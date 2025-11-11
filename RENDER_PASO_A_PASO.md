# 🎥 GUÍA VISUAL: Deploy en Render (Paso a Paso)

## 📌 Índice Rápido

1. [Preparación del Repositorio](#1-preparación-del-repositorio)
2. [Deploy Backend](#2-deploy-backend)
3. [Crear Base de Datos](#3-crear-base-de-datos)
4. [Deploy Frontend](#4-deploy-frontend)
5. [Verificación Final](#5-verificación-final)

---

## 1. PREPARACIÓN DEL REPOSITORIO

### Paso 1.1: Abrir Terminal

```bash
# En la carpeta raíz del proyecto (donde ves back/ y front/)
pwd
# Debería mostrar: /home/teck/Escritorio/E-comerce
```

### Paso 1.2: Hacer Commit Final

```bash
# Agregar todos los cambios
git add .

# Ver qué se va a commitear
git status

# Hacer commit
git commit -m "Final configuration for Render deployment"

# Subir a GitHub
git push origin main
```

**Esperar a que termine la subida** (puede tardar unos segundos)

### Paso 1.3: Verificar en GitHub

1. Ir a https://github.com/TU_USUARIO/TU_REPO
2. Recargar la página
3. Verificar que los cambios aparecen (RENDER_DEPLOY_GUIA.md, .env.example, etc.)

---

## 2. DEPLOY BACKEND

### Paso 2.1: Crear Cuenta en Render (Si no tienes)

1. Ir a https://render.com
2. Click **"Sign up"** arriba a la derecha
3. Seleccionar **"Sign up with GitHub"**
4. Autorizar el acceso
5. Completar registro

### Paso 2.2: Ir al Dashboard

1. Una vez registrado, ir a https://render.com/dashboard
2. Deberías ver un botón **"New +"** en la esquina superior derecha

### Paso 2.3: Crear Web Service para Backend

```
Paso 1: Click en "New +" → "Web Service"
Paso 2: Buscar tu repositorio en "Connect a repository"
Paso 3: Si no aparece, click "Configure account" y autorizar
Paso 4: Seleccionar tu repositorio → Click "Connect"
```

### Paso 2.4: Llenar Formulario Básico

```
NAME:              artemania-back
ENVIRONMENT:       Node
BUILD COMMAND:     cd back && npm install && npm run build
START COMMAND:     cd back && npm run start:prod
PLAN:              Free
REGION:            Ohio (o la más cercana a ti)
```

### Paso 2.5: Agregar Variables de Entorno

**IMPORTANTE: Hacer esto ANTES de dar "Create"**

1. Scroll hacia abajo
2. Click en **"Advanced"** (si dice "Hide Advanced", ya está abierto)
3. Buscar sección **"Environment Variables"**
4. Click **"Add Environment Variable"** para cada una:

**Variable 1:**
```
KEY:   NODE_ENV
VALUE: production
```
Click ➕ para agregar

**Variable 2:**
```
KEY:   JWT_SECRET
VALUE: (GENERAR - ver paso 2.6)
```
Click ➕

**Variable 3:**
```
KEY:   TELEGRAM_BOT_TOKEN
VALUE: 7511431174:AAHzs6aqRuxN-Xx9x-XCCqble5luJgIGvjk
```
Click ➕

**Variable 4:**
```
KEY:   TELEGRAM_CHAT_ID
VALUE: 1884634191
```
Click ➕

**Variable 5:**
```
KEY:   CORS_ORIGINS
VALUE: https://artemania-front.onrender.com
```
Click ➕

**Variable 6:**
```
KEY:   DATABASE_URL
VALUE: (DÉJALO VACÍO - lo pondremos después)
```

### Paso 2.6: Generar JWT_SECRET

En tu terminal LOCAL (en la carpeta del proyecto):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Salida:** Una cadena larga como:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1
```

**Copiar completamente** y pegar en el valor de `JWT_SECRET` en Render

### Paso 2.7: Crear Web Service

Una vez llenes todo:
1. Scroll hacia abajo
2. Click **"Create Web Service"**
3. Esperar a que se cree (1-2 minutos)
4. Verás página con el Web Service creado

---

## 3. CREAR BASE DE DATOS

**MIENTRAS se crea el Web Service del Backend, hacer esto:**

### Paso 3.1: Crear PostgreSQL Database

1. En Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Llenar:
```
NAME:   artemania-db
REGION: Ohio (igual que el Web Service)
PLAN:   Free
```
3. Click **"Create Database"**
4. Esperar a que se cree

### Paso 3.2: Copiar DATABASE_URL

Cuando se cree la DB:

1. En la página de la BD, buscar **"Connections"**
2. Copiar el campo **"Internal Database URL"**
3. Debería verse así:
```
postgresql://usuario:clave@host:5432/basedatos
```

### Paso 3.3: Pegar en Web Service

1. Ir a Render Dashboard → **artemania-back**
2. Click en **"Settings"**
3. Bajar a **"Environment"**
4. Buscar variable **DATABASE_URL**
5. Click en el campo de valor
6. Pegar la URL copiada
7. Click **"Save"**

**El backend se redeploya automáticamente**

### Paso 3.4: Esperar Redeploy

1. Ir a pestaña **"Logs"** en artemania-back
2. Ver en tiempo real el deploy
3. Cuando veas:
```
Server is running on port 3000
Environment: production
```
Significa que está listo ✅

---

## 4. DEPLOY FRONTEND

### Paso 4.1: Crear Static Site

1. En Render Dashboard, click **"New +"** → **"Static Site"**
2. Buscar tu repositorio → Click **"Connect"**

### Paso 4.2: Llenar Formulario

```
NAME:                  artemania-front
BUILD COMMAND:         cd front && npm install && npm run build
PUBLISH DIRECTORY:     dist/front/browser
```

### Paso 4.3: Agregar Variable de Entorno

**ANTES de crear:**

1. Scroll hacia abajo
2. En **"Environment Variables"**, agregar:
```
KEY:   NEXT_PUBLIC_API_URL
VALUE: https://artemania-back.onrender.com
```

### Paso 4.4: Crear Static Site

Click **"Create Static Site"**

Esperar 3-5 minutos

### Paso 4.5: Obtener URL

Cuando termine:
- En la parte superior verás URL como:
```
https://artemania-front.onrender.com
```

**Copiar esta URL**

### Paso 4.6: Actualizar CORS en Backend (si cambió)

1. Ir a artemania-back → Settings → Environment
2. Editar **CORS_ORIGINS** con la URL real del frontend
3. Click "Save"

---

## 5. VERIFICACIÓN FINAL

### Paso 5.1: Probar Backend

En navegador:
```
https://artemania-back.onrender.com/
```

Debería cargar sin errores

### Paso 5.2: Probar Frontend

En navegador:
```
https://artemania-front.onrender.com
```

Debería ver la aplicación completa

### Paso 5.3: Probar Conexión (en DevTools)

1. En `https://artemania-front.onrender.com`
2. Abrir F12 (DevTools)
3. Ir a **Network** tab
4. Recargar página (F5)
5. Ver si hay requests rojos ❌ o verdes ✅
   - Verde = funciona
   - Rojo = hay problema

### Paso 5.4: Probar Funcionalidades

- [ ] Click en productos
- [ ] Agregar al carrito
- [ ] Ver carrito
- [ ] Intentar login/registro

Si todo funciona, **¡LISTO! 🎉**

---

## ⚡ COMANDOS ÚTILES

### Ver logs en tiempo real

**Backend Logs:**
```bash
# En terminal, si tienes SSH configurado en Render
# O simplemente ir a:
# Render Dashboard → artemania-back → Logs
```

### Hacer Redeploy Manual

Si quieres forzar un nuevo deploy:

1. Ir a Render Dashboard
2. Seleccionar el servicio (artemania-back o artemania-front)
3. Click **"Deploy"**
4. Seleccionar **"Manual Deploy"** o **"Clear build cache and deploy"**

### Ver Estado de Servicios

```
Render Dashboard → (cada servicio muestra estado)
- Verde = Online ✅
- Rojo = Error ❌
- Amarillo = Building...
```

---

## 🆘 SI ALGO FALLA

### Error: "Build failed"

**Solución:**
1. Click en el log que dice "Build failed"
2. Leer el mensaje de error
3. Hacer fix en local:
   ```bash
   git add .
   git commit -m "Fix build error"
   git push origin main
   ```
4. Render automáticamente reintenta

### Error: "CORS blocked"

**Solución:**
1. Backend → Settings → Environment
2. Verificar `CORS_ORIGINS` tiene URL del frontend:
   ```
   https://artemania-front.onrender.com
   ```
3. Guardar y esperar redeploy

### Error: "Cannot connect to database"

**Solución:**
1. Backend → Settings → Environment
2. Verificar `DATABASE_URL` está correcta
3. Ir a la BD en Render
4. Copiar DATABASE_URL nuevamente
5. Pegar en Web Service
6. Guardar

### El sitio muestra "Suspended"

**Causa:** Render Free suspende apps inactivas

**Solución:** Upgrade a plan Starter ($7/mes) o configurar Uptime Robot

---

## 📞 SOPORTE RENDER

- **Documentación:** https://render.com/docs
- **Estado del Servicio:** https://status.render.com
- **Chat de Soporte:** En Render Dashboard

---

**¡Listo! Tu app está en línea en Render. 🚀**
