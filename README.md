# 🚀 Marketia Funnel Pro - Sistema Completo de Embudos y Landings

**Versión:** 1.0.0  
**Última actualización:** 21 de septiembre de 2026

---

## 📋 Descripción

Sistema completo multi-usuario para crear, gestionar y publicar:
- **Embudos de venta interactivos** de 17 pasos con medios personalizados
- **Landings personales** con 5 variantes de diseño
- **Panel de administración** con gestión de usuarios, leads y métricas
- **Autenticación multi-proveedor** (Google OAuth + credenciales)
- **Gestión de medios** (imágenes, videos, audios)
- **Captura y exportación de leads**

---

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14.2.28** (App Router + React Server Components)
- **React 18**
- **TypeScript 5.6**
- **Tailwind CSS 3.4.17**
- **Framer Motion** (animaciones)
- **Lucide React** (iconos)

### Backend
- **Next.js API Routes**
- **Prisma ORM 6.2**
- **PostgreSQL** (base de datos)
- **NextAuth.js** (autenticación)

### DevOps
- **npm** como gestor de paquetes
- **ESLint** para linting
- **PostCSS** para procesamiento de CSS

---

## 📁 Estructura del Proyecto

```
marketia-funnel/
├── app/                          # App Router de Next.js
│   ├── api/                      # API Routes
│   │   ├── auth/[...nextauth]/   # NextAuth endpoints
│   │   ├── funnels/              # CRUD de embudos
│   │   ├── leads/                # Gestión de leads
│   │   └── users/                # Gestión de usuarios
│   ├── step/[id]/                # Vista pública del embudo (paso a paso)
│   ├── embudo/[username]/        # Embudo por username
│   ├── funnel/[username]/        # Alias de embudo
│   ├── agente/[username]/        # Landing personal
│   ├── dashboard/                # Panel de usuario
│   │   ├── funnels/              # Gestión de embudos
│   │   ├── landing/              # Editor de landing
│   │   └── config/               # Configuración de usuario
│   ├── admin/                    # Panel de administración
│   └── layout.tsx                # Layout principal
├── components/                   # Componentes React
│   ├── auth/                     # Componentes de autenticación
│   ├── dashboard/                # Componentes del dashboard
│   ├── embudo/                   # Componentes del embudo
│   ├── landing/                  # Componentes de landing
│   └── ui/                       # Componentes UI reutilizables
├── config/                       # Configuración
│   ├── funnel-config.ts          # Config de los 17 pasos del embudo
│   └── funnel-styles.ts          # Estilos por tipo de paso
├── lib/                          # Utilidades
│   ├── auth.ts                   # Configuración de NextAuth
│   ├── prisma.ts                 # Cliente de Prisma
│   └── utils.ts                  # Funciones auxiliares
├── prisma/                       # Esquema de base de datos
│   ├── schema.prisma             # Modelo de datos (13 tablas)
│   └── seed.ts                   # Datos iniciales
├── public/                       # Archivos estáticos
│   ├── logo-marketia-funnel.png  # Logo principal
│   └── funnel-hero.png           # Hero del landing
├── scripts/                      # Scripts de utilidad
│   ├── seed.ts                   # Seeding manual
│   └── safe-seed.ts              # Seeding seguro
├── types/                        # Tipos TypeScript
├── .env.example                  # Variables de entorno (plantilla)
├── next.config.ts                # Configuración de Next.js
├── tailwind.config.ts            # Configuración de Tailwind
├── tsconfig.json                 # Configuración de TypeScript
└── package.json                  # Dependencias
```

---

## 🗄️ Modelo de Datos (13 Tablas)

### 1. **users** - Usuarios del sistema
- `id`, `name`, `username`, `email`, `password`, `role`, `image`
- Roles: `user`, `admin`, `superadmin`
- Soft delete con `deletedAt`

### 2. **funnels** - Embudos
- `id`, `userId`, `title`, `slug`, `config` (JSON), `styles` (JSON)
- `isPublished`, `isDemo`, `createdAt`, `updatedAt`

### 3. **prospects** - Leads capturados en embudos
- `id`, `funnelId`, `name`, `phone`, `email`, `answers` (JSON)
- `createdAt`

