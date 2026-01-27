// STRATEGIC IMPLEMENTATION MAP - ALL POKÉMON FORMS
// Status: PHASE 1 - FOUNDATION COMPLETE
// The system is now in place to dynamically load ALL alternate forms

// The implementation works as follows:
// 1. PokemonModal.tsx now fetches ALL varieties from PokeAPI
// 2. It intelligently filters to show only forms with:
//    - Type changes (hasTypeChange)
//    - Ability changes (hasAbilityChange)  
//    - Stat changes (hasStatsChange)
//    - Or is a special form (Mega, Gigantamax, Regional)
// 3. Form names are translated using formTranslations.ts

// FULL POKÉMON FORM LIST BY CATEGORY
// Based on https://www.wikidex.net/wiki/Lista_de_Pok%C3%A9mon_con_diferentes_formas

// ============================================
// CATEGORY 1: COMBAT FORM-CHANGERS (23 Pokémon)
// ============================================
// These change form during battle based on conditions

const COMBAT_FORM_CHANGERS = {
  castform: {
    forms: ["normal", "sunny", "rainy", "snowy"],
    changes: "type",
    condition: "weather"
  },
  kyogre: {
    forms: ["normal", "primal"],
    changes: "type",
    condition: "item (prisma azul)"
  },
  groudon: {
    forms: ["normal", "primal"],
    changes: "type",
    condition: "item (prisma rojo)"
  },
  burmy: {
    forms: ["planta", "arena", "basura"],
    changes: "none",
    condition: "last combat form"
  },
  wormadam: {
    forms: ["planta", "arena", "basura"],
    changes: "type + stats",
    condition: "inherited from burmy"
  },
  cherrim: {
    forms: ["encapotado", "soleado"],
    changes: "stats",
    condition: "sunny weather"
  },
  arceus: {
    forms: ["normal", "fuego", "agua", "planta", "eléctrico", "hielo", "lucha", "veneno", "tierra", "volador", "psíquico", "bicho", "roca", "fantasma", "dragón", "siniestro", "acero", "hada"],
    changes: "type",
    condition: "tabla elemental"
  },
  darmanitan: {
    forms: ["normal", "daruma"],
    changes: "type + stats",
    condition: "modo daruma ability + <50% HP"
  },
  meloetta: {
    forms: ["lírica", "danza"],
    changes: "stats",
    condition: "after defeating opponent"
  },
  greninja: {
    forms: ["normal", "ash"],
    changes: "type",
    condition: "fuerte afecto ability"
  },
  aegislash: {
    forms: ["filo", "escudo"],
    changes: "stats",
    condition: "cambio táctico ability"
  },
  xerneas: {
    forms: ["relajado", "activo"],
    changes: "aesthetic",
    condition: "battle vs. resting"
  },
  zygarde: {
    forms: ["10%", "50%", "completo"],
    changes: "stats",
    condition: "agrupamiento ability + HP"
  },
  wishiwashi: {
    forms: ["individual", "banco"],
    changes: "stats",
    condition: "banco ability + level 20 + HP"
  },
  minior: {
    forms: ["meteorito", "rojo", "naranja", "amarillo", "verde", "azul", "índigo", "violeta"],
    changes: "type + stats",
    condition: "escudo limitado ability"
  },
  mimikyu: {
    forms: ["encubierto", "descubierto"],
    changes: "none",
    condition: "disfrazarse ability"
  },
  cramorant: {
    forms: ["normal", "tragatodo"],
    changes: "none",
    condition: "tragamisil ability"
  },
  eiscue: {
    forms: ["hielo", "deshielo"],
    changes: "type",
    condition: "cara de hielo ability"
  },
  morpeko: {
    forms: ["saciado", "voraz"],
    changes: "stats",
    condition: "mutapetito ability"
  },
  zacian: {
    forms: ["guerrero", "espada suprema"],
    changes: "type + stats",
    condition: "espada oxidada item"
  },
  zamazenta: {
    forms: ["guerrero", "escudo supremo"],
    changes: "type + stats",
    condition: "escudo oxidado item"
  },
  palafin: {
    forms: ["ingenua", "heroica"],
    changes: "stats",
    condition: "cambio heroico ability"
  },
  terapagos: {
    forms: ["normal", "teracristal", "astral"],
    changes: "type + stats",
    condition: "teracaparazón ability"
  }
};

