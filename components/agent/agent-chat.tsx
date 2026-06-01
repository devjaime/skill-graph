"use client";

import * as React from "react";
import { Bot, Send, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Source = {
  id: string;
  kind: string;
  title: string;
  url: string | null;
};

const roleOptions = [
  "Backend Engineer",
  "Data Engineer",
  "Cloud Engineer",
  "Frontend Engineer",
  "UX/UI Designer",
  "Product Owner",
  "Scrum Master",
  "Lider de Proyecto",
  "Developer/DevOps Agentic AI",
];

export function AgentChat() {
  const [role, setRole] = React.useState(roleOptions[0]);
  const [goal, setGoal] = React.useState("Encontrar mi ruta de aprendizaje con IA");
  const [weeklyHours, setWeeklyHours] = React.useState("4-6");
  const [input, setInput] = React.useState("Quiero una ruta de 6 semanas con ejercicios y certificaciones recomendadas.");
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hola. Soy el agente de rutas de Skill Graph. Dime tu rol actual, objetivo y tiempo semanal, y te propongo un camino con skills, ejercicios y fuentes.",
    },
  ]);
  const [sources, setSources] = React.useState<Source[]>([]);
  const [mode, setMode] = React.useState<"fallback" | "minimax" | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = input.trim();
    if (!message || isLoading) return;

    const nextMessages = [...messages, { role: "user" as const, content: message }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: messages,
          profile: { role, goal, weeklyHours },
        }),
      });
      const payload = (await response.json()) as {
        answer?: string;
        mode?: "fallback" | "minimax";
        sources?: Source[];
        error?: string;
      };

      setMessages([...nextMessages, { role: "assistant", content: payload.answer ?? payload.error ?? "No pude responder." }]);
      setSources(payload.sources ?? []);
      setMode(payload.mode ?? null);
    } catch (error) {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: error instanceof Error ? error.message : "Error inesperado al contactar el agente.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden />
            Perfil de aprendizaje
          </CardTitle>
          <CardDescription>El agente usa estos datos para recuperar rutas y ejercicios del roadmap.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="grid gap-2 text-sm">
            Rol actual
            <select className="h-10 rounded-md border bg-background px-3" value={role} onChange={(event) => setRole(event.target.value)}>
              {roleOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            Objetivo
            <input className="h-10 rounded-md border bg-background px-3" value={goal} onChange={(event) => setGoal(event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm">
            Horas por semana
            <input className="h-10 rounded-md border bg-background px-3" value={weeklyHours} onChange={(event) => setWeeklyHours(event.target.value)} />
          </label>
          <div className="rounded-md border bg-background/60 p-3 text-xs leading-5 text-muted-foreground">
            MiniMax se activa con `MINIMAX_API_KEY`. Sin key, se usa modo fallback con RAG local sobre `mock-data`.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" aria-hidden />
                Agente de rutas IA
              </CardTitle>
              <CardDescription>Orientador conversacional con RAG del roadmap, certificaciones y ejercicios.</CardDescription>
            </div>
            {mode ? <Badge variant={mode === "minimax" ? "default" : "secondary"}>{mode === "minimax" ? "MiniMax" : "Fallback"}</Badge> : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-[520px] space-y-3 overflow-y-auto rounded-lg border bg-background/50 p-3">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === "user" ? "ml-auto max-w-[85%]" : "mr-auto max-w-[90%]"}>
                <div className={message.role === "user" ? "rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground" : "rounded-lg bg-secondary/70 px-3 py-2 text-sm leading-6 text-foreground"}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {sources.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {sources.slice(0, 8).map((source) =>
                source.url ? (
                  <a className="rounded-md border px-2 py-1 text-xs text-primary hover:underline" href={source.url} key={source.id} rel="noreferrer" target="_blank">
                    {source.title}
                  </a>
                ) : (
                  <span className="rounded-md border px-2 py-1 text-xs text-muted-foreground" key={source.id}>
                    {source.title}
                  </span>
                ),
              )}
            </div>
          ) : null}

          <form className="flex gap-2" onSubmit={sendMessage}>
            <textarea
              className="min-h-16 flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm"
              onChange={(event) => setInput(event.target.value)}
              placeholder="Pregunta por una ruta, ejercicios o certificaciones..."
              value={input}
            />
            <Button className="h-auto self-stretch" disabled={isLoading} type="submit">
              <Send className="h-4 w-4" aria-hidden />
              Enviar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