### 4. **funnel_visits** - Registro de visitas
- `id`, `funnelId`, `step`, `sessionId`, `createdAt`

### 5. **landing_templates** - Plantillas de landing
- `id`, `name`, `config` (JSON)

### 6. **user_landings** - Landings personales de usuarios
- `id`, `userId`, `templateId`, `customConfig` (JSON)
- `isPublished`, `isDemo`

### 7. **landing_leads** - Leads de landings
- `id`, `landingId`, `name`, `email`, `phone`, `message`

### 8-10. **Cursos** (courses, course_modules, course_students)
- Sistema de cursos con módulos y seguimiento de estudiantes

### 11-12. **Email** (email_lists, email_contacts)
- Listas de correo y contactos

### 13. **app_settings** - Configuración global
- Ajustes del sistema

---

## 🚀 Instalación

### Requisitos Previos
- **Node.js 18+** y npm
- **PostgreSQL 14+**
- **Git**

### Paso 1: Clonar o descomprimir el proyecto
```bash
# Si tienes el ZIP:
unzip marketia_proyecto_completo.zip
cd marketia_proyecto_completo

# O si lo clonaste desde Git:
cd marketia-funnel
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Configurar variables de entorno
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env y configurar:
# - DATABASE_URL (conexión a PostgreSQL)
# - NEXTAUTH_SECRET (generar con: openssl rand -base64 32)
# - GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET (si usas OAuth)
```

**Ejemplo de DATABASE_URL:**
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/marketia_db?schema=public"
```

### Paso 4: Crear la base de datos
```bash
# Crear las tablas
npx prisma migrate deploy

# O si no hay migraciones previas:
npx prisma db push
```

### Paso 5: Poblar con datos iniciales
```bash
# Crear usuarios demo y embudo de ejemplo
npx prisma db seed

# O manualmente:
npm run seed
```

**Usuarios creados por el seed:**
- **Superadmin:** `onofre@marketia.live` / `password123`
- **Usuario Demo:** `raul@example.com` / `password123`

### Paso 6: Correr el proyecto
```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm run start
```

**URL de desarrollo:** http://localhost:3000

---

## 🔐 Configuración de Autenticación

### Google OAuth (Opcional)

1. **Ir a [Google Cloud Console](https://console.cloud.google.com/)**
2. **Crear un proyecto nuevo** o seleccionar uno existente
3. **Habilitar Google+ API**
4. **Ir a "Credenciales" → "Crear credenciales" → "ID de cliente de OAuth 2.0"**
5. **Configurar URI de redireccionamiento:**
   ```
   http://localhost:3000/api/auth/callback/google
   https://tudominio.com/api/auth/callback/google
   ```
6. **Copiar Client ID y Client Secret** a tu archivo `.env`:
   ```env
   GOOGLE_CLIENT_ID="tu_client_id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="tu_client_secret"
   ```

---

## 📱 Configuración de WhatsApp Business API (Opcional)

Para redirigir al usuario a WhatsApp al final del embudo:

1. **Obtener un token de WhatsApp Business API** desde [Meta for Developers](https://developers.facebook.com/apps/)
2. **Configurar en el panel de cada usuario:**
   - Ir a Dashboard → Configuración
   - Agregar número de WhatsApp (formato: +52XXXXXXXXXX)
   - Agregar token de API (si aplica)
3. **Variables de entorno (opcional):**
   ```env
   WHATSAPP_API_TOKEN="tu_token"
   WHATSAPP_PHONE_NUMBER_ID="tu_phone_number_id"
   ```

---

## 🎨 Personalización del Embudo

### Configuración de los 17 pasos
Editar `config/funnel-config.ts`:

```typescript
export const defaultFunnelConfig = {
  step1: {
    type: 'image',
    title: 'Bienvenido',
    subtitle: 'Tu mensaje aquí',
    media: '/ruta/a/imagen.jpg',
    // ...
  },
  // ... hasta step17
}
```

### Tipos de pasos disponibles:
- `image` - Foto con CTA
- `video` - Video reproductible
- `audio` - Audio con visualización de onda
- `text` - Texto enriquecido
- `form` - Formulario de captura
- `quiz` - Pregunta con opciones
- `swipe` - Transición con deslizar
- `terminal` - Animación tipo hacker
- `whatsapp` - Chat simulado de WhatsApp
- `calendar` - Agenda de citas

---

## 📊 Panel de Administración

### Acceder como Admin
1. **Login con usuario admin** (creado en el seed)
2. **Ir a `/admin`**

### Funcionalidades:
- ✅ Ver todos los usuarios
- ✅ Cambiar roles (user/admin/superadmin)
- ✅ Ver estadísticas globales
- ✅ Gestionar embudos de todos los usuarios
- ✅ Configuración global del sistema

---

## 📈 Gestión de Leads

### Exportar prospectos
1. **Dashboard → Mis Embudos → [Seleccionar embudo]**
2. **Pestaña "Prospectos"**
3. **Botón "Exportar CSV"**

### Estructura del CSV:
```csv
Nombre,Teléfono,Email,Respuestas,Fecha
Juan Pérez,+524451234567,juan@example.com,"Pregunta 1: Opción A",2026-09-21
```

---

## 🌐 Despliegue en Producción

### Opción 1: Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod

# Configurar variables de entorno en Vercel Dashboard
```

