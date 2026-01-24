"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PokemonListItem } from "@/types/pokemon";
import { TYPE_COLORS } from "@/types/colors";
import { TYPES_TRANSLATIONS, getAbilityTranslation } from "@/lib/translations";

type Props = {
  pokemon: PokemonListItem | null;
  open: boolean;
  onClose: () => void;
  onSelectPokemon: (pokemon: PokemonListItem) => void;
};

// Función para asignar color a cada stat individual
function getStatColor(value: number) {
  if (value <= 50) return "#E53E3E";      // rojo
  if (value <= 80) return "#DD6B20";      // naranja
  if (value <= 110) return "#ECC94B";     // amarillo
  if (value <= 140) return "#48BB78";     // verde
  return "#4299E1";                       // azul
}

// Función para asignar color al total de stats según tus rangos
function getTotalStatColor(total: number) {
  if (total < 450) return "#DD6B20";          // naranja
  if (total >= 450 && total < 480) return "#ECC94B"; // amarillo
  if (total >= 480 && total < 500) return "#A3E635"; // lima
  if (total >= 500 && total < 550) return "#48BB78"; // verde
  if (total >= 550) return "#4299E1";         // azul
  return "#FFFFFF"; // fallback blanco
}

export default function PokemonModal({ pokemon, open, onClose, onSelectPokemon }: Props) {
  const [evolutionFamily, setEvolutionFamily] = useState<PokemonListItem[]>([]);
  const [stats, setStats] = useState<{ name: string; value: number }[]>([]);
  const [pokedexEntries, setPokedexEntries] = useState<{ version: string; text: string }[]>([]);
  const [abilities, setAbilities] = useState<{ name: string; isHidden: boolean }[]>([]);
  const [isPlayingCry, setIsPlayingCry] = useState(false);

  // Deshabilitar scroll cuando el modal está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
    if (!pokemon) return;

    async function fetchPokemonDetails() {
      try {
        // Traer stats
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon?.id}`);
        const data = await res.json();
        setStats(data.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat })));

        // Traer habilidades
        const abilitiesList = data.abilities.map((a: any) => ({
          name: a.ability.name,
          isHidden: a.is_hidden,
        }));
        setAbilities(abilitiesList);

        // Traer descripciones de pokédex de todos los juegos
        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon?.id}`);
        const species = await speciesRes.json();
        
        // Procesar todas las entradas de pokédex
        const entries: { version: string; text: string; lang: string }[] = [];
        if (species.flavor_text_entries && species.flavor_text_entries.length > 0) {
          // Primero, recolectar todas las entradas de español
          for (const entry of species.flavor_text_entries) {
            // Buscar español
            const isSpanish = entry.language.name === "es" || 
                            entry.language.name === "es-es" ||
                            entry.language.iso639 === "es";
            
            if (isSpanish) {
              const versionName = entry.version.name
                .split("-")
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
              const text = entry.flavor_text.replace(/\n|\f|\r/g, " ").trim();
              
              // Evitar duplicados
              if (!entries.find(e => e.version === versionName && e.text === text)) {
                entries.push({ version: versionName, text, lang: "es" });
              }
            }
          }
          
          // Si no hay en español, agregar en inglés
          if (entries.length === 0) {
            for (const entry of species.flavor_text_entries) {
              const isEnglish = entry.language.name === "en" || 
                              entry.language.iso639 === "en";
              
              if (isEnglish) {
                const versionName = entry.version.name
                  .split("-")
                  .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ");
                const text = entry.flavor_text.replace(/\n|\f|\r/g, " ").trim();
                
                if (!entries.find(e => e.version === versionName && e.text === text)) {
                  entries.push({ version: versionName, text, lang: "en" });
                }
              }
            }
          }
        }
        setPokedexEntries(entries);
        
        if (!species.evolution_chain?.url) return;

        const evoRes = await fetch(species.evolution_chain.url);
        const evoData = await evoRes.json();

        const familyIds: number[] = [];
        function traverse(chain: any) {
          const urlParts = chain.species.url.split("/").filter(Boolean);
          const id = parseInt(urlParts[urlParts.length - 1], 10);
          familyIds.push(id);
          chain.evolves_to.forEach(traverse);
        }
        traverse(evoData.chain);

        const familyData: PokemonListItem[] = await Promise.all(
          familyIds.map(async (id) => {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await res.json();
            return {
              id,
              name: data.name,
              url: `https://pokeapi.co/api/v2/pokemon/${id}`,
              types: data.types.map((t: any) => t.type.name),
            };
          })
        );

        setEvolutionFamily(familyData);
      } catch (error) {
        console.error("Error fetching Pokémon details:", error);
      }
    }

    fetchPokemonDetails();
  }, [pokemon]);

  if (!open || !pokemon) return null;

  const playCry = () => {
    try {
      const audio = new Audio(
        `https://play.pokemonshowdown.com/audio/cries/${pokemon.name.toLowerCase()}.mp3`
      );
      audio.volume = 0.5;
      audio.play();
    } catch (e) {
      console.error("No se pudo reproducir el grito:", e);
    }
  };

  // Total de stats
  const totalStats = stats.reduce((sum, s) => sum + s.value, 0);
  const totalColor = getTotalStatColor(totalStats);

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start mt-2">
      <div className="bg-slate-900 rounded-lg p-6 w-[95vw] max-w-[95vw] h-[95vh] overflow-y-auto relative">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-2xl font-bold hover:text-red-500 hover:scale-125 transition-all duration-200 cursor-pointer"
          title="Cerrar"
        >
          ×
        </button>

        <div className="flex gap-6 pr-12">
          {/* Imagen + tipos + nombre */}
          <div className="flex flex-col items-center bg-slate-700 p-3 rounded">
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
              alt={pokemon.name}
              className="w-56 h-56 cursor-pointer"
              onClick={playCry}
            />

            {/* Tipos debajo de la imagen */}
            <div className="flex gap-2 mt-2">
              {pokemon.types?.map((type) => (
                <span
                  key={type}
                  className="px-2 py-1 rounded text-white text-sm font-semibold"
                  style={{ backgroundColor: TYPE_COLORS[type] }}
                >
                  {TYPES_TRANSLATIONS[type] || type}
                </span>
              ))}
            </div>

            {/* Habilidades debajo de tipos */}
            {abilities.length > 0 && (
              <div className="mt-3 w-full">
                <p className="text-slate-300 text-xs font-semibold mb-2">Habilidades:</p>
                <div className="flex flex-wrap gap-2">
                  {abilities.map((ability) => {
                    const translatedName = getAbilityTranslation(ability.name);
                    return (
                      <Link
                        key={ability.name}
                        href={`/habilidades?ability=${ability.name}`}
                        className={`px-2 py-1 rounded text-xs font-semibold capitalize transition-all hover:opacity-80 cursor-pointer block ${
                          ability.isHidden
                            ? 'bg-purple-600 text-yellow-300 border border-yellow-400 hover:bg-purple-700'
                            : 'bg-slate-600 text-slate-200 hover:bg-slate-500'
                        }`}
                      >
                        {translatedName}
                        {ability.isHidden && ' (Oculta)'}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nombre debajo de tipos */}
            <h2 className="capitalize text-2xl font-bold text-white mt-2">
              {pokemon.name}
            </h2>
          </div>

          {/* Stats con barras + Pokédex */}
          <div className="flex gap-6 flex-1">
            {/* Stats */}
            <div className="flex flex-col justify-start gap-3 text-white">
              <h3 className="text-lg font-semibold">Stats:</h3>

            {stats.map((s) => {
              const color = getStatColor(s.value);
              const widthPercent = Math.min((s.value / 200) * 100, 100);

              return (
                <div key={s.name} className="w-full">
                  <div className="flex justify-between text-sm mb-1 capitalize">
                    <span>{s.name}</span>
                    <span>{s.value}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded h-3">
                    <div
                      className="h-3 rounded"
                      style={{
                        width: `${widthPercent}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Total de stats */}
            <div className="mt-3 text-white font-bold text-lg" style={{ color: totalColor }}>
              Total de stats: {totalStats}
            </div>
            </div>

            {/* Pokédex Entries */}
            {pokedexEntries.length > 0 && (
              <div className="bg-slate-700 p-4 rounded flex-1 overflow-y-auto max-h-[400px]">
                <h3 className="text-lg font-semibold text-red-500 mb-4">Pokédex</h3>
                <div className="space-y-4">
                  {pokedexEntries.map((entry, index) => (
                    <div key={index} className="border-l-2 border-red-500 pl-3">
                      <p className="text-red-400 text-xs font-semibold mb-1">{entry.version}</p>
                      <p className="text-slate-200 text-sm leading-relaxed">
                        {entry.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Evolución debajo */}
        {evolutionFamily.length > 0 && (
          <div className="mt-6">
            <p className="text-slate-300 text-sm mb-2">Familia evolutiva:</p>
            <div className="flex gap-3 flex-wrap">
              {evolutionFamily.map((member) => (
                <div
                  key={member.id}
                  className="bg-slate-700 p-1 rounded flex flex-col items-center cursor-pointer hover:bg-slate-600"
                  onClick={() => onSelectPokemon(member)}
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${member.id}.png`}
                    alt={member.name}
                    className="w-32 h-32"
                  />
                  <span className="capitalize text-white text-sm mt-1">{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}