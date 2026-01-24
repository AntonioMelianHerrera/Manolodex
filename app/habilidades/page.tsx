"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getAbilityTranslation } from "@/lib/translations";

interface AbilityData {
  id: number;
  name: string;
  description: string;
}

function AbilitiesContent() {
  const searchParams = useSearchParams();
  const [abilities, setAbilities] = useState<AbilityData[]>([]);
  const [filteredAbilities, setFilteredAbilities] = useState<AbilityData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAbility, setSelectedAbility] = useState<AbilityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAbilities() {
      try {
        setLoading(true);
        const abilitiesData: AbilityData[] = [];

        // Fetch primeras 150 habilidades (mucho más rápido que 300)
        const res = await fetch("https://pokeapi.co/api/v2/ability?limit=150");
        const data = await res.json();

        // Hacer todos los fetches en paralelo en lugar de secuencialmente
        const abilityPromises = data.results.map(async (ability: any) => {
          try {
            const abilityRes = await fetch(ability.url);
            const abilityDetail = await abilityRes.json();

            // Buscar descripción en español primero, luego inglés
            const effectEntry = abilityDetail.effect_entries?.find(
              (e: any) => e.language.name === "es" || e.language.iso639 === "es"
            );
            
            const englishEntry = abilityDetail.effect_entries?.find(
              (e: any) => e.language.name === "en" || e.language.iso639 === "en"
            );
            
            const description =
              effectEntry?.effect || englishEntry?.effect || "Sin descripción disponible";

            return {
              id: abilityDetail.id,
              name: ability.name,
              description: description,
            };
          } catch (error) {
            console.error(`Error fetching ability ${ability.name}:`, error);
            return null;
          }
        });

        const results = await Promise.all(abilityPromises);
        const validAbilities = results.filter((a): a is AbilityData => a !== null);
        
        setAbilities(validAbilities);

        // Si viene un parámetro de habilidad, seleccionar esa
        const abilityParam = searchParams.get("ability");
        if (abilityParam) {
          const found = validAbilities.find((a) => a.name === abilityParam);
          if (found) {
            setSelectedAbility(found);
            setSearchTerm(found.name);
          }
        }
      } catch (error) {
        console.error("Error fetching abilities:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAbilities();
  }, [searchParams]);

  useEffect(() => {
    const filtered = abilities.filter((ability) => {
      const translated = getAbilityTranslation(ability.name);
      return (
        ability.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        translated.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredAbilities(filtered);
    if (filtered.length > 0 && !selectedAbility) {
      setSelectedAbility(filtered[0]);
    }
  }, [searchTerm, abilities, selectedAbility]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Cargando habilidades...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-2">Habilidades</h1>
      <p className="text-slate-400 mb-6">Explora todas las habilidades de los Pokémon</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de habilidades */}
        <div className="lg:col-span-1 bg-slate-900 rounded-lg p-4 border border-slate-800 max-h-[600px] overflow-y-auto">
          <input
            type="text"
            placeholder="Buscar habilidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 text-white border border-slate-700 rounded mb-4 focus:outline-none focus:border-red-500 transition"
          />

          <div className="space-y-2">
            {filteredAbilities.map((ability) => {
              const translated = getAbilityTranslation(ability.name);
              return (
                <button
                  key={ability.name}
                  onClick={() => setSelectedAbility(ability)}
                  className={`w-full text-left px-4 py-2 rounded transition ${
                    selectedAbility?.name === ability.name
                      ? "bg-red-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <p className="font-semibold text-sm">{translated}</p>
                  <p className="text-xs text-slate-400">{ability.name}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detalle de habilidad */}
        <div className="lg:col-span-2">
          {selectedAbility ? (
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
              <h2 className="text-3xl font-bold text-white mb-2">
                {getAbilityTranslation(selectedAbility.name)}
              </h2>
              <p className="text-slate-400 text-sm mb-4">{selectedAbility.name}</p>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-red-500 mb-3">Descripción</h3>
                <p className="text-slate-300 leading-relaxed">{selectedAbility.description}</p>
              </div>

              <div className="mt-6 p-4 bg-slate-800 rounded border-l-4 border-red-500">
                <p className="text-slate-400 text-sm">
                  Habilidad ID: <span className="text-white font-semibold">{selectedAbility.id}</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800 flex items-center justify-center h-96">
              <p className="text-slate-400">Selecciona una habilidad para ver los detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AbilitiesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-96">
          <div className="text-slate-400">Cargando habilidades...</div>
        </div>
      }
    >
      <AbilitiesContent />
    </Suspense>
  );
}
