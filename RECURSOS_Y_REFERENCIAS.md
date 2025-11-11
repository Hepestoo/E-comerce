# 📚 RECURSOS Y REFERENCIAS - Deploy en Render

## 🎥 VIDEOS TUTORIALES RECOMENDADOS

### Deploy en Render (EN ESPAÑOL)

1. **Deploy Full Stack en Render**
   - Duración: 45 min
   - Tópicos: Backend, Frontend, Base de Datos
   - URL: Busca en YouTube "deploy render full stack español"

2. **Render vs Vercel vs Heroku**
   - Duración: 30 min
   - Ideal para entender diferencias
   - URL: YouTube "render vs vercel 2024"

### Deploy de Angular

3. **Angular Production Build**
   - Duración: 20 min
   - URL: Angular official docs

4. **NestJS Production Deployment**
   - Duración: 25 min
   - URL: NestJS official docs

---

## 🔗 LINKS ÚTILES

### Render
- **Dashboard:** https://render.com/dashboard
- **Documentación:** https://render.com/docs
- **Precios:** https://render.com/pricing
- **Status del Servicio:** https://status.render.com
- **Blog:** https://render.com/blog

### Angular
- **Build for Production:** https://angular.io/guide/build
- **Deployment Guide:** https://angular.io/guide/deployment
- **CLI Reference:** https://angular.io/cli

### NestJS
- **Deployment:** https://docs.nestjs.com/deployment
- **Configuration:** https://docs.nestjs.com/techniques/configuration
- **Database:** https://docs.nestjs.com/techniques/database

### PostgreSQL
- **Render Database:** https://render.com/docs/databases
- **Connection Strings:** https://www.postgresql.org/docs/current/libpq-connect.html
- **SSL Mode:** https://www.postgresql.org/docs/current/ssl-support.html

### Otras Herramientas
- **Uptime Robot (Monitoreo):** https://uptimerobot.com
- **GitHub Status:** https://www.githubstatus.com

---

## 📖 DOCUMENTACIÓN OFICIAL

### Backend (NestJS)

```
TÓPICO                          LINK
────────────────────────────────────────────────────────
Getting Started                 https://docs.nestjs.com/
CLI Overview                    https://docs.nestjs.com/cli/overview
First Steps                     https://docs.nestjs.com/first-steps
Controllers                     https://docs.nestjs.com/controllers
Services                        https://docs.nestjs.com/providers
Modules                         https://docs.nestjs.com/modules
Middleware                      https://docs.nestjs.com/middleware
Exception Filters               https://docs.nestjs.com/exception-filters
Pipes                           https://docs.nestjs.com/pipes
Guards                          https://docs.nestjs.com/guards
Interceptors                    https://docs.nestjs.com/interceptors
Custom Decorators              https://docs.nestjs.com/custom-decorators
TypeORM Integration            https://docs.nestjs.com/techniques/database
Configuration                  https://docs.nestjs.com/techniques/configuration
Validation                     https://docs.nestjs.com/techniques/validation
Caching                        https://docs.nestjs.com/techniques/caching
GraphQL                        https://docs.nestjs.com/graphql/quick-start
Authentication                https://docs.nestjs.com/security/authentication
Authorization                 https://docs.nestjs.com/security/authorization
Helmet                         https://docs.nestjs.com/security/helmet
CORS                           https://docs.nestjs.com/security/cors
Rate Limiting                  https://docs.nestjs.com/security/rate-limiting
Deployment                     https://docs.nestjs.com/deployment
```

### Frontend (Angular)

```
TÓPICO                          LINK
────────────────────────────────────────────────────────
Getting Started                 https://angular.io/start
Tour of Heroes                  https://angular.io/tutorial/tour-of-heroes
Architecture                   https://angular.io/guide/architecture
Components                     https://angular.io/guide/component-overview
Templates                      https://angular.io/guide/template-syntax
Directives                     https://angular.io/guide/attribute-binding
Event Binding                  https://angular.io/guide/event-binding
Forms                          https://angular.io/guide/forms-overview
HTTP Client                    https://angular.io/guide/http
Routing                        https://angular.io/guide/routing-overview
Services                       https://angular.io/guide/creating-injectable-services
Dependency Injection           https://angular.io/guide/dependency-injection
RxJS & Observables            https://angular.io/guide/rx-library
NgRx State Management          https://ngrx.io/
Testing                        https://angular.io/guide/testing
Performance                    https://angular.io/guide/styleguide
Security                       https://angular.io/guide/security
Internationalization (i18n)    https://angular.io/guide/i18n-overview
Accessibility                 https://angular.io/guide/accessibility
Build Optimization            https://angular.io/guide/build
Deployment                    https://angular.io/guide/deployment
```

### PostgreSQL

```
TÓPICO                          LINK
────────────────────────────────────────────────────────
Official Site                  https://www.postgresql.org/
Documentation                  https://www.postgresql.org/docs/
Downloads                      https://www.postgresql.org/download/
Connection Strings             https://www.postgresql.org/docs/current/libpq-connect.html
Environment Variables          https://www.postgresql.org/docs/current/libpq-envars.html
Authentication                 https://www.postgresql.org/docs/current/client-authentication.html
SSL Support                    https://www.postgresql.org/docs/current/ssl-support.html
Connection Pooling            https://www.postgresql.org/docs/current/runtime-config-connection.html
```

---

