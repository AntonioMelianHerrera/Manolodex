"use client";

import { useState, useEffect } from "react";
import TypeTrainingGame from "@/components/games/TypeTrainingGame";
import SoundQuizGame from "@/components/games/SoundQuizGame";
import PokédexQuizGame from "@/components/games/PokédexQuizGame";
import { TypesIcon, SoundIcon, PokedexIcon, PlayIcon, SettingsIcon } from "@/components/icons";

type GameType = "none" | "type-training" | "type-training-easy" | "type-training-hard" | "type-training-infinite" | "sound-quiz" | "sound-quiz-normal" | "sound-quiz-infinite" | "sound-quiz-custom" | "pokedex-quiz" | "pokedex-quiz-normal" | "pokedex-quiz-infinite" | "pokedex-quiz-custom";

export default function MinijuegosPage() {
  const [selectedGame, setSelectedGame] = useState<GameType>("none");
  const [showTypeTrainingModes, setShowTypeTrainingModes] = useState(false);
  const [showSoundQuizModes, setShowSoundQuizModes] = useState(false);
  const [showPokédexQuizModes, setShowPokédexQuizModes] = useState(false);
  const [showGenerationFilter, setShowGenerationFilter] = useState(false);
  const [currentGameType, setCurrentGameType] = useState<"sound" | "pokedex" | null>(null);
  const [bestStreak, setBestStreak] = useState(0);
  const [selectedGenerations, setSelectedGenerations] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  useEffect(() => {
    // Cargar mejor racha del localStorage
    const saved = localStorage.getItem("bestInfiniteStreak");
    if (saved) {
      setBestStreak(parseInt(saved));
    }
  }, []);

  const renderDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return <TypesIcon />;
      case "hard":
        return <TypesIcon />;
      case "infinite":
        return <TypesIcon />;
      default:
        return <TypesIcon />;
    }
  };

  const renderGameIcon = (iconType: string) => {
    switch (iconType) {
      case "types":
        return <TypesIcon />;
      case "sound":
        return <SoundIcon />;
      case "pokedex":
        return <PokedexIcon />;
      default:
        return <TypesIcon />;
    }
  };

  const games = [
    {
      id: "type-training" as const,
      title: "Entrenamiento de Tipos",
      description: "Aprende qué tipos son efectivos atacando a cada Pokémon",
      iconType: "types" as const,
    },
    {
      id: "sound-quiz" as const,
      title: "Quiz de Sonidos",
      description: "Adivina el Pokémon por su grito",
      iconType: "sound" as const,
    },
    {
      id: "pokedex-quiz" as const,
      title: "Quiz de Pokédex",
      description: "Adivina el Pokémon por su descripción",
      iconType: "pokedex" as const,
    },
  ];

  if (selectedGame !== "none") {
    return (
      <section className="max-w-6xl mx-auto p-4 py-8">
        <button
          onClick={() => setSelectedGame("none")}
          className="mb-6 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          ← Volver a minijuegos
        </button>
        
        {selectedGame === "type-training-easy" && <TypeTrainingGame mode="easy" onExit={() => setSelectedGame("none")} />}
        {selectedGame === "type-training-hard" && <TypeTrainingGame mode="hard" onExit={() => setSelectedGame("none")} />}
        {selectedGame === "type-training-infinite" && <TypeTrainingGame mode="infinite" onExit={() => setSelectedGame("none")} />}
        {selectedGame === "sound-quiz-normal" && <SoundQuizGame mode="normal" selectedGenerations={selectedGenerations} onExit={() => setSelectedGame("none")} />}
        {selectedGame === "sound-quiz-infinite" && <SoundQuizGame mode="infinite" selectedGenerations={selectedGenerations} onExit={() => setSelectedGame("none")} />}
        {selectedGame === "sound-quiz-custom" && <SoundQuizGame mode="custom" selectedGenerations={selectedGenerations} onExit={() => setSelectedGame("none")} />}
        {selectedGame === "pokedex-quiz-normal" && <PokédexQuizGame mode="normal" selectedGenerations={selectedGenerations} onExit={() => setSelectedGame("none")} />}
        {selectedGame === "pokedex-quiz-infinite" && <PokédexQuizGame mode="infinite" selectedGenerations={selectedGenerations} onExit={() => setSelectedGame("none")} />}
        {selectedGame === "pokedex-quiz-custom" && <PokédexQuizGame mode="custom" selectedGenerations={selectedGenerations} onExit={() => setSelectedGame("none")} />}
      </section>
    );
  }

  // Selector de modo para Quiz de Sonidos
  if (showSoundQuizModes) {
    return (
      <section className="max-w-6xl mx-auto p-4 py-8">
        <button
          onClick={() => {
            setShowSoundQuizModes(false);
            setShowGenerationFilter(false);
          }}
          className="mb-6 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          ← Volver
        </button>

        {!showGenerationFilter ? (
          <>
            <h2 className="text-3xl font-bold text-red-500 mb-8">
              Selecciona el Modo
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => {
                  setSelectedGame("sound-quiz-normal");
                  setShowSoundQuizModes(false);
                }}
                className="bg-blue-900 hover:bg-blue-800 border border-blue-700 hover:border-blue-500 rounded-xl p-6 transition-all transform hover:scale-105 text-center"
              >
                <div className="text-6xl mb-3 inline-block">
                  <SoundIcon />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Normal</h3>
                <p className="text-slate-300 text-sm mb-4">
                  10 Pokémon • Continúa aunque falles
                </p>
                <p className="text-blue-300 font-semibold">Perfecto para practicar</p>
              </button>

              <button
                onClick={() => {
                  setSelectedGame("sound-quiz-infinite");
                  setShowSoundQuizModes(false);
                }}
                className="bg-red-900 hover:bg-red-800 border border-red-700 hover:border-red-500 rounded-xl p-6 transition-all transform hover:scale-105 text-center"
              >
                <div className="text-6xl mb-3 inline-block">
                  <SoundIcon />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Infinito</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Sin fin • Termina en el primer error
                </p>
                <p className="text-red-300 font-semibold">Modo Desafío</p>
              </button>

              <button
                onClick={() => setShowGenerationFilter(true)}
                className="bg-purple-900 hover:bg-purple-800 border border-purple-700 hover:border-purple-500 rounded-xl p-6 transition-all transform hover:scale-105 text-center"
              >
                <div className="text-6xl mb-3 inline-block">
                  <SettingsIcon />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Personalizado</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Elige generaciones y dificultad
                </p>
                <p className="text-purple-300 font-semibold">A tu medida</p>
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-red-500 mb-6">
              Selecciona las Generaciones
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((gen) => (
                <label
                  key={gen}
                  className="flex items-center gap-3 p-4 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedGenerations.includes(gen)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedGenerations([...selectedGenerations, gen].sort());
                      } else {
                        setSelectedGenerations(
                          selectedGenerations.filter((g) => g !== gen)
                        );
                      }
                    }}
                    className="w-5 h-5"
                  />
                  <span className="text-white font-semibold">
                    Generación {gen}
                  </span>
                </label>
              ))}
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Selecciona la Dificultad</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setSelectedGame("sound-quiz-normal");
                    setShowSoundQuizModes(false);
                    setShowGenerationFilter(false);
                  }}
                  className="bg-blue-900 hover:bg-blue-800 border border-blue-700 hover:border-blue-500 rounded-lg p-4 transition-colors text-white font-semibold"
                >
                  Normal (10 rondas)
                </button>
                <button
                  onClick={() => {
                    setSelectedGame("sound-quiz-infinite");
                    setShowSoundQuizModes(false);
                    setShowGenerationFilter(false);
                  }}
                  className="bg-red-900 hover:bg-red-800 border border-red-700 hover:border-red-500 rounded-lg p-4 transition-colors text-white font-semibold"
                >
                  Infinito
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    );
  }

  // Selector de modo para Quiz de Pokédex
  if (showPokédexQuizModes) {
    return (
      <section className="max-w-6xl mx-auto p-4 py-8">
        <button
          onClick={() => {
            setShowPokédexQuizModes(false);
            setShowGenerationFilter(false);
          }}
          className="mb-6 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          ← Volver
        </button>

        {!showGenerationFilter ? (
          <>
            <h2 className="text-3xl font-bold text-red-500 mb-8">
              Selecciona el Modo
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => {
                  setSelectedGame("pokedex-quiz-normal");
                  setShowPokédexQuizModes(false);
                }}
                className="bg-blue-900 hover:bg-blue-800 border border-blue-700 hover:border-blue-500 rounded-xl p-6 transition-all transform hover:scale-105 text-center"
              >
                <div className="text-6xl mb-3 inline-block">
                  <PokedexIcon />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Normal</h3>
                <p className="text-slate-300 text-sm mb-4">
                  10 Pokémon • Continúa aunque falles
                </p>
                <p className="text-blue-300 font-semibold">Perfecto para practicar</p>
              </button>

              <button
                onClick={() => {
                  setSelectedGame("pokedex-quiz-infinite");
                  setShowPokédexQuizModes(false);
                }}
                className="bg-red-900 hover:bg-red-800 border border-red-700 hover:border-red-500 rounded-xl p-6 transition-all transform hover:scale-105 text-center"
              >
                <div className="text-6xl mb-3 inline-block">
                  <PokedexIcon />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Infinito</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Sin fin • Termina en el primer error
                </p>
                <p className="text-red-300 font-semibold">Modo Desafío</p>
              </button>

              <button
                onClick={() => setShowGenerationFilter(true)}
                className="bg-purple-900 hover:bg-purple-800 border border-purple-700 hover:border-purple-500 rounded-xl p-6 transition-all transform hover:scale-105 text-center"
              >
                <div className="text-6xl mb-3 inline-block">
                  <SettingsIcon />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Personalizado</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Elige generaciones y dificultad
                </p>
                <p className="text-purple-300 font-semibold">A tu medida</p>
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-red-500 mb-6">
              Selecciona las Generaciones
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              * La generación 9 no tiene descripciones disponibles en español
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((gen) => (
                <label
                  key={gen}
                  className="flex items-center gap-3 p-4 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedGenerations.includes(gen)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedGenerations([...selectedGenerations, gen].sort());
                      } else {
                        setSelectedGenerations(
                          selectedGenerations.filter((g) => g !== gen)
                        );
                      }
                    }}
                    className="w-5 h-5"
                  />
                  <span className="text-white font-semibold">
                    Generación {gen}
                  </span>
                </label>
              ))}
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Selecciona la Dificultad</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setSelectedGame("pokedex-quiz-normal");
                    setShowPokédexQuizModes(false);
                    setShowGenerationFilter(false);
                  }}
                  className="bg-blue-900 hover:bg-blue-800 border border-blue-700 hover:border-blue-500 rounded-lg p-4 transition-colors text-white font-semibold"
                >
                  Normal (10 rondas)
                </button>
                <button
                  onClick={() => {
                    setSelectedGame("pokedex-quiz-infinite");
                    setShowPokédexQuizModes(false);
                    setShowGenerationFilter(false);
                  }}
                  className="bg-red-900 hover:bg-red-800 border border-red-700 hover:border-red-500 rounded-lg p-4 transition-colors text-white font-semibold"
                >
                  Infinito
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    );
  }

  // Selector de modo para Entrenamiento de Tipos
  if (showTypeTrainingModes) {
    return (
      <section className="max-w-6xl mx-auto p-4 py-8">
        <button
          onClick={() => setShowTypeTrainingModes(false)}
          className="mb-6 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          ← Volver
        </button>

        <h2 className="text-3xl font-bold text-red-500 mb-8">
          Selecciona la Dificultad
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => setSelectedGame("type-training-easy")}
            className="bg-green-900 hover:bg-green-800 border border-green-700 hover:border-green-500 rounded-xl p-6 transition-all transform hover:scale-105 text-center"
          >
            <div className="text-6xl mb-3 inline-block">
              {renderDifficultyIcon("easy")}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Fácil</h3>
            <p className="text-slate-300 text-sm mb-4">
              10 Pokémon • Sin límite de tiempo • Continúa aunque falles
            </p>
            <p className="text-green-300 font-semibold">Perfecta para aprender</p>
          </button>

          <button
            onClick={() => setSelectedGame("type-training-hard")}
            className="bg-yellow-900 hover:bg-yellow-800 border border-yellow-700 hover:border-yellow-500 rounded-xl p-6 transition-all transform hover:scale-105 text-center"
          >
            <div className="text-6xl mb-3 inline-block">
              {renderDifficultyIcon("hard")}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Difícil</h3>
            <p className="text-slate-300 text-sm mb-4">
              20 Pokémon • 5 segundos por pregunta • Continúa aunque falles
            </p>
            <p className="text-yellow-300 font-semibold">Para expertos</p>
          </button>

          <button
            onClick={() => setSelectedGame("type-training-infinite")}
            className="bg-red-900 hover:bg-red-800 border border-red-700 hover:border-red-500 rounded-xl p-6 transition-all transform hover:scale-105 text-center"
          >
            <div className="text-6xl mb-3 inline-block">
              {renderDifficultyIcon("infinite")}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Infinito</h3>
            <p className="text-slate-300 text-sm mb-4">
              Sin fin • 5 segundos por pregunta • Termina en el primer error
            </p>
            {bestStreak > 0 && (
              <p className="text-red-300 font-semibold mb-2">Mejor racha: {bestStreak}</p>
            )}
            <p className="text-red-300 font-semibold">Modo Adiestramiento</p>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto p-4 py-8">
      <h2 className="text-3xl font-bold text-red-500 mb-2">Minijuegos</h2>
      <p className="text-slate-400 mb-8">Elige un minijuego para comenzar</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game: any) => (
          <button
            key={game.id}
            onClick={() => {
              if (game.id === "type-training") {
                setShowTypeTrainingModes(true);
              } else if (game.id === "sound-quiz") {
                setShowSoundQuizModes(true);
              } else if (game.id === "pokedex-quiz") {
                setShowPokédexQuizModes(true);
              } else {
                setSelectedGame(game.id as GameType);
              }
            }}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-red-500 rounded-xl p-6 transition-all transform hover:scale-105"
          >
            <div className="text-5xl mb-3 inline-block">
              {renderGameIcon(game.iconType)}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {game.title}
            </h3>
            <p className="text-slate-400 text-sm">{game.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
