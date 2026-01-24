"use client";

import { useState } from "react";
import { TYPE_COLORS } from "@/types/colors";
import { TypesIcon } from "@/components/icons";

const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

// ESTRUCTURA DE OFENSA: Qué tipos son efectivos al atacar CON este tipo
// effective (2x): Contra qué tipos este tipo hace super daño
// resistant (0.5x): Contra qué tipos este tipo hace poco daño
// immune (0x): Contra qué tipos este tipo hace daño cero
const TYPE_OFFENSIVE: Record<string, { effective: string[]; resistant: string[]; immune: string[] }> = {
  normal: {
    effective: [],
    resistant: ["rock", "steel"],
    immune: ["ghost"],
  },
  fire: {
    effective: ["grass", "ice", "bug", "steel"],
    resistant: ["fire", "water", "rock", "dragon"],
    immune: [],
  },
  water: {
    effective: ["fire", "ground", "rock"],
    resistant: ["water", "grass", "dragon"],
    immune: [],
  },
  electric: {
    effective: ["water", "flying"],
    resistant: ["electric", "grass", "dragon"],
    immune: ["ground"],
  },
  grass: {
    effective: ["water", "ground", "rock"],
    resistant: ["fire", "grass", "poison", "flying", "bug", "dragon"],
    immune: [],
  },
  ice: {
    effective: ["flying", "ground", "grass", "dragon"],
    resistant: ["fire", "water", "ice", "grass"],
    immune: [],
  },
  fighting: {
    effective: ["normal", "ice", "rock", "dark", "steel"],
    resistant: ["flying", "psychic", "fairy"],
    immune: ["ghost"],
  },
  poison: {
    effective: ["grass", "fairy"],
    resistant: ["poison", "bug"],
    immune: ["steel"],
  },
  ground: {
    effective: ["fire", "electric", "poison", "rock", "steel"],
    resistant: ["grass", "bug"],
    immune: ["flying"],
  },
  flying: {
    effective: ["fighting", "bug", "grass"],
    resistant: ["electric", "rock", "steel"],
    immune: [],
  },
  psychic: {
    effective: ["fighting", "poison"],
    resistant: ["psychic", "steel"],
    immune: ["dark"],
  },
  bug: {
    effective: ["grass", "psychic", "dark"],
    resistant: ["fire", "flying", "ghost"],
    immune: [],
  },
  rock: {
    effective: ["flying", "bug", "fire", "ice"],
    resistant: ["fighting", "ground", "grass"],
    immune: [],
  },
  ghost: {
    effective: ["ghost", "psychic"],
    resistant: ["dark"],
    immune: ["normal"],
  },
  dragon: {
    effective: ["dragon"],
    resistant: ["steel", "water", "grass", "electric"],
    immune: ["fairy"],
  },
  dark: {
    effective: ["ghost", "psychic"],
    resistant: ["fighting", "dark"],
    immune: [],
  },
  steel: {
    effective: ["rock", "ice", "fairy"],
    resistant: ["steel", "water", "fire", "electric"],
    immune: [],
  },
  fairy: {
    effective: ["fighting", "dragon", "dark"],
    resistant: ["fire", "poison", "steel"],
    immune: [],
  },
};

