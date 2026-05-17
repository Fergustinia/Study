"use client";

import Link from "next/link";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { getPriorityClasses, getPriorityLabel, type KanbanTask } from "@/types/task";
import { cn } from "@/lib/utils";

type TaskCardProps = {
  task: KanbanTask;
  isDragging?: boolean;
};

export function TaskCard({ task, isDragging }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-xl border bg-white p-3 shadow-sm transition",
        isDragging && "opacity-50 ring-2 ring-black/10"
      )}
    >
      <button
        type="button"
        className="mb-2 cursor-grab text-neutral-400 active:cursor-grabbing"
        {...listeners}
        {...attributes}
        aria-label="Перетащить задачу"
      >
        ⋮⋮
      </button>

      <Link
        href={`/projects/${task.projectId}/tasks/${task.id}/edit`}
        className="block font-medium leading-snug transition hover:text-neutral-600"
      >
        {task.title}
      </Link>

      {task.description ? (
        <p className="mt-1 line-clamp-2 text-xs text-neutral-500">
          {task.description}
        </p>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-2">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-medium",
            getPriorityClasses(task.priority)
          )}
        >
          {getPriorityLabel(task.priority)}
        </span>
        {task.storyPoints > 0 ? (
          <span className="text-[10px] font-medium text-neutral-500">
            {task.storyPoints} SP
          </span>
        ) : null}
        {task.assignee ? (
          <span
            className="ml-auto truncate text-[10px] text-neutral-500"
            title={task.assignee.email}
          >
            {task.assignee.name || task.assignee.email}
          </span>
        ) : null}
      </div>
    </div>
  );
}
