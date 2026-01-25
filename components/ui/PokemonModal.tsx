"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PokemonListItem } from "@/types/pokemon";
import { TYPE_COLORS } from "@/types/colors";
import { TYPES_TRANSLATIONS, getAbilityTranslation, getItemTranslation } from "@/lib/translations";

type Props = {
  pokemon: PokemonListItem | null;
  open: boolean;
  onClose: () => void;
  onSelectPokemon: (pokemon: PokemonListItem) => void;
};

// Tipos para la cadena de evolución
type EvolutionMethod = {
  type: string;
  details: Record<string, any>;
};

type EvolutionNode = {
  id: number;
  name: string;
  types: string[];
  method?: EvolutionMethod;
  evolvesTo: EvolutionNode[];
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

// Función para formatear el método de evolución
function formatEvolutionMethod(method?: EvolutionMethod): string {
  if (!method) return "Evolución desconocida";

  const { type, details } = method;

  if (type === "level-up") {
    // Si tiene minLevel, mostrar el nivel
    if (details.minLevel) {
      let text = `Nivel ${details.minLevel}`;
      
      // Si hay hora del día adicional, añadirla
      if (details.timeOfDay) {
        const timeLabel = details.timeOfDay === "day" ? "Día" : "Noche";
        text += ` (${timeLabel})`;
      }
      
      // Si hay felicidad junto con nivel/hora
      if (details.minHappiness && (details.timeOfDay || details.minLevel)) {
        text += ` + Felicidad`;
      }
      
      return text;
    }
    
    // Si solo tiene felicidad/amistad, solo mostrar "Felicidad" sin número
    if (details.minHappiness) {
      let text = "Felicidad";
      
      // Si hay hora del día adicional, añadirla
      if (details.timeOfDay) {
        const timeLabel = details.timeOfDay === "day" ? "Día" : "Noche";
        text += ` (${timeLabel})`;
      }
      
      return text;
    }
    
    if (details.minBeauty) return `Belleza ${details.minBeauty}`;
    if (details.minAffection) return "Afección";
    if (details.knownMove) return `Conoce movimiento: ${details.knownMove}`;
    if (details.partySpecies) return `Con ${details.partySpecies} en el equipo`;
    if (details.partyType) return `Con tipo ${details.partyType} en el equipo`;
    if (details.timeOfDay) {
      const timeLabel = details.timeOfDay === "day" ? "Día" : "Noche";
      return `Subir de nivel (${timeLabel})`;
    }
    if (details.location) return `En ${details.location}`;
    if (details.needsOverworldRain) return "Bajo lluvia";
    return "Subir de nivel";
  }

  if (type === "trade") {
    if (details.tradeSpecies) return `Intercambiar con ${details.tradeSpecies}`;
    if (details.heldItem) return `Intercambiar con ${details.heldItem}`;
    return "Intercambio";
  }

  if (type === "use-item") {
    if (details.item) return `Usar ${getItemTranslation(details.item)}`;
    return "Usar objeto";
  }

  if (type === "shed") {
    return "Al dejar espacio en el equipo";
  }

  return `Tipo: ${type}`;
}

type AlternativeForm = {
  id: number;
  name: string;
  formName: string;
  types: string[];
  isMega: boolean;
  isGigantamax: boolean;
  image?: string;
  varietyUrl?: string;
};

export default function PokemonModal({ pokemon, open, onClose, onSelectPokemon }: Props) {
  const [evolutionChain, setEvolutionChain] = useState<EvolutionNode | null>(null);
  const [alternativeForms, setAlternativeForms] = useState<AlternativeForm[]>([]);
  const [stats, setStats] = useState<{ name: string; value: number }[]>([]);
  const [pokedexEntries, setPokedexEntries] = useState<{ version: string; text: string }[]>([]);
  const [abilities, setAbilities] = useState<{ name: string; isHidden: boolean }[]>([]);
  const [isPlayingCry, setIsPlayingCry] = useState(false);
  const [pokemonImage, setPokemonImage] = useState<string>('');
  const [pokemonGenus, setPokemonGenus] = useState<string>('');

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
        // Si es una forma especial (mega/gigantamax), usar el nombre completo, si no usar el ID
        const pokemonIdentifier = pokemon && (pokemon.name.includes('mega') || pokemon.name.includes('gigantamax') || pokemon.name.includes('gmax'))
          ? pokemon.name 
          : pokemon?.id;
        
        // Traer stats
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonIdentifier}`);
        const data = await res.json();
        setStats(data.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat })));

        // Obtener imagen - priorizar official-artwork
        const imageUrl = data.sprites?.other?.['official-artwork']?.front_default || 
                        data.sprites?.front_default ||
                        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonIdentifier}.png`;
        setPokemonImage(imageUrl);

        // Traer habilidades
        const abilitiesList = data.abilities.map((a: any) => ({
          name: a.ability.name,
          isHidden: a.is_hidden,
        }));
        setAbilities(abilitiesList);

        // Traer descripciones de pokédex de todos los juegos
        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon?.id}`);
        const species = await speciesRes.json();
        
        // Obtener el genus (especie) en español o inglés
        if (species.genera && species.genera.length > 0) {
          // Buscar en español primero
          let genus = species.genera.find((g: any) => g.language.name === "es" || g.language.iso639 === "es")?.genus;
          // Si no hay español, usar inglés
          if (!genus) {
            genus = species.genera.find((g: any) => g.language.name === "en" || g.language.iso639 === "en")?.genus;
          }
          if (genus) {
            setPokemonGenus(genus);
          }
        }
        
        // Procesar todas las entradas de pokédex
        const entries: { version: string; text: string; lang: string }[] = [];
        if (species.flavor_text_entries && species.flavor_text_entries.length > 0) {
          // Si es una forma especial (mega/gigantamax), buscar entradas que mencionen esa forma
          const isSpecialForm = pokemon && (pokemon.name.includes('mega') || pokemon.name.includes('gigantamax') || pokemon.name.includes('gmax'));
          const formKeyword = pokemon?.name.includes('mega') ? 'mega' : pokemon?.name.includes('gmax') ? 'gmax' : 'gigantamax';
          
          // Primero, buscar en español
          const spanishEntries: { version: string; text: string; lang: string }[] = [];
          for (const entry of species.flavor_text_entries) {
            const isSpanish = entry.language.name === "es" || 
                            entry.language.name === "es-es" ||
                            entry.language.iso639 === "es";
            
            if (isSpanish) {
              const versionName = entry.version.name
                .split("-")
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
              const text = entry.flavor_text.replace(/\n|\f|\r/g, " ").trim();
              
              if (!spanishEntries.find(e => e.version === versionName && e.text === text)) {
                spanishEntries.push({ version: versionName, text, lang: "es" });
              }
            }
          }
          
          // Si es forma especial, filtrar por la palabra clave
          if (isSpecialForm && spanishEntries.length > 0) {
            const specialFormEntries = spanishEntries.filter(e => e.text.toLowerCase().includes(formKeyword));
            if (specialFormEntries.length > 0) {
              entries.push(...specialFormEntries);
            } else {
              // Si no encontramos entradas específicas de la forma, usar todas
              entries.push(...spanishEntries);
            }
          } else if (spanishEntries.length > 0) {
            entries.push(...spanishEntries);
          }
          
          // Si no hay en español, agregar en inglés
          if (entries.length === 0) {
            const englishEntries: { version: string; text: string; lang: string }[] = [];
            for (const entry of species.flavor_text_entries) {
              const isEnglish = entry.language.name === "en" || 
                              entry.language.iso639 === "en";
              
              if (isEnglish) {
                const versionName = entry.version.name
                  .split("-")
                  .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ");
                const text = entry.flavor_text.replace(/\n|\f|\r/g, " ").trim();
                
                if (!englishEntries.find(e => e.version === versionName && e.text === text)) {
                  englishEntries.push({ version: versionName, text, lang: "en" });
                }
              }
            }
            
            // Si es forma especial, filtrar por la palabra clave
            if (isSpecialForm && englishEntries.length > 0) {
              const specialFormEntries = englishEntries.filter(e => e.text.toLowerCase().includes(formKeyword));
              if (specialFormEntries.length > 0) {
                entries.push(...specialFormEntries);
              } else {
                // Si no encontramos entradas específicas de la forma, usar todas
                entries.push(...englishEntries);
              }
            } else if (englishEntries.length > 0) {
              entries.push(...englishEntries);
            }
          }
        }
        setPokedexEntries(entries);
        
        if (!species.evolution_chain?.url) return;

        const evoRes = await fetch(species.evolution_chain.url);
        const evoData = await evoRes.json();

        // Función para construir la cadena de evolución con métodos
        async function buildEvolutionTree(chain: any): Promise<EvolutionNode> {
          const urlParts = chain.species.url.split("/").filter(Boolean);
          const id = parseInt(urlParts[urlParts.length - 1], 10);

          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          const pokemonData = await res.json();

          // Extraer método de evolución si existe
          let method: EvolutionMethod | undefined;
          if (chain.evolution_details && chain.evolution_details.length > 0) {
            const details = chain.evolution_details[0];
            method = {
              type: details.trigger?.name || "unknown",
              details: {
                minLevel: details.min_level,
                item: details.item?.name,
                gender: details.gender,
                heldItem: details.held_item?.name,
                knownMove: details.known_move?.name,
                knownType: details.known_type?.name,
                location: details.location?.name,
                minAffection: details.min_affection,
                minBeauty: details.min_beauty,
                minHappiness: details.min_happiness,
                needsOverworldRain: details.needs_overworld_rain,
                partySpecies: details.party_species?.name,
                partyType: details.party_type?.name,
                relativePhysicalStats: details.relative_physical_stats,
                timeOfDay: details.time_of_day,
                tradeSpecies: details.trade_species?.name,
              },
            };
          }

          // Procesar evoluciones posteriores
          const evolvesTo: EvolutionNode[] = await Promise.all(
            chain.evolves_to.map((evo: any) => buildEvolutionTree(evo))
          );

          return {
            id,
            name: pokemonData.name,
            types: pokemonData.types.map((t: any) => t.type.name),
            method,
            evolvesTo,
          };
        }

        const evolutionTree = await buildEvolutionTree(evoData.chain);
        setEvolutionChain(evolutionTree);

        // Helper function to collect all Pokémon from evolution tree
        function getAllPokemonInEvolutionChain(node: EvolutionNode): EvolutionNode[] {
          const all = [node];
          for (const evo of node.evolvesTo) {
            all.push(...getAllPokemonInEvolutionChain(evo));
          }
          return all;
        }

        // Fetch alternative forms from the entire evolution chain
        try {
          const allPokemonInChain = getAllPokemonInEvolutionChain(evolutionTree);
          console.log('All Pokémon in chain:', allPokemonInChain.map(p => ({ id: p.id, name: p.name })));
          
          const alternativeFormsList: AlternativeForm[] = [];

          for (const pokemonInChain of allPokemonInChain) {
            try {
              // Fetch species data to get alternate species
              const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonInChain.id}/`);
              if (!speciesRes.ok) continue;
              
              const speciesData = await speciesRes.json();
              console.log(`Species data for ${speciesData.name}:`, { varieties: speciesData.varieties?.length });
              
              // Get varieties which include different forms
              if (speciesData.varieties && speciesData.varieties.length > 0) {
                for (const variety of speciesData.varieties) {
                  try {
                    const varietyUrl = variety.pokemon.url;
                    const varietyRes = await fetch(varietyUrl);
                    if (!varietyRes.ok) continue;
                    
                    const varietyData = await varietyRes.json();
                    const varietyName = varietyData.name || '';
                    console.log(`Checking variety: ${varietyName}`);
                    
                    // Check if it's a mega evolution or gigantamax (mega debe tener guion: -mega, -mega-x, -mega-y)
                    const isMega = varietyName.includes('-mega');
                    const isGigantamax = varietyName.includes('gigantamax') || varietyName.includes('gmax');
                    
                    if (isMega || isGigantamax) {
                      const types = varietyData.types?.map((t: any) => t.type.name) || [];
                      // Get official artwork image first, fallback to default
                      const image = varietyData.sprites?.other?.['official-artwork']?.front_default || varietyData.sprites?.front_default;
                      console.log(`Found special form: ${varietyName}, image: ${image}`);
                      alternativeFormsList.push({
                        id: pokemonInChain.id,
                        name: pokemonInChain.name,
                        formName: varietyName,
                        types,
                        isMega,
                        isGigantamax,
                        image,
                        varietyUrl: varietyUrl
                      });
                    }
                  } catch (error) {
                    console.error(`Error fetching variety ${variety.pokemon.name}:`, error);
                  }
                }
              }
            } catch (error) {
              console.error(`Error fetching species for ${pokemonInChain.name}:`, error);
            }
          }

          console.log('Alternative forms found:', alternativeFormsList);
          setAlternativeForms(alternativeFormsList);
        } catch (error) {
          console.error('Error fetching alternative forms:', error);
        }
      } catch (error) {
        console.error("Error fetching Pokémon details:", error);
      }
    }

    fetchPokemonDetails();
  }, [pokemon]);

  if (!open || !pokemon) return null;

  const playCry = () => {
    try {
      let cryName = pokemon.name.toLowerCase();
      
      // Para Gigantamax, usar solo el nombre base (sin forma)
      if (pokemon.name.includes('gigantamax') || pokemon.name.includes('gmax')) {
        cryName = cryName.split('-')[0];
      }
      // Para Mega Evolutions con -mega, intentar el nombre completo primero
      // Formato principal: charizard-mega-x.mp3
      
      const playAudio = (name: string) => {
        const audio = new Audio(`https://play.pokemonshowdown.com/audio/cries/${name}.mp3`);
        audio.volume = 0.5;
        
        // Manejo robusto de errores
        audio.onerror = () => {
          // Si falla la forma especial, intentar con el nombre base
          if (name !== cryName.split('-')[0]) {
            const baseName = cryName.split('-')[0];
            console.warn(`No se encontró grito para ${name}, intentando ${baseName}`);
            playAudio(baseName);
          } else {
            console.warn(`No se encontró grito para ${name}`);
          }
        };
        
        // Suprimir el error de NotSupportedError en la consola
        audio.addEventListener('error', (e) => {
          // El onerror ya maneja el fallback
        }, true);
        
        audio.play().catch(() => {
          // El onerror maneja el fallback, no mostrar error aquí
        });
      };
      
      playAudio(cryName);
    } catch (e) {
      console.error("No se pudo reproducir el grito:", e);
    }
  };

  // Total de stats
  const totalStats = stats.reduce((sum, s) => sum + s.value, 0);
  const totalColor = getTotalStatColor(totalStats);

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto"
      onClick={(e) => {
        // Cerrar solo si hacemos click en el backdrop, no en el contenido
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-slate-900 rounded-lg p-6 w-[95vw] max-w-[95vw] my-2 relative">
        {/* Botón cerrar - Fixed en la esquina */}
        <button
          onClick={onClose}
          className="fixed top-6 right-6 z-50 w-12 h-12 flex items-center justify-center text-white text-5xl font-bold hover:text-red-500 hover:scale-110 transition-all duration-200 cursor-pointer bg-slate-900 bg-opacity-80 hover:bg-opacity-100 rounded-full border-2 border-slate-700 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/50"
          title="Cerrar"
        >
          ×
        </button>

        <div className="flex gap-6 pr-12">
          {/* Imagen + tipos + nombre */}
          <div className="flex flex-col items-center bg-slate-700 p-3 rounded">
            <img
              src={pokemonImage || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
              alt={pokemon.name}
              className="w-56 h-56 cursor-pointer"
              onClick={playCry}
              onError={(e) => {
                // Si falla, intentar con el ID
                (e.target as HTMLImageElement).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
              }}
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
            {/* Genus/Especie */}
            {pokemonGenus && (
              <p className="text-slate-400 text-sm">
                {pokemonGenus}
              </p>
            )}
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
        {evolutionChain && evolutionChain.evolvesTo.length > 0 && (
          <div className="mt-6">
            <p className="text-slate-300 text-sm mb-4">Cadena evolutiva:</p>
            <div className="space-y-6">
              <EvolutionTreeComponent 
                node={evolutionChain}
                onSelectPokemon={onSelectPokemon}
              />
            </div>
          </div>
        )}

        {/* Formas alternativas (Mega Evolutions, Gigantamax) */}
        {alternativeForms.length > 0 && (
          <div className="mt-6 border-t border-slate-700 pt-6">
            <p className="text-slate-300 text-sm mb-4">Formas especiales:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {alternativeForms.map((form, index) => (
                <div
                  key={index}
                  className="bg-slate-800 rounded-lg p-4 cursor-pointer hover:bg-slate-700 transition border-2 border-yellow-500"
                  onClick={() => {
                    // Si tiene varietyUrl, cargar los detalles de esa variedad específica
                    if (form.varietyUrl) {
                      const listItem: PokemonListItem = {
                        id: form.id,
                        name: form.formName,  // Usar el nombre de la forma
                        url: form.varietyUrl,
                        types: form.types,
                      };
                      onSelectPokemon(listItem);
                    } else {
                      const listItem: PokemonListItem = {
                        id: form.id,
                        name: form.name,
                        url: `https://pokeapi.co/api/v2/pokemon/${form.id}/`,
                        types: form.types,
                      };
                      onSelectPokemon(listItem);
                    }
                  }}
                >
                  {/* Imagen de la forma */}
                  {form.image && (
                    <div className="mb-2 flex justify-center">
                      <img 
                        src={form.image} 
                        alt={form.formName}
                        className="w-24 h-24 object-contain"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold capitalize text-sm">{form.name}</h4>
                    {form.isMega && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded font-bold">
                        MEGA
                      </span>
                    )}
                    {form.isGigantamax && (
                      <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded font-bold">
                        GMAX
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-2 capitalize">{form.formName}</p>
                  <div className="flex flex-wrap gap-1">
                    {form.types.map((type) => (
                      <span
                        key={type}
                        className="text-white text-xs px-2 py-1 rounded font-semibold"
                        style={{ backgroundColor: TYPE_COLORS[type as keyof typeof TYPE_COLORS] || "#666" }}
                      >
                        {TYPES_TRANSLATIONS[type as keyof typeof TYPES_TRANSLATIONS] || type}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Función para detectar si es una línea recta (sin ramificaciones)
function isLinearEvolution(node: EvolutionNode): boolean {
  if (node.evolvesTo.length === 0) return true;
  if (node.evolvesTo.length > 1) return false;
  return isLinearEvolution(node.evolvesTo[0]);
}

// Función para obtener toda la línea de evoluciones lineales
function getLinearEvolutionChain(node: EvolutionNode): EvolutionNode[] {
  const chain = [node];
  let current = node;
  
  while (current.evolvesTo.length === 1) {
    current = current.evolvesTo[0];
    chain.push(current);
  }
  
  return chain;
}

// Componente para una evolución individual
function PokemonEvolutionCard({ 
  pokemon,
  onSelectPokemon 
}: { 
  pokemon: EvolutionNode;
  onSelectPokemon: (pokemon: PokemonListItem) => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
  );

  const handleImageError = () => {
    // Si la imagen falló, intentar con la API de PokéAPI directamente
    const fallbackUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`;
    fetch(fallbackUrl)
      .then(res => res.json())
      .then(data => {
        const officialArt = data.sprites?.other?.['official-artwork']?.front_default;
        if (officialArt) {
          setImageSrc(officialArt);
        } else {
          // Último recurso: imagen pequeña del sprite
          setImageSrc(data.sprites?.front_default || '');
        }
      })
      .catch(() => {
        // Si todo falla, usar un placeholder
        setImageSrc('');
      });
  };

  return (
    <div
      className="bg-slate-700 p-3 rounded-lg flex flex-col items-center cursor-pointer hover:bg-slate-600 transition-colors flex-shrink-0"
      onClick={() =>
        onSelectPokemon({
          id: pokemon.id,
          name: pokemon.name,
          url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`,
          types: pokemon.types,
        })
      }
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={pokemon.name}
          className="w-24 h-24 object-contain"
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
        />
      ) : (
        <div className="w-24 h-24 bg-slate-600 rounded flex items-center justify-center">
          <span className="text-slate-400 text-xs">Sin imagen</span>
        </div>
      )}
      <span className="capitalize text-white text-sm font-semibold mt-1">{pokemon.name}</span>
      <div className="flex gap-1 mt-2">
        {pokemon.types.map((type) => (
          <span
            key={type}
            className="px-2 py-1 rounded text-xs text-white font-semibold"
            style={{ backgroundColor: (TYPE_COLORS as any)[type] || "#6B7280" }}
          >
            {(TYPES_TRANSLATIONS as any)[type] || type}
          </span>
        ))}
      </div>
    </div>
  );
}

// Componente para mostrar una cadena de evoluciones horizontalmente
function HorizontalEvolutionChain({ 
  chain,
  onSelectPokemon 
}: { 
  chain: EvolutionNode[];
  onSelectPokemon: (pokemon: PokemonListItem) => void;
}) {
  const lastPokemon = chain[chain.length - 1];
  
  return (
    <div className="flex flex-col gap-4">
      {/* Cadena horizontal */}
      <div className="flex items-center gap-4 overflow-x-auto py-2">
        {chain.map((pokemon, index) => (
          <div key={`${pokemon.id}-${index}`} className="flex items-center gap-4 flex-shrink-0">
            <PokemonEvolutionCard pokemon={pokemon} onSelectPokemon={onSelectPokemon} />

            {/* Flecha y método de evolución */}
            {index < chain.length - 1 && (
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="text-2xl text-red-500">→</div>
                <div className="bg-slate-800 px-2 py-1 rounded text-xs text-slate-300 whitespace-nowrap border border-slate-600 w-28 text-center">
                  {formatEvolutionMethod(chain[index + 1].method)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Si el último Pokémon tiene ramificaciones, mostrarlas sin repetir el Pokémon */}
      {lastPokemon && lastPokemon.evolvesTo.length > 1 && (
        <div className="mt-2 ml-4 border-l-2 border-slate-600 pl-4">
          <div className="space-y-4">
            {lastPokemon.evolvesTo.map((evolution, index) => (
              <div key={`${evolution.id}-${index}`} className="flex items-center gap-2">
                {/* Línea conectora horizontal */}
                <div className="w-4 h-0.5 bg-slate-600"></div>

                {/* Método de evolución */}
                <div className="bg-slate-800 px-2 py-1 rounded text-xs text-slate-300 whitespace-nowrap border border-slate-600 w-32 text-center flex-shrink-0">
                  {formatEvolutionMethod(evolution.method)}
                </div>

                {/* Rama - mostrar recursivamente */}
                <div>
                  <EvolutionTreeComponent 
                    node={evolution}
                    onSelectPokemon={onSelectPokemon}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente principal para visualizar evoluciones
// El pokémon original está centrado verticalmente, las ramificaciones horizontales
function EvolutionTreeComponent({ 
  node, 
  onSelectPokemon
}: { 
  node: EvolutionNode;
  onSelectPokemon: (pokemon: PokemonListItem) => void;
}) {
  // Si no hay evoluciones, no mostrar nada
  if (node.evolvesTo.length === 0) {
    return null;
  }

  // Si tiene UNA sola evolución directa, mostrar como cadena lineal
  // (Sin importar si esa evolución tiene múltiples evoluciones posteriores)
  if (node.evolvesTo.length === 1) {
    const chain = getLinearEvolutionChain(node);
    return <HorizontalEvolutionChain chain={chain} onSelectPokemon={onSelectPokemon} />;
  }

  // Si hay múltiples evoluciones directas (split evolutions)
  // Pokémon original centrado a la izquierda, cada rama en su propia fila
  return (
    <div className="flex gap-6">
      {/* Pokémon original centrado verticalmente */}
      <div className="flex items-center">
        <PokemonEvolutionCard pokemon={node} onSelectPokemon={onSelectPokemon} />
      </div>

      {/* Línea conectora vertical */}
      <div className="relative w-8">
        <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-slate-600"></div>
      </div>

      {/* Ramas de evoluciones - cada una en su propia fila */}
      <div className="space-y-4">
        {node.evolvesTo.map((evolution, index) => (
          <div key={`${evolution.id}-${index}`} className="flex items-center gap-2">
            {/* Línea conectora horizontal */}
            <div className="w-4 h-0.5 bg-slate-600"></div>

            {/* Método de evolución */}
            <div className="bg-slate-800 px-2 py-1 rounded text-xs text-slate-300 whitespace-nowrap border border-slate-600 w-32 text-center flex-shrink-0">
              {formatEvolutionMethod(evolution.method)}
            </div>

            {/* Rama - mostrar recursivamente para manejar ramificaciones posteriores */}
            <div>
              <EvolutionTreeComponent 
                node={evolution}
                onSelectPokemon={onSelectPokemon}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}