"use client";

import { useRouter } from "next/navigation";

import type { ProjectOption } from "@/lib/projects";

type Props = {
  projects: ProjectOption[];
  selectedProjectId: string;
  basePath: string;
  label?: string;
};

export function ProjectPageSelect({
  projects,
  selectedProjectId,
  basePath,
  label = "Проект",
}: Props) {
  const router = useRouter();

  return (
    <div className="space-y-2">
      <label htmlFor="projectId" className="text-sm font-medium">
        {label}
      </label>
      <select
        id="projectId"
        name="projectId"
        value={selectedProjectId}
        onChange={(event) => {
          router.push(`${basePath}?projectId=${event.target.value}`);
        }}
        className="flex h-10 min-w-[220px] rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
      >
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name} ({project.key})
          </option>
        ))}
      </select>
    </div>
  );
}
