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

// Diccionario de traducciones de habilidades (solo las más importantes)
const ABILITIES_MAP: Record<string, string> = {
  "static": "Electricidad Estática",
  "lightning-rod": "Pararrayos",
  "volt-absorb": "Absorbe Electricidad",
  "synchronize": "Sincronía",
  "intimidate": "Intimidación",
  "sturdy": "Robustez",
  "thick-fat": "Sebo",
  "flash-fire": "Fuego Flasheante",
  "shield-dust": "Polvo Escudo",
  "wonder-guard": "Guardián",
  "flame-body": "Cuerpo Llama",
  "pressure": "Presión",
  "drizzle": "Gota Fría",
  "drought": "Sequía",
  "speed-boost": "Impulso",
  "battle-armor": "Armadura de Batalla",
  "shed-skin": "Muda",
  "arena-trap": "Trampa Arena",
  "natural-cure": "Curación Natural",
  "water-absorb": "Absorbe Agua",
  "overgrow": "Espesura",
  "blaze": "Llama",
  "torrent": "Torrente",
  "sand-stream": "Tormenta Arenosa",
  "pickup": "Recogida",
  "truant": "Vago",
  "run-away": "Huida",
  "keen-eye": "Ojo Agudo",
  "hydration": "Hidratación",
  "water-compaction": "Compactación Acuosa",
  "damp": "Humedad",
  "magma-armor": "Armadura Magma",
  "swift-swim": "Nado Rápido",
  "chlorophyll": "Clorofila",
  "sand-veil": "Velo Arenoso",
  "harvest": "Cosecha",
  "illuminate": "Iluminación",
  "forecast": "Previsión",
  "abilities": "Habilidades",
};

// Función para obtener traducción de habilidad - si no existe, formatea el nombre en español
export function getAbilityTranslation(name: string): string {
  if (ABILITIES_MAP[name]) {
    return ABILITIES_MAP[name];
  }
  // Fallback: capitalizar y reemplazar guiones con espacios
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
}

// Diccionario de traducciones de items evolutivos
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
  "choice-scarf": "Bufanda Elegida",
  "choice-specs": "Gafas Elegidas",
  "choice-band": "Banda Elegida",
  "assault-vest": "Chaleco Asalto",
  "life-orb": "Orbe Vital",
  "expert-belt": "Cinturón Experto",
  "soothe-bell": "Campana Sosiego",
  "sweet-apple": "Manzana Dulce",
  "tart-apple": "Manzana Ácida",
  "cracked-pot": "Jarra Agrietada",
  "chipped-pot": "Jarra Mellada",
  "reaper-cloth": "Tela Segadora",
};

// Función para obtener traducción de item - si no existe, formatea el nombre en español
export function getItemTranslation(name: string): string {
  if (ITEMS_MAP[name]) {
    return ITEMS_MAP[name];
  }
  // Fallback: capitalizar y reemplazar guiones con espacios
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
}
