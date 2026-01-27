import { PokemonListItem } from "@/types/pokemon";

const TOTAL_POKEMON = 1025;
const MAX_CONCURRENT_REQUESTS = 20;
const RETRY_ATTEMPTS = 3;
const REQUEST_TIMEOUT = 10000; // 10 segundos

// Función para hacer fetch con reintentos y timeout
async function fetchWithRetry(
  url: string,
  retries = RETRY_ATTEMPTS
): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res;
    } catch (error) {
      clearTimeout(undefined as any);
      if (attempt === retries - 1) {
        throw error;
      }
      // Esperar un poco antes de reintentar (backoff exponencial)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 100)
      );
    }
  }
  throw new Error("Max retries exceeded");
}

// Función para limitar concurrencia
async function batchFetch<T>(
  items: { name: string; url: string }[],
  fetchFn: (item: { name: string; url: string }, index: number) => Promise<T>,
  maxConcurrent = MAX_CONCURRENT_REQUESTS
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<T>[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    const promise = fetchFn(item, i).then((result) => {
      executing.splice(executing.indexOf(promise), 1);
      return result;
    });

    results.push(promise as any);
    executing.push(promise);

    if (executing.length >= maxConcurrent) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

export async function getPokemonList(): Promise<PokemonListItem[]> {
  try {
    const res = await fetchWithRetry(
      `https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMON}`
    );
    const data = await res.json();

    // Fetch de detalles por Pokémon para obtener tipos con limite de concurrencia
    const pokemonList: PokemonListItem[] = await batchFetch(
      data.results,
      async (p: { name: string; url: string }, index: number) => {
        try {
          const detailsRes = await fetchWithRetry(p.url);
          const details = await detailsRes.json();

          return {
            id: index + 1,
            name: p.name,
            url: p.url,
            types: details.types.map((t: any) => t.type.name),
            generation: getGenerationFromId(index + 1),
          };
        } catch (error) {
          console.warn(`Error fetching details for ${p.name}:`, error);
          // Retornar datos mínimos si falla
          return {
            id: index + 1,
            name: p.name,
            url: p.url,
            types: [],
            generation: getGenerationFromId(index + 1),
          };
        }
      }
    );

    // Retornar la lista base sin esperar a las formas regionales
    // Las formas regionales se cargarán en background
    addRegionalFormsToListAsync(pokemonList).catch(error => 
      console.error("Error adding regional forms in background:", error)
    );
    
    return pokemonList;
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    throw new Error(
      "No se pudo cargar la lista de Pokémon. Por favor, intenta de nuevo."
    );
  }
}

// Función asíncrona que agrega formas regionales sin bloquear
async function addRegionalFormsToListAsync(pokemonList: PokemonListItem[]): Promise<void> {
  // Esta función se ejecuta en background y actualiza el cache si es necesario
  try {
    const regionalForms: PokemonListItem[] = [];
    let processed = 0;
    const total = Math.min(pokemonList.length, 100); // Solo procesar primeros 100 para evitar sobrecarga

    for (let i = 0; i < total; i++) {
      const pokemon = pokemonList[i];
      try {
        const speciesRes = await fetchWithRetry(
          `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`
        );
        const speciesData = await speciesRes.json();

        if (speciesData.varieties && speciesData.varieties.length > 1) {
          for (const variety of speciesData.varieties) {
            const varietyName = variety.pokemon.name;
            const isRegional = varietyName.includes('-alola') || 
                              varietyName.includes('-galar') || 
                              varietyName.includes('-hisui') || 
                              varietyName.includes('-paldea');
            
            if (isRegional && !variety.is_main_variety) {
              try {
                const varietyRes = await fetchWithRetry(variety.pokemon.url);
                const varietyData = await varietyRes.json();
                
                let regionalGeneration = pokemon.generation;
                if (varietyName.includes('-alola')) {
                  regionalGeneration = 7;
                } else if (varietyName.includes('-galar')) {
                  regionalGeneration = 8;
                } else if (varietyName.includes('-hisui')) {
                  regionalGeneration = 8;
                } else if (varietyName.includes('-paldea')) {
                  regionalGeneration = 9;
                }

                regionalForms.push({
                  id: pokemon.id,
                  name: varietyName,
                  url: variety.pokemon.url,
                  types: varietyData.types.map((t: any) => t.type.name),
                  generation: regionalGeneration,
                });
              } catch (error) {
                console.warn(`Error fetching regional form ${varietyName}:`, error);
              }
            }
          }
        }
        processed++;
      } catch (error) {
        console.warn(`Error fetching species for ${pokemon.name}:`, error);
      }
    }
  } catch (error) {
    console.error("Error adding regional forms in background:", error);
  }
}

// Función antigua que ahora se usa solo para minijuegos
async function addRegionalFormsToList(pokemonList: PokemonListItem[]): Promise<PokemonListItem[]> {
  try {
    const regionalFormsToAdd: PokemonListItem[] = [];

    // Procesar Pokémon para encontrar sus formas regionales
    for (const pokemon of pokemonList) {
      try {
        const speciesRes = await fetchWithRetry(
          `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`
        );
        const speciesData = await speciesRes.json();

        // Obtener variedades (formas alternativas)
        if (speciesData.varieties && speciesData.varieties.length > 1) {
          for (const variety of speciesData.varieties) {
            // Solo procesar formas regionales
            const varietyName = variety.pokemon.name;
            const isRegional = varietyName.includes('-alola') || 
                              varietyName.includes('-galar') || 
                              varietyName.includes('-hisui') || 
                              varietyName.includes('-paldea');
            
            if (isRegional && !variety.is_main_variety) {
              try {
                const varietyRes = await fetchWithRetry(variety.pokemon.url);
                const varietyData = await varietyRes.json();
                
                // Determinar generación basada en la forma regional
                let regionalGeneration = pokemon.generation;
                if (varietyName.includes('-alola')) {
                  regionalGeneration = 7;
                } else if (varietyName.includes('-galar')) {
                  regionalGeneration = 8;
                } else if (varietyName.includes('-hisui')) {
                  regionalGeneration = 8;
                } else if (varietyName.includes('-paldea')) {
                  regionalGeneration = 9;
                }

                regionalFormsToAdd.push({
                  id: pokemon.id,
                  name: varietyName,
                  url: variety.pokemon.url,
                  types: varietyData.types.map((t: any) => t.type.name),
                  generation: regionalGeneration,
                });
              } catch (error) {
                console.warn(`Error fetching regional form ${varietyName}:`, error);
              }
            }
          }
        }
      } catch (error) {
        // Si falla obtener species, simplemente continuar
        console.warn(`Error fetching species for ${pokemon.name}:`, error);
      }
    }

    // Combinar lista original con formas regionales
    return [...pokemonList, ...regionalFormsToAdd];
  } catch (error) {
    console.error("Error adding regional forms:", error);
    // Si falla, retornar solo la lista original
    return pokemonList;
  }
}

// Rango de generaciones
function getGenerationFromId(id: number): number {
  if (id <= 151) return 1;
  if (id <= 251) return 2;
  if (id <= 386) return 3;
  if (id <= 493) return 4;
  if (id <= 649) return 5;
  if (id <= 721) return 6;
  if (id <= 809) return 7;
  if (id <= 905) return 8;
  return 9;
}

// Filtrar variantes no deseadas de Pokémon
// Elimina variantes como mimikyu-disguised, dudunsparce-2-segments
// Pero mantiene mega, gigantamax, regional (alola, galar, hisui)
export function isDesiredPokemonVariant(name: string): boolean {
  const undesiredSuffixes = [
    "-disguised",
    "-2-segments",
    "-gmax", // algunas variantes gigantamax
    "-totem", // formas totem de Alola
    "-phony",
    "-battle-bond",
    "-ash-greninja",
    "-eternamax",
    "-active",
    "-male",
    "-female",
    "-average",
    "-small",
    "-large",
    "-single-strike",
    "-rapid-strike",
    "-type-null-normal", // variantes específicas no deseadas
  ];
  
  // Mantener estas formas deseadas
  const desiredKeywords = ["mega", "gigantamax", "alola", "galar", "hisui", "paldea", "regional"];
  
  // Si contiene palabras deseadas, mantener
  if (desiredKeywords.some(keyword => name.includes(keyword))) {
    return true;
  }
  
  // Si contiene sufijos no deseados, filtrar
  if (undesiredSuffixes.some(suffix => name.endsWith(suffix))) {
    return false;
  }
  
  return true;
}

// Función para agregar formas regionales a una lista de Pokémon para minijuegos
// Recibe lista de Pokémon y agrega sus formas regionales con las generaciones correctas
export async function addRegionalFormsForGames(
  pokemonList: Array<{ id: number; name: string; generation: number }>
): Promise<Array<{ id: number; name: string; generation: number }>> {
  try {
    const regionalFormsToAdd: Array<{ id: number; name: string; generation: number }> = [];

    // Procesar Pokémon para encontrar sus formas regionales
    for (const pokemon of pokemonList) {
      try {
        const speciesRes = await fetchWithRetry(
          `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`
        );
        const speciesData = await speciesRes.json();

        // Obtener variedades (formas alternativas)
        if (speciesData.varieties && speciesData.varieties.length > 1) {
          for (const variety of speciesData.varieties) {
            // Solo procesar formas regionales
            const varietyName = variety.pokemon.name;
            const isRegional = varietyName.includes('-alola') || 
                              varietyName.includes('-galar') || 
                              varietyName.includes('-hisui') || 
                              varietyName.includes('-paldea');
            
            if (isRegional && !variety.is_main_variety) {
              // Determinar generación basada en la forma regional
              let regionalGeneration = pokemon.generation;
              if (varietyName.includes('-alola')) {
                regionalGeneration = 7;
              } else if (varietyName.includes('-galar')) {
                regionalGeneration = 8;
              } else if (varietyName.includes('-hisui')) {
                regionalGeneration = 8;
              } else if (varietyName.includes('-paldea')) {
                regionalGeneration = 9;
              }

              regionalFormsToAdd.push({
                id: pokemon.id,
                name: varietyName,
                generation: regionalGeneration,
              });
            }
          }
        }
      } catch (error) {
        // Si falla obtener species, simplemente continuar
        console.warn(`Error fetching species for ${pokemon.name}:`, error);
      }
    }

    // Combinar lista original con formas regionales
    return [...pokemonList, ...regionalFormsToAdd];
  } catch (error) {
    console.error("Error adding regional forms for games:", error);
    // Si falla, retornar solo la lista original
    return pokemonList;
  }
}