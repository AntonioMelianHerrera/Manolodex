"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PokemonListItem } from "@/types/pokemon";
import { getPokemonList } from "@/lib/pokemon";

import SearchBar from "@/components/ui/SearchBar";
import PokemonCard from "@/components/ui/PokemonCard";
import Filters from "@/components/ui/Filters";
import PokemonModal from "@/components/ui/PokemonModal";

function HomeContent() {
  const searchParams = useSearchParams();
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [search, setSearch] = useState("");

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedGenerations, setSelectedGenerations] = useState<number[]>([]);

  // Para modal
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonListItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getPokemonList().then(setPokemon);
  }, []);

  // Procesar parámetro de búsqueda desde URL
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearch(searchParam);
      
      // Buscar el pokémon y abrirlo automáticamente
      if (pokemon.length > 0) {
        const foundPokemon = pokemon.find(
          (p) => p.name.toLowerCase() === searchParam.toLowerCase()
        );
        if (foundPokemon) {
          setSelectedPokemon(foundPokemon);
          setModalOpen(true);
        }
      }
    }
  }, [searchParams, pokemon]);

  // Filtrado AND: Pokémon debe cumplir todos los tipos seleccionados y la generación
  const filteredPokemon = pokemon.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(search.toLowerCase());

    // AND entre tipos: el Pokémon debe contener todos los tipos seleccionados
    const matchesType =
      selectedTypes.length === 0 ||
      selectedTypes.every((type) => p.types?.includes(type));

    // Generación: OR entre generaciones seleccionadas (solo un número por Pokémon)
    const matchesGeneration =
      selectedGenerations.length === 0 ||
      selectedGenerations.includes(p.generation!);

    return matchesName && matchesType && matchesGeneration;
  });

  return (
    <section className="max-w-6xl mx-auto p-4 py-8">
      {/* Mensaje de bienvenida */}
      <h2 className="text-3xl font-bold text-red-500 mb-2">
        Pokédex Interactiva
      </h2>
      <p className="text-slate-400 mb-6">
        Manolo presenta: Pokédex 2
      </p>

      {/* Buscador */}
      <SearchBar value={search} onChange={setSearch} />

      {/* Filtros */}
      <div className="mt-3">
        <Filters
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          selectedGenerations={selectedGenerations}
          setSelectedGenerations={setSelectedGenerations}
        />
      </div>

      {/* Grid de Pokémon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {filteredPokemon.map((p) => (
          <PokemonCard
            key={p.id}
            pokemon={p}
            onClick={() => {
              setSelectedPokemon(p);
              setModalOpen(true);
            }}
          />
        ))}
      </div>

      {/* Estado vacío */}
      {filteredPokemon.length === 0 && (
        <p className="text-slate-500 text-sm mt-6 text-center">
          No se han encontrado Pokémon con esos filtros
        </p>
      )}

      {/* Modal */}
      <PokemonModal
        pokemon={selectedPokemon}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelectPokemon={(p) => {
          setSelectedPokemon(p);
          setModalOpen(true);
        }}
      />
    </section>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-96"><div className="text-slate-400">Cargando...</div></div>}>
      <HomeContent />
    </Suspense>
  );
}