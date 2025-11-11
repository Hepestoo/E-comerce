# 🚀 RESUMEN EJECUTIVO - Deploy Render en 5 Minutos

## TL;DR (Too Long; Didn't Read)

**El proceso completo toma ~40 minutos, pero 90% es tiempo de espera automático.**

---

## 🎯 OBJETIVO

Llevar tu aplicación (Frontend + Backend) de tu computadora local a **Internet en vivo**.

```
Antes: localhost:4200 (solo local)
Después: https://artemania-front.onrender.com (INTERNET)
```

---

## 📋 REQUISITOS (5 minutos)

- [ ] GitHub: Proyecto subido (`git push origin main`)
- [ ] Terminal: Acceso a la carpeta del proyecto
- [ ] Navegador: Chrome, Firefox, Safari
- [ ] Credenciales:
  - [ ] GitHub username/password
  - [ ] JWT_SECRET nuevo (te enseño a generar)

---

## ⚡ 5 PASOS PRINCIPALES

### PASO 1: Preparar Repositorio (2 min)
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### PASO 2: Crear Backend en Render (10 min)
1. https://render.com/dashboard → New ➕ → Web Service
2. Conectar GitHub → Seleccionar repo → Connect
3. Llenar:
   - Name: `artemania-back`
   - Build: `cd back && npm install && npm run build`
   - Start: `cd back && npm run start:prod`
4. Agregar 6 variables de entorno (copy-paste abajo)
5. Click "Create Web Service" → Esperar

**Variables para Backend:**
```
NODE_ENV=production
JWT_SECRET=(generar con comando abajo)
TELEGRAM_BOT_TOKEN=7511431174:AAHzs6aqRuxN-Xx9x-XCCqble5luJgIGvjk
TELEGRAM_CHAT_ID=1884634191
CORS_ORIGINS=https://artemania-front.onrender.com
DATABASE_URL=(vacío por ahora)
```

**Generar JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copiar output → pegar en Render
```

### PASO 3: Crear Base de Datos (5 min)
1. Render Dashboard → New ➕ → PostgreSQL
2. Name: `artemania-db`
3. Create Database → Esperar
4. Copiar `Internal Database URL`
5. Render → artemania-back → Settings → Environment
6. Pegar en `DATABASE_URL`
7. Save → Backend redeploya

### PASO 4: Crear Frontend en Render (10 min)
1. Render Dashboard → New ➕ → Static Site
2. Conectar GitHub (igual que backend)
3. Llenar:
   - Build: `cd front && npm install && npm run build`
   - Publish: `front/dist/front/browser`
4. Variable:
   ```
   NEXT_PUBLIC_API_URL=https://artemania-back.onrender.com
   ```
5. Click "Create Static Site" → Esperar

### PASO 5: Verificar Todo Funciona (3 min)
1. Abrir: `https://artemania-front.onrender.com`
2. F12 (DevTools) → Network tab
3. Recargar (F5)
4. Ver que no hay errores rojos ❌
5. Probar: Login, Productos, Carrito

---

## 🔑 CONCEPTOS CLAVE

| Concepto | Qué es |
|----------|--------|
| **Web Service** | Tu backend NestJS corriendo en Render |
| **Static Site** | Tu frontend Angular compilado en Render |
| **PostgreSQL** | Tu base de datos en Render |
| **Environment Variables** | Credenciales/config sin poner en código |
| **CORS** | Permite que frontend hable con backend |
| **DATABASE_URL** | String de conexión a BD |
| **JWT_SECRET** | Clave para encriptar tokens de login |

---

## ✅ RESULTADO FINAL

```
┌─────────────────────────────────────────────────┐
│        APLICACIÓN EN LÍNEA (VIVA)              │
├─────────────────────────────────────────────────┤
│                                                 │
│ Frontend:  https://artemania-front.onrender.com│
│ Backend:   https://artemania-back.onrender.com │
│ Database:  PostgreSQL en Render                │
│                                                 │
│ ✅ Cualquiera con internet puede acceder       │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## ⚠️ COSAS IMPORTANTES

### NO HAGAS:
- ❌ Subir `datos.env` a GitHub
- ❌ Poner credenciales en el código
- ❌ Usar JWT_SECRET débil (como "secret" o "123456")
- ❌ Olvidar actualizar CORS cuando cambies URLs

### SÍ HACES:
- ✅ Usar variables de entorno
- ✅ Generar JWT_SECRET fuerte y nuevo
- ✅ Hacer commit & push antes de deploy
- ✅ Verificar logs si algo falla

---

## 🎓 DESPUÉS DE DEPLOY

### Monitoreo (Opcional pero recomendado)
Usar Uptime Robot para alertas si algo cae:
- https://uptimerobot.com
- Monitor a: `https://artemania-back.onrender.com`
- Intervalo: 5 minutos
- Alerta por email si cae

### Mejoras Futuras
- Agregar dominio personalizado (tu-dominio.com)
- Configurar CI/CD automático
- Agregar logs más detallados
- Implementar caché

---

## 🆘 SI ALGO FALLA

| Error | Solución |
|-------|----------|
| "Build failed" | Ver logs → Fix en código → git push |
| "CORS error" | Actualizar CORS_ORIGINS → Redeploy |
| "Cannot connect to DB" | Verificar DATABASE_URL → Copiar de nuevo |
| "Static site shows error" | Check Build command → Manual deploy |
| "App suspended" | Upgrade plan o usar Uptime Robot |

**En todos los casos:** Ver logs en `Render Dashboard → Logs`

---

## 📞 RESOURCES

| Recurso | Link |
|---------|------|
| Render Docs | https://render.com/docs |
| Si necesitas ayuda | RENDER_PASO_A_PASO.md en el proyecto |
| Diagrama completo | DIAGRAMA_VISUAL.md |
| Troubleshooting | DEPLOY_CHECKLIST.md |

---

## ⏱️ TIEMPO ESTIMADO

```
Tarea                              Tiempo
──────────────────────────────────────────
Preparar repo                      2 min
Crear Backend                      10 min ⏳
Crear Database                     5 min ⏳
Crear Frontend                     10 min ⏳
Verificar & Ajustar                3 min
──────────────────────────────────────────
TOTAL                              30 min
```

**⏳ = Mayormente esperas a que Render complete**

---

## 🎉 ¡LISTO!

Una vez completes los 5 pasos, tu aplicación estará **VIVA EN INTERNET** y accesible para que cualquiera la use.

### Próximos pasos:
1. Compartir URL con otros usuarios
2. Monitorear que todo funcione
3. Hacer cambios locales → git push → Auto-redeploy
4. ¡Tomar café y celebrar! ☕

---

**¿Necesitas la guía paso a paso más detallada?** 
→ Ver `RENDER_PASO_A_PASO.md`

**¿Necesitas diagrama visual?**
→ Ver `DIAGRAMA_VISUAL.md`

**¿Tienes un error específico?**
→ Ver `DEPLOY_CHECKLIST.md` sección Troubleshooting

---

**🚀 ¡A DEPLOYAR!**