// ESTRUCTURA DE DEFENSA: Cómo recibo ataques
// immune (0x): Qué tipos de ataque me son inmunes
// resistant (0.5x): Qué tipos de ataque resisto
// weak (2x): Contra qué tipos de ataque soy débil
const TYPE_DEFENSIVE: Record<string, { immune: string[]; resistant: string[]; weak: string[] }> = {
  normal: {
    immune: ["ghost"],
    resistant: [],
    weak: ["fighting"],
  },
  fire: {
    immune: [],
    resistant: ["bug", "steel", "grass", "ice", "fairy", "fire"],
    weak: ["water", "ground", "rock"],
  },
  water: {
    immune: [],
    resistant: ["steel", "fire", "water", "ice"],
    weak: ["electric", "grass"],
  },
  electric: {
    immune: [],
    resistant: ["flying", "steel", "electric"],
    weak: ["ground"],
  },
  grass: {
    immune: [],
    resistant: ["ground", "water", "grass"],
    weak: ["fire", "ice", "poison", "flying", "bug"],
  },
  ice: {
    immune: [],
    resistant: ["ice"],
    weak: ["fire", "fighting", "rock", "steel"],
  },
  fighting: {
    immune: [],
    resistant: ["rock", "bug", "dark"],
    weak: ["flying", "psychic", "fairy"],
  },
  poison: {
    immune: [],
    resistant: ["fighting", "poison", "bug", "grass"],
    weak: ["ground", "psychic"],
  },
  ground: {
    immune: ["electric"],
    resistant: ["poison", "rock"],
    weak: ["water", "grass", "ice"],
  },
  flying: {
    immune: ["ground"],
    resistant: ["fighting", "bug", "grass"],
    weak: ["electric", "ice", "rock"],
  },
  psychic: {
    immune: [],
    resistant: ["fighting", "psychic"],
    weak: ["bug", "ghost", "dark"],
  },
  bug: {
    immune: [],
    resistant: ["fighting", "ground", "grass"],
    weak: ["fire", "flying", "rock"],
  },
  rock: {
    immune: [],
    resistant: ["normal", "flying", "poison", "fire"],
    weak: ["water", "grass", "fighting", "ground", "steel"],
  },
  ghost: {
    immune: ["normal", "fighting"],
    resistant: ["poison", "bug"],
    weak: ["ghost", "dark"],
  },
  dragon: {
    immune: [],
    resistant: ["fire", "water", "grass", "electric"],
    weak: ["ice", "dragon", "fairy"],
  },
  dark: {
    immune: ["psychic"],
    resistant: ["ghost", "dark"],
    weak: ["fighting", "bug", "fairy"],
  },
  steel: {
    immune: ["poison"],
    resistant: ["normal", "flying", "rock", "bug", "grass", "psychic", "ice", "dragon", "fairy"],
    weak: ["fire", "ground", "fighting"],
  },
  fairy: {
    immune: [],
    resistant: ["fighting", "bug", "dark"],
    weak: ["poison", "steel"],
  },
};

const TYPE_SPANISH_NAMES: Record<string, string> = {
  normal: "Normal",
  fire: "Fuego",
  water: "Agua",
  grass: "Planta",
  electric: "Eléctrico",
  ice: "Hielo",
  fighting: "Lucha",
  poison: "Veneno",
  ground: "Tierra",
  flying: "Volador",
  psychic: "Psíquico",
  bug: "Bicho",
  rock: "Roca",
  ghost: "Fantasma",
  dragon: "Dragón",
  dark: "Siniestro",
  steel: "Acero",
  fairy: "Hada",
};

