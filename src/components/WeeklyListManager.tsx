'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Product } from '@/types/product';
import { formatPrice, type WeeklyListSection, WEEKLY_LIST_FINAL_LINES } from '@/lib/weeklyList';

type WeeklyListManagerProps = {
  sections: WeeklyListSection[];
};

type FlatProduct = {
  categoryLabel: string;
  product: Product;
};

type CopyMode = 'completa' | 'categoria';

type WeeklyHistoryItem = {
  id: string;
  createdAt: string;
  mode: CopyMode;
  title: string;
  text: string;
};

const HISTORY_STORAGE_KEY = 'betech.weekly-list.history.v1';

const CLOSING_PRESETS = {
  simple:
    '📌 *INFORMACIÓN IMPORTANTE*\n\n▪️ Precios sujetos a cambio sin previo aviso\n▪️ Stock sujeto a disponibilidad\n📲 *Consultame y te respondo al momento*',
  opcional: WEEKLY_LIST_FINAL_LINES.join('\n'),
} as const;

function getProductLabel(product: Product): string {
  return product.description || product.name || 'Sin descripción';
}

function getProductHref(sku: string): string {
  return `/producto/${encodeURIComponent(sku)}`;
}

function escapeCsvValue(value: string): string {
  const normalized = (value || '').replace(/\r?\n/g, ' ').trim();
  return `"${normalized.replace(/"/g, '""')}"`;
}

