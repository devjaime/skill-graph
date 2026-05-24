"use client";

import * as React from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
  Position,
  Handle,
} from "@xyflow/react";
import { CheckCircle2, Cloud, ExternalLink, Filter, LockKeyhole, LogOut, Route, Save, Search, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Certification, LearningPath, Resource, Skill, SkillLevel } from "@/lib/types";
import { categories, levels } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type SkillNodeData = {
  skill: Skill;
  selected: boolean;
  completed: boolean;
};

type LevelNodeData = {
  label: string;
};

const levelLabel: Record<SkillLevel, string> = {
  beginner: "Inicial",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

const levelClass: Record<SkillLevel, string> = {
  beginner: "border-teal-400/40 bg-teal-400/10 text-teal-200",
  intermediate: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  advanced: "border-rose-400/40 bg-rose-400/10 text-rose-200",
};

const tieredLayout: Record<string, { x: number; y: number }> = {
  "intro-ai-engineering": { x: 40, y: 40 },
  "python-ai": { x: 340, y: 40 },
  "llm-inference": { x: 640, y: 40 },
  "prompt-engineering": { x: 940, y: 40 },
  "backend-ai": { x: 40, y: 330 },
  embeddings: { x: 340, y: 330 },
  "vector-databases": { x: 640, y: 330 },
  rag: { x: 940, y: 330 },
  "ai-safety": { x: 1240, y: 330 },
  "agents-mcp": { x: 340, y: 620 },
  llmops: { x: 640, y: 620 },
  "cloud-ai": { x: 940, y: 620 },
  "ai-architectures": { x: 1240, y: 620 },
};

function SkillNode({ data }: NodeProps<Node<SkillNodeData>>) {
  const skill = data.skill;

  return (
    <div
      className={cn(
        "w-[230px] rounded-lg border bg-card/95 p-3 shadow-[0_0_28px_rgba(0,0,0,0.22)] transition-colors",
        data.completed ? "border-primary bg-primary/10" : data.selected ? "border-primary ring-2 ring-primary/35" : "border-border",
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-primary" />
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{skill.category}</p>
          <h3 className="mt-1 text-sm font-semibold leading-tight">{skill.title}</h3>
        </div>
        <Badge className={cn("shrink-0", levelClass[skill.level])} variant="outline">
          {levelLabel[skill.level]}
        </Badge>
      </div>
      <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">{skill.description}</p>
      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{data.completed ? "completado" : `${skill.exercises.length} ejercicios`}</span>
        <span>{skill.nextSkills.length} siguientes</span>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-primary" />
    </div>
  );
}

function LevelNode({ data }: NodeProps<Node<LevelNodeData>>) {
  return (
    <div className="w-[120px] rounded-md border border-dashed bg-background/80 px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {data.label}
    </div>
  );
}

const nodeTypes = {
  skill: SkillNode,
  level: LevelNode,
};

function buildEdges(skills: Skill[]): Edge[] {
  return skills.flatMap((skill) =>
    skill.nextSkills.map((nextSkill) => ({
      id: `${skill.id}-${nextSkill}`,
      source: skill.id,
      target: nextSkill,
      animated: true,
      style: { stroke: "var(--terminal-line)" },
    })),
  );
}

export function SkillRoadmap({
  skills,
  paths,
  resources,
  certifications,
}: {
  skills: Skill[];
  paths: LearningPath[];
  resources: Resource[];
  certifications: Certification[];
}) {
  const [selectedSkillId, setSelectedSkillId] = React.useState(skills[0]?.id);
  const [category, setCategory] = React.useState("Todas");
  const [level, setLevel] = React.useState<SkillLevel | "Todos">("Todos");
  const [cloud, setCloud] = React.useState("Todos");
  const [pathId, setPathId] = React.useState("all");
  const [user, setUser] = React.useState<LocalUser | null>(null);
  const [progress, setProgress] = React.useState<Record<string, string[]>>({});

  React.useEffect(() => {
    const storedUser = readLocalUser();
    setUser(storedUser);
    setProgress(storedUser ? readProgress(storedUser.email) : {});
  }, []);

  const completedSkillIds = React.useMemo(() => {
    return new Set(
      skills
        .filter((skill) => {
          const checked = progress[skill.id] ?? [];
          return skill.learn.length > 0 && skill.learn.every((item) => checked.includes(item));
        })
        .map((skill) => skill.id),
    );
  }, [progress, skills]);

  const selectedPath = paths.find((path) => path.id === pathId);

  const filteredSkills = React.useMemo(() => {
    return skills.filter((skill) => {
      const matchesPath = !selectedPath || selectedPath.skills.includes(skill.id);
      const matchesCategory = category === "Todas" || skill.category === category;
      const matchesLevel = level === "Todos" || skill.level === level;
      const matchesCloud =
        cloud === "Todos" ||
        skill.cloudMappings.some((mapping) => {
          const value = cloud.toLowerCase() as "gcp" | "aws" | "azure" | "local";
          return Boolean(mapping[value]);
        });

      return matchesPath && matchesCategory && matchesLevel && matchesCloud;
    });
  }, [category, cloud, level, selectedPath, skills]);

  const visibleIds = new Set(filteredSkills.map((skill) => skill.id));
  const selectedSkill = skills.find((skill) => skill.id === selectedSkillId) ?? filteredSkills[0] ?? skills[0];

  const nodes: Array<Node<SkillNodeData> | Node<LevelNodeData>> = [
    { id: "level-beginner", type: "level", position: { x: -130, y: 70 }, data: { label: "Inicial" }, selectable: false, draggable: false },
    { id: "level-intermediate", type: "level", position: { x: -130, y: 360 }, data: { label: "Intermedio" }, selectable: false, draggable: false },
    { id: "level-advanced", type: "level", position: { x: -130, y: 650 }, data: { label: "Avanzado" }, selectable: false, draggable: false },
    ...filteredSkills.map((skill) => ({
      id: skill.id,
      type: "skill",
      position: tieredLayout[skill.id] ?? skill.position,
      data: { skill, selected: skill.id === selectedSkill?.id, completed: completedSkillIds.has(skill.id) },
    })),
  ];

  const edges = buildEdges(skills).filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target));

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="min-h-[900px] overflow-hidden rounded-lg border bg-card/40">
        <div className="flex flex-col gap-3 border-b bg-background/60 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <Filter className="h-4 w-4" aria-hidden />
              Filtros del mapa
            </p>
            <h1 className="mt-1 text-xl font-semibold">Roadmap interactivo en español</h1>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <select className="h-9 rounded-md border bg-background px-3 text-sm" value={pathId} onChange={(event) => setPathId(event.target.value)}>
              <option value="all">Todas las rutas</option>
              {paths.map((path) => (
                <option key={path.id} value={path.id}>
                  {path.title}
                </option>
              ))}
            </select>
            <select className="h-9 rounded-md border bg-background px-3 text-sm" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option>Todas</option>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select className="h-9 rounded-md border bg-background px-3 text-sm" value={level} onChange={(event) => setLevel(event.target.value as SkillLevel | "Todos")}>
              <option>Todos</option>
              {levels.map((item) => (
                <option key={item} value={item}>
                  {levelLabel[item]}
                </option>
              ))}
            </select>
            <select className="h-9 rounded-md border bg-background px-3 text-sm" value={cloud} onChange={(event) => setCloud(event.target.value)}>
              <option>Todos</option>
              <option>GCP</option>
              <option>AWS</option>
              <option>Azure</option>
              <option>Local</option>
            </select>
          </div>
        </div>

        {selectedPath ? (
          <div className="border-b bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{selectedPath.title}:</span> {selectedPath.description}
          </div>
        ) : null}

        <div className="h-[820px]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => setSelectedSkillId(node.id)}
            fitView
            fitViewOptions={{ padding: 0.12 }}
            minZoom={0.25}
            maxZoom={1.2}
          >
            <Background gap={24} color="rgba(148, 163, 184, 0.18)" />
            <Controls />
            <MiniMap nodeColor="hsl(var(--primary))" maskColor="rgba(2, 6, 23, 0.68)" pannable zoomable />
          </ReactFlow>
        </div>
      </section>

      <aside className="space-y-4">
        <ProgressPanel
          completedCount={completedSkillIds.size}
          onLogin={(nextUser) => {
            setUser(nextUser);
            setProgress(readProgress(nextUser.email));
          }}
          onLogout={() => {
            window.localStorage.removeItem(USER_STORAGE_KEY);
            setUser(null);
            setProgress({});
          }}
          totalCount={skills.length}
          user={user}
        />
        <SkillDetail
          certifications={certifications}
          onToggleLearn={(item) => {
            if (!user) return;
            setProgress((current) => {
              const currentItems = current[selectedSkill.id] ?? [];
              const nextItems = currentItems.includes(item)
                ? currentItems.filter((currentItem) => currentItem !== item)
                : [...currentItems, item];
              const nextProgress = { ...current, [selectedSkill.id]: nextItems };
              writeProgress(user.email, nextProgress);
              return nextProgress;
            });
          }}
          progressItems={progress[selectedSkill.id] ?? []}
          resources={resources}
          skill={selectedSkill}
          user={user}
        />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-4 w-4 text-primary" aria-hidden />
              Rutas predefinidas
            </CardTitle>
            <CardDescription>Selecciona una ruta para resaltar solo sus nodos.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {paths.map((path) => (
              <Button
                key={path.id}
                className="h-auto justify-start whitespace-normal px-3 py-2 text-left"
                variant={path.id === pathId ? "default" : "outline"}
                onClick={() => setPathId(path.id)}
              >
                {path.title}
              </Button>
            ))}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

type LocalUser = {
  name: string;
  email: string;
};

const USER_STORAGE_KEY = "skill-graph-user";

function readLocalUser() {
  try {
    const value = window.localStorage.getItem(USER_STORAGE_KEY);
    return value ? (JSON.parse(value) as LocalUser) : null;
  } catch {
    return null;
  }
}

function readProgress(email: string) {
  try {
    const value = window.localStorage.getItem(`skill-graph-progress:${email}`);
    return value ? (JSON.parse(value) as Record<string, string[]>) : {};
  } catch {
    return {};
  }
}

function writeProgress(email: string, progress: Record<string, string[]>) {
  window.localStorage.setItem(`skill-graph-progress:${email}`, JSON.stringify(progress));
}

function ProgressPanel({
  completedCount,
  onLogin,
  onLogout,
  totalCount,
  user,
}: {
  completedCount: number;
  onLogin: (user: LocalUser) => void;
  onLogout: () => void;
  totalCount: number;
  user: LocalUser | null;
}) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const percentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  if (user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-primary" aria-hidden />
            Tu avance
          </CardTitle>
          <CardDescription>{user.name} · {user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{completedCount} de {totalCount} skills completos</span>
            <span>{percentage}%</span>
          </div>
          <Button className="w-full" onClick={onLogout} variant="outline">
            <LogOut className="h-4 w-4" aria-hidden />
            Cerrar sesión local
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LockKeyhole className="h-4 w-4 text-primary" aria-hidden />
          Registro local
        </CardTitle>
        <CardDescription>Guarda checks de avance en este navegador. TODO: migrar a Auth.js + base de datos.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <input className="h-10 w-full rounded-md border bg-background px-3 text-sm" onChange={(event) => setName(event.target.value)} placeholder="Nombre" value={name} />
        <input className="h-10 w-full rounded-md border bg-background px-3 text-sm" onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" value={email} />
        <Button
          className="w-full"
          disabled={!name.trim() || !email.includes("@")}
          onClick={() => {
            const nextUser = { name: name.trim(), email: email.trim().toLowerCase() };
            window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
            onLogin(nextUser);
          }}
        >
          <Save className="h-4 w-4" aria-hidden />
          Crear cuenta local
        </Button>
      </CardContent>
    </Card>
  );
}

function SkillDetail({
  certifications,
  onToggleLearn,
  progressItems,
  resources,
  skill,
  user,
}: {
  certifications: Certification[];
  onToggleLearn: (item: string) => void;
  progressItems: string[];
  resources: Resource[];
  skill: Skill;
  user: LocalUser | null;
}) {
  const linkedResources = skill.resources.map((item) => ({
    label: item,
    resource: findByLabel(resources, item, "title"),
  }));
  const linkedCertifications = skill.certifications.map((item) => ({
    label: item,
    certification: findByLabel(certifications, item, "name"),
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardDescription>{skill.category}</CardDescription>
            <CardTitle className="mt-1 text-xl">{skill.title}</CardTitle>
          </div>
          <Badge className={levelClass[skill.level]} variant="outline">
            {levelLabel[skill.level]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-6 text-muted-foreground">{skill.description}</p>

        <DetailBlock title="Por qué importa" items={[skill.whyItMatters]} icon={<Search className="h-4 w-4" />} />
        <LearnBlock disabled={!user} items={skill.learn} onToggle={onToggleLearn} selectedItems={progressItems} />
        <DetailBlock title="Ejercicios" items={skill.exercises} icon={<CheckCircle2 className="h-4 w-4" />} />
        <LinkedBlock items={linkedResources} title="Fuentes y recursos" />
        <LinkedCertificationBlock items={linkedCertifications} />

        <div>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Cloud className="h-4 w-4 text-primary" aria-hidden />
            Servicios equivalentes
          </h3>
          <div className="space-y-3">
            {skill.cloudMappings.map((mapping) => (
              <div key={mapping.concept} className="rounded-lg border bg-background/50 p-3 text-xs">
                <p className="mb-2 font-medium text-foreground">{mapping.concept}</p>
                <div className="grid gap-1 text-muted-foreground">
                  {mapping.gcp ? <span>GCP: {mapping.gcp}</span> : null}
                  {mapping.aws ? <span>AWS: {mapping.aws}</span> : null}
                  {mapping.azure ? <span>Azure: {mapping.azure}</span> : null}
                  {mapping.local ? <span>Local/open-source: {mapping.local}</span> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function normalizeLabel(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function findByLabel<T extends Record<K, string>, K extends keyof T>(items: T[], label: string, key: K) {
  const normalizedLabel = normalizeLabel(label);
  return items.find((item) => {
    const normalizedItem = normalizeLabel(item[key]);
    return normalizedItem === normalizedLabel || normalizedItem.includes(normalizedLabel) || normalizedLabel.includes(normalizedItem);
  });
}

function LearnBlock({
  disabled,
  items,
  onToggle,
  selectedItems,
}: {
  disabled: boolean;
  items: string[];
  onToggle: (item: string) => void;
  selectedItems: string[];
}) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="text-primary"><CheckCircle2 className="h-4 w-4" /></span>
        Qué aprender
      </h3>
      {disabled ? <p className="mb-2 text-xs text-muted-foreground">Crea una cuenta local para marcar conceptos aprendidos.</p> : null}
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((item) => {
          const checked = selectedItems.includes(item);
          return (
            <li key={item}>
              <label className={cn("flex items-center gap-2 rounded-md bg-secondary/40 px-3 py-2 leading-5", disabled ? "opacity-70" : "cursor-pointer")}>
                <input checked={checked} className="h-4 w-4 accent-primary" disabled={disabled} onChange={() => onToggle(item)} type="checkbox" />
                <span className={cn(checked && "text-foreground line-through decoration-primary")}>{item}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function LinkedBlock({ items, title }: { items: Array<{ label: string; resource?: Resource }>; title: string }) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="text-primary"><Search className="h-4 w-4" /></span>
        {title}
      </h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map(({ label, resource }) => (
          <li key={label} className="rounded-md bg-secondary/40 px-3 py-2 leading-5">
            {resource ? (
              <a className="inline-flex items-center gap-2 text-primary hover:underline" href={resource.url} rel="noreferrer" target="_blank">
                {label}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            ) : (
              <span>{label}</span>
            )}
            {resource ? <p className="mt-1 text-xs text-muted-foreground">Fuente: {resource.provider} · {resource.type} · {resource.difficulty}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LinkedCertificationBlock({ items }: { items: Array<{ label: string; certification?: Certification }> }) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="text-primary"><CheckCircle2 className="h-4 w-4" /></span>
        Certificaciones
      </h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map(({ label, certification }) => (
          <li key={label} className="rounded-md bg-secondary/40 px-3 py-2 leading-5">
            {certification ? (
              <a className="inline-flex items-center gap-2 text-primary hover:underline" href={certification.url} rel="noreferrer" target="_blank">
                {label}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            ) : (
              <span>{label}</span>
            )}
            {certification ? <p className="mt-1 text-xs text-muted-foreground">Proveedor: {certification.provider} · nivel {certification.level}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DetailBlock({ title, items, icon }: { title: string; items: string[]; icon: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="text-primary">{icon}</span>
        {title}
      </h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="rounded-md bg-secondary/40 px-3 py-2 leading-5">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
