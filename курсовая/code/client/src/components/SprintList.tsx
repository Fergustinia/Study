import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Grid,
  CircularProgress,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchSprints, deleteSprint, createSprint, updateSprint } from '../store/slices/sprintSlice';
import SprintForm from './SprintForm';
import { SprintFormValues } from './SprintForm';

interface SprintListProps {
  projectId: string;
}

const SprintList: React.FC<SprintListProps> = ({ projectId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { sprints, loading, error } = useSelector((state: RootState) => state.sprints);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState<SprintFormValues | null>(null);

  useEffect(() => {
    dispatch(fetchSprints(projectId));
  }, [dispatch, projectId]);

  const handleCreateSprint = () => {
    setSelectedSprint(null);
    setIsFormOpen(true);
  };

  const handleEditSprint = (sprint: SprintFormValues) => {
    setSelectedSprint(sprint);
    setIsFormOpen(true);
  };

  const handleDeleteSprint = async (sprintId: string) => {
    if (window.confirm('Are you sure you want to delete this sprint?')) {
      await dispatch(deleteSprint(sprintId));
    }
  };

  const handleFormSubmit = async (values: SprintFormValues) => {
    if (selectedSprint) {
      await dispatch(updateSprint({ sprintId: selectedSprint._id, sprintData: values }));
    } else {
      await dispatch(createSprint(values));
    }
    setIsFormOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'default';
      case 'active':
        return 'primary';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Sprints</Typography>
        <Button variant="contained" onClick={handleCreateSprint}>
          Create Sprint
        </Button>
      </Box>

      <Grid container spacing={2}>
        {sprints.map((sprint) => (
          <Grid item xs={12} md={6} lg={4} key={sprint._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6" gutterBottom>
                    {sprint.name}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEditSprint(sprint)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteSprint(sprint._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {sprint.description}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(sprint.startDate).toLocaleDateString()} -{' '}
                    {new Date(sprint.endDate).toLocaleDateString()}
                  </Typography>
                  <Chip
                    label={sprint.status}
                    color={getStatusColor(sprint.status)}
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <SprintForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialValues={selectedSprint || undefined}
        projectId={projectId}
      />
    </Box>
  );
};

export default SprintList; 