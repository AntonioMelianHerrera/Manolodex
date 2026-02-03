"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SearchBar from "@/components/ui/SearchBar";
import { TYPES_TRANSLATIONS } from "@/lib/translations";
import { TYPE_COLORS } from "@/types/colors";
import { movesData } from "@/lib/movesData";

const movesLookup = movesData as Record<string, { name: string; description: string }>;

const TYPES = [
  "normal","fire","water","electric","grass","ice",
  "fighting","poison","ground","flying","psychic",
  "bug","rock","ghost","dragon","dark","steel","fairy",
];

interface PokemonLearner {
  name: string;
  id: number;
}

interface MoveData {
  id: number;
  name: string;
  type: string;
  category: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
  description: string;
  target: string;
  pokemonLearners: PokemonLearner[];
}

function getMoveTranslation(moveName: string): string {
  const key = moveName.toLowerCase();
  return (
    movesLookup[key]?.name ||
    moveName.charAt(0).toUpperCase() + moveName.slice(1).replace(/-/g, " ")
  );
}

function AttacksContent() {
  const searchParams = useSearchParams();
  const [moves, setMoves] = useState<MoveData[]>([]);
  const [filteredMoves, setFilteredMoves] = useState<MoveData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMove, setSelectedMove] = useState<MoveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    async function fetchMoves() {
      try {
        setLoading(true);
        const movesData: MoveData[] = [];

        const res = await fetch("https://pokeapi.co/api/v2/move?limit=900");
        const data = await res.json();

        const movePromises = data.results.slice(0, 500).map(async (move: any) => {
          try {
            const moveRes = await fetch(move.url);
            const moveDetail = await moveRes.json();

            // Obtener descripción en español
            const effectEntry = moveDetail.effect_entries?.find(
              (e: any) => e.language.name === "es"
            );
            
            const englishEntry = moveDetail.effect_entries?.find(
              (e: any) => e.language.name === "en"
            );

            let description = effectEntry?.effect || englishEntry?.effect || "Sin descripción disponible";

            // Agregar efecto secundario si existe
            if (moveDetail.effect_chance && moveDetail.effect_chance > 0) {
              description += ` (${moveDetail.effect_chance}% de probabilidad)`;
            }

            // Helper: permitir SOLO formas base y regionales (-alola, -galar, -hisui, -paldea)
            // Rechazar TODAS las otras variantes (totem, ash, gulping, primal, mega, gmax, etc.)
            const isNormalOrRegional = (name: string): boolean => {
              const lower = name.toLowerCase();
              
              // Permitir formas regionales específicas
              const allowedRegionals = ["-alola", "-galar", "-hisui", "-paldea"];
              if (allowedRegionals.some((regional) => lower.endsWith(regional))) return true;
              
              // Si contiene un guión y NO es una forma regional, verificar si es variante
              const parts = lower.split("-");
              if (parts.length > 2) {
                // Nombre con múltiples guiones (ej: "raticate-alola-totem") - rechazar
                return false;
              }
              if (parts.length === 2) {
                // Nombre con un guión (ej: "mr-mime" o "greninja-ash")
                const suffix = parts[1];
                // Lista de palabras que indican variantes no permitidas
                const variantKeywords = [
                  "totem", "ash", "gulping", "lowkey", "amped", "gmax", "gigantamax",
                  "mega", "primal", "eternamax", "crowned", "unbound", "origin",
                  "active", "battle-bond", "disguised", "busted", "zenith"
                ];
                if (variantKeywords.includes(suffix)) return false;
              }
              
              // Por defecto permitir (formas base)
              return true;
            };

            // Obtener pokémon que pueden aprender este ataque (cargar todos)
            const pokemonLearners: PokemonLearner[] = [];
            if (moveDetail.learned_by_pokemon && moveDetail.learned_by_pokemon.length > 0) {
              moveDetail.learned_by_pokemon.forEach((p: any) => {
                const pokeName: string = p.name;
                if (!isNormalOrRegional(pokeName)) return;

                const urlParts = p.url.split("/").filter(Boolean);
                const id = parseInt(urlParts[urlParts.length - 1], 10);
                pokemonLearners.push({
                  name: pokeName,
                  id,
                });
              });
            }

            const urlParts = move.url.split("/").filter(Boolean);
            const moveId = parseInt(urlParts[urlParts.length - 1], 10);

            return {
              id: moveId,
              name: move.name,
              type: moveDetail.type?.name || "normal",
              category: moveDetail.damage_class?.name || "status",
              power: moveDetail.power,
              accuracy: moveDetail.accuracy,
              pp: moveDetail.pp,
              description,
              target: moveDetail.target?.name || "",
              pokemonLearners,
            };
          } catch (error) {
            console.error(`Error fetching move ${move.name}:`, error);
            return null;
          }
        });

        const results = await Promise.all(movePromises);
        const validMoves = results.filter((m): m is MoveData => m !== null);
        
        setMoves(validMoves);

        const moveParam = searchParams.get("move");
        if (moveParam) {
          const found = validMoves.find((m) => m.name === moveParam);
          if (found) {
            setSelectedMove(found);
            setSearchTerm(found.name);
          }
        }
      } catch (error) {
        console.error("Error fetching moves:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMoves();
  }, [searchParams]);

  useEffect(() => {
    const filtered = moves.filter((move) => {
      const translated = getMoveTranslation(move.name);
      const matchesSearch =
        move.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        translated.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = !selectedType || move.type === selectedType;

      return matchesSearch && matchesType;
    });

    setFilteredMoves(filtered);
    if (filtered.length > 0 && !selectedMove) {
      setSelectedMove(filtered[0]);
    }
  }, [searchTerm, moves, selectedMove, selectedType]);

  const getTypeColor = (type: string): string => {
    return TYPE_COLORS[type] || "#999999";
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "physical":
        return "bg-red-600";
      case "special":
        return "bg-blue-600";
      case "status":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case "physical":
        return "Físico";
      case "special":
        return "Especial";
      case "status":
        return "Estado";
      default:
        return category;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Cargando ataques...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-2">Ataques</h1>
      <p className="text-slate-400 mb-6">Explora todos los ataques Pokémon</p>

      {/* Buscador */}
      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar ataque..." />

      {/* Filtros colapsables */}
      <div className="bg-slate-800 p-3 rounded-lg text-white text-sm mt-4 mb-6">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full text-left font-semibold mb-2 cursor-pointer"
        >
          Filtros {filtersOpen ? "▲" : "▼"}
        </button>

        {filtersOpen && (
          <>
            {/* Tipos */}
            <div className="mb-3">
              <p className="text-xs text-slate-400 mb-2">Tipos</p>
              <div className="flex flex-col gap-2">
                <div className="flex">
                  <label
                    className="flex items-center gap-1 p-2 rounded cursor-pointer bg-slate-700 hover:bg-slate-600"
                  >
                    <input
                      type="radio"
                      name="type"
                      checked={selectedType === ""}
                      onChange={() => setSelectedType("")}
                      className="cursor-pointer"
                    />
                    Todos
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-1 p-2 rounded cursor-pointer"
                      style={{ backgroundColor: selectedType === type ? TYPE_COLORS[type] : "#64748b" }}
                    >
                      <input
                        type="radio"
                        name="type"
                        checked={selectedType === type}
                        onChange={() => setSelectedType(type)}
                        className="cursor-pointer"
                      />
                      <img
                        src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${type}.svg`}
                        alt={type}
                        className="w-4 h-4"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de ataques */}
        <div className="lg:col-span-1 bg-slate-900 rounded-lg p-4 border border-slate-800 max-h-[600px] overflow-y-auto">
          <div className="space-y-2">
            {filteredMoves.map((move) => {
              const translated = getMoveTranslation(move.name);
              return (
                <button
                  key={move.name}
                  onClick={() => setSelectedMove(move)}
                  className={`w-full text-left px-4 py-3 rounded transition ${
                    selectedMove?.name === move.name
                      ? "bg-red-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate text-sm">{translated}</p>
                      <p className="text-xs text-slate-400 truncate">{move.name}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span 
                        className="px-2 py-0.5 rounded text-white text-xs font-semibold whitespace-nowrap"
                        style={{ backgroundColor: TYPE_COLORS[move.type] }}
                      >
                        {TYPES_TRANSLATIONS[move.type] || move.type}
                      </span>
                      {move.power && (
                        <p className="text-xs font-semibold text-slate-300">⚡ {move.power}</p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detalle del ataque */}
        <div className="lg:col-span-2">
          {selectedMove ? (
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-white">
                    {getMoveTranslation(selectedMove.name)}
                  </h2>
                  <span 
                    className="px-4 py-1 rounded text-white font-semibold text-lg"
                    style={{ backgroundColor: TYPE_COLORS[selectedMove.type] }}
                  >
                    {TYPES_TRANSLATIONS[selectedMove.type] || selectedMove.type}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">{selectedMove.name}</p>
              </div>

              {/* Estadísticas del ataque */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-800 p-3 rounded border border-slate-700">
                  <p className="text-slate-400 text-xs mb-1">Categoría</p>
                  <p className="text-white font-semibold text-sm">
                    {getCategoryLabel(selectedMove.category)}
                  </p>
                </div>
                {selectedMove.power && (
                  <div className="bg-slate-800 p-3 rounded border border-slate-700">
                    <p className="text-slate-400 text-xs mb-1">Potencia</p>
                    <p className="text-white font-semibold text-sm">{selectedMove.power}</p>
                  </div>
                )}
                {selectedMove.accuracy && (
                  <div className="bg-slate-800 p-3 rounded border border-slate-700">
                    <p className="text-slate-400 text-xs mb-1">Precisión</p>
                    <p className="text-white font-semibold text-sm">{selectedMove.accuracy}%</p>
                  </div>
                )}
                <div className="bg-slate-800 p-3 rounded border border-slate-700">
                  <p className="text-slate-400 text-xs mb-1">PP</p>
                  <p className="text-white font-semibold text-sm">{selectedMove.pp}</p>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <h3 className="text-lg font-semibold text-red-500 mb-3">Descripción y Efecto</h3>
                <p className="text-slate-300 leading-relaxed">
                  {movesLookup[selectedMove.name.toLowerCase()]?.description || selectedMove.description}
                </p>
              </div>

              {/* Pokémon que pueden aprenderlo */}
              {selectedMove.pokemonLearners.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-red-500 mb-3">
                    Pokémon que pueden aprenderlo ({selectedMove.pokemonLearners.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {selectedMove.pokemonLearners.map((pokemon) => (
                      <Link key={pokemon.id} href={`/?search=${pokemon.name}`} className="group">
                        <div className="bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition border border-slate-700 hover:border-red-500 cursor-pointer">
                          <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                            alt={pokemon.name}
                            className="w-20 h-20 mx-auto"
                          />
                          <p className="text-white text-xs font-semibold capitalize mt-2 text-center truncate group-hover:text-red-400 transition">
                            {pokemon.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800 flex items-center justify-center h-96">
              <p className="text-slate-400">Selecciona un ataque para ver los detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AttacksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-96">
          <div className="text-slate-400">Cargando ataques...</div>
        </div>
      }
    >
      <AttacksContent />
    </Suspense>
  );
}
