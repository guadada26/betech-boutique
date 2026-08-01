# INSTRUCCIONES PASO A PASO — Instalación de Google Apps Script

**Objetivo:** Crear un puente entre el Master de Google Sheets y Betech Boutique **SIN TOCAR el código existente de Betech OS**.

---

## ADVERTENCIA: NO REEMPLACES Code.gs

⚠️ **IMPORTANTE**: Tu `Code.gs` actual contiene el código de Betech OS (usado por empleados).

**NO lo borres ni lo reemplaces.** Vamos a agregar archivos nuevos y hacer un dispatcher.

---

## PASO 1: Abrir Google Apps Script desde el Master

1. Abrí el Master en Google Sheets:
   ```
   https://docs.google.com/spreadsheets/d/1ALd-XNzimxkMqvfbFp6-_cj8SCTHLBBra94SMzOM5yQ/edit
   ```

2. Haz clic en **Extensiones** (menú superior)

3. Busca **Apps Script** en el menú desplegable

4. Se abrirá una nueva pestaña con el editor de Apps Script

---

## PASO 2: Crear archivo nuevo BoutiqueAPI.gs

1. En el panel izquierdo, debajo del archivo `Code.gs`, busca el botón **+** (Nuevo archivo)

2. Haz clic en el **+**

3. Elige **Archivo de script**

4. Nombra el archivo: `BoutiqueAPI`

5. Se creará `BoutiqueAPI.gs` automáticamente

6. **Pega el código completo** que está en:
   ```
   c:\Users\guada\Documents\betech-ecosystem\apps-script\boutique\BoutiqueAPI_PASO1.gs
   ```

7. Guarda (`Ctrl+S`)

---

## PASO 3: Preparar tu código de Betech OS

1. En el archivo `Code.gs`, **copia TODA la función `doGet(e)`** (no solo el contenido, la firma completa)

2. Pégala en algún lugar seguro (bloc de notas, documento, etc.)

   Te la necesitaremos en el PASO 5.

---

## PASO 4: Crear archivo Dispatcher.gs

1. De nuevo, haz clic en **+** (Nuevo archivo)

2. Elige **Archivo de script**

3. Nombra: `Dispatcher`

4. Se creará `Dispatcher.gs`

5. **Pega el código** que está en:
   ```
   c:\Users\guada\Documents\betech-ecosystem\apps-script\boutique\Dispatcher_PASO2.gs
   ```

6. Guarda (`Ctrl+S`)

---

## PASO 5: Integrar tu código de Betech OS en el Dispatcher

1. En el archivo `Dispatcher.gs`, busca la función `handleBetech OS(e)` (está más abajo)

2. Dentro de esa función, verás un comentario:
   ```
   // ─── AQUÍ VA TODO EL CÓDIGO QUE TENÍAS EN doGet() PARA BETECH OS ───
   ```

3. Reemplaza TODO lo que hay entre los comentarios con tu código actual de `doGet()` de `Code.gs`

   (Usa la función que copiaste en PASO 3)

4. Guarda (`Ctrl+S`)

---

## PASO 6: Limpiar Code.gs (dejar solo Dispatcher.gs)

1. Abrí el archivo `Code.gs` (tu código original de Betech OS)

2. **Localiza la función `doGet(e)`**

3. **Elimina solo esa función** (si existía)

4. **No toques el resto del código** de Betech OS

5. Guarda (`Ctrl+S`)

   (Dispatcher.gs ahora es el punto de entrada principal)

---

## PASO 7: Probar antes de publicar

1. En el editor de Apps Script, abrí el archivo `BoutiqueAPI.gs`

2. Busca la función `diagnosticarEncabezadosBoutique` en el archivo

3. Haz clic en ella → luego haz clic en el ícono de **Ejecutar** (▶ play)

4. Si aparece una ventana pidiendo permisos, elige **Revisar permisos** → **Autorizar**

5. En el panel derecho (Registros), verás los encabezados detectados

6. Confirma que aparecen las columnas correctas.

---

## PASO 8: Publicar el script como Aplicación Web

1. En el editor de Apps Script, haz clic en **Implementar** (Deploy) - arriba a la derecha

2. Selecciona **Nueva implementación** (New deployment)

3. En el menú **Seleccionar tipo**, elige **Aplicación web** (Web app)

4. Completa:
   - **Ejecutar como**: Tu cuenta de Google
   - **Quién tiene acceso**: **Cualquier usuario** (Anyone)

5. Haz clic en **Implementar** (Deploy)

6. Se abrirá una ventana con la URL generada. **Cópiala completamente**.

   ```
   https://script.google.com/macros/s/ABCD1234_XXXX_YYYY/exec
   ```

   **Esta es tu NEXT_PUBLIC_BOUTIQUE_API_URL.**

---

## PASO 9: Configurar la variable de entorno en VS Code

1. Abrí VS Code

2. Navegá a la carpeta:
   ```
   c:\Users\guada\Documents\betech-ecosystem\boutique\frontend
   ```

