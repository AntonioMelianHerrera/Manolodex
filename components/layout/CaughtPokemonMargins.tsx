"use client";

import Image from "next/image";
import { useState } from "react";
import { useCaughtPokemon } from "@/lib/CaughtPokemonContext";

export default function CaughtPokemonMargins() {
  const { caughtPokemon } = useCaughtPokemon();
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  // Filtrar Pokémon con spriteUrl válido (no null o vacío)
  const validPokemon = caughtPokemon.filter((p) => p.spriteUrl && p.spriteUrl.trim());
  const leftPokemon = validPokemon.filter((p) => p.position === "left" && !failedImages.has(p.id));
  const rightPokemon = validPokemon.filter((p) => p.position === "right" && !failedImages.has(p.id));

  const handleImageError = (pokemonId: number) => {
    setFailedImages((prev) => new Set(prev).add(pokemonId));
  };

  return (
    <>
      {/* Margen izquierdo con Pokémon capturados - invertidos horizontalmente */}
      <div className="fixed left-0 top-20 bottom-0 w-12 pointer-events-none z-10 overflow-y-auto flex flex-col gap-0 p-1">
        {leftPokemon.map((pokemon, index) => (
          <div
            key={`left-${pokemon.id}-${index}`}
            className="flex-shrink-0 relative w-11 h-11"
            style={{ transform: "scaleX(-1)" }}
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

      {/* Margen derecho con Pokémon capturados */}
      <div className="fixed right-0 top-20 bottom-0 w-12 pointer-events-none z-10 overflow-y-auto flex flex-col gap-0 p-1">
        {rightPokemon.map((pokemon, index) => (
          <div
            key={`right-${pokemon.id}-${index}`}
            className="flex-shrink-0 relative w-11 h-11"
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
    </>
  );
}
