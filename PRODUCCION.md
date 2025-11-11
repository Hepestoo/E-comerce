# E-Commerce - Guía de Configuración para Producción

## 📋 Requisitos Previos

- Node.js v18 o superior
- npm o yarn
- PostgreSQL (para desarrollo local)
- Cuenta en Render (para backend)
- Cuenta en Vercel (para frontend)

## 🚀 Configuración de Producción

### Backend (Render)

#### 1. Preparar repositorio

```bash
# Asegúrate que datos.env esté en .gitignore
echo "datos.env" >> back/.gitignore
git add back/.gitignore
git commit -m "Add datos.env to gitignore"
git push
```

#### 2. En Render Dashboard

1. Crea un nuevo **Web Service**
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Build Command**: `cd back && npm install && npm run build`
   - **Start Command**: `cd back && npm run start:prod`
   - **Root Directory**: (vacío o `/`)

#### 3. Variables de Entorno en Render

En el dashboard de Render, añade estas variables:

```
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/basedatos
JWT_SECRET=una_clave_secreta_fuerte_y_aleatoria
TELEGRAM_BOT_TOKEN=tu_token_aqui
TELEGRAM_CHAT_ID=tu_chat_id_aqui
CORS_ORIGINS=https://artemania-front.vercel.app
NODE_ENV=production
```

**⚠️ IMPORTANTE**: 
- Genera un JWT_SECRET fuerte: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- No uses valores locales en producción

#### 4. Base de Datos

Si usas Render Database:
1. Crear una PostgreSQL Database en Render
2. Copiar la `DATABASE_URL`
3. Pegarla en las variables de entorno del Web Service
4. La URL ya incluye `?sslmode=require`, lo que está configurado en `app.module.ts`

### Frontend (Vercel)

#### 1. En Vercel Dashboard

1. **Import Project** desde GitHub
2. Selecciona el repositorio
3. Configura:
   - **Framework**: Angular
   - **Root Directory**: `front`
   - **Build Command**: `ng build --configuration=production`
   - **Output Directory**: `dist/front/browser`

#### 2. Variables de Entorno en Vercel

```
NEXT_PUBLIC_API_URL=https://artemania-back.onrender.com
```

#### 3. Configuración de Redirecciones

Vercel automáticamente redirige todas las rutas a `index.html` para Angular.

---

## 🔧 Configuración Local

### Backend Local

```bash
cd back

# 1. Instalar dependencias
npm install

# 2. Crear archivo .env local
cp .env.example .env

# 3. Editar .env con tus valores locales:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=tu_password
# DB_NAME=Artemania
# JWT_SECRET=dev_secret_key
# NODE_ENV=development

# 4. Ejecutar en modo desarrollo
npm run start:dev
```

### Frontend Local

```bash
cd front

# 1. Instalar dependencias
npm install

# 2. Ejecutar servidor de desarrollo
npm start

# El frontend abrirá en http://localhost:4200
```

---

## 📝 Estructura de Archivos Importante

```
back/
├── .env.example          ✅ Documentación de variables
├── .gitignore            ✅ Incluye datos.env y .env
├── datos.env             ❌ NO SUBIR A GIT (solo local)
├── src/
│   ├── main.ts          ✅ CORS configurado correctamente
│   └── app.module.ts    ✅ BD local y producción

front/
├── .env.example          ✅ Documentación de variables
├── .gitignore            ✅ Incluye .env.local
├── vercel.json          ✅ Configuración para Vercel
└── src/
    └── environments/
        └── environments.ts  ✅ URLs configuradas
```

---

## 🧪 Verificación de Deploy

### Backend

```bash
# Verificar que el API responde
curl https://artemania-back.onrender.com/

# Ver logs en Render dashboard
# Settings > Logs
```

### Frontend

```bash
# Verificar que la aplicación carga
curl https://artemania-front.vercel.app/
```

---

## 🔐 Seguridad

- ✅ Credenciales en variables de entorno
- ✅ CORS limitado a dominios permitidos
- ✅ JWT_SECRET fuerte y único
- ✅ No subir `.env`, `datos.env` a Git
- ✅ SSL/TLS habilitado en producción

---

## ⚠️ Troubleshooting

### "CORS error" en frontend

**Solución**: Verifica que `CORS_ORIGINS` en Render incluya tu URL de Vercel:
```
https://artemania-front.vercel.app
```

### "Database connection refused" en Render

**Solución**: 
1. Verifica `DATABASE_URL` en variables de entorno
2. Si usas Render DB: asegúrate que está en la misma región
3. Usa `?sslmode=require` en la URL (ya configurado)

### Frontend no se conecta al backend

**Solución**:
1. Verifica `environment.apiUrl` apunta a `https://artemania-back.onrender.com`
2. Comprueba que backend está activo (no en estado "suspended")
3. Revisa la consola del navegador (F12 → Network)

### Render suspende la aplicación

Por defecto, Render suspende apps gratis inactivas.
- **Solución**: Usar plan de pago o agregar monitoreo externo

---

## 📚 Referencias

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [NestJS Deployment](https://docs.nestjs.com/deployment)
- [Angular Production Build](https://angular.io/guide/build)
