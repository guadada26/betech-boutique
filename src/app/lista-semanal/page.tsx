import type { Metadata } from 'next';
import Link from 'next/link';
import WeeklyListManager from '@/components/WeeklyListManager';
import { buildWeeklyListSections } from '@/lib/weeklyList';
import { getProducts } from '@/services/boutiqueApi';

export const metadata: Metadata = {
  title: 'Lista de la semana | Betech Boutique',
  description: 'Listado semanal editable y exportable de productos activos por categoría y precio.',
};

export default async function ListaSemanalPage() {
  const products = await getProducts();
  const sections = buildWeeklyListSections(products);

  return (
    <main className="min-h-screen bg-stone-50 px-4 pb-28 pt-28 sm:px-6 md:pb-10 md:pt-24 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-3">
          <Link href="/" className="text-sm text-stone-600 transition hover:text-stone-900">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Lista de la semana</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-stone-600">
            Acá podés revisar el listado de productos activos, ordenar por categoría y precio (ya viene aplicado),
            quitar productos antes de enviar y exportar en CSV o copiar el texto para WhatsApp.
          </p>
        </header>

        <WeeklyListManager sections={sections} />
      </div>
    </main>
  );
}
