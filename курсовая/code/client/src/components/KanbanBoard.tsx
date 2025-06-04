import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
}

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, newStatus: string) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

const columns = {
  todo: {
    title: 'To Do',
    color: '#f5f5f5',
  },
  'in-progress': {
    title: 'In Progress',
    color: '#e3f2fd',
  },
  review: {
    title: 'Review',
    color: '#fff3e0',
  },
  done: {
    title: 'Done',
    color: '#e8f5e9',
  },
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskUpdate,
  onTaskEdit,
  onTaskDelete,
}) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    onTaskUpdate(draggableId, destination.droppableId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box display="flex" gap={2} p={2} sx={{ overflowX: 'auto' }}>
        {Object.entries(columns).map(([status, { title, color }]) => (
          <Paper
            key={status}
            sx={{
              minWidth: 300,
              backgroundColor: color,
              p: 2,
              flex: 1,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <Droppable droppableId={status}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  minHeight={500}
                >
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ mb: 2 }}
                          >
                            <CardContent>
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="flex-start"
                              >
                                <Typography variant="h6" gutterBottom>
                                  {task.title}
                                </Typography>
                                <Box>
                                  <IconButton
                                    size="small"
                                    onClick={() => onTaskEdit(task)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => onTaskDelete(task.id)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              </Box>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                gutterBottom
                              >
                                {task.description}
                              </Typography>
                              <Box display="flex" gap={1}>
                                <Chip
                                  label={task.priority}
                                  color={getPriorityColor(task.priority)}
                                  size="small"
                                />
                                {task.assignee && (
                                  <Chip
                                    label={task.assignee}
                                    variant="outlined"
                                    size="small"
                                  />
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </Paper>
        ))}
      </Box>
    </DragDropContext>
  );
};

export default KanbanBoard; 