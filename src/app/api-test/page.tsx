/**
 * Página de diagnóstico: prueba la conexión con el Master (Apps Script).
 * Acceder en: http://localhost:3003/api-test
 *
 * Esta página puede eliminarse o restringirse cuando la integración esté validada.
 */

import { getCategories, getProducts } from '@/services/boutiqueApi';
import type { Category } from '@/types/category';
import type { Product } from '@/types/product';

export const dynamic = 'force-dynamic'; // nunca cachear esta página

// ─── Tipos locales ─────────────────────────────────────────────────────────

interface SectionResult<T> {
  data: T[] | null;
  error: string | null;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

async function safeCall<T>(fn: () => Promise<T[]>): Promise<SectionResult<T>> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : String(e) };
  }
}

// ─── Componentes de UI ─────────────────────────────────────────────────────

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${
        ok ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
      }`}
    >
      {ok ? '✓ OK' : '✗ Error'}
    </span>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-stone-200 rounded-lg overflow-hidden">
      <div className="bg-stone-100 px-4 py-3 border-b border-stone-200">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-600">
          {title}
        </h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700 font-mono break-all">
      {message}
    </div>
  );
}

// ─── Página principal ──────────────────────────────────────────────────────

export default async function ApiTestPage() {
  const apiUrl = process.env.NEXT_PUBLIC_BOUTIQUE_API_URL ?? '(no configurada)';
  const isConfigured = !apiUrl.includes('REEMPLAZAR') && apiUrl !== '(no configurada)';

  const [categoriesResult, productsResult] = await Promise.all([
    safeCall<Category>(getCategories),
    safeCall<Product>(getProducts),
  ]);

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Encabezado */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-1">
            Betech Boutique · Diagnóstico
          </p>
          <h1 className="text-2xl font-semibold text-stone-900">
            Prueba de conexión con el Master
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Esta página no es visible en producción. Su único propósito es validar la integración con Google Sheets.
          </p>
        </div>

        {/* Estado general */}
        <SectionCard title="Configuración">
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-stone-500 w-40 shrink-0">API URL:</span>
              <span className="font-mono text-stone-800 break-all">{apiUrl}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-stone-500 w-40 shrink-0">Variable de entorno:</span>
              <StatusBadge ok={isConfigured} />
              {!isConfigured && (
                <span className="text-xs text-stone-500">
                  Editá <code className="bg-stone-100 px-1 rounded">.env.local</code> y reiniciá el servidor
                </span>
              )}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Diagnóstico de encabezados">
          <p className="text-sm text-stone-600">
            El endpoint público <code className="bg-stone-100 px-1 rounded">resource=headers</code> está deshabilitado.
            Para diagnosticar encabezados ejecutá la función{' '}
            <code className="bg-stone-100 px-1 rounded">diagnosticarEncabezadosBoutique()</code> directamente en Apps Script.
          </p>
        </SectionCard>

        {/* Categorías */}
        <SectionCard title={`Categorías (${categoriesResult.data?.length ?? 0} recibidas)`}>
          {categoriesResult.error ? (
            <ErrorBox message={categoriesResult.error} />
          ) : categoriesResult.data && categoriesResult.data.length > 0 ? (
            <div className="space-y-2">
              {categoriesResult.data.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-4 text-sm border-b border-stone-100 pb-2 last:border-0 last:pb-0"
                >
                  <StatusBadge ok={true} />
                  <span className="font-semibold text-stone-800 w-40 shrink-0">{cat.name}</span>
                  <code className="text-stone-500 text-xs">/{cat.slug}</code>
                  <span className="text-stone-400 text-xs ml-auto">{cat.id}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-500">
              {isConfigured
                ? 'Sin categorías activas en el Master.'
                : 'Configurá la variable de entorno para ver los datos.'}
            </p>
          )}
        </SectionCard>

        {/* Productos */}
        <SectionCard title={`Productos (${productsResult.data?.length ?? 0} recibidos)`}>
          {productsResult.error ? (
            <ErrorBox message={productsResult.error} />
          ) : productsResult.data && productsResult.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 uppercase tracking-wide">
                    <th className="pb-2 pr-4">SKU</th>
                    <th className="pb-2 pr-4">Nombre</th>
                    <th className="pb-2 pr-4">Marca</th>
                    <th className="pb-2 pr-4">Categoría</th>
                    <th className="pb-2 pr-4">Precio</th>
                    <th className="pb-2">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {productsResult.data.slice(0, 10).map((p, i) => (
                    <tr key={p.sku || i} className="border-b border-stone-100 last:border-0">
                      <td className="py-2 pr-4 font-mono text-stone-600">{p.sku || '—'}</td>
                      <td className="py-2 pr-4 text-stone-800">{p.name || '—'}</td>
                      <td className="py-2 pr-4 text-stone-600">{p.brand || '—'}</td>
                      <td className="py-2 pr-4 text-stone-500">{p.category || '—'}</td>
                      <td className="py-2 pr-4 text-stone-800">
                        {p.price > 0
                          ? `${p.currency} ${p.price.toLocaleString('es-AR')}`
                          : '—'}
                      </td>
                      <td className="py-2">
                        <StatusBadge ok={p.status.toUpperCase() === 'ACTIVO' || p.status.toUpperCase() === 'DISPONIBLE'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {productsResult.data.length > 10 && (
                <p className="mt-3 text-xs text-stone-400">
                  Mostrando los primeros 10 de {productsResult.data.length} productos.
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-stone-500">
              {isConfigured
                ? 'Sin productos activos en el Master.'
                : 'Configurá la variable de entorno para ver los datos.'}
            </p>
          )}
        </SectionCard>

        {/* Links de prueba directa */}
        {isConfigured && (
          <SectionCard title="Prueba directa de la API">
            <p className="text-xs text-stone-500 mb-3">
              Abrí estos links para ver la respuesta JSON sin pasar por Next.js:
            </p>
            <div className="space-y-2 text-xs font-mono">
              {[
                { label: 'Categorías', qs: '?resource=categories' },
                { label: 'Todos los productos', qs: '?resource=products' },
                { label: 'Productos: celulares', qs: '?resource=products&category=celulares' },
              ].map(({ label, qs }) => (
                <div key={qs} className="flex items-center gap-3">
                  <span className="text-stone-500 w-40 shrink-0">{label}:</span>
                  <a
                    href={`${apiUrl}${qs}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 hover:text-emerald-800 break-all"
                  >
                    {apiUrl}{qs}
                  </a>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Instrucciones si no está configurada */}
        {!isConfigured && (
          <SectionCard title="Próximo paso">
            <ol className="space-y-2 text-sm text-stone-700 list-decimal list-inside">
              <li>Publicá el Google Apps Script (ver instrucciones abajo).</li>
              <li>
                Copiá la URL generada y pegala en{' '}
                <code className="bg-stone-100 px-1 rounded">.env.local</code>:
                <pre className="mt-1 bg-stone-100 p-2 rounded text-xs overflow-x-auto">
                  NEXT_PUBLIC_BOUTIQUE_API_URL=https://script.google.com/macros/s/TU_ID/exec
                </pre>
              </li>
              <li>
                Reiniciá el servidor:{' '}
                <code className="bg-stone-100 px-1 rounded">npm run dev</code>
              </li>
              <li>Recargá esta página.</li>
            </ol>
          </SectionCard>
        )}

        <p className="text-center text-xs text-stone-400 pt-4">
          Betech Boutique · Diagnóstico de integración · Solo desarrollo
        </p>
      </div>
    </div>
  );
}
