import { Github, Linkedin, Mail } from "lucide-react";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const providers = [
  {
    id: "github",
    label: "Continuar con GitHub",
    icon: Github,
    enabled: Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET),
  },
  {
    id: "google",
    label: "Continuar con Google",
    icon: Mail,
    enabled: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
  },
  {
    id: "linkedin",
    label: "Continuar con LinkedIn",
    icon: Linkedin,
    enabled: Boolean(process.env.AUTH_LINKEDIN_ID && process.env.AUTH_LINKEDIN_SECRET),
  },
];

export default async function SignInPage() {
  const session = await auth();
  const enabledProviders = providers.filter((provider) => provider.enabled);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg items-center px-4 py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Ingresar a Skill Graph</CardTitle>
          <CardDescription>
            Usa OAuth para guardar tu progreso asociado a tu correo. En modo local, configura credenciales Auth.js en Vercel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {session?.user?.email ? (
            <p className="rounded-md bg-secondary/50 px-3 py-2 text-sm text-muted-foreground">
              Ya ingresaste como {session.user.email}.
            </p>
          ) : null}
          {enabledProviders.length > 0 ? (
            enabledProviders.map((provider) => (
              <Button asChild className="w-full" key={provider.id} variant="outline">
                <a href={`/api/auth/signin/${provider.id}?callbackUrl=/roadmap`}>
                  <provider.icon className="h-4 w-4" aria-hidden />
                  {provider.label}
                </a>
              </Button>
            ))
          ) : (
            <div className="space-y-3 rounded-md border bg-background/60 p-4 text-sm text-muted-foreground">
              <p>No hay providers OAuth configurados todavía.</p>
              <p>Agrega variables en Vercel para activar GitHub, Google o LinkedIn.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
