import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Task, TaskStatus } from '../types/task';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

export const Column: React.FC<ColumnProps> = ({ status, tasks }) => {
  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          className="bg-gray-100 rounded-md p-2 w-1/3 min-h-[300px]"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <h2 className="font-bold mb-2">{status}</h2>
          {tasks.map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