## 🛠️ HERRAMIENTAS ÚTILES

### Para Testing Local

```bash
# Test HTTP Requests
curl https://artemania-back.onrender.com/

# Check DNS Resolution
nslookup artemania-back.onrender.com

# Check Certificate
openssl s_client -connect artemania-back.onrender.com:443

# Test Database Connection (si instalas psql)
psql "DATABASE_URL"
```

### Monitoreo y Logging

| Herramienta | Propósito | Link |
|-----------|----------|------|
| **Render Logs** | Ver logs de tu app | Dashboard Render |
| **Uptime Robot** | Monitoreo de disponibilidad | https://uptimerobot.com |
| **Better Stack** | Logging y monitoring | https://betterstack.com |
| **Sentry** | Error tracking | https://sentry.io |
| **DataDog** | Monitoring completo | https://datadoghq.com |

---

## 🐛 DEBUGGING TIPS

### Si el Backend no responde

```bash
# 1. Revisar logs en Render Dashboard
Render → artemania-back → Logs

# 2. Probar URL directamente
curl https://artemania-back.onrender.com/

# 3. Revisar base de datos
Render → artemania-db → Logs

# 4. Verificar variables de entorno
Render → artemania-back → Settings → Environment
```

### Si el Frontend no carga

```bash
# 1. Ver build logs
Render → artemania-front → Logs

# 2. Probar construcción local
cd front
npm install
npm run build

# 3. Ver si hay errores de build
npm run build 2>&1 | tail -50

# 4. Revisar archivo build
cat front/dist/front/browser/index.html
```

### Si CORS está fallando

```bash
# 1. Revisar variable CORS_ORIGINS
Render → artemania-back → Settings → Environment

# 2. Valor debe ser:
https://artemania-front.onrender.com

# 3. Si son múltiples dominios, separar con coma:
https://artemania-front.onrender.com,http://localhost:4200

# 4. Hacer redeploy del backend
Render → artemania-back → Deploy
```

### Si Base de Datos no conecta

```bash
# 1. Verificar DATABASE_URL en backend
Render → artemania-back → Settings → Environment

# 2. Copiar URL de la BD
Render → artemania-db → Connections → Internal Database URL

# 3. Pegar en artemania-back → DATABASE_URL

# 4. Asegurar URL incluya:
postgresql://user:pass@host:5432/database

# 5. NO usar Internal Database URL externa, usar INTERNA
```

---

## 📊 PERFORMANCE TIPS

### Frontend
- Usar `--prod` en build (ya lo haces)
- Lazy loading de módulos
- Optimizar imágenes
- Usar CDN para assets estáticos
- Minificar CSS/JS (Angular lo hace)

### Backend
- Pool de conexiones PostgreSQL
- Caché en endpoints que lo necesiten
- Compresión gzip
- Rate limiting
- Índices en BD para queries frecuentes

### General
- Usar HTTP/2 (Render lo proporciona)
- Enable gzip compression
- Set appropriate cache headers
- Use CDN para imágenes

---

## ✅ PREGUNTAS FRECUENTES

**P: ¿Cuánto cuesta Render?**
A: Gratis para aplicaciones pequeñas. A partir de $7/mes para mejor performance.

**P: ¿La BD se guarda si pago?**
A: Sí, todos los datos persisten. Free tier tiene 100GB/mes.

**P: ¿Puedo tener múltiples ambientes (dev, staging, prod)?**
A: Sí, crear múltiples Web Services / Databases.

**P: ¿Cómo hago backup de la BD?**
A: Render proporciona backups automáticos. O usar `pg_dump`:
```bash
pg_dump "DATABASE_URL" > backup.sql
```

**P: ¿Puedo usar dominio personalizado?**
A: Sí, en Settings → Custom Domain

**P: ¿Render cubre HTTPS?**
A: Sí, automáticamente con Let's Encrypt

**P: ¿Qué pasa si supero límites de Free Tier?**
A: Se pausa el servicio. Puedes upgradar en cualquier momento.

**P: ¿Puedo desplegar desde branch específica?**
A: Sí, en Settings de cada servicio.

---

## 🆘 SOPORTE

Si necesitas ayuda:

1. **Documentación Oficial**
   - Render: https://render.com/docs
   - Angular: https://angular.io/docs
   - NestJS: https://docs.nestjs.com

2. **Comunidades**
   - Stack Overflow: tag `render.com`
   - Reddit: r/webdev, r/learnprogramming
   - Discord: comunidades de Angular, NestJS

3. **Soporte Directo**
   - Render Dashboard: Chat support
   - GitHub Issues (para errores de dependencias)

---

## 🎓 PRÓXIMOS PASOS

Una vez que tengas todo funcionando en producción:

1. **Monitoreo**
   - Configurar Uptime Robot
   - Revisar logs regularmente

2. **Mejoras**
   - Agregar logging más detallado
   - Implementar rate limiting
   - Optimizar queries a BD

3. **Seguridad**
   - Configurar HTTPS (ya incluido)
   - Validar inputs
   - Usar HTTPS_ONLY en cookies
   - Implementar CSRF protection

4. **Escalabilidad**
   - Considerar caché (Redis)
   - Implementar CDN
   - Optimizar imágenes

---

**¡Felicidades! Tu aplicación está en PRODUCCIÓN. 🚀**

Cualquier duda, revisa la documentación o crea un issue en GitHub.
