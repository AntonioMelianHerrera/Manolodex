# Manual de Proyecto Pokédex - Guía para IA

## 📖 Descripción General

Este proyecto es una **aplicación web de Pokédex completa** construida con Next.js 16, React 19 y TypeScript. Implementa una interfaz moderna y responsiva para explorar información detallada de Pokémon, incluyendo sus formas alternativas, evoluciones, estadísticas, habilidades, movimientos y minijuegos interactivos.

**Características principales:**
- Lista completa de 1025+ Pokémon con paginación infinita
- Sistema de búsqueda y filtrado avanzado (por tipo, generación)
- Modal detallado con estadísticas, evoluciones y formas alternativas
- Sistema dinámico de formas de Pokémon (Mega, Gigantamax, Regionales)
- Minijuegos interactivos (Quiz, Silueta, Sonido, Entrenamiento de Tipos)
- Soporte completo para español e inglés
- Diseño moderno con Tailwind CSS

## 🏗️ Arquitectura y Tecnologías

### Tecnologías Core
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Lenguaje**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **API**: PokeAPI (https://pokeapi.co/)
- **Build Tool**: Turbopack (Next.js integrado)
- **Linting**: ESLint 9

### Dependencias Principales
```json
{
  "next": "16.1.4",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "@tailwindcss/postcss": "^4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "16.1.4",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

## 📂 Estructura de Archivos

```
pokedex/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout raíz con providers
│   ├── page.tsx                 # Página principal (lista Pokémon)
│   ├── globals.css              # Estilos globales Tailwind
│   ├── ataques/page.tsx         # Página de ataques/movimientos
│   ├── habilidades/page.tsx     # Página de habilidades
│   ├── minijuegos/page.tsx      # Página de minijuegos
│   └── tipos/page.tsx           # Página de tipos
├── components/                  # Componentes React reutilizables
│   ├── ui/                      # Componentes de UI principales
│   │   ├── PokemonCard.tsx      # Tarjeta individual de Pokémon
│   │   ├── PokemonModal.tsx     # Modal con detalles completos
│   │   ├── SearchBar.tsx        # Barra de búsqueda
│   │   └── Filters.tsx          # Filtros por tipo/generación
│   ├── games/                   # Componentes de juegos
│   │   ├── PokédexQuizGame.tsx  # Juego de preguntas
│   │   ├── SilhouetteQuizGame.tsx # Juego de siluetas
│   │   ├── SoundQuizGame.tsx    # Juego de sonidos
│   │   └── TypeTrainingGame.tsx # Entrenamiento de tipos
│   ├── layout/                  # Componentes de layout
│   │   ├── Header.tsx           # Cabecera con navegación
│   │   ├── Footer.tsx           # Pie de página
│   │   ├── ScrollToTop.tsx      # Botón scroll to top
│   │   ├── FloatingCircles.tsx  # Elementos decorativos
│   │   └── CaughtPokemonMargins.tsx # Sistema de Pokémon capturados
│   └── icons/                   # Iconos SVG reutilizables
│       └── index.tsx            # Exportador de iconos
├── lib/                         # Lógica de negocio y utilidades
│   ├── pokemon.ts               # Funciones para obtener datos de Pokémon
│   ├── translations.ts          # Traducciones español/inglés
│   ├── translations-es.ts       # Traducciones específicas español
│   ├── abilities.ts             # Datos y funciones de habilidades
│   ├── movesData.ts             # Datos de movimientos
│   ├── movesTranslations.ts     # Traducciones de movimientos
│   ├── typeData.ts              # Datos de tipos y efectividades
│   ├── formTranslations.ts      # Traducciones de formas de Pokémon
│   ├── FORMS_IMPLEMENTATION_MAP.ts # Mapa de implementación de formas
│   └── CaughtPokemonContext.tsx # Context para Pokémon capturados
├── types/                       # Definiciones TypeScript
│   ├── pokemon.ts               # Tipos para datos de Pokémon
│   └── colors.ts                # Colores para tipos y stats
├── public/                      # Archivos estáticos
└── [config files]               # Configuración (package.json, tsconfig.json, etc.)
```

## 🔧 Componentes Reutilizables

### Componentes UI Principales

#### 1. `PokemonCard`
**Ubicación**: `components/ui/PokemonCard.tsx`
**Propósito**: Muestra una tarjeta compacta de Pokémon con imagen, ID y nombre.
**Props**:
- `pokemon: PokemonListItem` - Datos del Pokémon
- `onClick?: () => void` - Handler para click
**Características**:
- Maneja automáticamente formas Mega (agrega prefijo "Mega")
- Usa traducciones para nombres
- Diseño hover responsivo

#### 2. `PokemonModal`
**Ubicación**: `components/ui/PokemonModal.tsx`
**Propósito**: Modal completo con todos los detalles de un Pokémon.
**Props**:
- `pokemon: PokemonListItem | null`
- `open: boolean`
- `onClose: () => void`
- `onSelectPokemon: (pokemon: PokemonListItem) => void`
**Características**:
- Estadísticas con barras de progreso coloreadas
- Cadena de evolución completa
- Sistema de formas alternativas dinámico
- Habilidades con descripciones
- Movimientos por nivel, MT, etc.
- Interfaz completamente traducible

#### 3. `SearchBar`
**Ubicación**: `components/ui/SearchBar.tsx`
**Propósito**: Barra de búsqueda con filtrado en tiempo real.
**Props**:
- `value: string`
- `onChange: (value: string) => void`
- `placeholder?: string`
**Características**:
- Búsqueda por nombre o ID
- Limpieza automática de espacios
- Integración con URL params

#### 4. `Filters`
**Ubicación**: `components/ui/Filters.tsx`
**Propósito**: Filtros por tipos y generaciones.
**Props**:
- `selectedTypes: string[]`
- `onTypesChange: (types: string[]) => void`
- `selectedGenerations: number[]`
- `onGenerationsChange: (generations: number[]) => void`
**Características**:
- Chips interactivos para tipos
- Botones toggle para generaciones
- Diseño responsive

### Componentes de Layout

#### 5. `Header`
**Ubicación**: `components/layout/Header.tsx`
**Propósito**: Navegación principal con menú responsive.
**Características**:
- Navegación a secciones principales
- Logo y branding
- Menú móvil colapsable

#### 6. `Footer`
**Ubicación**: `components/layout/Footer.tsx`
**Propósito**: Información de pie de página.
**Características**:
- Enlaces útiles
- Información de copyright

### Componentes de Juegos

#### 7. `PokédexQuizGame`
**Ubicación**: `components/games/PokédexQuizGame.tsx`
**Propósito**: Juego de preguntas sobre Pokémon.
**Características**:
- Preguntas aleatorias
- Sistema de puntuación
- Temporizador

#### 8. `SilhouetteQuizGame`
**Ubicación**: `components/games/SilhouetteQuizGame.tsx`
**Propósito**: Adivinar Pokémon por silueta.
**Características**:
- Siluetas en negro
- Pistas progresivas
- Dificultad ajustable

#### 9. `SoundQuizGame`
**Ubicación**: `components/games/SoundQuizGame.tsx`
**Propósito**: Adivinar Pokémon por sonido.
**Características**:
- Reproducción de sonidos
- Opciones múltiples
- Sistema de hints

#### 10. `TypeTrainingGame`
**Ubicación**: `components/games/TypeTrainingGame.tsx`
**Propósito**: Entrenamiento de efectividades de tipos.
**Características**:
- Preguntas sobre ventajas/desventajas
- Modo práctica y examen
- Estadísticas de progreso

## 📊 Lógica de Datos

### Sistema de Datos de Pokémon

#### API Integration (`lib/pokemon.ts`)
- **getPokemonList()**: Obtiene lista completa de Pokémon con paginación
- **getPokemonDetails(id)**: Detalles completos de un Pokémon específico
- **getEvolutionChain(url)**: Cadena de evolución completa
- **Características**:
  - Fetch con reintentos y timeout
  - Límite de concurrencia para evitar rate limits
  - Cache inteligente de requests

#### Sistema de Traducciones
- **translations.ts**: Traducciones generales (nombres, tipos, etc.)
- **translations-es.ts**: Traducciones específicas al español
- **formTranslations.ts**: Traducciones de formas alternativas
- **movesTranslations.ts**: Traducciones de movimientos
- **Funciones clave**:
  - `getPokemonName(name)`: Obtiene nombre traducido
  - `getTypeTranslation(type)`: Traducción de tipos
  - `getFormattedFormName(formName)`: Formatea nombres de formas

#### Sistema de Formas Alternativas
- **FORMS_IMPLEMENTATION_MAP.ts**: Mapa de todas las formas soportadas
- **Detección automática**: Compara stats, tipos y habilidades
- **Categorías**: Mega, Gigantamax, Regionales (Alola, Galar, Hisui, Paldea)
- **Badges visuales**: Identificadores coloreados para cada tipo de forma

### Context y Estado Global

#### `CaughtPokemonContext`
**Ubicación**: `lib/CaughtPokemonContext.tsx`
**Propósito**: Gestiona el estado de Pokémon "capturados" por el usuario.
**Características**:
- Persistencia en localStorage
- Funciones para marcar/desmarcar capturas
- Estadísticas de progreso

## 🎮 Funcionalidades Principales

### 1. Lista de Pokémon
- **Paginación infinita**: Carga 150 Pokémon inicialmente, luego lazy loading
- **Búsqueda**: Por nombre o ID con filtrado en tiempo real
- **Filtros**: Por tipos (múltiples) y generaciones
- **URL params**: Estado compartible vía URL

### 2. Modal de Detalles
- **Información básica**: Imagen, tipos, altura, peso
- **Estadísticas**: Barras coloreadas con total
- **Evoluciones**: Cadena completa con métodos de evolución
- **Habilidades**: Nombres y descripciones traducidas
- **Movimientos**: Agrupados por método de aprendizaje
- **Formas alternativas**: Sistema dinámico con badges

### 3. Sistema de Formas
- **Carga automática**: Desde PokeAPI sin configuración manual
- **Filtrado inteligente**: Solo formas con cambios reales
- **Interactividad**: Click para cambiar entre formas
- **Traducciones**: 100+ formas traducidas al español

### 4. Minijuegos
- **Quiz de Pokédex**: Preguntas sobre datos de Pokémon
- **Quiz de Siluetas**: Adivinar por forma oscura
- **Quiz de Sonidos**: Identificar por cries
- **Entrenamiento de Tipos**: Aprender efectividades

### 5. Navegación
- **Páginas dedicadas**: Ataques, Habilidades, Tipos, Minijuegos
- **Responsive**: Diseño móvil-first
- **SEO-friendly**: URLs limpias y meta tags

## 🚀 Cómo Extender el Proyecto

### Añadir un Nuevo Componente
1. Crear archivo en `components/ui/` o carpeta apropiada
2. Exportar desde `index.tsx` si es general
3. Usar tipos de `types/pokemon.ts` para consistencia
4. Implementar traducciones si aplica

### Añadir Nueva Página
1. Crear carpeta en `app/` con `page.tsx`
2. Añadir enlace en `components/layout/Header.tsx`
3. Usar componentes existentes para consistencia

### Añadir Nuevo Juego
1. Crear componente en `components/games/`
2. Seguir patrón de juegos existentes
3. Añadir a página de minijuegos
4. Integrar con sistema de puntuación si aplica

### Añadir Nuevas Traducciones
1. Añadir entradas a `lib/translations.ts` o `translations-es.ts`
2. Usar funciones helper existentes
3. Verificar consistencia con API

### Modificar Sistema de Formas
1. Revisar `FORMS_IMPLEMENTATION_MAP.ts` para referencia
2. Modificar lógica en `PokemonModal.tsx`
3. Añadir traducciones en `formTranslations.ts`
4. Testear con diferentes Pokémon

## 💡 Notas para Futuros Prompts de IA

### Patrones de Código a Seguir
- **Imports absolutos**: Usar `@/` para imports
- **Nombres de archivos**: PascalCase para componentes, camelCase para utilidades
- **Tipos**: Definir interfaces en `types/` y usarlas consistentemente
- **Estilos**: Usar clases de Tailwind, evitar CSS custom
- **Estado**: Usar hooks de React, Context para estado global

### Consideraciones de Rendimiento
- **Lazy loading**: Implementado para lista de Pokémon
- **Memoización**: Usar `useMemo` para cálculos costosos
- **Imágenes**: Optimizadas automáticamente por Next.js
- **API calls**: Limitar concurrencia y usar reintentos

### Testing y Debugging
- **Build**: Ejecutar `npm run build` para verificar compilación
- **TypeScript**: Verificar tipos con `tsc --noEmit`
- **Linting**: `npm run lint` para código limpio
- **Console**: Revisar errores de red en DevTools

### Arquitectura de Estado
- **Local state**: useState para componentes individuales
- **Global state**: Context para datos compartidos (ej: Pokémon capturados)
- **URL state**: useSearchParams para filtros compartibles
- **Server state**: SWR o similar si se añade (actualmente directo fetch)

### Convenciones de Nombres
- **Componentes**: PascalCase (PokemonCard, SearchBar)
- **Funciones**: camelCase (getPokemonName, formatEvolutionMethod)
- **Variables**: camelCase (selectedPokemon, isLoading)
- **Tipos**: PascalCase (PokemonListItem, EvolutionNode)
- **Archivos**: PascalCase para componentes, camelCase para libs

### API de PokeAPI
- **Base URL**: https://pokeapi.co/api/v2/
- **Endpoints principales**:
  - `/pokemon?limit=1025` - Lista de Pokémon
  - `/pokemon/{id}` - Detalles de Pokémon
  - `/evolution-chain/{id}` - Cadena de evolución
  - `/ability/{id}` - Detalles de habilidad
  - `/move/{id}` - Detalles de movimiento
- **Rate limiting**: ~100 requests/segundo, usar batching

Este manual proporciona una comprensión completa del proyecto Pokédex, permitiendo a una IA navegar, modificar y extender la aplicación de manera efectiva. Para cualquier modificación específica, referenciar los archivos mencionados y seguir los patrones establecidos.