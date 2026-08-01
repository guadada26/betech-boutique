# Go Live: Shopify + Boutique

Objetivo:
- Mantener Shopify en https://betechstyle.com
- Publicar Boutique sin afectar la tienda
- Garantizar navegacion fluida y operacion simple diaria

## Decisión recomendada (Fase 1)

Publicar Boutique en subdominio:
- https://boutique.betechstyle.com

Motivos:
- Menos riesgo tecnico
- Menos puntos de falla
- Sin rehacer rutas de toda la app
- Deploy y rollback mas simples

## Fase 2 opcional

Si luego queres mostrar Boutique en la ruta:
- https://betechstyle.com/boutique

Hacerlo con proxy controlado (Cloudflare/Nginx) una vez establecida la Fase 1.

---

## Paso a paso (Go Live estable)

### 1) Deploy del frontend en Vercel

1. Conectar repo en Vercel.
2. Root directory del proyecto: boutique/frontend
3. Build command: npm run build
4. Output: Next.js default
5. Agregar variable de entorno en Vercel:
   - NEXT_PUBLIC_BOUTIQUE_API_URL = URL de Apps Script publicada
6. Deploy.

Checklist:
- Home carga
- Categoria tecnologia carga
- Un producto abre detalle
- Boton WhatsApp funciona

### 2) Dominio en DNS

Objetivo:
- boutique.betechstyle.com -> Vercel

Accion:
- Crear registro CNAME boutique apuntando al target indicado por Vercel.

Checklist:
- Certificado SSL activo
- Sin warning de seguridad

### 3) Integrar acceso desde Shopify

En Shopify:
- Agregar item de menu principal: Boutique
- URL: https://boutique.betechstyle.com
- Agregar acceso secundario en home y footer de Shopify

UX recomendada:
- Texto claro: Boutique
- No abrir en nueva pestaña
- Ubicarlo en primer nivel del menu

### 4) Monitoreo anti-caidas

Configurar UptimeRobot (gratis) con 3 checks:
1. https://boutique.betechstyle.com/
2. https://boutique.betechstyle.com/category/tecnologia
3. https://boutique.betechstyle.com/producto/Pencil-Pro

Frecuencia:
- cada 5 minutos

Alertas:
- email principal
- whatsapp/telegram opcional

### 5) Rollback operativo

En Vercel dejar definido:
- Si un deploy rompe algo: Promote previous deployment

Regla de operacion:
- Nunca deploy viernes tarde sin ventana de monitoreo

### 6) Operacion diaria (catalogo)

Datos y administracion:
- Seguis operando por Apps Script + Google Sheet

Comandos utiles en frontend:
- npm run photos:status
- npm run photos:status:detail
- npm run images:import -- --csv docs/faltantes-fotos-import.csv

Flujo de fotos:
1. Ejecutar status
2. Completar URLs en docs/faltantes-fotos-import.csv
3. Importar
4. Revalidar status
5. Hacer commit y deploy

### 7) Calidad minima previa a publicar cambios

Checklist por release:
- Sin errores de build
- Sin imagenes rotas en Home
- 2 categorias probadas
- 1 producto probado en detalle
- 1 prueba real de WhatsApp
- Lighthouse mobile aceptable

### 8) Seguridad y continuidad

- Mantener secreto el acceso al proyecto Vercel
- No exponer credenciales en repo
- Mantener copia de la URL de Apps Script activa
- Tener una segunda persona con acceso admin a Vercel y DNS

---

## Plan para /boutique en mismo dominio (cuando quieras)

Solo despues de estabilizar subdominio.

Prerequisitos:
- Proxy por ruta en Cloudflare o servidor frontal
- Estrategia de rutas para que links y assets no vuelvan a /

Propuesta segura:
1. Mantener app en boutique.betechstyle.com
2. Crear entrada /boutique en el dominio principal con proxy o redireccion controlada
3. Ejecutar bateria de pruebas de navegacion completa

---

## Criterio de exito

Se considera resuelto cuando:
- Shopify sigue estable en raiz
- Boutique abre rapido y sin caidas
- El cliente encuentra Boutique facil desde menu
- Vos podes actualizar productos y fotos sin tocar servidor
