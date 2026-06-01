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
- `/agent` provides a MiniMax-backed learning advisor with local RAG fallback.
- `lib/agent-rag.ts` is the current retrieval layer; keep it stateless for Vercel until Chroma/pgvector is configured.
- `lib/db.ts` is a future persistence seam for SQLite local development or PostgreSQL + pgvector.
- Keep Supabase, OpenAI, Gemini, Claude, and commercial APIs optional rather than required.

## Current Status

- Authentication: Auth.js route is present at `/api/auth/[...nextauth]`; providers activate only when Vercel env vars are configured.
- Progress: concept checkboxes are stored in browser `localStorage`, keyed by authenticated/local email.
- Newsletter: opt-in posts to `/api/newsletter`, currently mock-only and ready for persistence.
- Exercises: playground and per-skill exercises exist, but exercise submissions/status are not persisted yet.
- Agent: `/agent` calls `/api/agent`; when `MINIMAX_API_KEY` is set it calls MiniMax's OpenAI-compatible chat API, otherwise it uses a deterministic local RAG fallback.

## MiniMax Agent Env

```bash
MINIMAX_API_KEY=
MINIMAX_BASE_URL=https://api.minimax.io/v1
MINIMAX_MODEL=MiniMax-M2.7
```

MiniMax official docs describe the OpenAI-compatible text chat endpoint at `POST /v1/chat/completions`.

## RAG Direction

Current retrieval is lexical over `lib/mock-data.ts` for zero-cost Vercel deploys. The next production-grade step is adding one adapter behind the same retrieval interface:

- Chroma HTTP server or Chroma Cloud if an external vector service is acceptable.
- PostgreSQL + pgvector if we want one open-source DB for auth, progress, content, and vectors.
- Hosted vector DB only if the product later accepts a managed dependency.

## Future Work

- Replace local auth with Auth.js / NextAuth.
- Persist user progress and newsletter opt-ins in PostgreSQL.
- Add pgvector for semantic search.
- Add Chroma or pgvector adapter behind the same agent retrieval interface.
- Add weekly update jobs with GitHub Actions.
- Support local AI with Ollama and open embeddings such as BGE or Nomic Embed.
- Add import/export for roadmap JSON.
- Add routes under a Vocari domain or subdomain once the product direction is settled.