// ============================================
// CATEGORY 2: OUT-OF-BATTLE CHANGERS (26 Pokémon)
// ============================================
// These change form outside of battle via items/events

const OUT_OF_BATTLE_CHANGERS = {
  deoxys: {
    forms: ["normal", "ataque", "defensa"],
    changes: "stats",
    condition: "meteorito"
  },
  rotom: {
    forms: ["normal", "calor", "lavado", "frío", "ventilador", "corte"],
    changes: "type + stats",
    condition: "electrodoméstico"
  },
  dialga: {
    forms: ["normal", "origen"],
    changes: "type",
    condition: "griseosfera item"
  },
  palkia: {
    forms: ["normal", "origen"],
    changes: "type",
    condition: "griseosfera item"
  },
  giratina: {
    forms: ["modificada", "origen"],
    changes: "type",
    condition: "griseosfera item"
  },
  shaymin: {
    forms: ["tierra", "cielo"],
    changes: "type + stats",
    condition: "gracídea"
  },
  arceus_out: {
    forms: ["18 types"],
    changes: "type",
    condition: "tabla elemental"
  },
  deerling: {
    forms: ["primavera", "verano", "otoño", "invierno"],
    changes: "none",
    condition: "season"
  },
  sawsbuck: {
    forms: ["primavera", "verano", "otoño", "invierno"],
    changes: "stats",
    condition: "season"
  },
  tornadus: {
    forms: ["incarnado", "avatar"],
    changes: "stats",
    condition: "espejo veraz"
  },
  thundurus: {
    forms: ["incarnado", "avatar"],
    changes: "stats",
    condition: "espejo veraz"
  },
  landorus: {
    forms: ["incarnado", "avatar"],
    changes: "stats",
    condition: "espejo veraz"
  },
  enamorus: {
    forms: ["incarnada", "avatar"],
    changes: "stats",
    condition: "espejo veraz"
  },
  kyurem: {
    forms: ["normal", "blanco", "negro"],
    changes: "type + stats",
    condition: "DNA + item"
  },
  keldeo: {
    forms: ["normal", "brío"],
    changes: "type",
    condition: "sable místico move"
  },
  meowstic: {
    forms: ["macho", "hembra"],
    changes: "abilities",
    condition: "gender"
  },
  indeedee: {
    forms: ["macho", "hembra"],
    changes: "abilities",
    condition: "gender"
  },
  furfrou: {
    forms: ["normal", "corazón", "estrella", "diamante", "debutante", "matrona", "caballero", "reina", "faraón"],
    changes: "none",
    condition: "grooming"
  },
  hoopa: {
    forms: ["contenido", "desencadenado"],
    changes: "type + stats",
    condition: "vasija castigo"
  },
  oricorio: {
    forms: ["apasionado", "animado", "sereno", "elegante"],
    changes: "type",
    condition: "néctar"
  },
  silvally: {
    forms: ["18 types"],
    changes: "type",
    condition: "disco"
  },
  calyrex: {
    forms: ["normal", "jinete glacial", "jinete espectral"],
    changes: "type + stats",
    condition: "riendas unión"
  },
  genesect: {
    forms: ["sin ROM", "hidroROM", "electroROM", "piroROM", "criorromo"],
    changes: "none",
    condition: "ROM cartridge"
  }
};

// ============================================
// CATEGORY 3: PERMANENT DIFFERENT FORMS (27 Pokémon)
// ============================================
// These are permanently different, not changeable

