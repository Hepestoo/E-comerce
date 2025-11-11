# 📌 HOJA DE REFERENCIA RÁPIDA - Render Deploy

## COMANDOS ESENCIALES

### Preparar Repositorio
```bash
# Ir a carpeta del proyecto
cd /home/teck/Escritorio/E-comerce

# Ver cambios
git status

# Agregar todo
git add .

# Commit
git commit -m "Ready for production"

# Push a GitHub
git push origin main
```

### Generar JWT_SECRET Seguro
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copiar output completamente.

### Probar Localmente Antes de Deploy
```bash
# Terminal 1 - Backend
cd back
npm install
npm run start:dev

# Terminal 2 - Frontend
cd front
npm install
npm start
```

---

## FORMULARIOS PARA LLENAR EN RENDER

### PASO 1: Web Service (Backend)

```
NAME:                  artemania-back
ENVIRONMENT:           Node
BUILD COMMAND:         cd back && npm install && npm run build
START COMMAND:         cd back && npm run start:prod
PLAN:                  Free
REGION:                Ohio
```

### PASO 2: Variables de Entorno (Backend)

```
NODE_ENV               | production
JWT_SECRET             | (GENERAR - ver comando arriba)
TELEGRAM_BOT_TOKEN     | 7511431174:AAHzs6aqRuxN-Xx9x-XCCqble5luJgIGvjk
TELEGRAM_CHAT_ID       | 1884634191
CORS_ORIGINS           | https://artemania-front.onrender.com
DATABASE_URL           | (DEJAR VACÍO - agregar después)
```

### PASO 3: PostgreSQL Database

```
NAME:      artemania-db
REGION:    Ohio
PLAN:      Free
```

Después de crear:
- Copiar "Internal Database URL"
- Pegar en `artemania-back` → Settings → Environment → `DATABASE_URL`

STATIC SITE (Frontend):
```
NAME:              artemania-front
BUILD COMMAND:     cd front && npm install && npm run build
PUBLISH DIRECTORY: dist/front/browser
```

### PASO 5: Variables de Entorno (Frontend)

```
NEXT_PUBLIC_API_URL | https://artemania-back.onrender.com
```

---

## URLS DE REFERENCIA

```
Login Render:              https://render.com/dashboard
Crear Web Service:         https://render.com/dashboard (New ➕)
Ver Logs Backend:          render.com/dashboard → artemania-back → Logs
Ver Logs Frontend:         render.com/dashboard → artemania-front → Logs

GitHub:                    https://github.com/TU_USUARIO/TU_REPO
GitHub Sync:               render.com/dashboard (conecta automático)

Frontend Live:             https://artemania-front.onrender.com
Backend Live:              https://artemania-back.onrender.com
Database:                  render.com/dashboard → artemania-db
```

---

## VARIABLES DE ENTORNO - VALORES RÁPIDOS

```bash
# JWT_SECRET (COPIA DEL TERMINAL)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Ejemplo output (NO uses este):
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1

# TELEGRAM (sin cambios)
TELEGRAM_BOT_TOKEN=7511431174:AAHzs6aqRuxN-Xx9x-XCCqble5luJgIGvjk
TELEGRAM_CHAT_ID=1884634191

# NODE_ENV (sin cambios)
NODE_ENV=production

# CORS (cambiar si frontend URL es diferente)
CORS_ORIGINS=https://artemania-front.onrender.com

# API URL (sin cambios)
NEXT_PUBLIC_API_URL=https://artemania-back.onrender.com
```

---

## CHECKLIST DE DEPLOY EN ORDEN

### Antes de Empezar
- [ ] GitHub: ¿proyecto subido? (`git push`)
- [ ] Terminal: ¿en carpeta raíz con back/ y front/?
- [ ] Render: ¿cuenta creada?
- [ ] Node: ¿instalado? (`node --version`)

### Paso 1: Backend (10 min)
- [ ] New ➕ Web Service
- [ ] Conectar GitHub repo
- [ ] Llenar Build + Start commands
- [ ] Agregar 6 variables de entorno
- [ ] Click "Create"
- [ ] Esperar...

### Paso 2: Database (5 min)
- [ ] New ➕ PostgreSQL
- [ ] Llenar Name, Region, Plan
- [ ] Click "Create"
- [ ] Copiar Internal URL
- [ ] Pegar en `artemania-back` variables
- [ ] Backend redeploya

### Paso 3: Frontend (10 min)
- [ ] New ➕ Static Site
- [ ] Conectar GitHub repo
- [ ] Llenar Build + Publish
- [ ] Agregar 1 variable
- [ ] Click "Create"
- [ ] Esperar...

