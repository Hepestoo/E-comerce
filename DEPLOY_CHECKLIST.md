# 🚀 CHECKLIST PARA DEPLOY A PRODUCCIÓN

## PASO 1: Preparar el Repositorio

### 1.1 Backend
```bash
cd back

# Verificar que datos.env NO está en el repositorio
git status | grep datos.env
# Si aparece, hacer:
git rm --cached datos.env
git commit -m "Remove datos.env from tracking"

# Verificar .gitignore tiene datos.env
grep "datos.env" .gitignore
```

### 1.2 Frontend
```bash
cd front

# Verificar que .env.local NO está en el repositorio
git status | grep .env.local
# Si aparece, hacer:
git rm --cached .env.local
git commit -m "Remove .env.local from tracking"
```

### 1.3 Commit y Push
```bash
git add .
git commit -m "Configure for production deployment"
git push origin main
```

---

## PASO 2: Configurar Backend en Render

### 2.1 Crear Web Service
1. Ir a https://render.com/dashboard
2. Click en "New +" → "Web Service"
3. Seleccionar tu repositorio de GitHub
4. Configurar:
   - **Name**: `artemania-back`
   - **Environment**: `Node`
   - **Build Command**: `cd back && npm install && npm run build`
   - **Start Command**: `cd back && npm run start:prod`
   - **Plan**: Free (o Starter si lo necesitas)

### 2.2 Agregar Variables de Entorno
En el formulario de creación del Web Service, agregar:

```
DATABASE_URL = (déjalo vacío por ahora, lo llenaremos después)
JWT_SECRET = (generaremos uno abajo)
TELEGRAM_BOT_TOKEN = 7511431174:AAHzs6aqRuxN-Xx9x-XCCqble5luJgIGvjk
TELEGRAM_CHAT_ID = 1884634191
CORS_ORIGINS = https://artemania-front.vercel.app
NODE_ENV = production
```

### 2.3 Generar JWT_SECRET fuerte
En tu terminal local:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Salida ejemplo: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1
# Copiar este valor a RENDER en JWT_SECRET
```

### 2.4 Crear Base de Datos
1. En Render Dashboard, crear PostgreSQL Database:
   - Click "New +" → "PostgreSQL"
   - **Name**: `artemania-db`
   - **Plan**: Free
   
2. Una vez creada, Render genera automáticamente `DATABASE_URL`
3. Copiar esa URL
4. Ir al Web Service `artemania-back`
5. Settings → Environment → Agregar/editar `DATABASE_URL`

### 2.5 Deploy
- Render debería auto-deployar cuando hagas push a main
- Si no, click en "Deploy"
- Esperar a que termine (2-3 minutos)
- Ver logs en "Logs"

---

## PASO 3: Configurar Frontend en Vercel

### 3.1 Importar Proyecto
1. Ir a https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. "Import Git Repository"
4. Seleccionar tu repositorio

### 3.2 Configurar Build
En los settings de importación:
- **Framework Preset**: Angular
- **Root Directory**: `front`
- **Build Command**: `ng build --configuration=production`
- **Install Command**: `npm install`
- **Output Directory**: `dist/front/browser`

### 3.3 Variables de Entorno
En el formulario:
```
NEXT_PUBLIC_API_URL = https://artemania-back.onrender.com
```
(Reemplazar con tu URL real de Render)

### 3.4 Deploy
- Click "Deploy"
- Esperar a que termine (3-5 minutos)
- Vercel te da una URL como: `https://artemania-front.vercel.app`

### 3.5 Actualizar CORS en Backend
1. Ir a Render → `artemania-back` → Settings
2. Editar `CORS_ORIGINS` con la URL de Vercel:
   ```
   https://artemania-front.vercel.app
   ```
3. El Web Service se redeploya automáticamente

---

## PASO 4: Verificar que Todo Funciona

### 4.1 Backend
```bash
# Probando endpoints
curl https://artemania-back.onrender.com/
# Debería responder sin error CORS
```

### 4.2 Frontend
1. Abrir en navegador: `https://artemania-front.vercel.app`
2. Abrir DevTools (F12)
3. En Network tab, revisar que las requests al API funcionan
4. En Console, no debería haber errores CORS

### 4.3 Funcionalidad
- Intentar login
- Cargar productos
- Agregar al carrito
- Revisar logs en Render Dashboard

---

## PASO 5: Solucionar Problemas Comunes

### ❌ "CORS error" en Frontend

**Causa**: `CORS_ORIGINS` no tiene la URL de Vercel

**Solución**:
```bash
# 1. Ir a Render Dashboard
# 2. Seleccionar artemania-back
# 3. Settings → Environment
# 4. Editar CORS_ORIGINS:
#    Antes: https://artemania-front.vercel.app
#    Después: https://artemania-front.vercel.app,http://localhost:3000 (si develops localmente)
# 5. Guardar
# 6. El servicio se redeploya automáticamente
```

### ❌ "Database connection refused"

**Causa**: Base de datos no está configurada o DATABASE_URL es incorrecto

**Solución**:
```bash
# 1. Ir a Render Dashboard
# 2. Verificar que existe la PostgreSQL Database
# 3. Copiar DATABASE_URL de la DB
# 4. En artemania-back Settings → Environment
# 5. Pegar DATABASE_URL
# 6. Redeploy
```

### ❌ Frontend carga pero no ve datos

**Causa**: Frontend no llama al API correcto o headers incorrectos

**Solución**:
```bash
# En el navegador, abrir DevTools
# Network tab → Ver requests al API
# Response debería ser un JSON válido (no HTML de error)
# Si es HTML con error, revisar logs de Render
```

### ❌ Render suspende la app (Free Tier)

**Problema**: Apps gratis se suspenden después de 15 min de inactividad

**Soluciones**:
- Usar plan Starter ($7/mes)
- O agregar monitoreo: https://uptimerobot.com
- O usar herramienta que haga ping cada 5 minutos

---

## PASO 6: Monitorear en Producción

### Logs de Backend
- Render Dashboard → artemania-back → Logs
- Ver errores, conexiones, etc.

### Logs de Frontend
- Vercel Dashboard → artemania-front → Deployments
- Ver build errors

### Monitoreo de Uptime
- https://uptimerobot.com (Gratuito)
- Configurar monitor para tu API endpoint
- Recibirás alertas si cae

---

## CHECKLIST FINAL

- [ ] Datos sensibles NO están en Git
- [ ] `.env` y `.env.local` están en `.gitignore`
- [ ] Backend deployado en Render
- [ ] Frontend deployado en Vercel
- [ ] Database configurada en Render
- [ ] JWT_SECRET establecido (fuerte y único)
- [ ] CORS_ORIGINS apunta a URL de Vercel
- [ ] Variables de entorno en Render completadas
- [ ] Variables de entorno en Vercel completadas
- [ ] Frontend puede conectarse al API
- [ ] Login funciona
- [ ] Productos cargan correctamente
- [ ] Carrito funciona
- [ ] No hay errores en DevTools

---

## URLs ÚTILES

- **Render Backend**: https://artemania-back.onrender.com
- **Vercel Frontend**: https://artemania-front.vercel.app
- **GitHub Repository**: Tu URL de GitHub
- **Render Dashboard**: https://render.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard

---

## 📞 SOPORTE

Si tienes problemas:
1. Revisa los logs (Render → Logs, Vercel → Deployments)
2. Verifica variables de entorno están correctas
3. Comprueba que el repositorio está actualizado (git push)
4. Intenta manual deployment en lugar de auto-deployment

¡Buena suerte! 🚀
