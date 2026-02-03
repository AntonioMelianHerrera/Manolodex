"use client";

import { useEffect, useState, Suspense, useRef, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getAbilityName, getAbilityDescription } from "@/lib/abilities";
import { getPokemonName } from "@/lib/translations";

interface PokemonWithAbility {
  name: string;
  id: number;
  isHidden: boolean;
}

interface AbilityData {
  id: number;
  name: string;
  description: string;
  pokemonWithAbility: PokemonWithAbility[];
}

const ABILITIES_PER_PAGE = 150;

function AbilitiesContent() {
  const searchParams = useSearchParams();
  const [allAbilities, setAllAbilities] = useState<AbilityData[]>([]);
  const [displayedAbilities, setDisplayedAbilities] = useState<AbilityData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAbility, setSelectedAbility] = useState<AbilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<{ filteredAbilities: AbilityData[]; displayedCount: number }>({
    filteredAbilities: [],
    displayedCount: 0,
  });

  useEffect(() => {
    async function fetchAbilities() {
      try {
        setLoading(true);
        const abilitiesData: AbilityData[] = [];

        // Fetch todas las habilidades (máximo disponible en PokeAPI)
        const res = await fetch("https://pokeapi.co/api/v2/ability?limit=300");
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

            // Obtener pokémon que tienen esta habilidad
            const pokemonWithAbility: PokemonWithAbility[] = [];
            if (abilityDetail.pokemon && abilityDetail.pokemon.length > 0) {
              abilityDetail.pokemon.forEach((p: any) => {
                const pokeName: string = p.pokemon.name;
                // Excluir formas Gigantamax (suffixes: -gmax, -gigantamax)
                if (/-gmax$|-gigantamax$/.test(pokeName)) return;

                const urlParts = p.pokemon.url.split("/").filter(Boolean);
                const id = parseInt(urlParts[urlParts.length - 1], 10);
                pokemonWithAbility.push({
                  name: pokeName,
                  id,
                  isHidden: p.is_hidden,
                });
              });
            }

            return {
              id: abilityDetail.id,
              name: ability.name,
              description: description,
              pokemonWithAbility,
            };
          } catch (error) {
            console.error(`Error fetching ability ${ability.name}:`, error);
            return null;
          }
        });

        const results = await Promise.all(abilityPromises);
        const validAbilities = results.filter((a): a is AbilityData => a !== null);
        
        setAllAbilities(validAbilities);
        // Mostrar primeras 150
        setDisplayedAbilities(validAbilities.slice(0, ABILITIES_PER_PAGE));
        setHasMore(validAbilities.length > ABILITIES_PER_PAGE);

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

  // Intersection Observer para lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Usar refs para obtener valores actuales sin recrear el efecto
          const currentCount = dataRef.current.displayedCount;
          const nextBatch = dataRef.current.filteredAbilities.slice(currentCount, currentCount + ABILITIES_PER_PAGE);

          if (nextBatch.length > 0) {
            setDisplayedAbilities((prev) => [...prev, ...nextBatch]);
          } else {
            setHasMore(false);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Calcular habilidades filtradas sin causar re-renders infinitos
  const filteredAbilities = useMemo(() => {
    return allAbilities.filter((ability) => {
      const translated = getAbilityName(ability.name);
      return (
        ability.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        translated.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm, allAbilities]);

  // Actualizar las referencias de datos sin disparar efectos
  useEffect(() => {
    dataRef.current = { filteredAbilities, displayedCount: displayedAbilities.length };
  }, [filteredAbilities, displayedAbilities.length]);

  // Resetear displayed abilities cuando los filtros cambian
  useEffect(() => {
    setDisplayedAbilities(filteredAbilities.slice(0, ABILITIES_PER_PAGE));
    setHasMore(filteredAbilities.length > ABILITIES_PER_PAGE);
    
    if (filteredAbilities.length > 0 && !selectedAbility) {
      setSelectedAbility(filteredAbilities[0]);
    }
  }, [filteredAbilities, selectedAbility]);

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
            {displayedAbilities.map((ability) => {
              const translated = getAbilityName(ability.name);
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

          {/* Sentinel para lazy loading */}
          <div ref={sentinelRef} className="h-4 mt-4" />
        </div>

        {/* Detalle de habilidad */}
        <div className="lg:col-span-2">
          {selectedAbility ? (
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800 space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {getAbilityName(selectedAbility.name)}
                </h2>
                <p className="text-slate-400 text-sm">{selectedAbility.name}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-red-500 mb-3">Descripción</h3>
                <p className="text-slate-300 leading-relaxed">{getAbilityDescription(selectedAbility.name)}</p>
              </div>

              {/* Pokémon con esta habilidad */}
              {selectedAbility.pokemonWithAbility.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-red-500 mb-3">
                    Pokémon con esta habilidad ({selectedAbility.pokemonWithAbility.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {selectedAbility.pokemonWithAbility.map((pokemon) => (
                      <Link
                        key={`${pokemon.id}-${pokemon.isHidden}`}
                        href={`/?search=${pokemon.name}`}
                        className="group"
                      >
                        <div className="bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition border border-slate-700 hover:border-red-500 cursor-pointer">
                          <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                            alt={pokemon.name}
                            className="w-20 h-20 mx-auto"
                          />
                          <p className="text-white text-xs font-semibold capitalize mt-2 text-center truncate group-hover:text-red-400 transition">
                            {getPokemonName(pokemon.name)}
                          </p>
                          {pokemon.isHidden && (
                            <p className="text-purple-400 text-xs text-center mt-1 font-semibold">
                              (Oculta)
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
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
