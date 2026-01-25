"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { CheckIcon, XIcon } from "@/components/icons";
import { isDesiredPokemonVariant } from "@/lib/pokemon";
import { useCaughtPokemon } from "@/lib/CaughtPokemonContext";

type GameMode = "all" | "generations";

// Intentar obtener minisprite de múltiples fuentes
const getMinispriteUrl = async (pokemonId: number): Promise<string | null> => {
  const sources = [
    // Gen VIII icons (primera opción)
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${pokemonId}.png`,
    // Gen IX icons para Pokémon de generación 9
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ix/icons/${pokemonId}.png`,
    // PokéSprite - repositorio con sprites modernos incluyendo Gen 9
    `https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8x/icons/${pokemonId}.png`,
    // Pokémon Showdown sprites modernos (afd - ancient form)
    `https://raw.githubusercontent.com/smogon/pokemon-showdown/master/public/sprites/pokemon/afd/${pokemonId}.gif`,
    // Pokémon Showdown standard sprites
    `https://raw.githubusercontent.com/smogon/pokemon-showdown/master/public/sprites/pokemon/${pokemonId}.png`,
    // Pokémon Showdown gen9 specific sprites
    `https://raw.githubusercontent.com/smogon/pokemon-showdown/master/public/sprites/pokemon/gen9/${pokemonId}.png`,
    // Bulbapedia sprites (Gen 9)
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/${pokemonId}.png`,
    // Alternative format with names - usando ID como fallback
    `https://raw.githubusercontent.com/PokemonChinese/pokemon-go-icons/master/assets/${pokemonId}.png`,
  ];

  for (const url of sources) {
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (response.ok) {
        return url;
      }
    } catch (error) {
      // Continuar con la siguiente fuente
      continue;
    }
  }

  // Si ninguna fuente funciona, retornar null
  return null;
};

interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  generation: number;
  originalId?: number;
}

// Tipo interno para gestionar tipos sin exponerlos en la UI
interface PokemonWithTypes extends Pokemon {
  types: string[];
}

interface CaughtPokemon {
  id: number;
  name: string;
  spriteUrl: string;
}

interface GameState {
  status: "waiting" | "correct" | "incorrect" | "game-over";
  currentPokemon: Pokemon | null;
  userAnswer: string;
  score: number;
  totalQuestions: number;
  streak: number;
  feedback: string;
}

const TOTAL_POKEMON = 1025;

interface SilhouetteQuizGameProps {
  mode: GameMode;
  selectedGenerations?: number[];
  onExit?: () => void;
}

