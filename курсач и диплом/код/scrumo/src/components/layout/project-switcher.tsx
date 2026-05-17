"use client";

import { useProject, type Project } from "@/contexts/project-context";

type Props = {
  projects: Project[];
};

export function ProjectSwitcher({ projects }: Props) {
  const { activeProject, setActiveProject } = useProject();

  if (projects.length === 0) {
    return (
      <p className="mb-4 text-xs text-neutral-500">
        Нет проектов. Создайте проект в разделе Projects.
      </p>
    );
  }

  return (
    <div className="mb-4">
      <label
        htmlFor="active-project"
        className="mb-1 block text-xs font-medium text-neutral-500"
      >
        Активный проект
      </label>

      <select
        id="active-project"
        className="w-full rounded-lg border border-neutral-200 bg-white p-2 text-sm outline-none focus:border-neutral-400"
        value={activeProject?.id ?? ""}
        onChange={(event) => {
          const project = projects.find((item) => item.id === event.target.value);

          if (project) {
            setActiveProject(project);
          }
        }}
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
