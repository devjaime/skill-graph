import { certifications, learningPaths, playgroundExercises, resources, skills } from "@/lib/mock-data";

export type RoadmapDocument = {
  id: string;
  kind: "skill" | "path" | "resource" | "certification" | "exercise";
  title: string;
  text: string;
  url?: string;
};

export type RetrievedContext = RoadmapDocument & {
  score: number;
};

const documents: RoadmapDocument[] = [
  ...skills.map((skill) => ({
    id: skill.id,
    kind: "skill" as const,
    title: skill.title,
    text: [
      `Categoria: ${skill.category}`,
      `Nivel: ${skill.level}`,
      skill.description,
      `Por que importa: ${skill.whyItMatters}`,
      `Prerequisitos: ${skill.prerequisites.join(", ")}`,
      `Que aprender: ${skill.learn.join(", ")}`,
      `Ejercicios: ${skill.exercises.join(", ")}`,
      `Recursos: ${skill.resources.join(", ")}`,
      `Certificaciones: ${skill.certifications.join(", ")}`,
      `Siguientes skills: ${skill.nextSkills.join(", ")}`,
    ].join("\n"),
  })),
  ...learningPaths.map((path) => ({
    id: path.id,
    kind: "path" as const,
    title: path.title,
    text: [`Audiencia: ${path.audience}`, path.description, `Skills: ${path.skills.join(", ")}`].join("\n"),
  })),
  ...resources.map((resource) => ({
    id: resource.id,
    kind: "resource" as const,
    title: resource.title,
    text: [`Tipo: ${resource.type}`, `Proveedor: ${resource.provider}`, `Dificultad: ${resource.difficulty}`, `Skills: ${resource.relatedSkills.join(", ")}`].join("\n"),
    url: resource.url,
  })),
  ...certifications.map((certification) => ({
    id: certification.id,
    kind: "certification" as const,
    title: certification.name,
    text: [`Proveedor: ${certification.provider}`, `Nivel: ${certification.level}`, `Recomendado para: ${certification.recommendedFor.join(", ")}`, `Skills: ${certification.relatedSkills.join(", ")}`].join("\n"),
    url: certification.url,
  })),
  ...playgroundExercises.map((exercise) => ({
    id: exercise.id,
    kind: "exercise" as const,
    title: exercise.title,
    text: [`Nivel: ${exercise.level}`, exercise.objective, `Entregables: ${exercise.deliverables.join(", ")}`, `Stack: ${exercise.stack.join(", ")}`, `Skills: ${exercise.relatedSkills.join(", ")}`].join("\n"),
  })),
];

const roleAliases: Record<string, string[]> = {
  backend: ["backend", "api", "serverless", "fastapi", "route handlers"],
  data: ["data", "postgresql", "vector", "embeddings", "rag"],
  cloud: ["cloud", "platform", "gcp", "aws", "azure", "llmops"],
  frontend: ["frontend", "react", "ui", "streaming", "interfaces"],
  ux: ["ux", "ui", "research", "designer", "figma"],
  po: ["product", "owner", "manager", "discovery", "prd"],
  scrum: ["scrum", "delivery", "liderazgo", "proyecto", "governance"],
  agentic: ["agentic", "agentes", "mcp", "tools", "github", "sdlc"],
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenize(value: string) {
  return normalize(value)
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

export function retrieveRoadmapContext(query: string, limit = 8): RetrievedContext[] {
  const queryTokens = tokenize(expandQuery(query));
  const querySet = new Set(queryTokens);

  return documents
    .map((document) => {
      const titleTokens = tokenize(document.title);
      const bodyTokens = tokenize(document.text);
      const bodySet = new Set(bodyTokens);
      const titleScore = titleTokens.reduce((score, token) => score + (querySet.has(token) ? 4 : 0), 0);
      const bodyScore = queryTokens.reduce((score, token) => score + (bodySet.has(token) ? 1 : 0), 0);
      const kindBoost = document.kind === "path" ? 2 : document.kind === "skill" ? 1.5 : 1;

      return {
        ...document,
        score: (titleScore + bodyScore) * kindBoost,
      };
    })
    .filter((document) => document.score > 0)
    .sort((first, second) => second.score - first.score)
    .slice(0, limit);
}

export function formatContextsForPrompt(contexts: RetrievedContext[]) {
  return contexts
    .map((context, index) => {
      return `[${index + 1}] ${context.kind.toUpperCase()}: ${context.title}\n${context.text}${context.url ? `\nURL: ${context.url}` : ""}`;
    })
    .join("\n\n");
}

export function fallbackAgentAnswer(message: string, contexts: RetrievedContext[]) {
  const topSkills = contexts.filter((context) => context.kind === "skill").slice(0, 4);
  const topPaths = contexts.filter((context) => context.kind === "path").slice(0, 2);
  const topExercises = contexts.filter((context) => context.kind === "exercise").slice(0, 2);

  return [
    "Puedo orientarte con el roadmap aun sin MiniMax configurado.",
    "",
    topPaths.length > 0 ? `Ruta sugerida: ${topPaths.map((path) => path.title).join(" o ")}.` : "Ruta sugerida: parte por Fundamentos de IA y luego filtra por tu rol.",
    topSkills.length > 0 ? `Skills prioritarios: ${topSkills.map((skill) => skill.title).join(" -> ")}.` : "",
    topExercises.length > 0 ? `Ejercicios recomendados: ${topExercises.map((exercise) => exercise.title).join(" y ")}.` : "",
    "",
    `Siguiente paso: dime tu rol actual, tiempo semanal disponible y objetivo. Pregunta recibida: "${message}"`,
  ]
    .filter(Boolean)
    .join("\n");
}

function expandQuery(query: string) {
  const normalized = normalize(query);
  const aliases = Object.entries(roleAliases)
    .filter(([role, terms]) => normalized.includes(role) || terms.some((term) => normalized.includes(term)))
    .flatMap(([, terms]) => terms)
    .join(" ");

  return `${query} ${aliases}`;
}

// TODO: Add a Chroma HTTP adapter once CHROMA_URL/CHROMA_API_KEY exist.
// The current lexical retriever is stateless and Vercel-safe; it mirrors the same interface a vector retriever should expose.
