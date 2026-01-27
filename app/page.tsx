"use client";

import { useEffect, useState, Suspense, useRef, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { PokemonListItem } from "@/types/pokemon";
import { getPokemonList } from "@/lib/pokemon";

import SearchBar from "@/components/ui/SearchBar";
import PokemonCard from "@/components/ui/PokemonCard";
import Filters from "@/components/ui/Filters";
import PokemonModal from "@/components/ui/PokemonModal";

const ITEMS_PER_PAGE = 150;

function HomeContent() {
  const searchParams = useSearchParams();
  const [allPokemon, setAllPokemon] = useState<PokemonListItem[]>([]);
  const [displayedPokemon, setDisplayedPokemon] = useState<PokemonListItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedGenerations, setSelectedGenerations] = useState<number[]>([]);

  // Para modal
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonListItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Referencia para el elemento sentinel (que dispara el lazy loading)
  const sentinelRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<{ filteredPokemon: PokemonListItem[]; displayedCount: number }>({
    filteredPokemon: [],
    displayedCount: 0,
  });

  // Cargar lista completa
  useEffect(() => {
    const loadPokemon = async () => {
      setIsLoading(true);
      const data = await getPokemonList();
      setAllPokemon(data);
      // Mostrar primeros 150
      setDisplayedPokemon(data.slice(0, ITEMS_PER_PAGE));
      setIsLoading(false);
    };
    loadPokemon();
  }, []);

  // Procesar parámetro de búsqueda desde URL
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearch(searchParam);
      
      // Buscar el pokémon y abrirlo automáticamente
      if (allPokemon.length > 0) {
        const foundPokemon = allPokemon.find(
          (p) => p.name.toLowerCase() === searchParam.toLowerCase()
        );
        if (foundPokemon) {
          setSelectedPokemon(foundPokemon);
          setModalOpen(true);
        }
      }
    }
  }, [searchParams, allPokemon]);

  // Filtrado AND: Pokémon debe cumplir todos los tipos seleccionados y la generación
  const filteredPokemon = useMemo(() => {
    return allPokemon.filter((p) => {
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
  }, [allPokemon, search, selectedTypes, selectedGenerations]);

  // Actualizar las referencias de datos sin disparar efectos
  useEffect(() => {
    dataRef.current = { filteredPokemon, displayedCount: displayedPokemon.length };
  }, [filteredPokemon, displayedPokemon.length]);

  // Intersection Observer para lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Usar refs para obtener valores actuales sin recrear el efecto
          const currentCount = dataRef.current.displayedCount;
          const nextBatch = dataRef.current.filteredPokemon.slice(currentCount, currentCount + ITEMS_PER_PAGE);

          if (nextBatch.length > 0) {
            setDisplayedPokemon((prev) => [...prev, ...nextBatch]);
          } else {
            setHasMore(false);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Resetear cuando cambian los filtros
  useEffect(() => {
    setDisplayedPokemon(filteredPokemon.slice(0, ITEMS_PER_PAGE));
    setHasMore(filteredPokemon.length > ITEMS_PER_PAGE);
  }, [search, selectedTypes, selectedGenerations, filteredPokemon]);

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
        {displayedPokemon.map((p) => (
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

      {/* Sentinel para lazy loading */}
      <div ref={sentinelRef} className="h-10 mt-8" />

      {/* Indicador de carga */}
      {isLoading && (
        <p className="text-slate-500 text-sm mt-6 text-center">
          Cargando más Pokémon...
        </p>
      )}

      {/* Estado vacío */}
      {displayedPokemon.length === 0 && !isLoading && (
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