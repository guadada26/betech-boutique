# Betech Boutique Frontend

Frontend público de Betech Boutique (Next.js).

## Ejecutar local

1. `npm install`
2. `npm run dev -- -p 3004`

URL local esperada: `http://localhost:3004`

## Integración API

La URL de Apps Script se configura en `.env.local` con:

`NEXT_PUBLIC_BOUTIQUE_API_URL=...`

## Administración de imágenes de productos

Las imágenes de catálogo se resuelven por SKU y tienen fallback automático.

Ubicación obligatoria:

`public/images/products/`

Formatos de nombre de archivo admitidos (por prioridad):

`{SKU}.jpg`, `{SKU}.jpeg`, `{SKU}.png`, `{SKU}.webp`

Ejemplos:

- `IPHONE-17-PRO-256GB.jpg`
- `A16-4G-128GB.jpg`
- `Pencil-Pro.jpg`

Regla de SKU admitido para imagen local:

`^[A-Z0-9-]+$`

Notas:

- Se prueban variantes de casing (original, mayúsculas, minúsculas, tipo título).
- Se normalizan separadores simples (`espacios` y `_` a `-`) para robustez.
- No se usa nombre comercial, slug ni ID.
- Si el SKU no cumple formato, el producto se muestra igual con placeholder.

## Procedimiento para agregar una foto

1. Confirmar el SKU exacto del producto (en mayúsculas).
2. Guardar imagen con nombre `{SKU}` y extensión preferida `.jpg`.
3. Copiarla en `public/images/products/`.
4. Reiniciar `npm run dev` si estaba corriendo.
5. Verificar la categoría del producto en la web.

## Carga masiva de fotos faltantes

1. Generar estado y plantillas:

`npm run photos:status`

2. Completar URLs en:

`docs/faltantes-fotos-import.csv`

3. Importar en lote:

`npm run images:import -- --csv docs/faltantes-fotos-import.csv`

4. Validar nuevamente:

`npm run photos:status:detail`

## Fallback cuando falta imagen

- Si no existe ninguna variante de `public/images/products/{SKU}.{jpg|jpeg|png|webp}`, se usa:
	`public/images/placeholders/product-placeholder.svg`.
- Si también falla el placeholder, se muestra texto `Sin imagen`.
- No se rompe la tarjeta de producto ni el layout.

## Producción

Cuando se agregan nuevas imágenes en producción hay que:

1. construir nuevamente el frontend,
2. desplegar/publicar la nueva build.

No hay carga dinámica de imágenes desde Master, Drive ni URLs externas.

## Publicar Online Con Dominio

Objetivo sugerido:

- Sitio principal: `betechstyle.com`
- Boutique: `betechstyle.com/boutique`

### Opción recomendada (rápida): subdominio

Publicar este frontend en `boutique.betechstyle.com` (Vercel o similar).

Ventajas:

- Deploy simple y estable.
- Sin cambios de rutas internas.

### Opción con subruta `/boutique`

Para servir en `betechstyle.com/boutique`, se recomienda reverse proxy en tu hosting principal:

- `betechstyle.com/boutique/*` -> `https://tu-deploy-boutique.vercel.app/*`

Nota importante:

- Como el proyecto usa muchos assets con rutas absolutas `/images/...`, no conviene activar subruta sin proxy o sin adaptar rutas globalmente.

### Pasos mínimos de deploy (Vercel)

1. Subir repo a GitHub.
2. Importar proyecto `boutique/frontend` en Vercel.
3. Configurar variable:
	`NEXT_PUBLIC_BOUTIQUE_API_URL`.
4. Deploy.
5. Dominio:
	- fácil: `boutique.betechstyle.com`, o
	- avanzado: proxy desde `betechstyle.com/boutique`.
