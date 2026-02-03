// Traducción de tipos de pokémon
export const TYPES_TRANSLATIONS: Record<string, string> = {
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

// Diccionario de traducciones de Pokémon - Nombres oficiales de Wikidex
// SOLO Pokémon Gen 9 que tienen nombres españoles DISTINTOS del inglés
// Fuente: Wikidex lista oficial
export const POKEMON_NAMES: Record<string, string> = {
  // Gen 5 - Type: Null (ID 0)
  "type-null": "Código Cero",
  
  // Gen 9 - Formas Paradoja (Pasado)
  "great-tusk": "Colmilargo",
  "scream-tail": "Colagrito",
  "brute-bonnet": "Furioseta",
  "flutter-mane": "Melenaleteo",
  "slither-wing": "Reptalada",
  "sandy-shocks": "Pelarena",
  "roaring-moon": "Bramaluna",
  
  // Gen 9 - Formas Paradoja (Futuro)
  "iron-treads": "Ferrodada",
  "iron-bundle": "Ferrosaco",
  "iron-hands": "Ferropalmas",
  "iron-jugulis": "Ferrocuello",
  "iron-moth": "Ferropolilla",
  "iron-thorns": "Ferropúas",
  "iron-crown": "Ferrotesta",
  "iron-valiant": "Ferropaladín",
  "iron-leaves": "Ferroverdor",
  "iron-boulder": "Ferromole",
  
  // Gen 9 - Otros Pokémon Gen 9
  "frigibax": "Frigibax",
  "arctibax": "Arctibax",
  "baxcalibur": "Baxcalibur",
  "gimmighoul": "Gimmighoul",
  "gholdengo": "Gholdengo",
  "wo-chien": "Wo-Chien",
  "chien-pao": "Chien-Pao",
  "ting-lu": "Ting-Lu",
  "chi-yu": "Chi-Yu",
  "koraidon": "Koraidon",
  "miraidon": "Miraidon",
  "walking-wake": "Ondulagua",
  "dipplin": "Dipplin",
  "poltchageist": "Poltchageist",
  "sinistcha": "Sinistcha",
  "okidogi": "Okidogi",
  "munkidori": "Munkidori",
  "fezandipiti": "Fezandipiti",
  "ogerpon": "Ogerpon",
  "archaludon": "Archaludon",
  "hydrapple": "Hydrapple",
  "flamariete": "Flamariete",
  "electrofuria": "Electrofuria",
  "gouging-fire": "Flamariete",
  "raging-bolt": "Electrofuria",
  "iron-mole": "Ferromole",
};


// Diccionario de traducciones de habilidades (oficial de Pokémon)
const ABILITIES_MAP: Record<string, string> = {
  "static": "Electricidad Estática",
  "lightning-rod": "Pararrayos",
  "volt-absorb": "Absorbe Electricidad",
  "synchronize": "Sincronía",
  "intimidate": "Intimidación",
  "sturdy": "Robustez",
  "thick-fat": "Sebo",
  "flash-fire": "Absorbe Fuego",
  "shield-dust": "Polvo Escudo",
  "wonder-guard": "Guardián",
  "flame-body": "Cuerpo Llama",
  "pressure": "Presión",
  "drizzle": "Llovizna",
  "drought": "Sequía",
  "speed-boost": "Impulso",
  "battle-armor": "Armadura de Batalla",
  "shed-skin": "Muda",
  "arena-trap": "Trampa Arena",
  "natural-cure": "Curación Natural",
  "water-absorb": "Absorbe Agua",
  "overgrow": "Espesura",
  "blaze": "Antorcha",
  "torrent": "Torrente",
  "sand-stream": "Tormenta de Arena",
  "pickup": "Recogida",
  "truant": "Vago",
  "run-away": "Huida",
  "keen-eye": "Ojo Agudo",
  "hydration": "Hidratación",
  "water-compaction": "Hidrorrefuerzo",
  "damp": "Humedad",
  "magma-armor": "Armadura Magma",
  "swift-swim": "Nado Rápido",
  "chlorophyll": "Clorofila",
  "sand-veil": "Velo Arena",
  "harvest": "Cosecha",
  "illuminate": "Iluminación",
  "forecast": "Previsión",
  "stench": "Hedor",
  "drip-dry": "Escurecimiento",
  "compound-eyes": "Ojo Compuesto",
  "swarm": "Enjambre",
  "gooey": "Mucosidad",
  "immunity": "Inmunidad",
  "adhesive": "Adhesión",
  "effect-spore": "Efecto Espora",
  "dry-skin": "Piel Seca",
  "competitive": "Competitivo",
  "defiant": "Desafío",
  "moxie": "Descaro",
  "cursed-body": "Cuerpo Maldito",
  "regenerator": "Regeneración",
  "weak-armor": "Armadura Frágil",
  "aura-break": "Quiebrauras",
  "multiscale": "Escamas Múltiples",
  "levitate": "Levitación",
  "unaware": "Desconocedor",
  "friend-guard": "Guardaespaldas",
  "magician": "Prestidigitador",
  "protean": "Mutatipo",
};

// Función para obtener traducción de habilidad
export function getAbilityTranslation(name: string): string {
  if (ABILITIES_MAP[name]) {
    return ABILITIES_MAP[name];
  }
  // Fallback: capitalizar y reemplazar guiones con espacios
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Diccionario de traducciones de items (oficial de Pokémon)
const ITEMS_MAP: Record<string, string> = {
  "fire-stone": "Piedra Fuego",
  "water-stone": "Piedra Agua",
  "leaf-stone": "Piedra Hoja",
  "thunder-stone": "Piedra Trueno",
  "ice-stone": "Piedra Hielo",
  "moon-stone": "Piedra Lunar",
  "sun-stone": "Piedra Solar",
  "dawn-stone": "Piedra Alba",
  "dusk-stone": "Piedra Anochecer",
  "shiny-stone": "Piedra Brillo",
  "oval-stone": "Piedra Óvalo",
  "everstone": "Piedra Eterna",
  "choice-scarf": "Pañuelo Elección",
  "choice-specs": "Gafas Elección",
  "choice-band": "Banda Elección",
  "assault-vest": "Chaleco Refuerzo",
  "life-orb": "Orbe Vital",
  "expert-belt": "Cinta Experta",
  "soothe-bell": "Campana Sosiego",
  "sweet-apple": "Manzana Dulce",
  "tart-apple": "Manzana Ácida",
  "cracked-pot": "Jarra Agrietada",
  "chipped-pot": "Jarra Mellada",
  "reaper-cloth": "Tela Segadora",
  "iron-ball": "Bola Hierro",
  "wise-glasses": "Gafas Sabias",
  "muscle-band": "Banda Músculo",
  "focus-band": "Banda Enfoque",
  "air-balloon": "Globo Aire",
  "soul-dew": "Rocío de Alma",
  "leftovers": "Restos",
  "black-sludge": "Residuo Negro",
  "sticky-barb": "Púa Pegajosa",
  "rocky-helmet": "Casco Rocoso",
  "light-ball": "Bola Luz",
  "thick-club": "Porra Gruesa",
  "macho-brace": "Arnés Macho",
};

// Función para obtener traducción de item
export function getItemTranslation(name: string): string {
  if (ITEMS_MAP[name]) {
    return ITEMS_MAP[name];
  }
  // Fallback: capitalizar y reemplazar guiones con espacios
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Función para obtener traducción de nombre de Pokémon
export function getPokemonName(name: string): string {
  // Primero, limpiar el nombre de formas (remover -mega, -gmax, -amped, -low-key, etc.)
  const baseName = cleanPokemonName(name);
  
  if (POKEMON_NAMES[baseName]) {
    return POKEMON_NAMES[baseName];
  }
  // Fallback: capitalizar el nombre original
  return baseName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Función para limpiar formas de Pokémon
export function cleanPokemonName(name: string): string {
  // Lista de sufijos de formas a remover
  const formSuffixes = [
    '-mega',
    '-mega-x',
    '-mega-y',
    '-gmax',
    '-gigantamax',
    '-amped',
    '-low-key',
    '-hero',
    '-alola',
    '-galar',
    '-paldea',
    '-hisui',
    '-crowned',
    '-gengar-mega',
    '-eternamax'
  ];
  
  let baseName = name;
  for (const suffix of formSuffixes) {
    if (baseName.endsWith(suffix)) {
      baseName = baseName.slice(0, -suffix.length);
      break;
    }
  }
  
  return baseName;
}