export default function SilhouetteQuizGame({
  mode,
  selectedGenerations = [1, 2, 3, 4, 5, 6, 7, 8, 9],
  onExit,
}: SilhouetteQuizGameProps) {
  const { addCaughtPokemon, clearCaughtPokemon } = useCaughtPokemon();
  
  const [gameState, setGameState] = useState<GameState>({
    status: "waiting",
    currentPokemon: null,
    userAnswer: "",
    score: 0,
    totalQuestions: 0,
    streak: 0,
    feedback: "",
  });

  const [gameStarted, setGameStarted] = useState(false);
  const [allPokemon, setAllPokemon] = useState<PokemonWithTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [usedPokemon, setUsedPokemon] = useState<Set<number>>(new Set());
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef(0);
  const [suggestions, setSuggestions] = useState<PokemonWithTypes[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calcular límite de preguntas dinámicamente
  const QUESTIONS_LIMIT = mode === "all" ? Infinity : allPokemon.length;

  // Obtener generación desde ID
  const getGenerationFromId = (id: number): number => {
    if (id <= 151) return 1;
    if (id <= 251) return 2;
    if (id <= 386) return 3;
    if (id <= 493) return 4;
    if (id <= 649) return 5;
    if (id <= 721) return 6;
    if (id <= 809) return 7;
    if (id <= 905) return 8;
    return 9;
  };

  // Obtener tipos del Pokémon (con retry)
  const getPokemonTypes = async (pokemonId: number, retries = 3): Promise<string[]> => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data.types.map((t: any) => t.type.name);
      } catch (error) {
        if (i === retries - 1) {
          console.error(`Failed to load types for pokemon ${pokemonId}:`, error);
          return [];
        }
        // Esperar antes de reintentar
        await new Promise(resolve => setTimeout(resolve, 500 * (i + 1)));
      }
    }
    return [];
  };

  // Cargar lista de pokémon con tipos
  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMON}`
        );
        const data = await response.json();

        let pokemonList = data.results
          .map((p: any, index: number) => ({
            id: index + 1,
            originalId: index + 1,
            name: p.name,
            imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
              index + 1
            }.png`,
            generation: getGenerationFromId(index + 1),
            index,
          }))
          .filter((p: any) => {
            // Filtrar variantes no deseadas
            if (!isDesiredPokemonVariant(p.name)) {
              return false;
            }
            // Filtrar por generación
            return mode === "all" 
              ? p.generation <= 9
              : selectedGenerations.includes(p.generation);
          })
          // Reasignar IDs después del filtrado para que sean secuenciales
          .map((p: any, newIndex: number) => ({
            ...p,
            id: newIndex + 1,
            types: [], // No cargar tipos al inicio
          }));

        setAllPokemon(pokemonList);
      } catch (error) {
        console.error("Error loading pokemon list:", error);
      }
    };

    fetchPokemonList();
  }, [mode, selectedGenerations]);

  // Iniciar juego cuando pokémon estén cargados
  useEffect(() => {
    if (allPokemon.length > 0 && !gameStarted) {
      setCountdown(3);
      setGameStarted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPokemon]);

  // Cuenta atrás antes de comenzar
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        countdownRef.current = countdown - 1;
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && gameStarted && gameState.currentPokemon === null) {
      startGame();
    }
  }, [countdown, gameStarted, gameState.currentPokemon]);

  // Auto-avance después de feedback (excepto en game-over)
  useEffect(() => {
    if (gameState.status !== "waiting" && gameState.status !== "game-over") {
      const timer = setTimeout(() => {
        nextQuestion();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState.status]);

  // Focus en input cuando hay una pregunta nueva
  useEffect(() => {
    if (gameState.status === "waiting" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState.status]);

  // Seleccionar pokémon único (no repetido en todo el juego)
  const getUniquePokemon = (): PokemonWithTypes => {
    let pokemon: PokemonWithTypes;
    let attempts = 0;
    const maxAttempts = 1000;

    do {
      const randomId = Math.floor(Math.random() * allPokemon.length);
      pokemon = allPokemon[randomId];
      attempts++;
    } while (
      usedPokemon.has(pokemon.id) &&
      usedPokemon.size < allPokemon.length &&
      attempts < maxAttempts
    );

    return pokemon;
  };

  // Iniciar el juego
  const startGame = async () => {
    setUsedPokemon(new Set());
    await generateQuestion();
  };

  const resetGame = () => {
    setCountdown(3);
    setGameStarted(true);
    setUsedPokemon(new Set());
    clearCaughtPokemon();
    setGameState({
      status: "waiting",
      currentPokemon: null,
      userAnswer: "",
      score: 0,
      totalQuestions: 0,
      streak: 0,
      feedback: "",
    });
  };

  // Salir del juego
  const exitGame = () => {
    if (onExit) {
      onExit();
    }
  };

  // Generar pregunta
  const generateQuestion = async () => {
    setLoading(true);
    try {
      const correctPokemon = getUniquePokemon();
      setUsedPokemon((prev) => new Set(prev).add(correctPokemon.id));

      setGameState((prev) => ({
        ...prev,
        status: "waiting",
        currentPokemon: correctPokemon,
        userAnswer: "",
        feedback: "",
      }));
      setSuggestions([]);
      setSelectedSuggestionIndex(-1);
    } catch (error) {
      console.error("Error generating question:", error);
    } finally {
      setLoading(false);
    }
  };

  // Procesar respuesta del usuario
  const handleAnswer = async (userAnswer?: string) => {
    if (!gameState.currentPokemon || gameState.status !== "waiting") return;

    const answerToValidate = userAnswer ?? gameState.userAnswer;
    const isCorrect =
      answerToValidate.toLowerCase().trim() ===
      gameState.currentPokemon.name.toLowerCase().trim();

    const feedback = isCorrect
      ? "¡Correcto!"
      : `Incorrecto. Era ${gameState.currentPokemon.name}`;

    // Si es correcto, agregar a pokémon capturados
    if (isCorrect) {
      const spriteUrl = await getMinispriteUrl(gameState.currentPokemon.originalId!);
      // Solo agregar si se encontró sprite disponible
      if (spriteUrl) {
        addCaughtPokemon({
          id: gameState.currentPokemon!.originalId!,
          name: gameState.currentPokemon!.name,
          spriteUrl,
        });
      }
    }

    setGameState((prev) => ({
      ...prev,
      userAnswer: answerToValidate,
      status: isCorrect ? "correct" : "incorrect",
      score: isCorrect ? prev.score + 1 : prev.score,
      streak: isCorrect ? prev.streak + 1 : 0,
      totalQuestions: prev.totalQuestions + 1,
      feedback,
    }));
  };

  // Manejar Enter en el input
  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && gameState.status === "waiting") {
      if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
        // Seleccionar la sugerencia - validar directamente
        const selectedPokemon = suggestions[selectedSuggestionIndex];
        const isCorrect =
          selectedPokemon.name.toLowerCase().trim() ===
          gameState.currentPokemon?.name.toLowerCase().trim();

        const feedback = isCorrect
          ? "¡Correcto!"
          : `Incorrecto. Era ${gameState.currentPokemon?.name}`;

        // Si es correcto, agregar a pokémon capturados
        if (isCorrect) {
          const spriteUrl = await getMinispriteUrl(selectedPokemon.originalId!);
          // Solo agregar si se encontró sprite disponible
          if (spriteUrl) {
            addCaughtPokemon({
              id: selectedPokemon.originalId!,
              name: selectedPokemon.name,
              spriteUrl,
            });
          }
        }

        setGameState((prev) => ({
          ...prev,
          userAnswer: selectedPokemon.name,
          status: isCorrect ? "correct" : "incorrect",
          score: isCorrect ? prev.score + 1 : prev.score,
          streak: isCorrect ? prev.streak + 1 : 0,
          totalQuestions: prev.totalQuestions + 1,
          feedback,
        }));
        setSuggestions([]);
        setSelectedSuggestionIndex(-1);
      } else {
        // Validar con el valor actual del input, no con el estado anterior
        const currentInputValue = e.currentTarget.value;
        handleAnswer(currentInputValue);
      }
    } else if (e.key === "ArrowDown" && suggestions.length > 0) {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp" && suggestions.length > 0) {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }
  };

  // Actualizar sugerencias basadas en lo que escribe el usuario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGameState((prev) => ({
      ...prev,
      userAnswer: value,
    }));

    if (value.trim().length === 0) {
      setSuggestions([]);
      setSelectedSuggestionIndex(-1);
    } else {
      // Filtrar pokémon que coincidan con lo que escribe (y que no hayan sido usados)
      const lowerValue = value.toLowerCase();
      
      // Primero obtener todos los que coinciden
      // Permitir el pokémon actual aunque esté en usedPokemon porque ES la respuesta correcta
      const allMatches = allPokemon.filter((p) => {
        const lowerName = p.name.toLowerCase();
        const isCurrentPokemon = gameState.currentPokemon && p.id === gameState.currentPokemon.id;
        return (
          lowerName.startsWith(lowerValue) || 
          lowerName.includes(lowerValue)
        ) && (isCurrentPokemon || !usedPokemon.has(p.id));
      });
      
      // Separar en dos grupos: los que empiezan con el valor y el resto
      const startsWith = allMatches.filter((p) => 
        p.name.toLowerCase().startsWith(lowerValue)
      );
      const includes = allMatches.filter((p) => 
        !p.name.toLowerCase().startsWith(lowerValue)
      );
      
      // Combinar: primero los que empiezan, luego el resto
      const filtered = [...startsWith, ...includes].slice(0, 10);

      setSuggestions(filtered);
      setSelectedSuggestionIndex(-1);
    }
  };

  // Ir a la siguiente pregunta
  const nextQuestion = async () => {
    // Verificar si se alcanzó el límite de preguntas
    if (gameState.totalQuestions >= QUESTIONS_LIMIT) {
      setGameState((prev) => ({ ...prev, status: "game-over" }));
      return;
    }

    await generateQuestion();
  };

  // Calcular precisión
  const accuracy =
    gameState.totalQuestions > 0
      ? Math.round((gameState.score / gameState.totalQuestions) * 100)
      : 0;

  // ============================================
  // PANTALLA DE CARGA / CUENTA ATRÁS
  // ============================================
  if (countdown > 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-7xl font-bold text-red-500 animate-pulse">
          {countdown}
        </p>
      </div>
    );
  }

  if (loading || !gameState.currentPokemon) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-block">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-400 mt-4">Cargando siguiente Pokémon...</p>
      </div>
    );
  }

  // ============================================
  // PANTALLA DE FIN DE JUEGO
  // ============================================
  if (gameState.status === "game-over") {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-8">¡Juego Terminado!</h2>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <p className="text-slate-400 text-sm">Puntuación Final</p>
            <p className="text-3xl font-bold text-green-400">{gameState.score}</p>
          </div>
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <p className="text-slate-400 text-sm">Total de Preguntas</p>
            <p className="text-3xl font-bold text-white">
              {gameState.totalQuestions}
            </p>
          </div>
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <p className="text-slate-400 text-sm">Precisión</p>
            <p className="text-3xl font-bold text-blue-400">{accuracy}%</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={resetGame}
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Jugar de Nuevo
          </button>
          <button
            onClick={exitGame}
            className="px-8 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // JUEGO EN PROGRESO
  // ============================================
  return (
    <div className="relative w-full">
      {/* Contenido principal - centrado */}
      <div className="max-w-2xl mx-auto px-4">
      {/* Puntuación y progreso */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 text-center">
          <p className="text-slate-400 text-xs">Puntuación</p>
          <p className="text-2xl font-bold text-white">{gameState.score}</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 text-center">
          <p className="text-slate-400 text-xs">Progreso</p>
          <p className="text-2xl font-bold text-slate-300">
            {gameState.totalQuestions}/{QUESTIONS_LIMIT === Infinity ? "∞" : QUESTIONS_LIMIT}
          </p>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 text-center">
          <p className="text-slate-400 text-xs">Precisión</p>
          <p className="text-2xl font-bold text-red-500">{accuracy}%</p>
        </div>
      </div>

      {/* Silueta del Pokémon */}
      <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 mb-8">
        <p className="text-slate-400 mb-4 text-sm">¿Quién es esta silueta?</p>
        <div className="flex justify-center items-center min-h-64 bg-slate-800 rounded-lg">
          <div className="relative w-48 h-48">
            <Image
              src={gameState.currentPokemon?.imageUrl || ""}
              alt="Silueta de Pokémon"
              fill
              className="object-contain filter brightness-0"
            />
          </div>
        </div>
      </div>

      {/* Input de respuesta */}
      <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 mb-8">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={gameState.userAnswer}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Escribe el nombre del Pokémon..."
              disabled={gameState.status !== "waiting"}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
            />

            {/* Dropdown de sugerencias */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden z-10">
                {suggestions.map((pokemon, index) => (
                  <button
                    key={pokemon.id}
                    onClick={async () => {
                      // Comparar directamente sin esperar el setState
                      const isCorrect =
                        pokemon.name.toLowerCase().trim() ===
                        gameState.currentPokemon?.name.toLowerCase().trim();

                      const feedback = isCorrect
                        ? "¡Correcto!"
                        : `Incorrecto. Era ${gameState.currentPokemon?.name}`;

                      // Si es correcto, agregar a pokémon capturados
                      if (isCorrect) {
                        const spriteUrl = await getMinispriteUrl(pokemon.originalId!);
                        // Solo agregar si se encontró sprite disponible
                        if (spriteUrl) {
                          addCaughtPokemon({
                            id: pokemon.originalId!,
                            name: pokemon.name,
                            spriteUrl,
                          });
                        }
                      }

                      setGameState((prev) => ({
                        ...prev,
                        userAnswer: pokemon.name,
                        status: isCorrect ? "correct" : "incorrect",
                        score: isCorrect ? prev.score + 1 : prev.score,
                        streak: isCorrect ? prev.streak + 1 : 0,
                        totalQuestions: prev.totalQuestions + 1,
                        feedback,
                      }));
                      setSuggestions([]);
                      setSelectedSuggestionIndex(-1);
                    }}
                    className={`w-full text-left px-4 py-2 transition-colors ${
                      index === selectedSuggestionIndex
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <span className="capitalize">{pokemon.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => handleAnswer()}
            disabled={gameState.status !== "waiting" || !gameState.userAnswer.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            Enviar
          </button>
        </div>

        {/* Feedback */}
        {gameState.status !== "waiting" && (
          <div className="text-center">
            <div className="text-3xl mt-2 flex justify-center">
              {gameState.status === "correct" && <div className="text-green-400"><CheckIcon /></div>}
              {gameState.status === "incorrect" && <div className="text-red-400"><XIcon /></div>}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