const PERMANENT_DIFFERENT_FORMS = {
  // Pikachu costumes
  pikachu_forms: ["original", "hoenn", "sinnoh", "unova", "kalos", "alola", "partner"],
  
  // Unown (28 letters + 2 punctuation)
  unown_forms: 26 + 2, // A-Z, !, ?
  
  // Shellos/Gastrodon
  shellos_forms: ["oeste", "este"],
  
  // Basculin
  basculin_forms: ["raya roja", "raya azul", "blanca"],
  
  // Vivillon (20 patterns)
  vivillon_forms: 20,
  
  // Flabébé family (5 colors)
  flabebe_forms: 5,
  
  // Pumpkaboo family (4 sizes)
  pumpkaboo_forms: 4,
  
  // Magearna
  magearna_forms: ["normal", "vetusta"],
  
  // Toxtricity
  toxtricity_forms: ["amplificado", "bajo voltaje"],
  
  // Sinistea/Polteageist
  sinistea_forms: ["falsificada", "genuina"],
  
  // Alcremie (63 combinations)
  alcremie_forms: 63,
  
  // Urshifu
  urshifu_forms: ["brusco", "fluido"],
  
  // Zarude
  zarude_forms: ["normal", "papá"],
  
  // Ursaluna
  ursaluna_forms: ["normal", "luna sangre"],
  
  // Maushold/Tandemaus
  maushold_forms: ["familia de 3", "familia de 4"],
  
  // Squawkabilly
  squawkabilly_forms: ["verde", "azul", "amarillo", "blanco"],
  
  // Tatsugiri
  tatsugiri_forms: ["recta", "curvada", "lánguida"],
  
  // Dudunsparce
  dudunsparce_forms: ["binodular", "trinodular"],
  
  // Gimmighoul
  gimmighoul_forms: ["cofre", "andante"],
  
  // Poltchageist/Sinistcha
  poltchageist_forms: ["fraudulenta", "opulenta", "mediocre", "suprema"]
};

// ============================================
// CATEGORY 4: REGIONAL FORMS (54 Pokémon Total)
// ============================================
// These are regional variants with different types/stats

const REGIONAL_FORMS = {
  alola: [
    // Gen 1 forms
    "rattata", "raticate", "raichu", "diglett", "dugtrio", "vulpix", "ninetales",
    "sandshrew", "sandslash", "graveler", "golem", "grimer", "muk", "exeggcutor",
    "marowak", "cubone",
    // Gen 2 form (Alola only has one)
  ],
  galar: [
    // Gen 1 forms
    "weezing", "mr-mime", "farfetchd", "zigzagoon", "linoone", "corsola",
    // Gen 5 forms
    "meowth", "ponyta", "rapidash", "slowpoke", "slowbro", "articuno", "zapdos",
    "moltres", "darumaka", "darmanitan",
    // Gen 8 exclusives
    "cursola", "stunfisk", "weezing"
  ],
  hisui: [
    "growlithe", "arcanine", "voltorb", "electrode", "typhlosion", "qwilfish",
    "sneasel", "samurott", "lilligant", "basculin", "deci dudgeist", "petilil",
    "ursaring", "ursaluna", "avalugg", "sliggoo", "goodra"
  ],
  paldea: [
    "tauros", "wooper", "dudunsparce", "wiglett"
  ]
};

// ============================================
// MEGA EVOLUTIONS & GIGANTAMAX
// ============================================
// Already implemented - 93 Mega forms + 33 Gigantamax forms

const SPECIAL_EVOLUTION_FORMS = {
  mega: "93 Pokémon total",
  gigantamax: "33 Pokémon total"
};

// ============================================
// IMPLEMENTATION STATUS
// ============================================

const IMPLEMENTATION_STATUS = {
  phase: "PHASE 1 - FOUNDATION",
  
  completed: [
    "✅ Dynamic form loading from PokeAPI",
    "✅ Intelligent filtering (type/ability/stats changes)",
    "✅ Form name translations",
    "✅ Regional form detection (Alola/Galar/Hisui/Paldea)",
    "✅ Mega/Gigantamax/special form badges",
    "✅ Build passing"
  ],
  
  next_steps: [
    "📝 Monitor and test with real Pokémon data",
    "🎨 Refine form display and sorting",
    "🌐 Add more form translations as needed",
    "⚡ Performance optimization if needed",
    "📱 Mobile responsiveness testing"
  ],
  
  notes: {
    architecture: "The system works by fetching ALL varieties from PokeAPI and intelligently filtering based on changes. This means NEW forms are automatically supported as they're added to PokeAPI.",
    performance: "Form loading is done in the useEffect hook when modal opens - cached by browser",
    scalability: "No hardcoded form lists needed - purely dynamic from PokeAPI varieties endpoint",
    coverage: "Covers all form categories: Combat changers, out-of-battle changers, permanent forms, regional forms, mega/gigantamax"
  }
};

export { COMBAT_FORM_CHANGERS, OUT_OF_BATTLE_CHANGERS, PERMANENT_DIFFERENT_FORMS, REGIONAL_FORMS, SPECIAL_EVOLUTION_FORMS, IMPLEMENTATION_STATUS };
