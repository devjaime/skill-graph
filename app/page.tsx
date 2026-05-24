import Link from "next/link";
import { ArrowRight, BrainCircuit, CheckCircle2, Database, GitBranch, ServerCog } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { learningPaths, skills } from "@/lib/mock-data";

const valueProps = [
  "Roadmap interactivo por nodos",
  "Ejercicios prácticos por skill",
  "Certificaciones por proveedor",
  "Rutas por perfil y cloud",
  "Preparado para IA local, RAG y actualización semanal",
];

const futureItems = [
  "SQLite local hoy; PostgreSQL + pgvector mañana",
  "Auth.js / NextAuth para guardar progreso",
  "Ollama y embeddings open-source",
  "Jobs semanales con GitHub Actions",
];

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <Badge variant="amber">MVP en español para AI Engineering</Badge>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-normal text-foreground sm:text-6xl">
            AI Engineer Skill Graph
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-muted-foreground">
            Mapa vivo para evolucionar hacia AI Engineering.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            Una guía práctica y navegable para pasar de backend, data o cloud hacia AI Engineer, AI Platform Engineer o AI Architect, priorizando herramientas abiertas y deploy inicial en Vercel free tier.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/roadmap">
                Explorar roadmap
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/playground">Ver ejercicios</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card/70 p-4 shadow-2xl shadow-black/30">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Skill graph</p>
              <h2 className="text-lg font-semibold">Vista tipo roadmap</h2>
            </div>
            <GitBranch className="h-5 w-5 text-primary" aria-hidden />
          </div>
          <div className="grid gap-3">
            {skills.slice(0, 7).map((skill, index) => (
              <div key={skill.id} className="grid grid-cols-[32px_1fr] gap-3">
                <div className="flex flex-col items-center">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md border bg-background text-xs font-mono text-primary">
                    {index + 1}
                  </span>
                  {index < 6 ? <span className="h-8 w-px bg-border" /> : null}
                </div>
                <div className="rounded-lg border bg-background/60 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-medium">{skill.title}</h3>
                    <Badge variant="secondary">{skill.level}</Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{skill.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-card/30">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-5">
          {valueProps.map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" aria-hidden />
                Roadmap aplicable
              </CardTitle>
              <CardDescription>De conceptos a features con IA reales: LLMs, RAG, agentes, seguridad y operación.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{skills.length} skills iniciales con prerequisitos, ejercicios, recursos y certificaciones.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ServerCog className="h-5 w-5 text-primary" aria-hidden />
                Arquitectura serverless
              </CardTitle>
              <CardDescription>Next.js App Router, Route Handlers y mock data listos para reemplazar por persistencia.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Deploy inicial en Vercel sin requerir servicios comerciales obligatorios.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" aria-hidden />
                Preparado para crecer
              </CardTitle>
              <CardDescription>Persistencia SQLite local y ruta futura a PostgreSQL open-source con pgvector.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {futureItems.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {learningPaths.map((path) => (
            <Card key={path.id}>
              <CardHeader>
                <CardTitle>{path.title}</CardTitle>
                <CardDescription>{path.audience}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{path.skills.length} pasos recomendados</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
