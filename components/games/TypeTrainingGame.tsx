"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { TYPE_OFFENSIVE, TYPE_SPANISH_NAMES, TYPE_DEFENSIVE } from "@/lib/typeData";
import { TYPE_COLORS } from "@/types/colors";

type GameMode = "easy" | "hard" | "infinite";

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  imageUrl: string;
}

interface GameState {
  status: "waiting" | "correct" | "incorrect" | "game-over";
  currentPokemon: Pokemon | null;
  options: string[];
  userAnswer: string | null;
  score: number;
  totalQuestions: number;
  streak: number;
  timeLeft: number;
}

const ALL_TYPES = Object.keys(TYPE_OFFENSIVE);
const TOTAL_POKEMON = 1025;

interface TypeTrainingGameProps {
  mode: GameMode;
  onExit?: () => void;
}

export default function TypeTrainingGame({ mode, onExit }: TypeTrainingGameProps) {
  const QUESTIONS_LIMIT = mode === "easy" ? 10 : mode === "hard" ? 20 : Infinity;
  const TIME_LIMIT = mode === "easy" ? Infinity : 5;
  const CONTINUE_ON_ERROR = mode !== "infinite";

  const [gameState, setGameState] = useState<GameState>({
    status: "waiting",
    currentPokemon: null,
    options: [],
    userAnswer: null,
    score: 0,
    totalQuestions: 0,
    streak: 0,
    timeLeft: TIME_LIMIT,
  });

  const [gameStarted, setGameStarted] = useState(false);
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [usedPokemon, setUsedPokemon] = useState<Set<number>>(new Set());
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef(0);

  // Cargar lista de pokémon
  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMON}`
        );
        const data = await response.json();

        const pokemonList = data.results.map((p: any, index: number) => ({
          id: index + 1,
          name: p.name,
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1}.png`,
        }));

        setAllPokemon(pokemonList);
      } catch (error) {
        console.error("Error loading pokemon list:", error);
      }
    };

    fetchPokemonList();
  }, []);

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

  // Timer para modos con límite de tiempo
  useEffect(() => {
    if (!gameStarted || gameState.status !== "waiting" || TIME_LIMIT === Infinity) {
      return;
    }

    const timer = setTimeout(() => {
      setGameState((prev) => {
        if (prev.timeLeft <= 1) {
          return {
            ...prev,
            status: "incorrect",
            userAnswer: "timeout",
            score: prev.score,
            streak: 0,
            totalQuestions: prev.totalQuestions + 1,
          };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [gameState.status, gameStarted, gameState.timeLeft, TIME_LIMIT]);

  // Auto-avance después de feedback (excepto en game-over)
  useEffect(() => {
    if (gameState.status !== "waiting" && gameState.status !== "game-over" && gameState.userAnswer !== null) {
      const timer = setTimeout(() => {
        nextQuestion();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.status, gameState.userAnswer]);

  // Obtener tipos de un pokémon
  const getPokemonTypes = async (pokemonName: string): Promise<string[]> => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      const data = await response.json();
      return data.types.map((t: any) => t.type.name);
    } catch (error) {
      console.error("Error loading pokemon types:", error);
      return [];
    }
  };

  // Seleccionar pokémon único (no repetido)
  const getUniquePokemon = (): Pokemon => {
    let randomId;
    do {
      randomId = Math.floor(Math.random() * allPokemon.length);
    } while (usedPokemon.has(randomId) && usedPokemon.size < Math.min(allPokemon.length, 100));

    return allPokemon[randomId];
  };

  // Función para calcular daño de un tipo atacante contra tipos defensores
  // Considera todas las debilidades, resistencias e inmunidades correctamente
  const calculateDamage = (attackType: string, defendTypes: string[]): number => {
    let multiplier = 1;

    // Aplicar multiplicador para cada tipo defensivo
    for (const defendType of defendTypes) {
      const defensiveData = TYPE_DEFENSIVE[defendType as keyof typeof TYPE_DEFENSIVE];

      if (!defensiveData) continue;

      if (defensiveData.weakness.includes(attackType)) {
        multiplier *= 2;
      } else if (defensiveData.resistance.includes(attackType)) {
        multiplier *= 0.5;
      } else if (defensiveData.immunity.includes(attackType)) {
        multiplier *= 0;
      }
    }

    return multiplier;
  };

  // Generar pregunta con 4 opciones
  const generateQuestion = async () => {
    setLoading(true);
    try {
      const randomPokemon = getUniquePokemon();
      setUsedPokemon((prev) => new Set(prev).add(randomPokemon.id));

      // Obtener tipos del pokémon
      const types = await getPokemonTypes(randomPokemon.name);

      // Encontrar todos los tipos que hacen 2x o 4x
      const effectiveTypes = new Set<string>();
      ALL_TYPES.forEach((attackType) => {
        const damage = calculateDamage(attackType, types);
        if (damage === 2 || damage === 4) {
          effectiveTypes.add(attackType);
        }
      });

      // Si no hay tipos efectivos, generar una nueva pregunta
      if (effectiveTypes.size === 0) {
        await generateQuestion();
        return;
      }

      // Seleccionar UNO al azar como respuesta correcta
      const correctAnswer = Array.from(effectiveTypes)[
        Math.floor(Math.random() * effectiveTypes.size)
      ];

      // Generar 3 opciones incorrectas (que NO hagan 2x o 4x)
      const wrongOptions = ALL_TYPES.filter((type) => {
        const damage = calculateDamage(type, types);
        return damage !== 2 && damage !== 4 && type !== correctAnswer;
      });
      
      const randomWrong = wrongOptions
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      // Mezclar opciones
      const options = [correctAnswer, ...randomWrong]
        .sort(() => Math.random() - 0.5);

      setGameState((prev) => ({
        ...prev,
        status: "waiting",
        currentPokemon: { ...randomPokemon, types },
        options,
        userAnswer: null,
        timeLeft: TIME_LIMIT,
      }));
    } catch (error) {
      console.error("Error generating question:", error);
    } finally {
      setLoading(false);
    }
  };

  // Procesar respuesta del usuario
  const handleAnswer = (selectedType: string) => {
    if (!gameState.currentPokemon || gameState.status !== "waiting") return;

    // Calcular daño del tipo seleccionado
    const damage = calculateDamage(selectedType, gameState.currentPokemon!.types);
    
    // Es correcta si hace 2x o 4x
    const isCorrect = damage === 2 || damage === 4;

    setGameState((prev) => ({
      ...prev,
      status: isCorrect ? "correct" : "incorrect",
      userAnswer: selectedType,
      score: isCorrect ? prev.score + 1 : prev.score,
      streak: isCorrect ? prev.streak + 1 : 0,
      totalQuestions: prev.totalQuestions + 1,
    }));
  };

  // Ir a la siguiente pregunta
  const nextQuestion = async () => {
    // Verificar si se alcanzó el límite de preguntas
    // totalQuestions ya fue incrementado en handleAnswer
    if (gameState.totalQuestions >= QUESTIONS_LIMIT) {
      // Guardar mejor racha en modo infinito
      if (mode === "infinite" && gameState.streak > 0) {
        const bestStreak = localStorage.getItem("bestInfiniteStreak");
        const currentBest = bestStreak ? parseInt(bestStreak) : 0;
        if (gameState.streak > currentBest) {
          localStorage.setItem("bestInfiniteStreak", gameState.streak.toString());
        }
      }
      setGameState((prev) => ({ ...prev, status: "game-over" }));
      return;
    }

    // En modo infinito, si es incorrecto, terminar
    if (mode === "infinite" && gameState.status === "incorrect") {
      // Guardar mejor racha
      const bestStreak = localStorage.getItem("bestInfiniteStreak");
      const currentBest = bestStreak ? parseInt(bestStreak) : 0;
      if (gameState.streak > currentBest) {
        localStorage.setItem("bestInfiniteStreak", gameState.streak.toString());
      }
      setGameState((prev) => ({ ...prev, status: "game-over" }));
      return;
    }

    await generateQuestion();
  };

  // Iniciar el juego
  // Iniciar el juego - SOLO carga la primera pregunta, NO resetea countdown
  const startGame = async () => {
    setUsedPokemon(new Set());
    await generateQuestion();
  };

  // Resetear juego completo
  const resetGame = () => {
    setCountdown(3);
    setGameStarted(true);
    setUsedPokemon(new Set());
    setGameState({
      status: "waiting",
      currentPokemon: null,
      options: [],
      userAnswer: null,
      score: 0,
      totalQuestions: 0,
      streak: 0,
      timeLeft: TIME_LIMIT,
    });
  };

  // Salir del juego
  const exitGame = () => {
    if (onExit) {
      onExit();
    } else {
      // Fallback: reiniciar el juego localmente si no hay callback
      setGameStarted(false);
      setGameState({
        status: "waiting",
        currentPokemon: null,
        options: [],
        userAnswer: null,
        score: 0,
        totalQuestions: 0,
        streak: 0,
        timeLeft: TIME_LIMIT,
      });
      setUsedPokemon(new Set());
    }
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

        <div className={`grid ${mode === "infinite" ? "grid-cols-2" : "grid-cols-3"} gap-4 mb-8`}>
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
          {mode !== "infinite" && (
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
              <p className="text-slate-400 text-sm">Precisión</p>
              <p className="text-3xl font-bold text-blue-400">{accuracy}%</p>
            </div>
          )}
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
  // Calcular tipos que hacen 2x o 4x (respuesta correcta)
  const correctAnswers = new Set<string>();
  ALL_TYPES.forEach((attackType) => {
    const damage = calculateDamage(attackType, gameState.currentPokemon!.types);
    if (damage === 2 || damage === 4) {
      correctAnswers.add(attackType);
    }
  });

  return (
    <div className="max-w-2xl mx-auto">
      {/* Puntuación y progreso */}
      <div className="grid grid-cols-4 gap-4 mb-8">
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
        {TIME_LIMIT !== Infinity && (
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 text-center">
            <p className="text-slate-400 text-xs">Tiempo</p>
            <p
              className={`text-2xl font-bold ${
                gameState.timeLeft <= 2 ? "text-red-500" : "text-white"
              }`}
            >
              {gameState.timeLeft}s
            </p>
          </div>
        )}
      </div>

      {/* Pokémon */}
      <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 mb-8 text-center">
        <div className="relative w-48 h-48 mx-auto mb-4">
          <Image
            src={gameState.currentPokemon.imageUrl}
            alt={gameState.currentPokemon.name}
            fill
            className="object-contain"
            priority
          />
        </div>

        <h3 className="text-2xl font-bold text-white capitalize mb-3">
          {gameState.currentPokemon.name}
        </h3>

        {/* Tipos del pokémon */}
        <div className="flex gap-2 justify-center mb-6">
          {gameState.currentPokemon.types.map((type) => (
            <div
              key={type}
              className="px-3 py-1 rounded-full text-white text-sm font-semibold"
              style={{
                backgroundColor:
                  TYPE_COLORS[type as keyof typeof TYPE_COLORS] || "#666",
              }}
            >
              {TYPE_SPANISH_NAMES[type as keyof typeof TYPE_SPANISH_NAMES] ||
                type}
            </div>
          ))}
        </div>

        <p className="text-slate-400 text-sm">
          ¿Qué tipo sería SUPEREFECTIVO atacando este Pokémon?
        </p>
      </div>

      {/* Opciones y Feedback */}
      <div className="flex gap-6 mb-8 items-center">
        {/* Opciones */}
        <div className="grid grid-cols-2 gap-4 flex-1">
          {gameState.options.map((type) => {
            const isSelected = gameState.userAnswer === type;
            const isCorrect = correctAnswers.has(type);
            const showResult = gameState.status !== "waiting";

            let buttonStyle =
              "bg-slate-800 hover:bg-slate-700 border-slate-700 cursor-pointer";

            if (showResult) {
              if (isCorrect) {
                buttonStyle = "bg-green-600 border-green-500 cursor-default";
              } else if (isSelected && !isCorrect) {
                buttonStyle = "bg-red-600 border-red-500 cursor-default";
              } else {
                buttonStyle = "bg-slate-800 border-slate-700 cursor-default";
              }
            } else if (isSelected) {
              buttonStyle = "bg-red-600 border-red-500 cursor-pointer";
            }

            return (
              <button
                key={type}
                onClick={() => handleAnswer(type)}
                disabled={gameState.status !== "waiting"}
                className={`p-4 rounded-lg border-2 text-white font-semibold capitalize transition-all flex items-center justify-center gap-3 ${buttonStyle}`}
                style={{
                  backgroundColor:
                    !showResult && !isSelected
                      ? TYPE_COLORS[type as keyof typeof TYPE_COLORS] || "#444"
                      : undefined,
                }}
              >
                <img
                  src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${type}.svg`}
                  alt={type}
                  className="w-5 h-5"
                />
                {TYPE_SPANISH_NAMES[type as keyof typeof TYPE_SPANISH_NAMES] ||
                  type}
              </button>
            );
          })}
        </div>

        {/* Feedback - A la derecha */}
        {gameState.status !== "waiting" && (
          <div className="text-6xl animate-pulse">
            {gameState.status === "correct" ? "✓" : "✗"}
          </div>
        )}
      </div>
    </div>
  );
}
