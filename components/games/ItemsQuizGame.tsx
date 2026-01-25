"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { CheckIcon, XIcon } from "@/components/icons";
import { getItemTranslation } from "@/lib/translations";

type GameMode = "easy" | "hard" | "custom";

interface Item {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  category: string;
}

interface GameState {
  status: "waiting" | "correct" | "incorrect" | "game-over";
  currentItem: Item | null;
  options: Item[];
  userAnswer: string | null;
  score: number;
  totalQuestions: number;
  streak: number;
  timeLeft: number;
}

const TOTAL_ITEMS = 20000;

interface ItemsQuizGameProps {
  mode: GameMode;
  selectedCategories?: string[];
  onExit?: () => void;
}

export default function ItemsQuizGame({
  mode,
  selectedCategories = [],
  onExit,
}: ItemsQuizGameProps) {
  const QUESTIONS_LIMIT = mode === "easy" ? 10 : mode === "hard" ? 20 : Infinity;
  const TIME_LIMIT = mode === "easy" ? Infinity : mode === "hard" ? 10 : Infinity;
  const CONTINUE_ON_ERROR = mode !== "custom";

  const [gameState, setGameState] = useState<GameState>({
    status: "waiting",
    currentItem: null,
    options: [],
    userAnswer: null,
    score: 0,
    totalQuestions: 0,
    streak: 0,
    timeLeft: TIME_LIMIT,
  });

  const [gameStarted, setGameStarted] = useState(false);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [usedItems, setUsedItems] = useState<Set<number>>(new Set());
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Obtener descripción del item
  const getItemDescription = async (itemId: number): Promise<string> => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/item/${itemId}`);
      const data = await response.json();

      // Buscar descripción en español
      const flavorText = data.flavor_text_entries?.find(
        (entry: any) => entry.language.name === "es"
      );

      if (flavorText) {
        return flavorText.text
          .replace(/\n/g, " ")
          .replace(/\f/g, " ")
          .trim();
      }

      const effectText = data.effect_entries?.find(
        (entry: any) => entry.language.name === "es"
      );

      if (effectText) {
        return effectText.short_effect;
      }

      return "Descripción no disponible";
    } catch (error) {
      console.error("Error loading item description:", error);
      return "Descripción no disponible";
    }
  };

  // Censurar nombre del item en la descripción
  const censorItemName = (description: string, itemName: string): string => {
    const regex = new RegExp(itemName.replace(/-/g, "[- ]"), "gi");
    return description.replace(regex, "_____");
  };

  // Cargar lista de items con descripciones
  useEffect(() => {
    const fetchItemList = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/item?limit=${TOTAL_ITEMS}`
        );
        const data = await response.json();

        const itemListWithDescriptions: Item[] = await Promise.all(
          data.results
            .slice(0, 500) // Limitar a 500 para no sobrecargar
            .map(async (item: any, index: number) => {
              const id = index + 1;
              const description = await getItemDescription(id);
              return {
                id,
                name: item.name,
                imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png`,
                description,
                category: "", // Se puede agregar si se necesita filtrar
              };
            })
        );

        // Filtrar items excluidos (mismos que en la página de items)
        const filteredItems = itemListWithDescriptions.filter((item) => {
          const isExcluded = item.name.includes('tm') ||
                             item.name.includes('hm') ||
                             item.name.includes('data-card');
          return !isExcluded;
        });

        setAllItems(filteredItems);
      } catch (error) {
        console.error("Error loading item list:", error);
      }
    };

    fetchItemList();
  }, []);

  // Iniciar juego cuando items estén cargados
  useEffect(() => {
    if (allItems.length > 0 && !gameStarted) {
      setCountdown(3);
      setGameStarted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allItems]);

  // Cuenta atrás antes de comenzar
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        countdownRef.current = countdown - 1;
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && gameStarted && gameState.currentItem === null) {
      startGame();
    }
  }, [countdown, gameStarted, gameState.currentItem]);

  // Temporizador para modo difícil
  useEffect(() => {
    if (gameState.status === "waiting" && gameState.timeLeft > 0 && gameState.timeLeft !== Infinity) {
      timerRef.current = setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0) {
      handleAnswer({ name: "" } as Item); // Respuesta incorrecta por tiempo
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState.timeLeft, gameState.status]);

  // Auto-avance después de feedback (excepto en game-over)
  useEffect(() => {
    if (gameState.status !== "waiting" && gameState.status !== "game-over" && gameState.userAnswer !== null) {
      const timer = setTimeout(() => {
        nextQuestion();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState.status, gameState.userAnswer]);

  // Seleccionar item único (no repetido)
  const getUniqueItem = (): Item => {
    let randomId;
    do {
      randomId = Math.floor(Math.random() * allItems.length);
    } while (usedItems.has(randomId) && usedItems.size < Math.min(allItems.length, 100));

    return allItems[randomId];
  };

  // Iniciar el juego
  const startGame = async () => {
    setUsedItems(new Set());
    await generateQuestion();
  };

  const resetGame = () => {
    setCountdown(3);
    setGameStarted(true);
    setUsedItems(new Set());
    setGameState({
      status: "waiting",
      currentItem: null,
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
    }
  };

  // Generar pregunta con 4 opciones
  const generateQuestion = async () => {
    setLoading(true);
    try {
      const correctItem = getUniqueItem();
      setUsedItems((prev) => new Set(prev).add(correctItem.id));

      // Seleccionar 3 items incorrectos
      const incorrectItems = [];
      const tempUsedIds = new Set(usedItems);
      tempUsedIds.add(correctItem.id);

      while (incorrectItems.length < 3 && incorrectItems.length < allItems.length - 1) {
        const randomId = Math.floor(Math.random() * allItems.length);
        if (!tempUsedIds.has(randomId)) {
          incorrectItems.push(allItems[randomId]);
          tempUsedIds.add(randomId);
        }
      }

      // Mezclar opciones
      const options = [correctItem, ...incorrectItems].sort(
        () => Math.random() - 0.5
      );

      setGameState((prev) => ({
        ...prev,
        status: "waiting",
        currentItem: correctItem,
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
  const handleAnswer = (selectedItem: Item) => {
    if (!gameState.currentItem || gameState.status !== "waiting") return;

    const isCorrect = selectedItem.id === gameState.currentItem.id;

    setGameState((prev) => ({
      ...prev,
      status: isCorrect ? "correct" : "incorrect",
      userAnswer: selectedItem.name,
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
    if (mode === "custom" && gameState.status === "incorrect") {
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

  if (loading || !gameState.currentItem) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-block">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-400 mt-4">Cargando siguiente objeto...</p>
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

        <div className={`grid ${mode === "custom" ? "grid-cols-2" : "grid-cols-3"} gap-4 mb-8`}>
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
          {mode !== "custom" && (
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
  const isCorrect = (item: Item) => {
    return item.id === gameState.currentItem?.id && gameState.status !== "waiting";
  };

  const isIncorrect = (item: Item) => {
    return (
      gameState.userAnswer === item.name &&
      item.id !== gameState.currentItem?.id &&
      gameState.status !== "waiting"
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
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

      {/* Temporizador para modo difícil */}
      {mode === "hard" && gameState.timeLeft !== Infinity && (
        <div className="text-center mb-4">
          <p className="text-2xl font-bold text-yellow-500">{gameState.timeLeft}s</p>
        </div>
      )}

      {/* Descripción */}
      <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 mb-8">
        <p className="text-slate-400 mb-4 text-sm">¿Qué objeto es este?</p>
        <div className="bg-slate-800 rounded-lg p-6 min-h-24 flex items-center justify-center">
          <p className="text-white text-lg leading-relaxed text-center italic">
            "{gameState.currentItem?.description && gameState.currentItem?.name
              ? censorItemName(gameState.currentItem.description, gameState.currentItem.name)
              : gameState.currentItem?.description}"
          </p>
        </div>
      </div>

      {/* Opciones */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {gameState.options.map((item) => {
          let buttonStyle = "border-slate-700 hover:border-slate-500 cursor-pointer";

          if (gameState.status !== "waiting") {
            if (isCorrect(item)) {
              buttonStyle = "border-green-500 bg-green-900 cursor-default";
            } else if (isIncorrect(item)) {
              buttonStyle = "border-red-500 bg-red-900 cursor-default";
            } else {
              buttonStyle = "border-slate-700 cursor-default";
            }
          }

          return (
            <button
              key={item.id}
              onClick={() => handleAnswer(item)}
              disabled={gameState.status !== "waiting"}
              className={`bg-slate-800 border-2 rounded-lg p-4 transition-all transform hover:scale-105 ${buttonStyle} ${
                gameState.status !== "waiting" ? "" : "hover:border-blue-500"
              }`}
            >
              <div className="relative w-full h-32 mb-3">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=?';
                  }}
                />
              </div>
              <p className="text-white font-semibold capitalize">{getItemTranslation(item.name)}</p>

              {/* Feedback */}
              {gameState.status !== "waiting" && (
                <div className="text-2xl mt-3 flex justify-center">
                  {isCorrect(item) && <CheckIcon />}
                  {isIncorrect(item) && <XIcon />}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}