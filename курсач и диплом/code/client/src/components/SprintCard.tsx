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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

interface SprintCardProps {
  id: string;
  name: string;
  description: string;
  status: 'planned' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  progress: number;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const SprintCard: React.FC<SprintCardProps> = ({
  id,
  name,
  description,
  status,
  startDate,
  endDate,
  progress,
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
      case 'planned':
        return 'info';
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
        <Box mb={2}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Progress: {progress}%
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
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

export default SprintCard; 