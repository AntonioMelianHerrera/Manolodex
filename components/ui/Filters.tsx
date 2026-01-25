import { useState } from "react";
import { TYPE_COLORS } from "@/types/colors";

const TYPES = [
  "normal","fire","water","electric","grass","ice",
  "fighting","poison","ground","flying","psychic",
  "bug","rock","ghost","dragon","dark","steel","fairy",
];

const GENERATIONS = [1,2,3,4,5,6,7,8,9];

export default function Filters({
  selectedTypes,
  setSelectedTypes,
  selectedGenerations,
  setSelectedGenerations,
}: any) {
  const [open, setOpen] = useState(false);

  const toggleFilter = (value: any, list: any[], set: any) => {
    if (list.includes(value)) {
      set(list.filter((v) => v !== value));
    } else {
      set([...list, value]);
    }
  };

  return (
    <div className="bg-slate-800 p-3 rounded-lg text-white text-sm">
      {/* Botón desplegable */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left font-semibold mb-2 cursor-pointer"
      >
        Filtros {open ? "▲" : "▼"}
      </button>

      {open && (
        <>
          {/* Tipos */}
          <div className="mb-2">
            <p className="text-xs text-slate-400 mb-1">Tipos</p>
            <div className="flex flex-wrap gap-2">
  {TYPES.map((type) => (
    <label
  key={type}
  className="flex items-center gap-1 p-1 rounded cursor-pointer"
  style={{ backgroundColor: TYPE_COLORS[type] }}
>
  <input
    type="checkbox"
    checked={selectedTypes.includes(type)}
    onChange={() =>
      toggleFilter(type, selectedTypes, setSelectedTypes)
    }
  />
  <img
    src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${type}.svg`}
    alt={type}
    className="w-4 h-4"
  />
</label>
  ))}
</div>
          </div>

          {/* Generaciones */}
          <div>
            <p className="text-xs text-slate-400 mb-1">Generación</p>
            <div className="flex gap-2 flex-wrap">
              {GENERATIONS.map((gen) => (
                <label key={gen} className="flex gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedGenerations.includes(gen)}
                    onChange={() =>
                      toggleFilter(gen, selectedGenerations, setSelectedGenerations)
                    }
                  />
                  Gen {gen}
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}