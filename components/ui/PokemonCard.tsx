import { PokemonListItem } from "@/types/pokemon";
import { getPokemonName, cleanPokemonName } from "@/lib/translations";

export default function PokemonCard({
  pokemon,
  onClick,
}: {
  pokemon: PokemonListItem;
  onClick?: () => void;
}) {
  const displayName = getPokemonName(pokemon.name);
  const isMegaForm = pokemon.name.includes('-mega');
  
  // Para mega formas, agregar prefijo "Mega"
  const finalDisplayName = isMegaForm 
    ? `Mega ${displayName}`
    : displayName;

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
        {finalDisplayName}
      </h3>
    </div>
  );
}