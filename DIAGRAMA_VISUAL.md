# 🎯 DIAGRAMA VISUAL - Flujo Completo de Deploy

## ANTES: Desarrollo Local

```
┌─────────────────────────────────────────────────────────┐
│                  TU COMPUTADORA LOCAL                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  FRONTEND                          BACKEND             │
│  localhost:4200                    localhost:3000      │
│  ┌────────────────┐               ┌─────────────────┐  │
│  │ ng serve       │◄────HTTP─────►│ npm start:dev   │  │
│  │ /src           │               │ /back/src       │  │
│  └────────────────┘               └─────────────────┘  │
│                                           ▼             │
│                                   ┌─────────────────┐  │
│                                   │  PostgreSQL     │  │
│                                   │  localhost:5432 │  │
│                                   │  (datos.env)    │  │
│                                   └─────────────────┘  │
│                                                         │
│  GitHub local (git push)                               │
│  └────────────────────────────────────────────────────┘
│                        ▼
│               GitHub Repository
│                     (Cloud)
│
└─────────────────────────────────────────────────────────┘
```

---

## DESPUÉS: Render Production

```
                          INTERNET
                        ┌──────────┐
                        │ Tu Dominio
                        │ Personalizado
                        │ (opcional)
                        └──────────┘
                             ▲
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
        ▼                                         ▼

┌──────────────────────┐              ┌──────────────────────┐
│   RENDER - FRONTEND  │              │   RENDER - BACKEND   │
│   (Static Site)      │              │   (Web Service)      │
├──────────────────────┤              ├──────────────────────┤
│                      │              │                      │
│  https://            │              │  https://            │
│  artemania-          │              │  artemania-          │
│  front.onrender.com  │              │  back.onrender.com   │
│                      │              │                      │
│  Angular Build       │    HTTP      │  NestJS App         │
│  dist/front/browser  │◄────────────►│  npm run start:prod │
│                      │              │                      │
│  Environment:        │              │  Environment:       │
│  NEXT_PUBLIC_API_URL │              │  DATABASE_URL       │
│  =back.onrender.com  │              │  JWT_SECRET         │
│                      │              │  CORS_ORIGINS       │
└──────────────────────┘              │  TELEGRAM_TOKEN     │
                                      │  NODE_ENV=prod      │
                                      └──────────────────────┘
                                              ▼
                                    ┌──────────────────────┐
                                    │  RENDER - DATABASE   │
                                    │  (PostgreSQL)        │
                                    ├──────────────────────┤
                                    │                      │
                                    │  postgresql://       │
                                    │  usuario:pass@       │
                                    │  host:5432/artemania │
                                    │                      │
                                    │  Internal Database   │
                                    │  URL                 │
                                    └──────────────────────┘

        ┌─────────────────────────────────────────┐
        │     TODO EN: render.com/dashboard      │
        └─────────────────────────────────────────┘
```

---

## FLUJO DE DEPLOY PASO A PASO

