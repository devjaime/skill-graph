import { FlaskConical, TerminalSquare } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { playgroundExercises } from "@/lib/mock-data";

export default function PlaygroundPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 max-w-3xl">
        <Badge variant="amber">Playground inicial</Badge>
        <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Ejercicios prácticos para construir criterio</h1>
        <p className="mt-3 text-muted-foreground">
          Actividades pequeñas pero realistas para transformar el roadmap en evidencia de aprendizaje. En siguientes versiones podrán generar issues, rúbricas y rutas personalizadas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {playgroundExercises.map((exercise) => (
          <Card key={exercise.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-primary" aria-hidden />
                  {exercise.title}
                </CardTitle>
                <Badge variant="secondary">{exercise.level}</Badge>
              </div>
              <CardDescription>{exercise.objective}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h2 className="mb-2 text-sm font-semibold">Entregables</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {exercise.deliverables.map((item) => (
                    <li key={item} className="rounded-md bg-secondary/40 px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <TerminalSquare className="h-4 w-4 text-primary" aria-hidden />
                  Stack sugerido
                </h2>
                <div className="flex flex-wrap gap-2">
                  {exercise.stack.map((item) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
