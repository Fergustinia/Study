"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Project = {
  id: string;
  name: string;
  key: string;
};

type ProjectContextType = {
  activeProject: Project | null;
  setActiveProject: (project: Project) => void;
};

const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({
  children,
  initialProject,
}: {
  children: React.ReactNode;
  initialProject: Project | null;
}) {
  const [activeProject, setActiveProject] = useState<Project | null>(
    initialProject
  );

  // optional: persist in localStorage
  useEffect(() => {
    if (activeProject) {
      localStorage.setItem(
        "activeProject",
        JSON.stringify(activeProject)
      );
    }
  }, [activeProject]);

  useEffect(() => {
    if (!activeProject) {
      const saved = localStorage.getItem("activeProject");
      if (saved) setActiveProject(JSON.parse(saved));
    }
  }, []);

  return (
    <ProjectContext.Provider
      value={{ activeProject, setActiveProject }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within ProjectProvider");
  return ctx;
}