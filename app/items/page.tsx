// app/items/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import SearchBar from "@/components/ui/SearchBar";
import { getItemTranslation } from "@/lib/translations";

type Item = {
  id: number;
  name: string;
  category: { name: string } | null;
  sprites: { default: string } | null;
  url: string;
};

type CategoryFilter = 'all' | 'pokeballs' | 'berries' | 'held-items' | 'others';
function extractIdFromUrl(url: string): number {
  const parts = url.split('/');
  return parseInt(parts[parts.length - 2], 10);
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(-1);


  useEffect(() => {
    const loadItemList = async () => {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/item?limit=20000');
        const data = await res.json();
        const allItems: Item[] = data.results.map((item: any) => ({
          id: extractIdFromUrl(item.url),
          name: item.name,
          url: item.url,
          category: null,
          sprites: null,
        }));
        setItems(allItems);
        setFilteredItems(allItems);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadItemList();
  }, []);

  useEffect(() => {
    if (items.length === 0) return;

    const applyFilter = async () => {
      let detailedItems = [...items];
      if (!detailedItems[0]?.category) {
        const updatedItems = [];
        for (const item of detailedItems) {
          if (item.category) {
            updatedItems.push(item);
            continue;
          }
          try {
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 20));
            const res = await fetch(item.url);
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            updatedItems.push({
              ...item,
              category: data.category,
              sprites: data.sprites,
            });
          } catch (err) {
            console.error(`Error loading details for ${item.name}:`, err);
            updatedItems.push(item);
          }
        }
        detailedItems = updatedItems;
        setItems(detailedItems);
      }

      let filtered = detailedItems;

      if (filter !== 'all') {
        filtered = detailedItems.filter((item) => {
          const cat = item.category?.name || '';
          const isExcluded = ['tms', 'hm', 'machines', 'data-cards'].includes(cat) ||
                             item.name.includes('tm') ||
                             item.name.includes('hm') ||
                             item.name.includes('data-card');

          if (isExcluded) return false;

          if (filter === 'pokeballs') return cat.includes('ball') || cat === 'pokeballs';
          if (filter === 'berries') return item.name.includes('-berry');
          if (filter === 'held-items') {
            return (
              cat.includes('held') ||
              cat === 'stat-boosts' ||
              cat === 'evolution' ||
              cat === 'flutes' ||
              cat === 'type-protection'
            );
          }
          if (filter === 'others') {
            return !cat.includes('ball') && !cat.includes('berry') && !cat.includes('held') &&
                   cat !== 'stat-boosts' && cat !== 'evolution' && cat !== 'flutes' && cat !== 'type-protection';
          }
          return false;
        });
      } else {
        filtered = detailedItems.filter((item) => {
          const cat = item.category?.name || '';
          const isExcluded = ['tms', 'hm', 'machines', 'data-cards'].includes(cat) ||
                             item.name.includes('tm') ||
                             item.name.includes('hm') ||
                             item.name.includes('data-card');
          return !isExcluded;
        });
      }

      if (search) {
        filtered = filtered.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
      }

      setFilteredItems(filtered);
      setCurrentPage(1);
    };

    applyFilter();
  }, [filter, items, search]);

  useEffect(() => {
    if (selectedItem) {
      fetch(selectedItem.url).then(res => res.json()).then(data => {
        const desc = data.flavor_text_entries?.find((e: any) => e.language.name === 'es')?.text ||
                     data.effect_entries?.find((e: any) => e.language.name === 'es')?.short_effect ||
                     'Sin descripción disponible.';
        setDescription(desc);
      }).catch(() => setDescription('Error al cargar descripción.'));
    }
  }, [selectedItem]);

  const getLabel = (key: CategoryFilter) => {
    switch (key) {
      case 'all': return 'Todos';
      case 'pokeballs': return 'Poké Balls';
      case 'berries': return 'Bayas';
      case 'held-items': return 'Held Items';
      case 'others': return 'Otros';
      default: return key;
    }
  };

  if (loading) return <div className="p-6">Cargando objetos...</div>;

  const totalPages = Math.ceil(filteredItems.length / 25);
  const paginatedItems = filteredItems.slice((currentPage - 1) * 25, currentPage * 25);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Objetos Pokémon</h1>

      <SearchBar value={search} onChange={setSearch} placeholder="Buscar items..." />

      <div className="mt-8"></div>

      {/* Filtros*/}
      {filter === 'all' && (
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {(['pokeballs', 'berries', 'held-items', 'others'] as CategoryFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 bg-slate-950 text-white rounded hover:bg-red-500"
            >
              {getLabel(f)}
            </button>
          ))}
        </div>
      )}

      {filter !== 'all' && (
        <div className="mb-6 text-center">
          <button
            onClick={() => setFilter('all')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ← Ver todos los objetos
          </button>
        </div>
      )}

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {paginatedItems.map((item) => (
            <button
              onClick={() => {
                const index = filteredItems.findIndex(i => i.id === item.id);
                setSelectedItem(item);
                setCurrentIndex(index);
                setModalOpen(true);
              }}
              className="flex flex-col items-center p-3 border rounded bg-slate-800 hover:bg-slate-700"
            >
              {item.sprites?.default ? (
                <img
                  src={item.sprites.default}
                  alt={item.name}
                  className="w-16 h-16 object-contain"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=?'; }}
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                  ?
                </div>
              )}
              <span className="mt-2 text-sm text-center">{item.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          No se encontraron objetos con este filtro.
        </div>
      )}

      {filteredItems.length > 0 && totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-slate-950 text-white rounded hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-white">Página {currentPage} de {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-slate-950 text-white rounded hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 text-white p-6 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center">
              <h2 className="text-3xl font-bold capitalize mb-4">{getItemTranslation(selectedItem.name)}</h2>
              {selectedItem.sprites?.default ? (
                <img
                  src={selectedItem.sprites.default}
                  alt={selectedItem.name}
                  className="w-40 h-40 object-contain mx-auto mb-4"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/160x160?text=No+Image'; }}
                />
              ) : (
                <img
                  src="https://via.placeholder.com/160x160?text=No+Image"
                  alt="Sin imagen"
                  className="w-40 h-40 object-contain mx-auto mb-4"
                />
              )}
              <p className="text-lg mb-4">{description}</p>
              <div className="flex justify-between mb-4">
                <button
                  onClick={() => {
                    const newIndex = currentIndex - 1;
                    if (newIndex >= 0) {
                      setSelectedItem(filteredItems[newIndex]);
                      setCurrentIndex(newIndex);
                    }
                  }}
                  disabled={currentIndex <= 0}
                  className="px-4 py-2 bg-slate-950 text-white rounded hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={() => {
                    const randomIndex = Math.floor(Math.random() * filteredItems.length);
                    setSelectedItem(filteredItems[randomIndex]);
                    setCurrentIndex(randomIndex);
                  }}
                  className="px-4 py-2 bg-slate-950 text-white rounded hover:bg-red-500"
                >
                  Aleatorio
                </button>
                <button
                  onClick={() => {
                    const newIndex = currentIndex + 1;
                    if (newIndex < filteredItems.length) {
                      setSelectedItem(filteredItems[newIndex]);
                      setCurrentIndex(newIndex);
                    }
                  }}
                  disabled={currentIndex >= filteredItems.length - 1}
                  className="px-4 py-2 bg-slate-950 text-white rounded hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}