export interface PokemonListItem {
  id: number;
  name: string;
  url: string;
  types?: string[];
  generation?: number;
}