export default function WeeklyListManager({ sections }: WeeklyListManagerProps) {
  const flatProducts = useMemo<FlatProduct[]>(() => {
    return sections.flatMap((section) =>
      section.products.map((product) => ({
        categoryLabel: section.categoryLabel,
        product,
      }))
    );
  }, [sections]);

  const [excludedSkus, setExcludedSkus] = useState<Set<string>>(new Set());
  const [copyStatus, setCopyStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [categoryCopyStatus, setCategoryCopyStatus] = useState<Record<string, 'idle' | 'ok' | 'error'>>({});
  const [history, setHistory] = useState<WeeklyHistoryItem[]>([]);
  const [closingText, setClosingText] = useState<string>(CLOSING_PRESETS.simple);
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof CLOSING_PRESETS>('simple');

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as WeeklyHistoryItem[];
      if (Array.isArray(parsed)) {
        setHistory(parsed.slice(0, 4));
      }
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.slice(0, 4)));
    } catch {
      // Ignorar errores de storage en navegadores restringidos.
    }
  }, [history]);

  const selectedProducts = useMemo(() => {
    return flatProducts.filter(({ product }) => !excludedSkus.has(product.sku));
  }, [flatProducts, excludedSkus]);

  const selectedByCategory = useMemo(() => {
    const grouped = new Map<string, Product[]>();

    for (const item of selectedProducts) {
      const list = grouped.get(item.categoryLabel) ?? [];
      list.push(item.product);
      grouped.set(item.categoryLabel, list);
    }

    return grouped;
  }, [selectedProducts]);

  function toggleProduct(sku: string): void {
    setExcludedSkus((prev) => {
      const next = new Set(prev);
      if (next.has(sku)) {
        next.delete(sku);
      } else {
        next.add(sku);
      }
      return next;
    });
  }

  function restoreAll(): void {
    setExcludedSkus(new Set());
    setCopyStatus('idle');
    setCategoryCopyStatus({});
  }

  function applyPreset(preset: keyof typeof CLOSING_PRESETS): void {
    setSelectedPreset(preset);
    setClosingText(CLOSING_PRESETS[preset]);
  }

  function getClosingLines(): string[] {
    const lines = (closingText || '')
      .split(/\r?\n/)
      .map((line) => line.trimEnd());
    return lines.length ? lines : [];
  }

  function pushHistory(item: Omit<WeeklyHistoryItem, 'id' | 'createdAt'>): void {
    const entry: WeeklyHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      ...item,
    };

    setHistory((prev) => [entry, ...prev].slice(0, 4));
  }

  function buildHeaderLines(dateText: string): string[] {
    const lines: string[] = [];
    lines.push('*Boutique Betech · Catalogo*');
    lines.push(`Actualizada: ${dateText}`);
    lines.push('');
    lines.push('📣 *Sumate a la Comunidad BETECH*');
    lines.push('Ofertas · Lanzamientos · Ingresos de mercadería · Oportunidades especiales');
    lines.push('👉 https://chat.whatsapp.com/HI6kT1zpUO94hQgC4fqe2O');
    lines.push('');
    lines.push('✅Garantía oficial ✅Entregas en todo el país ✅15 años en el mercado ✅Asesoramiento personalizado');
    lines.push('');
    return lines;
  }

  function buildCategoryBlock(categoryLabel: string, products: Product[]): string[] {
    const lines: string[] = [];
    lines.push(`*${categoryLabel.toUpperCase()}*`);
    for (const product of products) {
      lines.push(`🔹 ${getProductLabel(product)} | ${formatPrice(product.currency, Number(product.price))}`);
    }
    lines.push('');
    return lines;
  }

  function buildWeeklyText(): string {
    const dateText = new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date());

    const lines: string[] = buildHeaderLines(dateText);

    for (const [categoryLabel, products] of selectedByCategory.entries()) {
      lines.push(...buildCategoryBlock(categoryLabel, products));
    }

    lines.push(...getClosingLines());

    return lines.join('\n');
  }

  function buildCategoryOnlyText(categoryLabel: string, products: Product[]): string {
    const dateText = new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date());

    const lines: string[] = buildHeaderLines(dateText);
    lines.push(...buildCategoryBlock(categoryLabel, products));
    lines.push(...getClosingLines());
    return lines.join('\n');
  }

  async function copyWhatsAppText(): Promise<void> {
    try {
      const text = buildWeeklyText();
      await navigator.clipboard.writeText(text);
      setCopyStatus('ok');
      pushHistory({
        mode: 'completa',
        title: 'Lista completa',
        text,
      });
    } catch {
      setCopyStatus('error');
    }
  }

  async function copyCategoryWhatsAppText(categoryLabel: string, products: Product[]): Promise<void> {
    try {
      const text = buildCategoryOnlyText(categoryLabel, products);
      await navigator.clipboard.writeText(text);
      setCategoryCopyStatus((prev) => ({ ...prev, [categoryLabel]: 'ok' }));
      pushHistory({
        mode: 'categoria',
        title: `Solo ${categoryLabel}`,
        text,
      });
    } catch {
      setCategoryCopyStatus((prev) => ({ ...prev, [categoryLabel]: 'error' }));
    }
  }

  async function copyHistoryItem(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Si falla clipboard, dejamos el historial intacto.
    }
  }

  function downloadCsv(): void {
    const header = [
      'categoria',
      'descripcion',
      'precio',
      'moneda',
      'link',
    ];

    const rows = selectedProducts.map(({ categoryLabel, product }) => {
      return [
        escapeCsvValue(categoryLabel),
        escapeCsvValue(getProductLabel(product)),
        escapeCsvValue(String(product.price ?? '')),
        escapeCsvValue(product.currency || ''),
        escapeCsvValue(getProductHref(product.sku)),
      ].join(',');
    });

    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'betech-lista-semanal.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }

  function downloadCategoryCsv(categoryLabel: string, products: Product[]): void {
    const header = ['categoria', 'descripcion', 'precio', 'moneda', 'link'];

    const rows = products.map((product) => {
      return [
        escapeCsvValue(categoryLabel),
        escapeCsvValue(getProductLabel(product)),
        escapeCsvValue(String(product.price ?? '')),
        escapeCsvValue(product.currency || ''),
        escapeCsvValue(getProductHref(product.sku)),
      ].join(',');
    });

    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const fileSafeCategory = categoryLabel
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'categoria';

    const a = document.createElement('a');
    a.href = url;
    a.download = `betech-lista-${fileSafeCategory}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-sm text-stone-600">
          Seleccionados: <strong>{selectedProducts.length}</strong> de {flatProducts.length} productos activos
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={copyWhatsAppText}
            className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:brightness-95"
          >
            Copiar texto para WhatsApp
          </button>
          <button
            onClick={downloadCsv}
            className="rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-stone-800 transition hover:bg-stone-100"
          >
            Exportar CSV
          </button>
          <button
            onClick={restoreAll}
            className="rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-stone-800 transition hover:bg-stone-100"
          >
            Restaurar selección
          </button>
        </div>

        {copyStatus === 'ok' ? (
          <p className="mt-3 text-xs text-emerald-700">Texto copiado al portapapeles.</p>
        ) : null}
        {copyStatus === 'error' ? (
          <p className="mt-3 text-xs text-rose-700">No se pudo copiar automáticamente. Probá de nuevo.</p>
        ) : null}
        <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-700">Cierre editable</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              onClick={() => applyPreset('simple')}
              className="rounded-full border border-stone-300 bg-white px-3 py-1 text-[11px] font-semibold text-stone-800 transition hover:bg-stone-100"
            >
              Plantilla simple
            </button>
            <button
              onClick={() => applyPreset('opcional')}
              className="rounded-full border border-stone-300 bg-white px-3 py-1 text-[11px] font-semibold text-stone-800 transition hover:bg-stone-100"
            >
              Plantilla opcional
            </button>
          </div>
          <p className="mt-2 text-[11px] text-stone-500">Plantilla activa: {selectedPreset}</p>
          <textarea
            value={closingText}
            onChange={(event) => setClosingText(event.target.value)}
            className="mt-2 h-40 w-full rounded-xl border border-stone-300 bg-white p-3 text-xs text-stone-800"
          />
        </div>

        <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-700">Historial últimas 4 listas</p>
          {history.length === 0 ? (
            <p className="mt-2 text-xs text-stone-500">Todavía no hay historial. Se guarda al copiar una lista.</p>
          ) : (
            <div className="mt-2 space-y-2">
              {history.map((item) => {
                const created = new Date(item.createdAt);
                const createdText = Number.isNaN(created.getTime())
                  ? item.createdAt
                  : created.toLocaleString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                return (
                  <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2">
                    <p className="text-xs text-stone-700">
                      <span className="font-semibold">{item.title}</span> · {createdText}
                    </p>
                    <button
                      onClick={() => copyHistoryItem(item.text)}
                      className="rounded-full border border-stone-300 bg-white px-3 py-1 text-[11px] font-semibold text-stone-800 transition hover:bg-stone-100"
                    >
                      Copiar
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="space-y-5">
        {sections.map((section) => (
          <article key={section.categoryKey} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
            {(() => {
              const selectedSectionProducts = section.products.filter((product) => !excludedSkus.has(product.sku));
              return (
                <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-stone-900">{section.categoryLabel}</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => copyCategoryWhatsAppText(section.categoryLabel, selectedSectionProducts)}
                  className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-stone-800 transition hover:bg-stone-100"
                >
                  Copiar solo esta categoría
                </button>
                <button
                  onClick={() => downloadCategoryCsv(section.categoryLabel, selectedSectionProducts)}
                  className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-stone-800 transition hover:bg-stone-100"
                >
                  Exportar solo esta categoría
                </button>
              </div>
            </div>
            {categoryCopyStatus[section.categoryLabel] === 'ok' ? (
              <p className="mt-2 text-xs text-emerald-700">Categoría copiada.</p>
            ) : null}
            {categoryCopyStatus[section.categoryLabel] === 'error' ? (
              <p className="mt-2 text-xs text-rose-700">No se pudo copiar esta categoría.</p>
            ) : null}
            <div className="mt-3 space-y-2">
              {section.products.map((product) => {
                const isSelected = !excludedSkus.has(product.sku);
                return (
                  <label
                    key={product.sku}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                      isSelected ? 'border-stone-200 bg-stone-50' : 'border-stone-200 bg-white opacity-55'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleProduct(product.sku)}
                      className="mt-1 h-4 w-4 rounded border-stone-300"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-stone-900">{getProductLabel(product)}</p>
                    </div>
                    <p className="pl-2 text-sm font-semibold text-stone-900">
                      {formatPrice(product.currency, Number(product.price))}
                    </p>
                  </label>
                );
              })}
            </div>
                </>
              );
            })()}
          </article>
        ))}
      </section>
    </div>
  );
}
