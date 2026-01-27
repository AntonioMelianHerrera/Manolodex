# 🎯 GUÍA PRÁCTICA - SISTEMA DE FORMAS POKÉMON

## 📱 Cómo Usar el Sistema

### Para Ver las Formas de un Pokémon

1. **Abre la Pokédex** (página principal)
2. **Busca un Pokémon** (ej: "Castform", "Kyogre", "Greninja")
3. **Haz click en el Pokémon** para abrir el modal
4. **Desplázate hacia abajo** hasta la sección "Formas especiales:"
5. **Verás todas las formas alternativas** como tarjetas clickeables

### Interpretando las Tarjetas de Forma

Cada tarjeta muestra:

```
┌─────────────────────┐
│   [IMAGEN FORMA]    │  ← Imagen oficial de la forma
├─────────────────────┤
│ Castform    [SUNNY] │  ← Nombre base | Badge de forma
├─────────────────────┤
│ Castform Sol        │  ← Nombre traducido
├─────────────────────┤
│ [FUEGO] [NORMAL]    │  ← Tipos de esta forma
└─────────────────────┘
```

### Badges Especiales

Los badges indican qué tipo de forma es:

| Badge | Significado | Color |
|-------|------------|-------|
| **MEGA** | Megaevolución | 🟠 Naranja |
| **GMAX** | Gigantamax | 🟣 Púrpura |
| **ALOLA** | Forma de Alola (Gen 7) | 🔵 Azul |
| **GALAR** | Forma de Galar (Gen 8) | 🔴 Rojo |
| **HISUI** | Forma de Hisui (Legends) | 🟡 Ámbar |
| **PALDEA** | Forma de Paldea (Gen 9) | 🟣 Violeta |

## 🔄 Qué Cambia en Cada Forma

El sistema automáticamente **detecta y muestra qué cambió** respecto a la forma base:

### Tipos
Cuando una forma tiene **tipos diferentes**:
- Los badges de tipo cambian
- Ejemplo: Castform normal es `Agua`, Castform sol es `Agua/Fuego`

### Habilidades
Cuando una forma tiene **habilidades diferentes**:
- Se actualizan en la sección de habilidades del modal
- Ejemplo: Darmanitan modo daruma tiene `Modo Daruma` en lugar de `Energía Pura`

### Estadísticas
Cuando una forma tiene **stats diferentes**:
- Los números en la gráfica de stats cambian
- Ejemplo: Aegislash forma escudo tiene +Defensa/-Ataque

## 📚 Ejemplos Prácticos

### Ejemplo 1: Castform (Forma que cambia en combate)

```
Castform Normal
├─ Castform Sol      (tipo Agua/Fuego, cambio temporal en combate)
├─ Castform Lluvia   (tipo Agua/Agua, cambio temporal en combate)
└─ Castform Nieve    (tipo Agua/Hielo, cambio temporal en combate)
```

**Cuándo aparecen**: Durante un combate cuando cambia el clima
**Cómo cambiar en Pokédex**: Click en cada tarjeta

---

### Ejemplo 2: Greninja (Forma especial Ash)

```
Greninja Normal
└─ Greninja Ash      (tipo Agua/Siniestro + forma especial)
```

**Cambios**: 
- Tipo: El mismo pero forma especial
- Habilidad: `Fuerte Afecto` (en lugar de `Torrente`)

**Nota**: En Gen 9+ solo afecta stats, no forma visual

---

### Ejemplo 3: Zygarde (Múltiples formas)

```
Zygarde Base (50%)
├─ Zygarde 10%       (forma pequeña)
├─ Zygarde 100%      (forma completa)
└─ Zygarde Completo  (con Agrupamiento ability)
```

**Cambios**: Estadísticas completamente diferentes

---

### Ejemplo 4: Arceus (18 formas de tipo)

```
Arceus Normal        (tipo Normal)
├─ Arceus Fuego      (tipo Fuego)
├─ Arceus Agua       (tipo Agua)
├─ Arceus Planta     (tipo Planta)
├─ ... (todos los 18 tipos)
└─ Arceus Hada       (tipo Hada)
```

**Sistema**: Cambia de tipo según la tabla elemental equipada
**En Pokédex**: Cada uno es una forma clickeable diferente

---

### Ejemplo 5: Castform (Forma regional - NO implementada en las antiguas)

Para las **formas regionales** (Alola, Galar, Hisui, Paldea):

