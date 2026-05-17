"use client";

import { useMemo, useState, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import { updateTaskStatus } from "@/app/actions/tasks";
import { KanbanColumn } from "@/components/kanban/kanban-column";
import { TaskCard } from "@/components/kanban/task-card";
import {
  KANBAN_COLUMNS,
  TASK_STATUSES,
  type KanbanTask,
  type TaskStatus,
} from "@/types/task";

type KanbanBoardProps = {
  initialTasks: KanbanTask[];
};

function groupTasksByStatus(tasks: KanbanTask[]) {
  return TASK_STATUSES.reduce(
    (acc, status) => {
      acc[status] = tasks.filter((task) => task.status === status);
      return acc;
    },
    {} as Record<TaskStatus, KanbanTask[]>
  );
}

function isTaskStatus(value: string): value is TaskStatus {
  return TASK_STATUSES.includes(value as TaskStatus);
}

function resolveDropStatus(
  overId: string,
  tasks: KanbanTask[]
): TaskStatus | null {
  if (isTaskStatus(overId)) return overId;
  const overTask = tasks.find((item) => item.id === overId);
  return overTask?.status ?? null;
}

export function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const tasksByStatus = useMemo(() => groupTasksByStatus(tasks), [tasks]);

  const activeTask = activeTaskId
    ? tasks.find((task) => task.id === activeTaskId) ?? null
    : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveTaskId(String(event.active.id));
    setError(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTaskId(null);

    if (!over) return;

    const taskId = String(active.id);
    const newStatus = resolveDropStatus(String(over.id), tasks);
    if (!newStatus) return;

    const task = tasks.find((item) => item.id === taskId);
    if (!task || task.status === newStatus) return;

    const previousTasks = tasks;

    setTasks((current) =>
      current.map((item) =>
        item.id === taskId ? { ...item, status: newStatus } : item
      )
    );

    startTransition(async () => {
      const result = await updateTaskStatus(taskId, newStatus);
      if (!result.success) {
        setTasks(previousTasks);
        setError(result.error);
      }
    });
  }

  return (
    <div className="space-y-3">
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasksByStatus[column.id]}
              activeTaskId={activeTaskId}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
