import { AgentChat } from "@/components/agent/agent-chat";

export default function AgentPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Agentic learning advisor</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Agente de rutas de aprendizaje</h1>
        <p className="mt-3 text-muted-foreground">
          Conversa con un agente conectado a MiniMax y a una base RAG del roadmap. En Vercel puede funcionar sin API key usando recuperación local.
        </p>
      </div>
      <AgentChat />
    </main>
  );
}
