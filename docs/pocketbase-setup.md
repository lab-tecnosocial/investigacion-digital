# Configuración de PocketBase para formulario de inscripciones

URL del panel de administración: **https://pb.labtecnosocial.cloud/_/**

---

## Por qué esta arquitectura (importante leer)

PocketBase **no tiene tokens de scope limitado** (no existe un "token solo para leer esta colección"). El `Authorization: TOKEN header` que muestra la documentación es el token de superusuario — jamás debe estar en código del browser porque da acceso total a toda la base de datos.

La arquitectura correcta para este proyecto:

| Necesidad | Solución |
|---|---|
| Formulario público crea inscripciones | Create rule abierta (igual que Supabase `INSERT WITH CHECK (true)`) |
| Contador en tiempo real sin exponer datos | **JSVM Hook** — ruta custom server-side que solo devuelve el número |
| Leer datos completos de inscritos | Solo desde el panel admin (List rule bloqueada) |

El **JSVM Hook** es el equivalente de PocketBase a Supabase Edge Functions o Firebase Cloud Functions. Corre en el servidor, tiene acceso directo a la BD, y devuelve solo lo que tú decides.

---

## 1. Crear la colección `inscripciones`

1. Entra al panel en `https://pb.labtecnosocial.cloud/_/`
2. Menú lateral → **"New collection"** → nombre: `inscripciones` → tipo: **Base**

---

## 2. Agregar los campos

| Nombre del campo | Tipo | Configuración |
|---|---|---|
| `curso_slug` | Text | Required ✓ |
| `curso_titulo` | Text | Required ✓ |
| `apellidos` | Text | Required ✓ |
| `nombres` | Text | Required ✓ |
| `pais` | Text | Required ✓ |
| `whatsapp` | Text | Required ✓ |
| `gmail` | Email | Required ✓ |
| `nivel_estudio` | Select | Required ✓, Max select: 1, valores: `estudiante_universitario` `licenciatura` `maestria` `doctorado` |
| `profesion` | Text | Required ✓ |
| `metodo_pago` | Select | Required ✓, Max select: 1, valores: `bolivia` `internacional` |
| `comprobante` | File | Required ✓, Max files: 1, MIME types: `image/jpeg,image/png,image/webp,application/pdf` |

---

## 3. Configurar API Rules

> **Distinción clave:** candado cerrado 🔒 = solo superusuario. Para abrir: clic en el candado → deja el campo de texto **vacío** (el placeholder dice "Leave empty to grant everyone access").

| Regla | Estado | Razón |
|---|---|---|
| **List/Search** | 🔒 Bloqueado | Datos personales nunca públicos. El contador usa el JSVM Hook. |
| **View** | 🔒 Bloqueado | Idem |
| **Create** | 🔓 Abierto + vacío | El formulario público puede crear registros |
| **Update** | 🔒 Bloqueado | Solo admin |
| **Delete** | 🔒 Bloqueado | Solo admin |

---

## 4. Instalar el JSVM Hook para el contador

El hook es el archivo `docs/pb_hooks/count.pb.js` de este proyecto. Debes copiarlo al servidor donde corre PocketBase.

### Pasos

1. **Conéctate al servidor** por SSH donde está corriendo `pb.labtecnosocial.cloud`
2. Localiza el directorio de datos de PocketBase (normalmente `./pb_data/` junto al binario)
3. Crea el directorio de hooks si no existe:
   ```bash
   mkdir -p pb_hooks
   ```
4. Copia el archivo:
   ```bash
   # Desde tu máquina local:
   scp docs/pb_hooks/count.pb.js usuario@servidor:/ruta/a/pocketbase/pb_hooks/
   ```
5. **PocketBase detecta los hooks automáticamente** — no hace falta reiniciar el servidor.

### Verificar que funciona

```bash
curl "https://pb.labtecnosocial.cloud/api/custom/count?slug=mapas-qgis"
# Debe responder: {"count": 0}
```

---

## 5. Variables de entorno (para el contador en build time)

El contador también se obtiene en tiempo de build como valor inicial (antes de que el JSVM hook responda en el cliente). Edita `.env`:

```env
POCKETBASE_ADMIN_EMAIL=tu-email@ejemplo.com
POCKETBASE_ADMIN_PASSWORD=tu-contraseña-admin
```

`.env` ya está en `.gitignore`. Para producción, configura estas variables en Vercel/Netlify/CI.

---

## 6. Verificar el flujo completo

1. `npm run dev`
2. Navega a `http://localhost:4321/cursos/mapas-qgis`
3. El badge "X inscritos" muestra el valor del build y luego se actualiza con el JSVM hook
4. Tab **"Inscripción"** → completa y envía el formulario
5. Verifica en el panel de PocketBase que aparece el registro en `inscripciones`

---

## 7. Ver inscripciones

Panel de PocketBase → colección `inscripciones` → filtrar por `curso_slug`. Exportar a CSV con el botón **"Export"**.
