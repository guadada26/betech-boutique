import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ENV_FILE = path.join(ROOT, '.env.local');
const PHOTOS_DIR = path.join(ROOT, 'public', 'images', 'products');
const DOCS_DIR = path.join(ROOT, 'docs');
const STATUS_CSV = path.join(DOCS_DIR, 'status-fotos-productos.csv');
const MISSING_CSV = path.join(DOCS_DIR, 'faltantes-fotos-productos.csv');
const MISSING_IMPORT_CSV = path.join(DOCS_DIR, 'faltantes-fotos-import.csv');

const DETAIL_MODE = process.argv.includes('--detail');

function normalizeText(value) {
  return String(value ?? '').trim();
}

function normalizeCategoryKey(value) {
  return normalizeText(value).toLocaleLowerCase('es');
}

function isPublicActiveProduct(product) {
  const status = normalizeText(product?.status).toUpperCase();
  const availability = normalizeText(product?.availability).toUpperCase();

  if (status === 'INACTIVO' || availability === 'INACTIVO') {
    return false;
  }

  return ['ACTIVO', 'DISPONIBLE'].includes(status) || ['ACTIVO', 'DISPONIBLE'].includes(availability);
}

function parseDotEnvLine(line) {
  const idx = line.indexOf('=');
  if (idx === -1) return null;

  const key = line.slice(0, idx).trim();
  if (!key || key.startsWith('#')) return null;

  const rawValue = line.slice(idx + 1).trim();
  const value = rawValue.replace(/^['"]|['"]$/g, '');
  return { key, value };
}

async function readApiUrlFromEnv() {
  const content = await fs.readFile(ENV_FILE, 'utf8');
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const parsed = parseDotEnvLine(line);
    if (!parsed) continue;
    if (parsed.key === 'NEXT_PUBLIC_BOUTIQUE_API_URL') {
      if (!parsed.value) {
        throw new Error('NEXT_PUBLIC_BOUTIQUE_API_URL esta vacia en .env.local');
      }
      return parsed.value;
    }
  }

  throw new Error('No se encontro NEXT_PUBLIC_BOUTIQUE_API_URL en .env.local');
}

async function fetchProducts(apiUrl) {
  const url = new URL(apiUrl);
  url.searchParams.set('app', 'boutique');
  url.searchParams.set('resource', 'products');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`La API respondio HTTP ${response.status}`);
  }

  const raw = await response.text();
  const normalized = raw.replace(/^\uFEFF/, '').replace(/^\)\]\}',?\s*/, '').trim();
  const json = JSON.parse(normalized);

  if (!json?.success || !Array.isArray(json?.data)) {
    throw new Error('La API devolvio una respuesta inesperada en products');
  }

  return json.data;
}

async function getImageBaseNames() {
  const entries = await fs.readdir(PHOTOS_DIR, { withFileTypes: true });
  const set = new Set();

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const base = path.parse(entry.name).name;
    if (base) {
      set.add(base.toUpperCase());
    }
  }

  return set;
}

function csvCell(value) {
  const v = normalizeText(value).replace(/\r?\n/g, ' ');
  return `"${v.replace(/"/g, '""')}"`;
}

function toCsv(rows, columns) {
  const header = columns.join(',');
  const body = rows.map((row) => columns.map((col) => csvCell(row[col])).join(','));
  return [header, ...body].join('\n');
}

function printSummary(summary) {
  console.log('STATUS FOTOS');
  console.log(`Activos: ${summary.totalActive}`);
  console.log(`Con foto: ${summary.withPhoto}`);
  console.log(`Pendientes: ${summary.pending}`);
  console.log('');
  console.log('Por categoria:');

  for (const item of summary.byCategory) {
    console.log(`- ${item.category}: cargadas ${item.withPhoto} | pendientes ${item.pending} | total ${item.total}`);
  }

  console.log('');
  console.log(`CSV estado: docs/status-fotos-productos.csv`);
  console.log(`CSV faltantes: docs/faltantes-fotos-productos.csv`);
  console.log(`CSV importacion: docs/faltantes-fotos-import.csv`);
}

function printMissingDetail(missingRows) {
  console.log('');
  console.log('DETALLE FALTANTES');

  if (missingRows.length === 0) {
    console.log('- No hay faltantes');
    return;
  }

  for (const row of missingRows) {
    console.log(`- ${row.sku} | ${row.category} | ${row.description}`);
  }
}

async function main() {
  const apiUrl = await readApiUrlFromEnv();
  const products = await fetchProducts(apiUrl);
  const imageBases = await getImageBaseNames();

  const activeProducts = products.filter(isPublicActiveProduct);

  const rows = activeProducts.map((product) => {
    const sku = normalizeText(product?.sku);
    const category = normalizeText(product?.category) || 'Sin categoria';
    const description = normalizeText(product?.description || product?.name) || 'Sin descripcion';
    const status = normalizeText(product?.status);
    const availability = normalizeText(product?.availability);
    const photoLoaded = sku ? imageBases.has(sku.toUpperCase()) : false;

    return {
      sku,
      category,
      description,
      status,
      availability,
      foto_cargada: photoLoaded ? 'SI' : 'NO',
    };
  });

  rows.sort((a, b) => {
    const c = a.category.localeCompare(b.category, 'es', { sensitivity: 'base' });
    if (c !== 0) return c;
    return a.sku.localeCompare(b.sku, 'es', { sensitivity: 'base' });
  });

  const missingRows = rows.filter((row) => row.foto_cargada === 'NO');
  const withPhoto = rows.length - missingRows.length;

  const byCategoryMap = new Map();
  for (const row of rows) {
    const categoryKey = normalizeCategoryKey(row.category);

    if (!byCategoryMap.has(categoryKey)) {
      byCategoryMap.set(categoryKey, {
        category: row.category,
        total: 0,
        withPhoto: 0,
        pending: 0,
      });
    }

    const item = byCategoryMap.get(categoryKey);
    item.total += 1;
    if (row.foto_cargada === 'SI') {
      item.withPhoto += 1;
    } else {
      item.pending += 1;
    }
  }

  const byCategory = Array.from(byCategoryMap.values()).sort((a, b) =>
    a.category.localeCompare(b.category, 'es', { sensitivity: 'base' })
  );

  const summary = {
    totalActive: rows.length,
    withPhoto,
    pending: missingRows.length,
    byCategory,
  };

  await fs.mkdir(DOCS_DIR, { recursive: true });

  const statusCsv = toCsv(rows, ['sku', 'category', 'description', 'status', 'availability', 'foto_cargada']);
  const missingCsv = toCsv(missingRows, ['sku', 'category', 'description', 'status', 'availability', 'foto_cargada']);
  const missingImportCsv = toCsv(
    missingRows.map((row) => ({ sku: row.sku, url: '' })),
    ['sku', 'url']
  );

  await fs.writeFile(STATUS_CSV, statusCsv, 'utf8');
  await fs.writeFile(MISSING_CSV, missingCsv, 'utf8');
  await fs.writeFile(MISSING_IMPORT_CSV, missingImportCsv, 'utf8');

  printSummary(summary);

  if (DETAIL_MODE) {
    printMissingDetail(missingRows);
  }
}

main().catch((error) => {
  console.error('Error al generar status de fotos:');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
