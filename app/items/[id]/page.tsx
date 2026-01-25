// app/items/[id]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ItemDetail({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id) || id <= 0) return notFound();

  // Fetch del item
  const res = await fetch(`https://pokeapi.co/api/v2/item/${id}`);
  if (!res.ok) return notFound();

  const item = await res.json();

  // Descripción en español o inglés
  const description =
    item.effect_entries?.find((e: any) => e.language.name === 'es')?.short_effect ||
    item.effect_entries?.find((e: any) => e.language.name === 'en')?.short_effect ||
    'Sin descripción disponible.';

  // IDs vecinos (asumimos que los IDs son consecutivos)
  const prevId = id > 1 ? id - 1 : null;
  const nextId = id < 2000 ? id + 1 : null; // límite razonable

  return (
    <div className="p-6 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold capitalize mb-4">{item.name}</h1>

      {item.sprites?.default ? (
        <img
          src={item.sprites.default}
          alt={item.name}
          className="w-32 h-32 object-contain mx-auto mb-6"
        />
      ) : (
        <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500 mb-6">
          Sin imagen
        </div>
      )}

      <p className="text-lg mb-8">{description}</p>

      {/* Navegación */}
      <div className="flex justify-between max-w-xs mx-auto">
        {prevId ? (
          <Link
            href={`/items/${prevId}`}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            ← Anterior
          </Link>
        ) : (
          <div></div>
        )}

        {nextId ? (
          <Link
            href={`/items/${nextId}`}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Siguiente →
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}