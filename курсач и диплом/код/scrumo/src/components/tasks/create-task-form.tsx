"use client";

import { useActionState } from "react";

import { createTask, type CreateTaskFormState } from "@/app/actions/tasks";

type CreateTaskFormProps = {
  projectId: string;
  sprints: Array<{
    id: string;
    name: string;
    status: string;
  }>;
  users: Array<{
    id: string;
    name: string | null;
    email: string;
  }>;
  defaultAssigneeId?: string;
};

const initialState: CreateTaskFormState = {};

export function CreateTaskForm({
  projectId,
  sprints,
  users,
  defaultAssigneeId,
}: CreateTaskFormProps) {
  const [state, formAction, isPending] = useActionState(createTask, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="projectId" value={projectId} />

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Название задачи
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Например: Реализовать форму создания задачи"
          className="flex h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-400"
        />
        {state.errors?.title && (
          <p className="text-sm text-red-500">{state.errors.title[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Описание
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          placeholder="Опиши задачу подробнее"
          className="flex w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-400"
        />
        {state.errors?.description && (
          <p className="text-sm text-red-500">{state.errors.description[0]}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Статус
          </label>
          <select
            id="status"
            name="status"
            defaultValue="TODO"
            className="flex h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
          >
            <option value="TODO">К выполнению</option>
            <option value="IN_PROGRESS">В работе</option>
            <option value="REVIEW">На ревью</option>
            <option value="TESTING">Тестирование</option>
            <option value="DONE">Готово</option>
          </select>
          {state.errors?.status && (
            <p className="text-sm text-red-500">{state.errors.status[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="priority" className="text-sm font-medium">
            Приоритет
          </label>
          <select
            id="priority"
            name="priority"
            defaultValue="MEDIUM"
            className="flex h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
          {state.errors?.priority && (
            <p className="text-sm text-red-500">{state.errors.priority[0]}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="storyPoints" className="text-sm font-medium">
            Story Points
          </label>
          <input
            id="storyPoints"
            name="storyPoints"
            type="number"
            min={0}
            placeholder="Например: 3"
            className="flex h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-400"
          />
          {state.errors?.storyPoints && (
            <p className="text-sm text-red-500">{state.errors.storyPoints[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="deadline" className="text-sm font-medium">
            Deadline
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            className="flex h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
          />
          {state.errors?.deadline && (
            <p className="text-sm text-red-500">{state.errors.deadline[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="assigneeId" className="text-sm font-medium">
            Исполнитель (участник проекта)
          </label>
          <select
            id="assigneeId"
            name="assigneeId"
            defaultValue={
              users.some((user) => user.id === defaultAssigneeId)
                ? defaultAssigneeId
                : ""
            }
            className="flex h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
          >
            <option value="">Не назначен</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
          {state.errors?.assigneeId && (
            <p className="text-sm text-red-500">{state.errors.assigneeId[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="sprintId" className="text-sm font-medium">
          Спринт
        </label>
        <select
          id="sprintId"
          name="sprintId"
          defaultValue=""
          className="flex h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
        >
          <option value="">Без спринта</option>
          {sprints.map((sprint) => (
            <option key={sprint.id} value={sprint.id}>
              {sprint.name}
            </option>
          ))}
        </select>
        {state.errors?.sprintId && (
          <p className="text-sm text-red-500">{state.errors.sprintId[0]}</p>
        )}
      </div>

      {state.errors?._form && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.errors._form[0]}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Создание..." : "Создать задачу"}
        </button>

        <a
          href={`/projects/${projectId}`}
          className="inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium transition hover:bg-neutral-50"
        >
          Отмена
        </a>
      </div>
    </form>
  );
}