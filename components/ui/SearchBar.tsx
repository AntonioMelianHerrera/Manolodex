export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="text"
      placeholder="Buscar Pokémon..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 text-sm rounded-lg bg-slate-800 text-white border border-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
    />
  );
}