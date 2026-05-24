import { auth } from "@/auth";
import { SkillRoadmap } from "@/components/roadmap/skill-roadmap";
import { certifications, learningPaths, resources, skills } from "@/lib/mock-data";

export default async function RoadmapPage() {
  const session = await auth();

  return (
    <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6">
      <SkillRoadmap
        authUser={
          session?.user?.email
            ? {
                email: session.user.email,
                image: session.user.image ?? null,
                name: session.user.name ?? session.user.email,
                provider: "oauth",
              }
            : null
        }
        skills={skills}
        paths={learningPaths}
        resources={resources}
        certifications={certifications}
      />
    </main>
  );
}
