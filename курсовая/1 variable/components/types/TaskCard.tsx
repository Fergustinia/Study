import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  index: number;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className="bg-white p-2 rounded shadow mb-2"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <p className="font-semibold">{task.title}</p>
          {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
        </div>
      )}
    </Draggable>
  );
};