3. Abrí el archivo `.env.local` (está oculto, pero VS Code lo muestra)

4. Busca esta línea:
   ```
   NEXT_PUBLIC_BOUTIQUE_API_URL=https://script.google.com/macros/s/REEMPLAZAR_CON_TU_DEPLOYMENT_ID/exec
   ```

5. Reemplaza `REEMPLAZAR_CON_TU_DEPLOYMENT_ID` con el ID que copiaste en PASO 8.

   Por ejemplo, si tu URL es:
   ```
   https://script.google.com/macros/s/AScJ-XYZABC123_def456/exec
   ```

   Entonces reemplaza para que quede:
   ```
   NEXT_PUBLIC_BOUTIQUE_API_URL=https://script.google.com/macros/s/AScJ-XYZABC123_def456/exec
   ```

6. Guarda el archivo (`Ctrl+S`)

---

## PASO 10: Reiniciar el servidor de desarrollo

1. Si el servidor de Next.js está corriendo, **termínalo**:
   - En la terminal, presiona `Ctrl+C`

2. Inicia de nuevo:
   ```
   npm run dev
   ```

3. Espera a que diga:
   ```
   ✓ Ready in X.Xs
   ```

---

## PASO 11: Probar la API directamente

1. Abrí tu navegador

2. Navega a:
   ```
   http://localhost:3003/api-test
   ```

3. Verás una página con diagnósticos. Debería mostrar:
   - ✓ OK — Conexión exitosa con la API
   - Número de categorías encontradas
   - Lista de categorías
   - Número de productos encontrados
   - Primeros productos

   Si ve ✗ Error, revisa el mensaje exacto de error y asegúrate de que:
   - La URL de Apps Script es correcta en `.env.local`
   - El Apps Script fue publicado como "Cualquier usuario"
   - El servidor de Next.js fue reiniciado tras cambiar `.env.local`

---

## PASO 12: Verificar datos reales del Master

En la página `http://localhost:3003/api-test`, debería mostrarte exactamente:

- **Encabezados detectados en CATEGORIAS**: Los nombres reales de las columnas
- **Encabezados detectados en PRODUCTOS**: Los nombres reales de las columnas
- **Primeros 3 productos**: Con sus datos reales del Master

---

## PASO 13: Limpiar/refrescar caché si cambias datos en el Master

Si editas datos en el Master (añades categorías, productos, cambias ESTADO, etc.), la API cachea los resultados por 5 minutos.

**Para forzar recarga inmediatamente:**

1. En el editor de Apps Script, busca la función `clearBoutiqueCache`

2. Ejecutala (clic derecho → Ejecutar)

3. Luego recarga `http://localhost:3003/api-test` en tu navegador

---

## RESUMEN

| Paso | Acción |
|------|--------|
| 1    | Abrí Google Sheets → Extensiones → Apps Script |
| 2    | Crear archivo `BoutiqueAPI.gs` → pegar código |
| 3    | Guardar tu código de Betech OS |
| 4    | Crear archivo `Dispatcher.gs` → pegar código |
| 5    | Integrar tu código de Betech OS en el Dispatcher |
| 6    | Limpiar `Code.gs` (si es necesario) |
| 7    | Ejecutar `diagnosticarEncabezadosBoutique` para confirmar |
| 8    | Publicar como Aplicación Web → Copiar URL |
| 9    | Actualizar `.env.local` con la URL |
| 10   | Reiniciar `npm run dev` |
| 11   | Verificar `http://localhost:3003/api-test` |
| 12   | ✓ Confirmar datos reales del Master |
| 13   | Saber cómo limpiar caché cuando edites datos |

---

## ✅ VENTAJAS DE ESTA ARQUITECTURA

- ✅ **Sin conflictos**: Betech OS y Boutique coexisten
- ✅ **Un solo deployment**: Una sola URL para ambos sistemas
- ✅ **Parámetro app=**: Distingue entre sistemas fácilmente
- ✅ **Caché separado**: Cada sistema cachea sus datos
- ✅ **Escalable**: Agregar nuevos sistemas es simple (solo otro `if` en Dispatcher)

---

## ⚡ PRUEBAS RÁPIDAS

Una vez publicado, prueba directamente en tu navegador:

**Boutique:**
```
https://script.google.com/macros/s/DEPLOYMENT_ID/exec?app=boutique&resource=categories
https://script.google.com/macros/s/DEPLOYMENT_ID/exec?app=boutique&resource=products
```

**Betech OS (debería devolver tu código actual):**
```
https://script.google.com/macros/s/DEPLOYMENT_ID/exec?app=os
```

---

## ❓ PRÓXIMOS PASOS

Una vez validada la conexión en `/api-test`:

1. Las páginas de categorías dinámicas (`/categoria/celulares`, etc.) ya leerán automáticamente del Master
2. Los productos se filtran por categoría en el servidor (Apps Script)
3. El frontend recibe solo los datos necesarios

¿Necesitas ayuda con algún paso?
