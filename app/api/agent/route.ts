import { NextResponse } from "next/server";

import { fallbackAgentAnswer, formatContextsForPrompt, retrieveRoadmapContext } from "@/lib/agent-rag";

type AgentMessage = {
  role: "user" | "assistant";
  content: string;
};

type AgentRequest = {
  message?: string;
  history?: AgentMessage[];
  profile?: {
    role?: string;
    goal?: string;
    weeklyHours?: string;
  };
};

export async function POST(request: Request) {
  const body = (await request.json()) as AgentRequest;
  const message = body.message?.trim();

  if (!message) {
    return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 });
  }

  const profileContext = [
    body.profile?.role ? `Rol actual: ${body.profile.role}` : null,
    body.profile?.goal ? `Objetivo: ${body.profile.goal}` : null,
    body.profile?.weeklyHours ? `Horas semanales: ${body.profile.weeklyHours}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const contexts = retrieveRoadmapContext(`${profileContext}\n${message}`);
  const sources = contexts.map((context) => ({
    id: context.id,
    kind: context.kind,
    title: context.title,
    url: context.url ?? null,
  }));

  if (!process.env.MINIMAX_API_KEY) {
    return NextResponse.json({
      answer: fallbackAgentAnswer(message, contexts),
      mode: "fallback",
      sources,
    });
  }

  try {
    const answer = await callMiniMax({
      contexts: formatContextsForPrompt(contexts),
      history: body.history ?? [],
      message,
      profileContext,
    });

    return NextResponse.json({
      answer,
      mode: "minimax",
      sources,
    });
  } catch (error) {
    return NextResponse.json({
      answer: `${fallbackAgentAnswer(message, contexts)}\n\nNota tecnica: MiniMax no respondio correctamente, asi que use el fallback local del roadmap.`,
      mode: "fallback",
      sources,
      warning: error instanceof Error ? error.message : "MiniMax unavailable",
    });
  }
}

async function callMiniMax({
  contexts,
  history,
  message,
  profileContext,
}: {
  contexts: string;
  history: AgentMessage[];
  message: string;
  profileContext: string;
}) {
  const baseUrl = process.env.MINIMAX_BASE_URL ?? "https://api.minimax.io/v1";
  const model = process.env.MINIMAX_MODEL ?? "MiniMax-M2.7";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MINIMAX_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_completion_tokens: 900,
      messages: [
        {
          role: "system",
          name: "SkillGraphAgent",
          content:
            "Eres un agente orientador de aprendizaje de AI Engineer Skill Graph en español. Recomiendas rutas concretas por rol, priorizas pasos accionables, ejercicios y certificaciones. Usa solo el contexto RAG entregado. Si falta informacion, pregunta una cosa breve al final.",
        },
        {
          role: "system",
          name: "RoadmapRAG",
          content: `Perfil del usuario:\n${profileContext || "No especificado"}\n\nContexto recuperado del roadmap:\n${contexts}`,
        },
        ...history.slice(-8),
        {
          role: "user",
          content: message,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`MiniMax error ${response.status}: ${errorText.slice(0, 500)}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  return payload.choices?.[0]?.message?.content ?? "No pude generar respuesta con MiniMax. Intenta reformular la pregunta.";
}
