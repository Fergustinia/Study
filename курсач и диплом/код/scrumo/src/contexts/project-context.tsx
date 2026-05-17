"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Project = {
  id: string;
  name: string;
  key: string;
};

type ContextType = {
  activeProject: Project | null;
  setActiveProject: (project: Project) => void;
};

const ProjectContext = createContext<ContextType | null>(null);

export function ProjectProvider({
  children,
  initialProject,
  projects,
}: {
  children: ReactNode;
  initialProject: Project | null;
  projects: Project[];
}) {
  const [activeProject, setActiveProject] =
    useState<Project | null>(initialProject);

  useEffect(() => {
    const saved = localStorage.getItem("activeProject");

    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as Project;
      const found = projects.find((project) => project.id === parsed.id);

      if (found) {
        setActiveProject(found);
      }
    } catch {
      localStorage.removeItem("activeProject");
    }
  }, [projects]);

  useEffect(() => {
    if (activeProject) {
      localStorage.setItem("activeProject", JSON.stringify(activeProject));
    }
  }, [activeProject]);

  return (
    <ProjectContext.Provider value={{ activeProject, setActiveProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);

  if (!ctx) {
    throw new Error("useProject must be used within ProjectProvider");
  }

  return ctx;
}
