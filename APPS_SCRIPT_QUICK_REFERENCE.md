# ⚡ REFERENCIA RÁPIDA — Integración Betech Boutique + Betech OS

## 🏗️ Arquitectura

```
Google Sheets Master
    ├── Hoja CATEGORIAS
    └── Hoja PRODUCTOS
         ↓
Google Apps Script (3 archivos)
    ├── Code.gs (tu código de Betech OS)
    ├── BoutiqueAPI.gs (API de Boutique)
    └── Dispatcher.gs (enrutador: boutique ↔ os)
         ↓
URL única: https://script.google.com/macros/s/DEPLOYMENT_ID/exec
         ↓
    ├── ?app=boutique&resource=categories → Frontend Boutique
    └── ?app=os → Sistema de empleados
```

---

## 📁 Archivos a crear

| Archivo | Propósito |
|---------|----------|
| `BoutiqueAPI_PASO1.gs` | API de Boutique (lógica) |
| `Dispatcher_PASO2.gs` | Router de solicitudes |

---

## 🔑 Variable de entorno

```
NEXT_PUBLIC_BOUTIQUE_API_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

El `?app=boutique` se agrega automáticamente desde `src/services/boutiqueApi.ts`

---

## ✅ Checklist instalación

- [ ] Crear `BoutiqueAPI.gs` en Apps Script
- [ ] Crear `Dispatcher.gs` en Apps Script
- [ ] Integrar tu `doGet()` de Betech OS en `Dispatcher.gs`
- [ ] Ejecutar `diagnosticarEncabezadosBoutique()` para confirmar
- [ ] Publicar como Aplicación Web
- [ ] Copiar URL → actualizar `.env.local`
- [ ] Reiniciar `npm run dev`
- [ ] Verificar `http://localhost:3003/api-test` → ✓ OK

---

## 🧪 URLs de prueba

**Boutique (desde el navegador):**
```
https://script.google.com/macros/s/DEPLOYMENT_ID/exec?app=boutique&resource=categories
```

**Betech OS:**
```
https://script.google.com/macros/s/DEPLOYMENT_ID/exec?app=os
```

---

## 🚀 Próximos pasos (después de confirmar conexión)

1. **Página dinámica de categorías**: `src/app/categoria/[slug]/page.tsx`
2. **Grid de productos**: Con filtros y ordenamiento
3. **Conexión desde Home**: Las tarjetas ya navigarán correctamente

---

## 📞 Soporte

Si tienes error al conectar:
1. ¿La URL en `.env.local` es correcta?
2. ¿El Apps Script fue publicado como "Cualquier usuario"?
3. ¿Reiniciaste `npm run dev` tras cambiar `.env.local`?
4. Verifica los Registros en Apps Script (si no ve datos del Master)
