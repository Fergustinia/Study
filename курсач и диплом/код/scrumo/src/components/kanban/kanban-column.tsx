"use client";

import { useDroppable } from "@dnd-kit/core";

import { TaskCard } from "@/components/kanban/task-card";
import type { KanbanTask, TaskStatus } from "@/types/task";
import { cn } from "@/lib/utils";

type KanbanColumnProps = {
  id: TaskStatus;
  title: string;
  tasks: KanbanTask[];
  activeTaskId: string | null;
};

export function KanbanColumn({
  id,
  title,
  tasks,
  activeTaskId,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex w-72 shrink-0 flex-col">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold">{title}</h2>
        <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-700">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-[420px] flex-1 flex-col gap-2 rounded-2xl border border-dashed bg-neutral-50/80 p-2 transition",
          isOver && "border-black/30 bg-neutral-100"
        )}
      >
        {tasks.length === 0 ? (
          <p className="px-2 py-6 text-center text-xs text-neutral-400">
            Перетащите задачу сюда
          </p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isDragging={activeTaskId === task.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
