# AI Engineer Skill Graph

## Project Goal

Build a Vercel-deployable MVP for an interactive Spanish roadmap that helps people grow into AI Engineer, AI Platform Engineer, or AI Architect roles.

## Current Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS v4
- shadcn-style local UI components
- React Flow via `@xyflow/react`
- Route Handlers for serverless mock APIs
- Mock data in `lib/mock-data.ts`
- Vercel free-tier friendly by default

## Local Commands

```bash
npm install
npm run dev
npm run build
```

## Important Notes

- The current MVP must run without paid services or required external APIs.
- Vercel deploy should not require a persistent filesystem database.
- Progress/authentication is currently local-browser based with `localStorage`.
- Auth.js is wired for GitHub, Google, and LinkedIn OAuth when the relevant `AUTH_*` environment variables exist.
- OAuth email is used as the local progress key and newsletter-interest key until server persistence is added.
- `lib/db.ts` is a future persistence seam for SQLite local development or PostgreSQL + pgvector.
- Keep Supabase, OpenAI, Gemini, Claude, and commercial APIs optional rather than required.

## Future Work

- Replace local auth with Auth.js / NextAuth.
- Persist user progress and newsletter opt-ins in PostgreSQL.
- Add pgvector for semantic search.
- Add weekly update jobs with GitHub Actions.
- Support local AI with Ollama and open embeddings such as BGE or Nomic Embed.
- Add import/export for roadmap JSON.
- Add routes under a Vocari domain or subdomain once the product direction is settled.
