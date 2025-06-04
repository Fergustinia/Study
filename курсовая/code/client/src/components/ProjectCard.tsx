import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  startDate: string;
  endDate: string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  description,
  status,
  startDate,
  endDate,
  onView,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'primary';
      case 'on-hold':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">
            {name}
          </Typography>
          <Chip
            label={status}
            color={getStatusColor(status) as any}
            size="small"
          />
        </Box>
        <Typography color="textSecondary" paragraph>
          {description}
        </Typography>
        <Box display="flex" justifyContent="space-between" color="textSecondary">
          <Typography variant="body2">Start: {new Date(startDate).toLocaleDateString()}</Typography>
          <Typography variant="body2">End: {new Date(endDate).toLocaleDateString()}</Typography>
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

export default ProjectCard; 