### Opción 2: VPS (Ubuntu/Debian)
```bash
# En tu servidor:
git clone [tu-repo]
cd marketia-funnel
npm install
npm run build

# Instalar PM2 para mantener el proceso corriendo
npm i -g pm2
pm2 start npm --name "marketia" -- start
pm2 save
pm2 startup
```

### Opción 3: Docker
```bash
# Crear Dockerfile (no incluido en este proyecto)
docker build -t marketia-funnel .
docker run -p 3000:3000 marketia-funnel
```

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar en modo desarrollo

# Producción
npm run build            # Compilar para producción
npm run start            # Iniciar servidor de producción

# Base de Datos
npx prisma studio        # Abrir GUI de Prisma
npx prisma migrate dev   # Crear nueva migración
npx prisma db seed       # Poblar BD con datos iniciales
npx prisma generate      # Regenerar cliente Prisma

# Linting
npm run lint             # Ejecutar ESLint
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
- Verificar que PostgreSQL esté corriendo
- Revisar `DATABASE_URL` en `.env`
- Probar conexión: `psql -U usuario -h localhost -d marketia_db`

### Error: "Module not found"
- Eliminar `node_modules` y reinstalar:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Error: "Prisma Client not found"
- Regenerar el cliente:
  ```bash
  npx prisma generate
  ```

### El embudo no se muestra
- Verificar que el embudo esté publicado (`isPublished = true`)
- Revisar que el slug o username sean correctos
- Ver logs en consola del navegador

---

## 📝 Notas Importantes

### Seguridad
- ⚠️ **Cambiar `NEXTAUTH_SECRET`** en producción
- ⚠️ **No subir `.env`** al repositorio
- ⚠️ **Usar HTTPS** en producción
- ⚠️ **Configurar CORS** si usas APIs externas

### Rendimiento
- ✅ Las imágenes en `/public` se sirven estáticamente
- ✅ Next.js hace SSR/SSG automáticamente
- ✅ Usar `next/image` para optimización de imágenes

### Base de Datos
- 💾 **Hacer backups regulares** de PostgreSQL
- 💾 Comando de backup:
  ```bash
  pg_dump -U usuario marketia_db > backup_$(date +%Y%m%d).sql
  ```

---

## 🤝 Soporte

**Desarrollado por:** Marketia Team  
**Email:** soporte@marketia.live  
**Documentación completa:** [Incluida en este README]

---

## 📜 Licencia

Proyecto propietario de Marketia. Todos los derechos reservados.

---

## 🎉 ¡Listo para Usar!

Una vez completados los pasos de instalación, tu sistema estará completamente funcional.

**Próximos pasos recomendados:**
1. ✅ Personalizar el embudo en `config/funnel-config.ts`
2. ✅ Subir tus propios medios (imágenes, videos, audios)
3. ✅ Configurar Google OAuth
4. ✅ Probar el embudo completo desde el paso 1 hasta el 17
5. ✅ Exportar tus primeros leads

**¡Mucho éxito! 🚀**
