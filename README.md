# Skill Graph

MVP de una plataforma web en español para visualizar rutas de aprendizaje hacia AI Engineer, AI Platform Engineer y AI Architect.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- React Flow
- Route Handlers serverless
- Mock data deployable en Vercel

## Desarrollo

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Build

```bash
npm run build
```

## Deploy

El MVP está preparado para Vercel sin servicios pagos obligatorios. La persistencia real queda como trabajo futuro con PostgreSQL + pgvector y Auth.js.

## OAuth En Vercel

La app usa Auth.js y puede activar login con GitHub, Google y LinkedIn al configurar variables de entorno:

```bash
AUTH_SECRET=
AUTH_URL=https://tu-dominio.vercel.app
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_LINKEDIN_ID=
AUTH_LINKEDIN_SECRET=
```

Sin estas variables, el deploy sigue funcionando en modo MVP/local.

El progreso se guarda actualmente en `localStorage` asociado al correo autenticado o local. La persistencia multi-dispositivo queda preparada como siguiente paso con PostgreSQL.