```
Rattata Normal        (Normal/Normal)
└─ Rattata de Alola   (Siniestro/Normal) [ALOLA badge]
```

## 🎯 Pokémon con MÁS Formas

Estos Pokémon tienen especialmente muchas formas:

| Pokémon | Cantidad | Formas |
|---------|----------|--------|
| **Pikachu** | 7+ | Sombreros de cada región + original |
| **Unown** | 28 | 26 letras + ! + ? |
| **Vivillon** | 20 | Patrones de alas por región global |
| **Alcremie** | 63 | Combinaciones de relleno y decoración |
| **Arceus** | 18 | Un tipo para cada uno |
| **Silvally** | 18 | Un tipo para cada uno |
| **Minior** | 8 | Meteorito + 7 colores de núcleo |

## 🔍 Buscar Formas Específicas

Si quieres encontrar una forma específica:

### Opción 1: Buscar por Pokémon base
1. Escribe el nombre del Pokémon
2. Abre el modal
3. Desplázate a "Formas especiales:"

### Opción 2: Buscar información
Si buscas "Castform Sol" o "Greninja Ash":
- La Pokédex podría no encontrarlo directamente
- Busca "Castform" o "Greninja" primero
- Luego selecciona la forma que quieres ver

## ⚡ Acciones con Formas

### Al hacer click en una forma:

1. **La imagen cambia** a la forma seleccionada
2. **Los tipos se actualizan** si son diferentes
3. **Las habilidades se actualizan** si son diferentes
4. **Los stats se recalculan** si son diferentes
5. **La descripción se mantiene** de la forma base

### Volver a forma base:

- Cierra el modal y abre de nuevo el Pokémon
- O busca la forma base entre las alternativas

## 🎨 Visualización de Cambios

El sistema muestra claramente qué cambió:

```
┌─ Forma Original ────────────────────┐
│ Castform                            │
│ Tipo: Agua                          │
│ Habilidad: Predicción              │
│ PS: 70 | Atq: 70 | Def: 70         │
└────────────────────────────────────┘
              ↓ CLICK
┌─ Forma Soleada ─────────────────────┐
│ Castform Sol                        │
│ Tipo: Agua / Fuego  [CAMBIÓ]        │
│ Habilidad: Predicción              │
│ PS: 70 | Atq: 70 | Def: 70         │
└────────────────────────────────────┘
```

## 📖 Categorías de Formas

El sistema maneja automáticamente 5 categorías:

### 1️⃣ **Formas de Combate** (23 Pokémon)
Cambian durante la batalla:
- Castform, Kyogre, Burmy, Darmanitan, Greninja, Aegislash, etc.

### 2️⃣ **Formas Fuera de Combate** (26 Pokémon)
Cambian con items/eventos:
- Deoxys, Rotom, Dialga, Shaymin, Kyurem, Hoopa, etc.

### 3️⃣ **Formas Permanentes** (27 Pokémon)
No cambian, son distintas versiones:
- Unown, Vivillon, Pikachu sombreros, Alcremie, etc.

### 4️⃣ **Formas Regionales** (54 Pokémon)
Variantes de regiones específicas:
- Alola (18), Galar (19), Hisui (17), Paldea (4)

### 5️⃣ **Megas y Gigantamax** (126 Pokémon)
Evoluciones especiales:
- 93 Megaevoluciones + 33 Gigantamax

## ❓ Preguntas Frecuentes

**P: ¿Por qué no veo formas para mi Pokémon favorito?**
A: Solo se muestran formas que tengan cambios reales (tipos, habilidades, stats) o sean formas especiales (Mega, regional). Los Pokémon sin formas alternativas no las muestran.

**P: ¿Cómo sé qué forma es mejor?**
A: Depende del combate. Algunas formas son más ofensivas, otras defensivas. Los stats lo indican.

**P: ¿Las formas cambian en el juego?**
A: En esta Pokédex, las formas son para referencia. En los juegos reales, cambian según las condiciones (clima, items, combate, etc).

**P: ¿Puedo ordenar las formas?**
A: Actualmente se muestran en el orden de PokeAPI. Un ordenamiento personalizado podría agregarse en el futuro.

**P: ¿Falta alguna forma?**
A: Si una forma no aparece, podría ser que:
1. No tenga cambios reales en PokeAPI
2. No esté en la base de datos aún
3. Sea una forma muy nueva

---

**¡Ahora estás listo para explorar todas las formas de Pokémon! 🎮✨**
