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
