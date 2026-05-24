import { ExternalLink, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { certifications } from "@/lib/mock-data";

const providers = Array.from(new Set(certifications.map((certification) => certification.provider)));

export default function CertificationsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 max-w-3xl">
        <Badge variant="amber">Certificaciones sugeridas</Badge>
        <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Certificaciones por proveedor</h1>
        <p className="mt-3 text-muted-foreground">
          Una selección inicial para orientar el aprendizaje. El roadmap no depende de certificaciones pagadas, pero las usa como señal de profundidad por rol.
        </p>
      </div>

      <div className="space-y-8">
        {providers.map((provider) => (
          <section key={provider}>
            <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
              <Trophy className="h-5 w-5 text-primary" aria-hidden />
              {provider}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {certifications
                .filter((certification) => certification.provider === provider)
                .map((certification) => (
                  <Card key={certification.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle>{certification.name}</CardTitle>
                        <Badge variant="secondary">{certification.level}</Badge>
                      </div>
                      <CardDescription>{certification.recommendedFor.join(" · ")}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {certification.relatedSkills.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <a className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline" href={certification.url} rel="noreferrer" target="_blank">
                        Ver certificación
                        <ExternalLink className="h-4 w-4" aria-hidden />
                      </a>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
