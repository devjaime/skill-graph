import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    email?: string;
    name?: string;
    source?: string;
  };

  if (!payload.email || !payload.email.includes("@")) {
    return NextResponse.json({ error: "Email requerido" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    mode: "mock",
    message: "Interés registrado en modo MVP. TODO: persistir en PostgreSQL o proveedor de email.",
    data: {
      email: payload.email,
      name: payload.name ?? null,
      source: payload.source ?? "roadmap",
    },
  });
}