```
PASO 1: PREPARACIÓN
  ├─ Verificar datos sensibles en .gitignore
  ├─ Hacer commit final
  └─ git push origin main

         ▼

PASO 2: CREAR CUENTA EN RENDER
  ├─ Ir a render.com
  ├─ Sign up with GitHub
  └─ Autorizar acceso

         ▼

PASO 3: DEPLOY BACKEND
  ├─ Dashboard → New ➕ → Web Service
  ├─ Conectar repositorio
  ├─ Configurar BUILD & START commands
  ├─ Agregar Environment Variables:
  │  ├─ NODE_ENV=production
  │  ├─ JWT_SECRET=(generar)
  │  ├─ TELEGRAM_BOT_TOKEN
  │  ├─ TELEGRAM_CHAT_ID
  │  ├─ CORS_ORIGINS=(dejar temporalmente)
  │  └─ DATABASE_URL=(vacío por ahora)
  └─ Click "Create Web Service"

         ▼

PASO 4: CREAR BASE DE DATOS
  ├─ Dashboard → New ➕ → PostgreSQL
  ├─ Llenar datos (name, region, plan)
  ├─ Click "Create Database"
  ├─ Copiar DATABASE_URL Interna
  └─ Pegar en Web Service artemania-back

         ▼

PASO 5: BACKEND EN LÍNEA ✅
  ├─ Ver logs: Render → artemania-back → Logs
  └─ Verificar: https://artemania-back.onrender.com/

         ▼

PASO 6: DEPLOY FRONTEND
  ├─ Dashboard → New ➕ → Static Site
  ├─ Conectar repositorio
  ├─ BUILD: cd front && npm install && npm run build
  ├─ PUBLISH: front/dist/front/browser
  ├─ Variable: NEXT_PUBLIC_API_URL=https://artemania-back.onrender.com
  └─ Click "Create Static Site"

         ▼

PASO 7: FRONTEND EN LÍNEA ✅
  ├─ Esperar build (3-5 minutos)
  └─ Verificar: https://artemania-front.onrender.com

         ▼

PASO 8: ACTUALIZAR CORS
  ├─ Render → artemania-back → Settings → Environment
  ├─ CORS_ORIGINS = https://artemania-front.onrender.com
  └─ Backend se redeploya automáticamente

         ▼

PASO 9: VERIFICACIÓN FINAL
  ├─ Abrir https://artemania-front.onrender.com
  ├─ F12 → Network → Revisar requests
  ├─ No debe haber errores rojos ❌
  └─ Probar: Login, Productos, Carrito, etc.

         ▼

✅ ¡APLICACIÓN EN PRODUCCIÓN!
```

---

## DIAGRAMA DE COMUNICACIÓN

```
┌─────────────────────────────────────────────────────────┐
│              USUARIO EN NAVEGADOR                       │
│          https://artemania-front.onrender.com           │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ 1. Usuario hace click
                     ▼
            ┌─────────────────────┐
            │  Angular Frontend   │
            │  (Static Files)     │
            └────────┬────────────┘
                     │
                     │ 2. HTTP Request
                     ▼
      ┌──────────────────────────────┐
      │    CORS Preflight Check      │
      │  Origin: https://artemania-  │
      │  front.onrender.com          │
      └────────┬─────────────────────┘
               │
               │ 3. Check Allowed Origins
               ▼
      ┌──────────────────────────────┐
      │  artemania-back.onrender.com │
      │  CORS_ORIGINS=               │
      │  https://artemania-          │
      │  front.onrender.com ✅       │
      └────────┬─────────────────────┘
               │
               │ 4. Allow Request
               ▼
      ┌──────────────────────────────┐
      │  NestJS Backend              │
      │  Process Request             │
      └────────┬─────────────────────┘
               │
               │ 5. Query Database
               ▼
      ┌──────────────────────────────┐
      │  PostgreSQL Database         │
      │  artemania-db.onrender.com   │
      └────────┬─────────────────────┘
               │
               │ 6. Return Data
               ▼
      ┌──────────────────────────────┐
      │  Backend Response (JSON)     │
      │  + CORS Headers              │
      └────────┬─────────────────────┘
               │
               │ 7. Browser Receives
               ▼
            ┌─────────────────────┐
            │  Angular Renders    │
            │  DOM Actualizado    │
            └─────────────────────┘
```

---

## ESTRUCTURA DE ARCHIVOS EN RENDER

```
GitHub Repository
  ├─ back/
  │  ├─ src/
  │  │  ├─ main.ts (CON CORS)
  │  │  ├─ app.module.ts (CON BD config)
  │  │  └─ ...
  │  ├─ package.json
  │  ├─ tsconfig.json
  │  ├─ .env.example
  │  └─ .gitignore (con datos.env)
  │
  ├─ front/
  │  ├─ src/
  │  │  ├─ environments/
  │  │  │  └─ environments.ts (apiUrl: back.onrender.com)
  │  │  └─ ...
  │  ├─ angular.json
  │  ├─ package.json
  │  ├─ vercel.json
  │  ├─ .env.example
  │  └─ .gitignore (con .env.local)
  │
  ├─ render.yaml (Configuración de deploy)
  ├─ .github/ (opcional)
  └─ README.md

Render Builds & Deploys:
  ├─ artemania-back (Web Service)
  │  ├─ Build: cd back && npm install && npm run build
  │  ├─ Start: cd back && npm run start:prod
  │  ├─ Environment Variables (6 variables)
  │  └─ Database: artemania-db
  │
  └─ artemania-front (Static Site)
     ├─ Build: cd front && npm install && npm run build
     ├─ Publish Directory: front/dist/front/browser
     ├─ Environment Variables (1 variable)
     └─ Auto-deploy on git push
```

