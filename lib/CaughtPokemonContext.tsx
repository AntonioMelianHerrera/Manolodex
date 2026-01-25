"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CaughtPokemon {
  id: number;
  name: string;
  spriteUrl: string;
  position: "left" | "right"; // Para alternar posición
}

interface CaughtPokemonContextType {
  caughtPokemon: CaughtPokemon[];
  addCaughtPokemon: (pokemon: Omit<CaughtPokemon, "position">) => void;
  clearCaughtPokemon: () => void;
}

const CaughtPokemonContext = createContext<CaughtPokemonContextType | undefined>(
  undefined
);

export function CaughtPokemonProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [caughtPokemon, setCaughtPokemon] = useState<CaughtPokemon[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Limpiar localStorage al recargar la página y cargar desde localStorage
  useEffect(() => {
    // Marcar que esta es la primera carga
    const isFirstLoad = !sessionStorage.getItem("appLoaded");
    
    if (isFirstLoad) {
      // Primera carga: limpiar localStorage (refresco de página)
      localStorage.removeItem("caughtPokemon");
      sessionStorage.setItem("appLoaded", "true");
    } else {
      // No es primera carga: cargar desde localStorage (navegación entre páginas)
      const stored = localStorage.getItem("caughtPokemon");
      if (stored) {
        try {
          setCaughtPokemon(JSON.parse(stored));
        } catch (error) {
          console.error("Error loading caught pokemon from localStorage:", error);
        }
      }
    }
    setIsHydrated(true);
  }, []);

  // Guardar en localStorage cuando cambie (pero solo después de la hidratación)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("caughtPokemon", JSON.stringify(caughtPokemon));
    }
  }, [caughtPokemon, isHydrated]);

  const addCaughtPokemon = (pokemon: Omit<CaughtPokemon, "position">) => {
    setCaughtPokemon((prev) => [
      ...prev,
      {
        ...pokemon,
        position: prev.length % 2 === 0 ? "left" : "right", // Alternar entre left y right
      },
    ]);
  };

  const clearCaughtPokemon = () => {
    setCaughtPokemon([]);
  };

  return (
    <CaughtPokemonContext.Provider
      value={{ caughtPokemon, addCaughtPokemon, clearCaughtPokemon }}
    >
      {children}
    </CaughtPokemonContext.Provider>
  );
}

export function useCaughtPokemon() {
  const context = useContext(CaughtPokemonContext);
  if (!context) {
    throw new Error(
      "useCaughtPokemon must be used within CaughtPokemonProvider"
    );
  }
  return context;
}
