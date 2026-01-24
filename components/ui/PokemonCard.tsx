import { PokemonListItem } from "@/types/pokemon";

export default function PokemonCard({
  pokemon,
  onClick,
}: {
  pokemon: PokemonListItem;
  onClick?: () => void;
}) {
  return (
    <div
      className="bg-slate-800 rounded-xl shadow p-3 text-center hover:bg-slate-700 transition cursor-pointer"
      onClick={onClick}
    >
      <img
  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
  alt={pokemon.name}
  className="mx-auto"
/>
      <p className="text-xs text-slate-400">#{pokemon.id}</p>
      <h3 className="capitalize text-sm font-medium text-white">
        {pokemon.name}
      </h3>
    </div>
  );
}