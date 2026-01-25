"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PlayIcon, CheckIcon, XIcon } from "@/components/icons";
import { isDesiredPokemonVariant } from "@/lib/pokemon";

type GameMode = "normal" | "infinite" | "custom";

interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  cryUrl: string;
  generation: number;
}

interface GameState {
  status: "waiting" | "correct" | "incorrect" | "game-over";
  currentPokemon: Pokemon | null;
  options: Pokemon[];
  userAnswer: string | null;
  score: number;
  totalQuestions: number;
  streak: number;
}

const TOTAL_POKEMON = 1025;

interface SoundQuizGameProps {
  mode: GameMode;
  selectedGenerations?: number[];
  onExit?: () => void;
}

export default function SoundQuizGame({
  mode,
  selectedGenerations = [1, 2, 3, 4, 5, 6, 7, 8, 9],
  onExit,
}: SoundQuizGameProps) {
  const QUESTIONS_LIMIT = mode === "normal" ? 10 : Infinity;
  const CONTINUE_ON_ERROR = mode !== "infinite";

  const [gameState, setGameState] = useState<GameState>({
    status: "waiting",
    currentPokemon: null,
    options: [],
    userAnswer: null,
    score: 0,
    totalQuestions: 0,
    streak: 0,
  });

  const [gameStarted, setGameStarted] = useState(false);
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [usedPokemon, setUsedPokemon] = useState<Set<number>>(new Set());
  const [countdown, setCountdown] = useState(0);
  const [volume, setVolume] = useState(0.3); // Volumen inicial al 30%
  const audioRef = useRef<HTMLAudioElement>(null);
  const countdownRef = useRef(0);

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

  // Cargar lista de pokémon
  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMON}`
        );
        const data = await response.json();

        const pokemonList = data.results
          .map((p: any, index: number) => ({
            id: index + 1,
            name: p.name,
            imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
              index + 1
            }.png`,
            cryUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/cries/latest/${
              index + 1
            }.ogg`,
            generation: getGenerationFromId(index + 1),
          }))
          .filter((p: Pokemon) => 
            isDesiredPokemonVariant(p.name) &&
            selectedGenerations.includes(p.generation)
          );

        setAllPokemon(pokemonList);
      } catch (error) {
        console.error("Error loading pokemon list:", error);
      }
    };

    fetchPokemonList();
  }, [selectedGenerations]);

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
    if (gameState.status !== "waiting" && gameState.status !== "game-over" && gameState.userAnswer !== null) {
      const timer = setTimeout(() => {
        nextQuestion();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState.status, gameState.userAnswer]);

  // Seleccionar pokémon único (no repetido)
  const getUniquePokemon = (): Pokemon => {
    let randomId;
    do {
      randomId = Math.floor(Math.random() * allPokemon.length);
    } while (usedPokemon.has(randomId) && usedPokemon.size < Math.min(allPokemon.length, 100));

    return allPokemon[randomId];
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
    setGameState({
      status: "waiting",
      currentPokemon: null,
      options: [],
      userAnswer: null,
      score: 0,
      totalQuestions: 0,
      streak: 0,
    });
  };

  // Salir del juego
  const exitGame = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (onExit) {
      onExit();
    }
  };

  // Generar pregunta con 4 opciones
  const generateQuestion = async () => {
    setLoading(true);
    try {
      const correctPokemon = getUniquePokemon();
      setUsedPokemon((prev) => new Set(prev).add(correctPokemon.id));

      // Seleccionar 3 pokémon incorrectos
      const incorrectPokemon = [];
      const tempUsedIds = new Set(usedPokemon);
      tempUsedIds.add(correctPokemon.id);

      while (incorrectPokemon.length < 3 && incorrectPokemon.length < allPokemon.length - 1) {
        const randomId = Math.floor(Math.random() * allPokemon.length);
        if (!tempUsedIds.has(randomId)) {
          incorrectPokemon.push(allPokemon[randomId]);
          tempUsedIds.add(randomId);
        }
      }

      // Mezclar opciones
      const options = [correctPokemon, ...incorrectPokemon].sort(
        () => Math.random() - 0.5
      );

      setGameState((prev) => ({
        ...prev,
        status: "waiting",
        currentPokemon: correctPokemon,
        options,
        userAnswer: null,
      }));
    } catch (error) {
      console.error("Error generating question:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reproducir sonido del pokémon
  const playCry = async () => {
    if (!gameState.currentPokemon || !audioRef.current) return;

    try {
      // Detener reproducción anterior
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      // Intentar con la URL del grito
      audioRef.current.src = gameState.currentPokemon.cryUrl;
      audioRef.current.volume = volume;
      await audioRef.current.play();
    } catch (error) {
      console.error("Error playing cry:", error);
      // Fallback: intentar con la API directa
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${gameState.currentPokemon.id}`
        );
        const data = await response.json();
        const cryUrl = data.cries?.latest || data.cries?.legacy;
        
        if (cryUrl && audioRef.current) {
          audioRef.current.src = cryUrl;
          audioRef.current.volume = volume;
          await audioRef.current.play();
        }
      } catch (fallbackError) {
        console.error("Fallback cry error:", fallbackError);
      }
    }
  };

  // Procesar respuesta del usuario
  const handleAnswer = (selectedPokemon: Pokemon) => {
    if (!gameState.currentPokemon || gameState.status !== "waiting") return;

    const isCorrect = selectedPokemon.id === gameState.currentPokemon.id;

    setGameState((prev) => ({
      ...prev,
      status: isCorrect ? "correct" : "incorrect",
      userAnswer: selectedPokemon.name,
      score: isCorrect ? prev.score + 1 : prev.score,
      streak: isCorrect ? prev.streak + 1 : 0,
      totalQuestions: prev.totalQuestions + 1,
    }));
  };

  // Ir a la siguiente pregunta
  const nextQuestion = async () => {
    // Verificar si se alcanzó el límite de preguntas
    if (gameState.totalQuestions >= QUESTIONS_LIMIT) {
      setGameState((prev) => ({ ...prev, status: "game-over" }));
      return;
    }

    // En modo infinito, si es incorrecto, terminar
    if (mode === "infinite" && gameState.status === "incorrect") {
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
  const isCorrect = (pokemon: Pokemon) => {
    return pokemon.id === gameState.currentPokemon?.id && gameState.status !== "waiting";
  };

  const isIncorrect = (pokemon: Pokemon) => {
    return (
      gameState.userAnswer === pokemon.name &&
      pokemon.id !== gameState.currentPokemon?.id &&
      gameState.status !== "waiting"
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <audio ref={audioRef} />

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

      {/* Botón Play */}
      <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 mb-8 text-center">
        <p className="text-slate-400 mb-6">¿Qué Pokémon es este?</p>
        <button
          onClick={playCry}
          disabled={gameState.status !== "waiting"}
          className="mx-auto mb-6 px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold rounded-lg transition-all flex items-center gap-3 hover:shadow-lg hover:shadow-blue-500/50 disabled:cursor-default cursor-pointer"
        >
          <PlayIcon />
          Reproducir Grito
        </button>
        <p className="text-slate-500 text-sm">Haz clic para reproducir el grito del Pokémon</p>

        {/* Control de Volumen */}
        <div className="mt-6 flex items-center justify-center gap-4 bg-slate-800 rounded-lg p-4">
          <span className="text-slate-400 text-sm">Volumen:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(volume * 100)}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
            className="w-32 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <span className="text-slate-300 text-sm font-semibold w-8 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* Opciones */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {gameState.options.map((pokemon) => {
          let buttonStyle = "border-slate-700 hover:border-slate-500 cursor-pointer";

          if (gameState.status !== "waiting") {
            if (isCorrect(pokemon)) {
              buttonStyle = "border-green-500 bg-green-900 cursor-default";
            } else if (isIncorrect(pokemon)) {
              buttonStyle = "border-red-500 bg-red-900 cursor-default";
            } else {
              buttonStyle = "border-slate-700 cursor-default";
            }
          }

          return (
            <button
              key={pokemon.id}
              onClick={() => handleAnswer(pokemon)}
              disabled={gameState.status !== "waiting"}
              className={`bg-slate-800 border-2 rounded-lg p-4 transition-all transform hover:scale-105 ${buttonStyle} ${
                gameState.status !== "waiting" ? "" : "hover:border-blue-500"
              }`}
            >
              <div className="relative w-full h-32 mb-3">
                <Image
                  src={pokemon.imageUrl}
                  alt={pokemon.name}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-white font-semibold capitalize">{pokemon.name}</p>

              {/* Feedback */}
              {gameState.status !== "waiting" && (
                <div className="text-2xl mt-3 flex justify-center">
                  {isCorrect(pokemon) && <CheckIcon />}
                  {isIncorrect(pokemon) && <XIcon />}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
