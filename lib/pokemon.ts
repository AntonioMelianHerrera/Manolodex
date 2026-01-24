import { PokemonListItem } from "@/types/pokemon";

const TOTAL_POKEMON = 1025;

export async function getPokemonList(): Promise<PokemonListItem[]> {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMON}`
  );
  const data = await res.json();

  // Fetch de detalles por Pokémon para obtener tipos
  const pokemonList: PokemonListItem[] = await Promise.all(
    data.results.map(async (p: { name: string; url: string }, index: number) => {
      const detailsRes = await fetch(p.url);
      const details = await detailsRes.json();

      return {
        id: index + 1,
        name: p.name,
        url: p.url,
        types: details.types.map((t: any) => t.type.name),
        generation: getGenerationFromId(index + 1),
      };
    })
  );

  return pokemonList;
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