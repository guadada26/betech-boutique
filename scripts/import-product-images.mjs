#!/usr/bin/env node
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname } from 'node:path';

function parseArgs(argv) {
  const args = {
    csv: '',
    concurrency: 6,
    dryRun: false,
    report: 'IMAGENES_IMPORT_RESULT.md',
    jpegAlias: true,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === '--csv') {
      args.csv = argv[i + 1] || '';
      i += 1;
      continue;
    }

    if (token === '--concurrency') {
      const value = Number(argv[i + 1]);
      if (Number.isFinite(value) && value > 0) {
        args.concurrency = Math.floor(value);
      }
      i += 1;
      continue;
    }

    if (token === '--report') {
      args.report = argv[i + 1] || args.report;
      i += 1;
      continue;
    }

    if (token === '--dry-run') {
      args.dryRun = true;
      continue;
    }

    if (token === '--no-jpeg-alias') {
      args.jpegAlias = false;
      continue;
    }

    if (token === '--help' || token === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return args;
}

function printHelp() {
  console.log(`\nImportador masivo de imagenes por SKU\n\nUso:\n  npm run images:import -- --csv data/product-images.csv\n\nOpciones:\n  --csv <ruta>            CSV con cabecera sku,url\n  --concurrency <n>       Descargas en paralelo (default: 6)\n  --report <ruta>         Reporte markdown de salida (default: IMAGENES_IMPORT_RESULT.md)\n  --dry-run               Simula sin escribir archivos\n  --no-jpeg-alias         No crea copia .jpeg cuando baja .jpg/.png/.webp\n\nFormato CSV:\n  sku,url\n  MWVV3AM-A,https://.../foto1.jpg\n  IPHONE-17E-256GB,https://.../foto2.png\n`);
}

function splitCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
      continue;
    }

    current += ch;
  }

  result.push(current);
  return result.map((v) => v.trim());
}

function parseCsv(text) {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const header = splitCsvLine(lines[0]).map((h) => h.toLowerCase());
  const skuIndex = header.indexOf('sku');
  const urlIndex = header.indexOf('url');

  if (skuIndex < 0 || urlIndex < 0) {
    throw new Error('El CSV debe tener cabeceras: sku,url');
  }

  const rows = [];

  for (let i = 1; i < lines.length; i += 1) {
    const cols = splitCsvLine(lines[i]);
    const sku = (cols[skuIndex] || '').trim();
    const url = (cols[urlIndex] || '').trim();
    if (!sku || !url) continue;
    rows.push({ sku, url });
  }

  return rows;
}

function extensionFromContentType(contentType) {
  const value = (contentType || '').toLowerCase();
  if (value.includes('image/jpeg') || value.includes('image/jpg')) return 'jpeg';
  if (value.includes('image/png')) return 'png';
  if (value.includes('image/webp')) return 'webp';
  return '';
}

function extensionFromUrl(rawUrl) {
  try {
    const pathname = new URL(rawUrl).pathname;
    const ext = extname(pathname).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') return 'jpeg';
    if (ext === '.png') return 'png';
    if (ext === '.webp') return 'webp';
  } catch {
    return '';
  }
  return '';
}

async function downloadOne({ sku, url, dryRun, jpegAlias }) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'image/*,*/*;q=0.8',
      'User-Agent': 'betech-boutique-image-import/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  let ext = extensionFromContentType(contentType);
  if (!ext) {
    ext = extensionFromUrl(url) || 'jpeg';
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  const outputPath = `public/images/products/${sku}.${ext}`;

  if (!dryRun) {
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, bytes);

    if (jpegAlias && ext !== 'jpeg') {
      const aliasPath = `public/images/products/${sku}.jpeg`;
      await copyFile(outputPath, aliasPath);
    }
  }

  return {
    sku,
    url,
    ext,
    bytes: bytes.byteLength,
    outputPath,
    createdJpegAlias: jpegAlias && ext !== 'jpeg',
  };
}

async function runPool(items, concurrency, worker) {
  const results = [];
  const queue = [...items];

  async function runner() {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;
      const result = await worker(item);
      results.push(result);
    }
  }

  const workers = Array.from({ length: Math.max(1, concurrency) }, () => runner());
  await Promise.all(workers);
  return results;
}

function buildReport({ total, ok, fail, dryRun }) {
  const timestamp = new Date().toISOString();
  const lines = [];

  lines.push('# Resultado importacion de imagenes');
  lines.push('');
  lines.push(`Fecha: ${timestamp}`);
  lines.push(`Modo: ${dryRun ? 'DRY RUN' : 'EJECUCION REAL'}`);
  lines.push('');
  lines.push(`Total filas CSV: ${total}`);
  lines.push(`Exitos: ${ok.length}`);
  lines.push(`Errores: ${fail.length}`);
  lines.push('');

  lines.push('## Exitos');
  for (const item of ok) {
    lines.push(`- ${item.sku} -> ${item.outputPath} (${item.ext}, ${item.bytes} bytes)`);
  }

  lines.push('');
  lines.push('## Errores');
  for (const item of fail) {
    lines.push(`- ${item.sku} -> ${item.url} | ${item.error}`);
  }

  return `${lines.join('\n')}\n`;
}

async function main() {
  const args = parseArgs(process.argv);

  if (!args.csv) {
    console.error('Falta --csv <ruta>.');
    printHelp();
    process.exit(1);
  }

  if (!existsSync(args.csv)) {
    console.error(`No existe el archivo CSV: ${args.csv}`);
    process.exit(1);
  }

  const csvText = await readFile(args.csv, 'utf8');
  const rows = parseCsv(csvText);

  if (rows.length === 0) {
    console.error('No hay filas validas para procesar.');
    process.exit(1);
  }

  const uniqueRows = Array.from(
    new Map(rows.map((row) => [row.sku, row])).values()
  );

  console.log(`Filas validas: ${uniqueRows.length}`);
  console.log(`Concurrencia: ${args.concurrency}`);
  console.log(`Dry run: ${args.dryRun ? 'si' : 'no'}`);

  const ok = [];
  const fail = [];

  await runPool(uniqueRows, args.concurrency, async (row) => {
    try {
      const result = await downloadOne({
        ...row,
        dryRun: args.dryRun,
        jpegAlias: args.jpegAlias,
      });
      ok.push(result);
      console.log(`OK  ${row.sku}`);
    } catch (error) {
      fail.push({
        ...row,
        error: error instanceof Error ? error.message : String(error),
      });
      console.log(`ERR ${row.sku}`);
    }
  });

  const report = buildReport({
    total: uniqueRows.length,
    ok,
    fail,
    dryRun: args.dryRun,
  });

  await writeFile(args.report, report, 'utf8');

  console.log('');
  console.log(`Exitos: ${ok.length}`);
  console.log(`Errores: ${fail.length}`);
  console.log(`Reporte: ${args.report}`);

  if (fail.length > 0) {
    process.exitCode = 2;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
