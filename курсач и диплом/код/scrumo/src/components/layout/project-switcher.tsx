"use client";

import { useProject } from "@/contexts/project-context";

export function ProjectSwitcher({ projects }: { projects: any[] }) {
  const { activeProject, setActiveProject } = useProject();

  return (
    <div className="mb-4">
      <div className="text-xs text-gray-500 mb-1">Active project</div>

      <select
        className="w-full border rounded-md p-2 text-sm"
        value={activeProject?.id || ""}
        onChange={(e) => {
          const project = projects.find(
            (p) => p.id === e.target.value
          );
          if (project) setActiveProject(project);
        }}
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}