export default function TypesPage() {
  const [attackingType, setAttackingType] = useState("fire");
  const [defendingType, setDefendingType] = useState("water");
  const [secondaryType, setSecondaryType] = useState("none");

  return (
    <section className="max-w-7xl mx-auto p-4 py-8">
      <h2 className="text-3xl font-bold text-red-500 mb-2">Tabla de Tipos Pokémon</h2>
      <p className="text-slate-400 mb-8">Analiza las efectividades ofensivas y defensivas entre tipos</p>

      {/* Calculadora */}
      <div className="bg-slate-900 rounded-xl p-6 mb-8 border border-slate-800">
        <h3 className="text-xl font-semibold text-white mb-4">Calculadora de Efectividad</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col justify-center">
            <label className="block text-sm text-slate-300 mb-3 font-medium">Tipo Atacante</label>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: TYPE_COLORS[attackingType] }}
              >
                <img
                  src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${attackingType}.svg`}
                  alt={attackingType}
                  className="w-6 h-6"
                />
              </div>
              <select
                value={attackingType}
                onChange={(e) => setAttackingType(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {POKEMON_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {TYPE_SPANISH_NAMES[type]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500 mb-2">VS</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: TYPE_COLORS[defendingType] }}
              >
                <img
                  src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${defendingType}.svg`}
                  alt={defendingType}
                  className="w-6 h-6"
                />
              </div>
              <select
                value={defendingType}
                onChange={(e) => setDefendingType(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {POKEMON_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {TYPE_SPANISH_NAMES[type]}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              {secondaryType !== "none" ? (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: TYPE_COLORS[secondaryType] }}
                >
                  <img
                    src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${secondaryType}.svg`}
                    alt={secondaryType}
                    className="w-6 h-6"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg bg-slate-700 text-slate-400">
                  -
                </div>
              )}
              <select
                value={secondaryType}
                onChange={(e) => setSecondaryType(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="none">Ninguno</option>
                {POKEMON_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {TYPE_SPANISH_NAMES[type]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Resultado del Enfrentamiento */}
      <div className="bg-slate-900 rounded-xl p-6 mb-8 border border-slate-800">
        <h3 className="text-lg font-semibold text-white mb-4">Resultado del Enfrentamiento</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Atacante */}
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-2">Atacante</p>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg mx-auto mb-2"
              style={{ backgroundColor: TYPE_COLORS[attackingType] }}
            >
              <img
                src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${attackingType}.svg`}
                alt={attackingType}
                className="w-8 h-8"
              />
            </div>
            <p className="text-white font-semibold">{TYPE_SPANISH_NAMES[attackingType]}</p>
          </div>

          {/* Resultado */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-center">
              {(() => {
                const offensiveData = TYPE_OFFENSIVE[attackingType];
                const defensingTypes = secondaryType !== "none" ? [defendingType, secondaryType] : [defendingType];
                
                let damageMultiplier = 1;
                let isEffective = false;
                let isResisted = false;
                let isImmune = false;

                // Calcular multiplicador de daño
                for (const defType of defensingTypes) {
                  if (offensiveData.immune.includes(defType)) {
                    isImmune = true;
                    damageMultiplier = 0;
                  } else if (offensiveData.effective.includes(defType)) {
                    isEffective = true;
                    damageMultiplier *= 2;
                  } else if (offensiveData.resistant.includes(defType)) {
                    isResisted = true;
                    damageMultiplier *= 0.5;
                  }
                }

                // Determinar color y mensaje
                let resultColor = "text-slate-300";
                let resultBg = "bg-slate-800";
                let resultText = `${damageMultiplier}x`;
                let resultDesc = "Daño normal";

                if (isImmune) {
                  resultColor = "text-slate-400";
                  resultBg = "bg-slate-700";
                  resultText = "0x";
                  resultDesc = "Inmune";
                } else if (damageMultiplier === 4) {
                  resultColor = "text-green-400";
                  resultBg = "bg-green-900/30";
                  resultText = "4x";
                  resultDesc = "Super efectivo x2";
                } else if (damageMultiplier === 2) {
                  resultColor = "text-green-400";
                  resultBg = "bg-green-900/30";
                  resultText = "2x";
                  resultDesc = "Super efectivo";
                } else if (damageMultiplier === 0.25) {
                  resultColor = "text-red-400";
                  resultBg = "bg-red-900/30";
                  resultText = "0.25x";
                  resultDesc = "Poco efectivo x2";
                } else if (damageMultiplier === 0.5) {
                  resultColor = "text-red-400";
                  resultBg = "bg-red-900/30";
                  resultText = "0.5x";
                  resultDesc = "Poco efectivo";
                }

                return (
                  <div className={`${resultBg} rounded-lg p-6 w-full`}>
                    <p className={`text-4xl font-bold ${resultColor} mb-2`}>{resultText}</p>
                    <p className="text-slate-300 text-sm">{resultDesc}</p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Defender */}
          <div>
            <p className="text-sm text-slate-400 mb-2">Defensor</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center gap-2">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: TYPE_COLORS[defendingType] }}
                >
                  <img
                    src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${defendingType}.svg`}
                    alt={defendingType}
                    className="w-8 h-8"
                  />
                </div>
                <p className="text-white font-semibold">{TYPE_SPANISH_NAMES[defendingType]}</p>
              </div>
              {secondaryType !== "none" && (
                <div className="flex items-center justify-center gap-2">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: TYPE_COLORS[secondaryType] }}
                  >
                    <img
                      src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${secondaryType}.svg`}
                      alt={secondaryType}
                      className="w-8 h-8"
                    />
                  </div>
                  <p className="text-white font-semibold">{TYPE_SPANISH_NAMES[secondaryType]}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dos Tablas lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TABLA OFENSA */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 overflow-x-auto">
          <div className="flex items-center gap-2 mb-4">
            <TypesIcon />
            <h3 className="text-lg font-semibold text-red-500">Tabla de Ofensa</h3>
          </div>
          <p className="text-xs text-slate-400 mb-3">A qué tipos le hace daño cuando ataca</p>
          
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left p-2 text-slate-300 font-semibold">Tipo</th>
                <th className="text-left p-2 text-slate-300 font-semibold">2x Superefectivo</th>
                <th className="text-left p-2 text-slate-300 font-semibold">0.5x Poco efectivo</th>
                <th className="text-left p-2 text-slate-300 font-semibold">0x Ineficaz</th>
              </tr>
            </thead>
            <tbody>
              {POKEMON_TYPES.map((type) => {
                const offensiveData = TYPE_OFFENSIVE[type];
                return (
                  <tr key={`offensive-${type}`} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                    <td className="p-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                        style={{ backgroundColor: TYPE_COLORS[type] }}
                        title={TYPE_SPANISH_NAMES[type]}
                      >
                        <img
                          src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${type}.svg`}
                          alt={type}
                          className="w-4 h-4"
                        />
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {offensiveData.effective.length > 0 ? (
                          offensiveData.effective.map((t) => (
                            <div
                              key={t}
                              className="w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                              style={{ backgroundColor: TYPE_COLORS[t] }}
                              title={TYPE_SPANISH_NAMES[t]}
                            >
                              <img
                                src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t}.svg`}
                                alt={t}
                                className="w-3 h-3"
                              />
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-500 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {offensiveData.resistant.length > 0 ? (
                          offensiveData.resistant.map((t) => (
                            <div
                              key={t}
                              className="w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                              style={{ backgroundColor: TYPE_COLORS[t] }}
                              title={TYPE_SPANISH_NAMES[t]}
                            >
                              <img
                                src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t}.svg`}
                                alt={t}
                                className="w-3 h-3"
                              />
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-500 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {offensiveData.immune.length > 0 ? (
                          offensiveData.immune.map((t) => (
                            <div
                              key={t}
                              className="w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                              style={{ backgroundColor: TYPE_COLORS[t] }}
                              title={TYPE_SPANISH_NAMES[t]}
                            >
                              <img
                                src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t}.svg`}
                                alt={t}
                                className="w-3 h-3"
                              />
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-500 text-xs">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* TABLA DEFENSA */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 overflow-x-auto">
          <div className="flex items-center gap-2 mb-4">
            <TypesIcon />
            <h3 className="text-lg font-semibold text-blue-500">Tabla de Defensa</h3>
          </div>
          <p className="text-xs text-slate-400 mb-3">Cómo reacciona el tipo al recibir ataques</p>
          
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left p-2 text-slate-300 font-semibold">Tipo</th>
                <th className="text-left p-2 text-slate-300 font-semibold">0x Inmune</th>
                <th className="text-left p-2 text-slate-300 font-semibold">0.5x Resiste</th>
                <th className="text-left p-2 text-slate-300 font-semibold">2x Débil</th>
              </tr>
            </thead>
            <tbody>
              {POKEMON_TYPES.map((type) => {
                const defensiveData = TYPE_DEFENSIVE[type];
                return (
                  <tr key={`defensive-${type}`} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                    <td className="p-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                        style={{ backgroundColor: TYPE_COLORS[type] }}
                        title={TYPE_SPANISH_NAMES[type]}
                      >
                        <img
                          src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${type}.svg`}
                          alt={type}
                          className="w-4 h-4"
                        />
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {defensiveData.immune.length > 0 ? (
                          defensiveData.immune.map((t) => (
                            <div
                              key={t}
                              className="w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                              style={{ backgroundColor: TYPE_COLORS[t] }}
                              title={TYPE_SPANISH_NAMES[t]}
                            >
                              <img
                                src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t}.svg`}
                                alt={t}
                                className="w-3 h-3"
                              />
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-500 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {defensiveData.resistant.length > 0 ? (
                          defensiveData.resistant.map((t) => (
                            <div
                              key={t}
                              className="w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                              style={{ backgroundColor: TYPE_COLORS[t] }}
                              title={TYPE_SPANISH_NAMES[t]}
                            >
                              <img
                                src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t}.svg`}
                                alt={t}
                                className="w-3 h-3"
                              />
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-500 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {defensiveData.weak.length > 0 ? (
                          defensiveData.weak.map((t) => (
                            <div
                              key={t}
                              className="w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                              style={{ backgroundColor: TYPE_COLORS[t] }}
                              title={TYPE_SPANISH_NAMES[t]}
                            >
                              <img
                                src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t}.svg`}
                                alt={t}
                                className="w-3 h-3"
                              />
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-500 text-xs">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