### Paso 4: Verificar (5 min)
- [ ] Abrir frontend URL
- [ ] F12 → Network → Sin errores rojos
- [ ] Probar login
- [ ] Probar productos
- [ ] Probar carrito

### Resultado
- [ ] ✅ Frontend en vivo
- [ ] ✅ Backend en vivo
- [ ] ✅ Database conectada
- [ ] ✅ CORS funcionando

---

## TROUBLESHOOTING RÁPIDO

### ❌ Frontend no carga
```
1. Ver: Render → artemania-front → Logs
2. Buscar: "error" o "failed"
3. Si Build Command es incorrecto:
   - Settings → Build Command
   - Debe ser: cd front && npm install && npm run build
4. Save → Manual redeploy
```

### ❌ CORS error
```
1. Render → artemania-back → Settings
2. Environment → CORS_ORIGINS
3. Debe ser: https://artemania-front.onrender.com
4. Si cambió URL, actualizar
5. Save → Backend redeploya
```

### ❌ "Cannot connect to database"
```
1. Render → artemania-db → Connections
2. Copiar "Internal Database URL" (NO external)
3. Render → artemania-back → Settings → Environment
4. DATABASE_URL = pegada URL
5. Save
```

### ❌ App se suspende
```
Causa: Free tier de Render
Soluciones:
  A) Upgrade a plan Starter ($7/mo)
  B) Configurar Uptime Robot (free)
     - Monitor a: https://artemania-back.onrender.com
     - Intervalo: 5 minutos
```

---

## NOTAS IMPORTANTES

### ⚠️ SEGURIDAD
- 🔐 JWT_SECRET: Genera nuevo, cópalo entero, no lo compartas
- 🔒 DATABASE_URL: Usa URL INTERNA (no externa)
- 🛡️ CORS: Solo permite frontend URL, no "*"
- 📁 .gitignore: datos.env y .env.local NO en Git

### ⏱️ TIEMPOS
- Backend Web Service: 5-10 min crear + deploy
- Database: 2-5 min crear
- Frontend Static Site: 5-15 min crear + build + deploy
- TOTAL: 30-40 min

### 🔄 AUTO-DEPLOY
Cuando hagas `git push`:
1. GitHub notifica a Render
2. Render automáticamente redeploya
3. Ver progreso en Render Logs
4. App actualizada en 5-10 minutos

---

## ARCHIVOS CREADOS/ACTUALIZADOS

```
✅ RENDER_DEPLOY_GUIA.md         (guía detallada)
✅ RENDER_PASO_A_PASO.md         (paso a paso visual)
✅ DIAGRAMA_VISUAL.md             (diagramas y flujos)
✅ README_DEPLOYMENT.md           (resumen ejecutivo)
✅ RECURSOS_Y_REFERENCIAS.md     (links y documentación)
✅ back/.env.example              (plantilla variables)
✅ front/.env.example             (plantilla variables)
✅ back/src/main.ts               (CORS configurado)
✅ back/src/app.module.ts         (BD config mejorada)
✅ front/vercel.json              (config Vercel)
✅ render.yaml                    (config Render - NO USADA PERO OK)
```

---

## DESPUÉS DE DEPLOY

### Día 1 (Inmediatamente)
- [ ] Probar todas las funciones
- [ ] Compartir URL con usuarios
- [ ] Recibir feedback

### Semana 1
- [ ] Monitorear logs
- [ ] Resolver bugs reportados
- [ ] Hacer hot fixes si es necesario

### Permanente
- [ ] `git push` automáticamente redeploya
- [ ] Monitoreo con Uptime Robot (opcional)
- [ ] Backup de BD (Render lo hace)

---

## INFORMACIÓN ÚTIL

### Tu Aplicación
```
Frontend URL:    https://artemania-front.onrender.com
Backend URL:     https://artemania-back.onrender.com
Database:        PostgreSQL en Render

Stack:
  - Frontend: Angular 19
  - Backend: NestJS
  - Database: PostgreSQL
  - Hosting: Render
```

### Soporte
- Render Docs: https://render.com/docs
- Angular Docs: https://angular.io/docs
- NestJS Docs: https://docs.nestjs.com
- GitHub: Ver issues/discussions

---

## 🎯 META

> Cuando hayas completado TODO, tendrás:
> - ✅ Aplicación LIVE en Internet
> - ✅ Base de datos persistente
> - ✅ Auto-deploy en cada git push
> - ✅ HTTPS/SSL gratis
> - ✅ Monitoreo (opcional)
> - ✅ Soporte de Render

---

**¡LISTO PARA DEPLOYAR! 🚀**

Sigue este documento + RENDER_PASO_A_PASO.md para éxito garantizado.
