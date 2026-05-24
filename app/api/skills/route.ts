import { NextResponse } from "next/server";

import { skills } from "@/lib/mock-data";

export function GET() {
  return NextResponse.json({
    data: skills,
    meta: {
      source: "mock",
      count: skills.length,
      todos: [
        "Conectar repositorio SQLite/Drizzle como fuente editable.",
        "Migrar a PostgreSQL + pgvector para búsqueda semántica.",
        "Guardar progreso por usuario con Auth.js / NextAuth.",
      ],
    },
  });
}
