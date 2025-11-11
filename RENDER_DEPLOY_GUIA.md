# 🚀 GUÍA DETALLADA: Deploy Frontend en Render

## ⚠️ IMPORTANTE: Primero Lee Esto

Render es para **ambas aplicaciones** (backend Y frontend). Yo te mostraré cómo hacer ambas.

Si solo quieres frontend en Render (sin backend), sigue esta guía.
Si quieres backend en Render y frontend en Vercel, ve a la sección al final.

---

## 📋 PREREQUISITOS

✅ Tener una cuenta en GitHub
✅ Proyecto subido a GitHub (con `git push`)
✅ Cuenta en Render (https://render.com) - GRATUITA
✅ Terminal abierta en el proyecto

---

## PASO 1: Preparar el Repositorio (LOCAL)

### 1.1 Verificar que todo está limpio

```bash
# En la carpeta raíz del proyecto
git status

# Debería mostrar:
# On branch main
# nothing to commit, working tree clean
```

Si hay cambios sin commitear:
```bash
git add .
git commit -m "Final configuration for production"
git push origin main
```

### 1.2 Verificar que datos sensibles NO están en Git

```bash
# Verificar que datos.env NO está trackeado
git log --all --full-history -- back/datos.env
# Si aparece algo, ejecutar:
git rm --cached back/datos.env
git commit -m "Remove datos.env from Git history"
git push origin main

# Verificar que .env.local NO está trackeado
git log --all --full-history -- front/.env.local
# Si aparece algo, ejecutar:
git rm --cached front/.env.local
git commit -m "Remove .env.local from Git history"
git push origin main
```

### 1.3 Confirmar que .gitignore está correcto

```bash
# Backend
cat back/.gitignore | grep "datos.env"
# Debería mostrar: datos.env

# Frontend
cat front/.gitignore | grep ".env"
# Debería mostrar varias líneas con .env
```

---

## PASO 2: Crear Cuenta en Render (Si No Tienes)

1. Ir a https://render.com
2. Click en "Sign Up" (esquina superior derecha)
3. Seleccionar "Sign up with GitHub"
4. Autorizar Render a acceder a tu GitHub
5. Completar datos si es necesario
6. Confirmar email

---

## PASO 3: Deploy del Backend en Render

### 3.1 Crear Web Service para Backend

1. En Render Dashboard (https://render.com/dashboard)
2. Click en **"New +"** (arriba a la derecha)
3. Seleccionar **"Web Service"**

![Render Dashboard](https://imgur.com/xxx.png)

### 3.2 Conectar GitHub

1. En "Connect a repository", buscar tu repositorio
2. Si no aparece, click en "Configure account" → Authorize RenderCI
3. Seleccionar tu repositorio de GitHub
4. Click **"Connect"**

### 3.3 Configurar el Web Service

Llenar el formulario:

```
NAME:                    artemania-back
ENVIRONMENT:             Node
BUILD COMMAND:           cd back && npm install && npm run build
START COMMAND:           cd back && npm run start:prod
PLAN:                    Free
REGION:                  Ohio (o la más cercana a ti)
```

### 3.4 Agregar Variables de Entorno (IMPORTANTE)

**ANTES de hacer click en "Create Web Service":**

1. Click en **"Advanced"** (si está colapsado)
2. En "Environment Variables", click **"Add Environment Variable"**

Agregar estas variables (una por una):

```
KEY: NODE_ENV
VALUE: production
```

```
KEY: JWT_SECRET
VALUE: (GENERA UNO NUEVO - ver abajo)
```

```
KEY: TELEGRAM_BOT_TOKEN
VALUE: 7511431174:AAHzs6aqRuxN-Xx9x-XCCqble5luJgIGvjk
```

```
KEY: TELEGRAM_CHAT_ID
VALUE: 1884634191
```

```
KEY: CORS_ORIGINS
VALUE: https://artemania-front.onrender.com
(Lo cambiaremos después cuando sepamos la URL del frontend)
```

```
KEY: DATABASE_URL
VALUE: (DÉJALO VACÍO POR AHORA - lo añadiremos después)
```

### 3.5 Generar JWT_SECRET Seguro

En tu terminal LOCAL:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Salida ejemplo:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

Copiar este valor → pegarlo en Render como JWT_SECRET

### 3.6 Crear Base de Datos PostgreSQL

**Mientras se crea el Web Service, crear la DB:**

1. En Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Llenar:
```
NAME:       artemania-db
REGION:     Ohio (igual que el Web Service)
PLAN:       Free
```
3. Click **"Create Database"**
4. Esperar a que se cree (1-2 minutos)

### 3.7 Obtener DATABASE_URL

Cuando se cree la Base de Datos:

1. Ir a la página de la DB en Render
2. Buscar la sección **"Connections"**
3. Copiar el campo **"Internal Database URL"** (NO la externa)
4. Debería verse así:
```
postgresql://usuario:password@host:5432/basedatos
```

### 3.8 Añadir DATABASE_URL al Web Service

1. En Render Dashboard, ir a **artemania-back** (Web Service)
2. Settings → Environment
3. Buscar la variable `DATABASE_URL` (si no existe, click "Add")
4. Pegar la URL copiada
5. Click "Save"

**El Web Service se redeploya automáticamente**

### 3.9 Verificar que el Backend funciona

1. En Render Dashboard, ir a **artemania-back**
2. Ir a la pestaña **"Logs"**
3. Esperar a que termine el deploy (hasta que veas el mensaje)
4. Abrir en navegador: `https://artemania-back.onrender.com/`
5. Debería cargar sin errores CORS

---

## PASO 4: Deploy del Frontend en Render

### 4.1 Crear Static Site para Frontend

1. En Render Dashboard, click **"New +"** → **"Static Site"**

### 4.2 Conectar GitHub (igual que antes)

1. Buscar y conectar tu repositorio
2. Click **"Connect"**

### 4.3 Configurar Static Site

Llenar el formulario:

```
NAME:                           artemania-front
BUILD COMMAND:                  cd front && npm install && npm run build
PUBLISH DIRECTORY:              front/dist/front/browser
```

### 4.4 Agregar Variables de Entorno

**ANTES de crear**, agregar variable:

```
KEY: NEXT_PUBLIC_API_URL
VALUE: https://artemania-back.onrender.com
```

(Es la URL que obtuviste del backend)

### 4.5 Crear Static Site

Click **"Create Static Site"**

Esperar a que termine (3-5 minutos)

### 4.6 Obtener URL del Frontend

Cuando termine:

1. Ir a la página del Static Site
2. En la parte superior, verás la URL, algo como:
```
https://artemania-front.onrender.com
```

**Copia esta URL** - la necesitaremos después

---

## PASO 5: Actualizar CORS en Backend

Ahora que sabemos la URL del frontend:

1. En Render Dashboard, ir a **artemania-back**
2. Settings → Environment
3. Editar la variable **CORS_ORIGINS**
4. Cambiar de:
```
https://artemania-front.onrender.com
```
a:
```
https://artemania-front.onrender.com
```
(Si será la misma, no cambies nada)

5. Click "Save"

**El backend se redeploya automáticamente**

---

## PASO 6: Actualizar Frontend con URL Correcta

### 6.1 Actualizar environments.ts

Si la URL del frontend es diferente a la esperada:

```bash
cd front
# Editar src/environments/environments.ts
```

Cambiar:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://artemania-back.onrender.com'  // URL del BACKEND
};
```

Si necesitas cambiarla:
```bash
# Hacer commit
git add .
git commit -m "Update API URL for production"
git push origin main

# Render automáticamente redeploya
```

---

## PASO 7: Verificar que TODO Funciona

### 7.1 Probar el Frontend

1. Abrir en navegador: `https://artemania-front.onrender.com`
2. Verificar que carga la página
3. Abrir DevTools (F12)
4. Ir a pestaña **"Network"**
5. Recargar la página (F5)
6. Ver que no hay errores rojos de CORS

### 7.2 Probar la API desde Frontend

En la consola del navegador (F12 → Console):

```javascript
fetch('https://artemania-back.onrender.com/')
  .then(r => r.text())
  .then(data => console.log(data))
```

Si funciona, debería mostrar una respuesta sin errores.

### 7.3 Probar funcionalidades principales

- [ ] Login (intentar registrarse)
- [ ] Ver productos
- [ ] Agregar al carrito
- [ ] Ver carrito
- [ ] Checkout/Pago (si aplica)

### 7.4 Revisar Logs

**Si algo falla:**

Backend Logs:
- Render Dashboard → artemania-back → Logs
- Ver qué error aparece

Frontend Logs:
- Render Dashboard → artemania-front → Logs
- Ver errores de build

---

## 🐛 TROUBLESHOOTING

### ❌ "CORS Error: The value of the 'Access-Control-Allow-Origin' header"

**Causa**: CORS no está configurado correctamente

**Solución**:
```bash
# 1. En Render → artemania-back → Settings → Environment
# 2. Verificar CORS_ORIGINS tiene la URL del frontend:
#    https://artemania-front.onrender.com
# 3. Guardar
# 4. Esperar redeploy
# 5. Recargar frontend en navegador
```

### ❌ "Failed to fetch" en Frontend

**Causa**: Backend no responde o está caído

**Solución**:
```bash
# 1. En navegador, probar:
#    https://artemania-back.onrender.com/
# 2. Si da error, revisar logs en Render → artemania-back → Logs
# 3. Si dice "Database connection refused", revisar DATABASE_URL
```

### ❌ "Cannot GET /" - Frontend muestra texto en lugar de la app

**Causa**: Build del frontend no configurado correctamente

**Solución**:
```bash
# 1. En Render → artemania-front → Settings
# 2. Verificar:
#    BUILD COMMAND:     cd front && npm install && npm run build
#    PUBLISH DIRECTORY: front/dist/front/browser
# 3. Si está mal, editar y guardar
# 4. Hacer manual deploy: Click "Deploy" → "Clear build cache and deploy"
```

### ❌ "Syntax error" en Frontend después de deploy

**Causa**: Versión de Node diferente o dependencias faltantes

**Solución**:
```bash
# En Render → artemania-front
# Click "Deploy" → "Clear build cache and deploy"
# Esperar que redeploy desde cero
```

### ❌ Frontend carga pero no muestra datos de BD

**Causa**: Backend no conecta a la BD

**Solución**:
```bash
# 1. En Render → artemania-back → Logs
# 2. Buscar línea con error de BD
# 3. Si dice "password authentication failed":
#    - Verificar DATABASE_URL está correcta
#    - DATABASE_URL de la DB debe coincidir con la del Web Service
# 4. Si dice "host not found":
#    - Usar DATABASE_URL interna (no la externa)
```

### ❌ App se "suspende" después de un tiempo

**Causa**: Plan Free de Render suspende después de 15 min de inactividad

**Soluciones**:
- Upgrade a plan Starter ($7/mes)
- O usar Uptime Robot para mantener viva: https://uptimerobot.com
  - Crear monitor HTTP a `https://artemania-back.onrender.com/`
  - Intervalo: 5 minutos

---

## 📊 RESULTADO FINAL

Cuando todo funcione:

```
Frontend (Render Static Site):
https://artemania-front.onrender.com

Backend (Render Web Service):
https://artemania-back.onrender.com

Base de Datos (Render PostgreSQL):
Integrada con el backend
```

---

## ✅ CHECKLIST FINAL

- [ ] Backend deployado en Render
- [ ] Base de Datos creada en Render
- [ ] DATABASE_URL configurada en backend
- [ ] JWT_SECRET establecido (fuerte)
- [ ] CORS_ORIGINS contiene URL del frontend
- [ ] Frontend deployado en Render
- [ ] NEXT_PUBLIC_API_URL apunta al backend
- [ ] Frontend carga en navegador
- [ ] No hay errores CORS en DevTools
- [ ] API responde correctamente
- [ ] Login funciona
- [ ] Productos cargan
- [ ] Carrito funciona

---

## 📞 AYUDA RÁPIDA

**URL del Dashboard Render**: https://render.com/dashboard

**Ver Logs Backend**: Render → artemania-back → Logs

**Ver Logs Frontend**: Render → artemania-front → Logs

**Editar Variables de Entorno**: Render → (Seleccionar servicio) → Settings → Environment

**Hacer Redeploy Manual**: Render → (Seleccionar servicio) → Deploy → Manual Deploy

---

¡Ya está! 🎉 Si todo funciona, tu aplicación está LIVE en Render.
