import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: {
    id: string;
    name: string;
    avatar?: string;
  };
  estimatedHours: number;
  spentHours: number;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  status,
  priority,
  assignee,
  estimatedHours,
  spentHours,
  onView,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'default';
      case 'in-progress':
        return 'info';
      case 'review':
        return 'warning';
      case 'done':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  const progress = (spentHours / estimatedHours) * 100;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          <Box>
            <Chip
              label={status}
              color={getStatusColor(status) as any}
              size="small"
              sx={{ mr: 1 }}
            />
            <Chip
              label={priority}
              color={getPriorityColor(priority) as any}
              size="small"
            />
          </Box>
        </Box>
        <Typography color="textSecondary" paragraph>
          {description}
        </Typography>
        <Box mb={2}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Progress: {Math.round(progress)}%
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Avatar
              src={assignee.avatar}
              alt={assignee.name}
              sx={{ width: 24, height: 24, mr: 1 }}
            >
              {assignee.name.charAt(0)}
            </Avatar>
            <Typography variant="body2" color="textSecondary">
              {assignee.name}
            </Typography>
          </Box>
          <Typography variant="body2" color="textSecondary">
            {spentHours}/{estimatedHours}h
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={() => onView(id)}
        >
          View
        </Button>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => onEdit(id)}
        >
          Edit
        </Button>
        <Button
          size="small"
          startIcon={<DeleteIcon />}
          color="error"
          onClick={() => onDelete(id)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default TaskCard; 