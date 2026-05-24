import Link from "next/link";
import { GitBranch, Map, Trophy, FlaskConical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";

const navItems = [
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/certifications", label: "Certificaciones", icon: Trophy },
  { href: "/playground", label: "Playground", icon: FlaskConical },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 text-primary">
            <GitBranch className="h-5 w-5" aria-hidden />
          </span>
          <span className="hidden sm:inline">AI Engineer Skill Graph</span>
          <span className="sm:hidden">Skill Graph</span>
        </Link>
        <nav className="flex items-center gap-1">
          <ThemeSwitcher />
          {navItems.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm">
              <Link href={item.href}>
                <item.icon className="h-4 w-4" aria-hidden />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
