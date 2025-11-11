# 🚀 GUÍA DEPLOY - RENDER (PASO A PASO)

## ⏱️ TIEMPO TOTAL: 40 minutos (mayormente esperas automáticas)

---

## PASO 1: Preparar Repositorio (2 min)

```bash
cd /home/teck/Escritorio/E-comerce

git add .
git commit -m "Ready for production deploy"
git push origin main
```

**Verificar en GitHub que está actualizado**

---

## PASO 2: Crear Backend en Render (10 min)

### En Render Dashboard (https://render.com/dashboard)

1. Click **"New +"** → **"Web Service"**
2. Seleccionar repositorio y **"Connect"**

### Llenar Formulario:

```
NAME:              artemania-back
BUILD COMMAND:     cd back && npm install && npm run build
START COMMAND:     cd back && npm run start:prod
PLAN:              Free
REGION:            Ohio
```

### Agregar Variables de Entorno (ANTES de crear):

```
NODE_ENV               | production
JWT_SECRET             | (GENERAR - ver comando abajo)
TELEGRAM_BOT_TOKEN     | 7511431174:AAHzs6aqRuxN-Xx9x-XCCqble5luJgIGvjk
TELEGRAM_CHAT_ID       | 1884634191
CORS_ORIGINS           | https://artemania-front.onrender.com
DATABASE_URL           | (DEJAR VACÍO - agregar después)
```

### Generar JWT_SECRET Seguro:

En terminal local:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copiar el output completamente y pegarlo en `JWT_SECRET` en Render.

### Click "Create Web Service" → Esperar (5-10 min)

---

## PASO 3: Crear Base de Datos (5 min)

### En Render Dashboard

1. Click **"New +"** → **"PostgreSQL"**

### Llenar:

```
NAME:       artemania-db
REGION:     Ohio (igual que Backend)
PLAN:       Free
```

### Click "Create Database" → Esperar (2-3 min)

### Copiar DATABASE_URL

1. Cuando se cree, buscar sección **"Connections"**
2. Copiar **"Internal Database URL"**
3. Ir a **artemania-back** → **Settings** → **Environment**
4. Pegar en variable `DATABASE_URL`
5. Click **"Save"**

**El backend se redeploya automáticamente**

---

## PASO 4: Crear Frontend en Render (10 min)

### En Render Dashboard

1. Click **"New +"** → **"Static Site"**
2. Seleccionar repositorio y **"Connect"**

### Llenar Formulario:

```
NAME:                   artemania-front
BUILD COMMAND:          cd front && npm install && npm run build
PUBLISH DIRECTORY:      front/dist/front
```

### Agregar Variable (ANTES de crear):

```
NEXT_PUBLIC_API_URL | https://artemania-back.onrender.com
```

### Click "Create Static Site" → Esperar (5-15 min)

---

## PASO 5: Verificar Todo Funciona (3 min)

### 1. Probar Frontend

- Abrir: `https://artemania-front.onrender.com`
- Debería cargar la aplicación

### 2. Abrir DevTools (F12)

- Ir a pestaña **"Network"**
- Recargar página (F5)
- Verificar que NO hay errores rojos ❌

### 3. Probar Funcionalidades

- [ ] Login (intentar registrarse)
- [ ] Ver productos
- [ ] Agregar al carrito
- [ ] Ver carrito

---

## ⚠️ SI ALGO FALLA EN RENDER

### Error: "Build failed - nest: not found"

**SOLUCIÓN:** Ya está arreglado en `back/package.json`
- `@nestjs/cli` ahora está en dependencies
- Hacer: `git push origin main`
- Render automáticamente reintenta

### Error: "CORS blocked"

**SOLUCIÓN:**
1. Render → artemania-back → Settings → Environment
2. `CORS_ORIGINS` debe ser: `https://artemania-front.onrender.com`
3. Click Save

### Error: "Cannot connect to database"

**SOLUCIÓN:**
1. Render → artemania-back → Settings → Environment
2. Verificar `DATABASE_URL` está correcto
3. Copiar de: artemania-db → Connections → Internal URL
4. Click Save

### Error: "Cannot find directory: front/dist/front/browser"

**SOLUCIÓN:** Ya está corregido
- `PUBLISH DIRECTORY` debe ser: `dist/front/browser`
- NO: `front/dist/front/browser`

### Error: "Static site shows error page"

**SOLUCIÓN:**
1. Render → artemania-front → Logs
2. Ver qué error aparece
3. Si es build error: ver logs de construcción
4. Click "Manual Deploy" para reintentar

---

## 📋 CHECKLIST FINAL

- [ ] Git push completado
- [ ] Web Service Backend creado
- [ ] Base de Datos PostgreSQL creada
- [ ] DATABASE_URL en variables del Backend
- [ ] Static Site Frontend creado
- [ ] Frontend carga sin errores
- [ ] API responde correctamente
- [ ] Login funciona
- [ ] Productos cargan
- [ ] Carrito funciona

---

## 📊 RESULTADO FINAL

```
Frontend:  https://artemania-front.onrender.com
Backend:   https://artemania-back.onrender.com
Database:  PostgreSQL en Render
```

✅ **Tu aplicación está VIVA en Internet**

---

## 🔗 LINKS ÚTILES

- Render Dashboard: https://render.com/dashboard
- Ver Logs: Render → (servicio) → Logs
- Editar Variables: Render → (servicio) → Settings → Environment

---

## 💡 TIPS

- Si Render suspende (Free tier): usar plan Starter ($7/mes) o Uptime Robot (gratis)
- Cada `git push` automáticamente redeploya
- Cambios toman 5-15 minutos en verse
- Ver logs siempre que algo falle

---

**¡LISTO! A DEPLOYAR! 🚀**
