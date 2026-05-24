"use client";

import * as React from "react";
import { MonitorCog } from "lucide-react";

import { cn } from "@/lib/utils";

const themes = [
  { id: "dark-plus", label: "Dark+" },
  { id: "monokai", label: "Monokai" },
  { id: "dracula", label: "Dracula" },
  { id: "matrix", label: "Matrix" },
] as const;

type ThemeId = (typeof themes)[number]["id"];

function isThemeId(value: string | null): value is ThemeId {
  return themes.some((item) => item.id === value);
}

export function ThemeSwitcher() {
  const [theme, setTheme] = React.useState<ThemeId>("dark-plus");

  React.useEffect(() => {
    const storedTheme = window.localStorage.getItem("skill-graph-theme");
    const nextTheme = isThemeId(storedTheme) ? storedTheme : "dark-plus";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  function updateTheme(nextTheme: ThemeId) {
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("skill-graph-theme", nextTheme);
  }

  return (
    <div className="hidden items-center gap-2 rounded-lg border bg-card/80 p-1 md:flex">
      <MonitorCog className="ml-2 h-4 w-4 text-primary" aria-hidden />
      {themes.map((item) => (
        <button
          key={item.id}
          className={cn(
            "h-8 rounded-md px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
            theme === item.id && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          )}
          onClick={() => updateTheme(item.id)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
