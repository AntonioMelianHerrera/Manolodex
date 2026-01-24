// ESTRUCTURA OFENSIVA: Qué tipos ataco efectivamente
// superEffectiveAgainst (2x): Contra qué tipos soy efectivo
// superEffectiveAgainst contiene los tipos que reciben 2x daño de este tipo
export const TYPE_OFFENSIVE: Record<string, { superEffectiveAgainst: string[] }> = {
  normal: {
    superEffectiveAgainst: [],
  },
  fire: {
    superEffectiveAgainst: ["grass", "ice", "bug", "steel"],
  },
  water: {
    superEffectiveAgainst: ["fire", "ground", "rock"],
  },
  electric: {
    superEffectiveAgainst: ["water", "flying"],
  },
  grass: {
    superEffectiveAgainst: ["water", "ground", "rock"],
  },
  ice: {
    superEffectiveAgainst: ["flying", "ground", "grass", "dragon"],
  },
  fighting: {
    superEffectiveAgainst: ["normal", "ice", "rock", "dark", "steel"],
  },
  poison: {
    superEffectiveAgainst: ["grass", "fairy"],
  },
  ground: {
    superEffectiveAgainst: ["fire", "electric", "poison", "rock", "steel"],
  },
  flying: {
    superEffectiveAgainst: ["fighting", "bug", "grass"],
  },
  psychic: {
    superEffectiveAgainst: ["fighting", "poison"],
  },
  bug: {
    superEffectiveAgainst: ["grass", "psychic", "dark"],
  },
  rock: {
    superEffectiveAgainst: ["flying", "bug", "fire", "ice"],
  },
  ghost: {
    superEffectiveAgainst: ["ghost", "psychic"],
  },
  dragon: {
    superEffectiveAgainst: ["dragon"],
  },
  dark: {
    superEffectiveAgainst: ["ghost", "psychic"],
  },
  steel: {
    superEffectiveAgainst: ["rock", "ice", "fairy"],
  },
  fairy: {
    superEffectiveAgainst: ["fighting", "dragon", "dark"],
  },
};

export const TYPE_SPANISH_NAMES: Record<string, string> = {
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

// ESTRUCTURA DEFENSIVA: Qué tipos me atacan efectivamente
// weakness (2x): Tipos que me atacan efectivamente
// resistance (0.5x): Tipos contra los que soy resistente
// immunity (0x): Tipos contra los que soy inmune
export const TYPE_DEFENSIVE: Record<string, { weakness: string[]; resistance: string[]; immunity: string[] }> = {
  normal: {
    weakness: ["fighting"],
    resistance: [],
    immunity: ["ghost"],
  },
  fire: {
    weakness: ["water", "ground", "rock"],
    resistance: ["fire", "grass", "ice", "bug", "steel", "fairy"],
    immunity: [],
  },
  water: {
    weakness: ["electric", "grass"],
    resistance: ["fire", "water", "ice", "steel"],
    immunity: [],
  },
  electric: {
    weakness: ["ground"],
    resistance: ["electric", "flying", "steel"],
    immunity: [],
  },
  grass: {
    weakness: ["fire", "ice", "poison", "flying", "bug"],
    resistance: ["ground", "water", "grass", "electric"],
    immunity: [],
  },
  ice: {
    weakness: ["fire", "fighting", "rock", "steel"],
    resistance: ["ice"],
    immunity: [],
  },
  fighting: {
    weakness: ["flying", "psychic", "fairy"],
    resistance: ["rock", "bug", "dark"],
    immunity: [],
  },
  poison: {
    weakness: ["ground", "psychic"],
    resistance: ["fighting", "poison", "bug", "grass"],
    immunity: [],
  },
  ground: {
    weakness: ["water", "grass", "ice"],
    resistance: ["poison", "rock"],
    immunity: ["electric"],
  },
  flying: {
    weakness: ["electric", "ice", "rock"],
    resistance: ["fighting", "bug", "grass"],
    immunity: ["ground"],
  },
  psychic: {
    weakness: ["bug", "ghost", "dark"],
    resistance: ["fighting", "psychic"],
    immunity: [],
  },
  bug: {
    weakness: ["fire", "flying", "rock"],
    resistance: ["fighting", "ground", "grass"],
    immunity: [],
  },
  rock: {
    weakness: ["water", "grass", "fighting", "ground", "steel"],
    resistance: ["normal", "flying", "poison", "fire"],
    immunity: [],
  },
  ghost: {
    weakness: ["ghost", "dark"],
    resistance: ["poison", "bug"],
    immunity: ["normal", "fighting"],
  },
  dragon: {
    weakness: ["ice", "dragon", "fairy"],
    resistance: ["fire", "water", "grass", "electric"],
    immunity: [],
  },
  dark: {
    weakness: ["fighting", "bug", "fairy"],
    resistance: ["ghost", "dark"],
    immunity: ["psychic"],
  },
  steel: {
    weakness: ["fire", "water", "ground"],
    resistance: ["normal", "flying", "rock", "bug", "steel", "grass", "psychic", "ice", "dragon", "fairy"],
    immunity: ["poison"],
  },
  fairy: {
    weakness: ["poison", "steel"],
    resistance: ["fighting", "bug", "dark"],
    immunity: [],
  },
};
