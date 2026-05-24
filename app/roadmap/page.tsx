import { SkillRoadmap } from "@/components/roadmap/skill-roadmap";
import { certifications, learningPaths, resources, skills } from "@/lib/mock-data";

export default function RoadmapPage() {
  return (
    <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6">
      <SkillRoadmap skills={skills} paths={learningPaths} resources={resources} certifications={certifications} />
    </main>
  );
}
