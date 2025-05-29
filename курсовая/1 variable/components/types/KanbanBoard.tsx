import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Task, TaskStatus } from '../types/task';
import { Column } from './Column';

const initialTasks: Task[] = [
  { id: '1', title: 'Создать проект', status: 'To Do' },
  { id: '2', title: 'Реализовать Kanban', status: 'In Progress' },
  { id: '3', title: 'Написать документацию', status: 'Done' },
];

const statuses: TaskStatus[] = ['To Do', 'In Progress', 'Done'];

export const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const updatedTasks = tasks.map(task => {
      if (task.id === draggableId) {
        return { ...task, status: destination.droppableId as TaskStatus };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 p-4">
        {statuses.map(status => (
          <Column
            key={status}
            status={status}
            tasks={tasks.filter(task => task.status === status)}
          />
        ))}
      </div>
    </DragDropContext>
  );
};