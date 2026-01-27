"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { useCaughtPokemon } from "@/lib/CaughtPokemonContext";

export default function CaughtPokemonMargins() {
  const { caughtPokemon } = useCaughtPokemon();
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const SPRITES_PER_COLUMN = 20;
  const SPRITE_SIZE = 44; // w-11 h-11 = 44px

  // Filtrar Pokémon con spriteUrl válido (no null o vacío)
  const validPokemon = caughtPokemon.filter((p) => p.spriteUrl && p.spriteUrl.trim());
  const leftPokemon = validPokemon.filter((p) => p.position === "left" && !failedImages.has(p.id));
  const rightPokemon = validPokemon.filter((p) => p.position === "right" && !failedImages.has(p.id));

  // Organizar en columnas
  const leftColumns = useMemo(() => {
    const cols: typeof leftPokemon[] = [];
    for (let i = 0; i < leftPokemon.length; i += SPRITES_PER_COLUMN) {
      cols.push(leftPokemon.slice(i, i + SPRITES_PER_COLUMN));
    }
    return cols;
  }, [leftPokemon]);

  const rightColumns = useMemo(() => {
    const cols: typeof rightPokemon[] = [];
    for (let i = 0; i < rightPokemon.length; i += SPRITES_PER_COLUMN) {
      cols.push(rightPokemon.slice(i, i + SPRITES_PER_COLUMN));
    }
    return cols;
  }, [rightPokemon]);

  const handleImageError = (pokemonId: number) => {
    setFailedImages((prev) => new Set(prev).add(pokemonId));
  };

  return (
    <>
      {/* Margen izquierdo: columnas expandidas hacia la derecha */}
      <div className="fixed left-0 top-20 bottom-0 pointer-events-none z-10 flex flex-row-reverse overflow-x-auto">
        {leftColumns.map((column, colIndex) => (
          <div
            key={`left-col-${colIndex}`}
            className="flex flex-col gap-0 flex-shrink-0"
            style={{ width: `${SPRITE_SIZE + 8}px` }}
          >
            {column.map((pokemon, spriteIndex) => (
              <div
                key={`left-${pokemon.id}-${colIndex}-${spriteIndex}`}
                className="flex-shrink-0 relative"
                style={{
                  width: `${SPRITE_SIZE}px`,
                  height: `${SPRITE_SIZE}px`,
                  transform: "scaleX(-1)",
                }}
              >
                <Image
                  src={pokemon.spriteUrl}
                  alt={pokemon.name}
                  fill
                  className="object-contain"
                  priority={false}
                  onError={() => handleImageError(pokemon.id)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Margen derecho: columnas expandidas hacia la izquierda */}
      <div className="fixed right-0 top-20 bottom-0 pointer-events-none z-10 flex flex-row overflow-x-auto">
        {rightColumns.map((column, colIndex) => (
          <div
            key={`right-col-${colIndex}`}
            className="flex flex-col gap-0 flex-shrink-0"
            style={{ width: `${SPRITE_SIZE + 8}px` }}
          >
            {column.map((pokemon, spriteIndex) => (
              <div
                key={`right-${pokemon.id}-${colIndex}-${spriteIndex}`}
                className="flex-shrink-0 relative"
                style={{
                  width: `${SPRITE_SIZE}px`,
                  height: `${SPRITE_SIZE}px`,
                }}
              >
                <Image
                  src={pokemon.spriteUrl}
                  alt={pokemon.name}
                  fill
                  className="object-contain"
                  priority={false}
                  onError={() => handleImageError(pokemon.id)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