---

## VARIABLES DE ENTORNO EN RENDER

```
┌─────────────────────────────────────────────────────┐
│         artemania-back (Web Service)                │
├─────────────────────────────────────────────────────┤
│ NODE_ENV             │ production                   │
│ JWT_SECRET           │ a1b2c3d4e5f6g7h8...       │
│ DATABASE_URL         │ postgresql://user:pass@... │
│ TELEGRAM_BOT_TOKEN   │ 7511431174:AAHzs6...      │
│ TELEGRAM_CHAT_ID     │ 1884634191                 │
│ CORS_ORIGINS         │ https://artemania-front... │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│        artemania-front (Static Site)                │
├─────────────────────────────────────────────────────┤
│ NEXT_PUBLIC_API_URL  │ https://artemania-back...  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│         artemania-db (PostgreSQL)                   │
├─────────────────────────────────────────────────────┤
│ DATABASE_URL (Internal) │ postgresql://user:pass... │
│ (Usada en Web Service)  │                          │
└─────────────────────────────────────────────────────┘
```

---

## TIMELINE ESPERADO

```
Tiempo             Evento
─────────────────────────────────────────────────────
0 min              ✓ Git Push
5 min              ✓ Web Service creado
10 min             ✓ Base de Datos creada
15 min             ✓ Backend en línea
20 min             ✓ Static Site creado
25 min             ✓ Frontend en línea
30 min             ✓ CORS Actualizado
35 min             ✓ Verificación completada
40 min             ✅ ¡LISTO EN PRODUCCIÓN!
```

---

## TROUBLESHOOTING VISUAL

```
PROBLEMA                    SOLUCIÓN
─────────────────────────────────────────────────────
❌ Frontend no carga        → Ver Logs: Render → artemania-front → Logs
                             → Check Build command in Settings
                             → Verify Publish Directory

❌ CORS Error              → Check CORS_ORIGINS variable
                             → Match Frontend URL exactly
                             → Redeploy backend

❌ No se conecta a BD      → Verify DATABASE_URL in Environment
                             → Use Internal URL (not external)
                             → Redeploy backend

❌ Backend no responde     → Check: https://artemania-back.onrender.com
                             → Ver Logs: Render → artemania-back → Logs
                             → Check all Environment variables

❌ App suspendida          → Upgrade to Starter plan ($7/mo)
                             → Or use Uptime Robot to keep alive

❌ Build timeout           → Increase build timeout in Settings
                             → Or reduce dependencies
                             → Check npm install logs
```

---

## CHECKLIST VISUAL

```
PREPARACIÓN
  ☐ Git commit & push
  ☐ .gitignore contiene datos sensibles
  ☐ Copia de JWT_SECRET segura

RENDER SETUP
  ☐ Cuenta Render creada
  ☐ GitHub conectado a Render

BACKEND
  ☐ Web Service creado
  ☐ Todas 6 variables de entorno configuradas
  ☐ Base de Datos creada
  ☐ DATABASE_URL en variables
  ☐ Backend responde en HTTPS

FRONTEND
  ☐ Static Site creado
  ☐ Variable NEXT_PUBLIC_API_URL configurada
  ☐ Frontend carga en HTTPS

INTEGRACIÓN
  ☐ CORS_ORIGINS actualizado con Frontend URL
  ☐ Backend redeploy completado

VERIFICACIÓN
  ☐ Frontend carga (F5)
  ☐ No hay errores en Network tab
  ☐ API requests funcionan
  ☐ Login funciona
  ☐ Productos cargan
  ☐ Carrito funciona

✅ LISTO PARA PRODUCCIÓN
```

---

**¡Con este diagrama tienes una visión completa del proceso! 🎯**
