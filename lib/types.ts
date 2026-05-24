export type SkillLevel = "beginner" | "intermediate" | "advanced";

export type ResourceType = "docs" | "course" | "repo" | "paper" | "video" | "blog";

export type CloudProvider = "gcp" | "aws" | "azure" | "local";

export type CloudMapping = {
  concept: string;
  gcp?: string;
  aws?: string;
  azure?: string;
  local?: string;
};

export type Skill = {
  id: string;
  title: string;
  slug: string;
  category: string;
  level: SkillLevel;
  description: string;
  whyItMatters: string;
  prerequisites: string[];
  learn: string[];
  exercises: string[];
  resources: string[];
  certifications: string[];
  cloudMappings: CloudMapping[];
  nextSkills: string[];
  position: {
    x: number;
    y: number;
  };
};

export type Certification = {
  id: string;
  name: string;
  provider: string;
  level: SkillLevel;
  url: string;
  recommendedFor: string[];
  relatedSkills: string[];
};

export type Resource = {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  provider: string;
  relatedSkills: string[];
  difficulty: SkillLevel;
};

export type LearningPath = {
  id: string;
  title: string;
  description: string;
  audience: string;
  skills: string[];
};

export type PlaygroundExercise = {
  id: string;
  title: string;
  level: SkillLevel;
  objective: string;
  deliverables: string[];
  stack: string[];
  relatedSkills: string[];
};
