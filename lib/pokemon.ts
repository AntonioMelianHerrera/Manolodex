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

    return pokemonList;
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    throw new Error(
      "No se pudo cargar la lista de Pokémon. Por favor, intenta de nuevo."
    );
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