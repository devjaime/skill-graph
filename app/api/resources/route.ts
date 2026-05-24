import { NextResponse } from "next/server";

import { resources } from "@/lib/mock-data";

export function GET() {
  return NextResponse.json({
    data: resources,
    meta: {
      source: "mock",
      count: resources.length,
      todos: [
        "Indexar documentación pública respetando robots.txt.",
        "Crear job semanal con GitHub Actions.",
        "Agregar export/import del roadmap en JSON.",
        "Soportar embeddings locales con sentence-transformers, BGE o Nomic Embed.",
      ],
    },
  });
}
