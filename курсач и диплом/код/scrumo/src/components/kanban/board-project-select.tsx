"use client";

import { useRouter } from "next/navigation";

type ProjectOption = {
  id: string;
  name: string;
  key: string;
};

type BoardProjectSelectProps = {
  projects: ProjectOption[];
  selectedProjectId: string;
};

export function BoardProjectSelect({
  projects,
  selectedProjectId,
}: BoardProjectSelectProps) {
  const router = useRouter();

  return (
    <div className="space-y-2">
      <label htmlFor="projectId" className="text-sm font-medium">
        Проект
      </label>
      <select
        id="projectId"
        name="projectId"
        value={selectedProjectId}
        onChange={(event) => {
          router.push(`/board?projectId=${event.target.value}`);
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
