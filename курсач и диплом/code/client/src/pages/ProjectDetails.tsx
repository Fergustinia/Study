import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { RootState } from '../store';
import {
  fetchProjectById,
  updateProject,
  deleteProject,
} from '../store/slices/projectSlice';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProject, loading } = useSelector(
    (state: RootState) => state.projects
  );
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: '',
    sprintDuration: 14,
  });

  useEffect(() => {
    if (id) {
      // Здесь будет запрос к API
      // Пока используем моковые данные
      const mockProject = {
        id,
        name: 'Project 1',
        description: 'Description 1',
        startDate: '2024-01-01',
        endDate: '2024-06-30',
        status: 'active',
        sprintDuration: 14,
        sprints: [
          {
            id: '1',
            name: 'Sprint 1',
            startDate: '2024-01-01',
            endDate: '2024-01-14',
            status: 'completed',
          },
          {
            id: '2',
            name: 'Sprint 2',
            startDate: '2024-01-15',
            endDate: '2024-01-28',
            status: 'active',
          },
        ],
      };
      dispatch(fetchProjectById(mockProject));
    }
  }, [dispatch, id]);

  const handleOpen = () => {
    if (currentProject) {
      setFormData({
        name: currentProject.name,
        description: currentProject.description,
        startDate: currentProject.startDate,
        endDate: currentProject.endDate,
        status: currentProject.status,
        sprintDuration: currentProject.sprintDuration,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      dispatch(updateProject({ ...formData, id }));
    }
    handleClose();
  };

  const handleDelete = () => {
    if (id && window.confirm('Are you sure you want to delete this project?')) {
      dispatch(deleteProject(id));
      navigate('/projects');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  if (loading || !currentProject) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">{currentProject.name}</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleOpen}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Project Details
            </Typography>
            <Typography color="textSecondary" paragraph>
              {currentProject.description}
            </Typography>
            <Box display="flex" gap={1} mb={2}>
              <Chip
                label={currentProject.status}
                color={getStatusColor(currentProject.status)}
              />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Start Date
                </Typography>
                <Typography>
                  {new Date(currentProject.startDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  End Date
                </Typography>
                <Typography>
                  {new Date(currentProject.endDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Sprint Duration
                </Typography>
                <Typography>{currentProject.sprintDuration} days</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Sprints</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate(`/projects/${id}/sprints/new`)}
              >
                New Sprint
              </Button>
            </Box>
            <List>
              {currentProject.sprints?.map((sprint) => (
                <React.Fragment key={sprint.id}>
                  <ListItem>
                    <ListItemText
                      primary={sprint.name}
                      secondary={`${new Date(sprint.startDate).toLocaleDateString()} - ${new Date(
                        sprint.endDate
                      ).toLocaleDateString()}`}
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={sprint.status}
                        color={getStatusColor(sprint.status)}
                        size="small"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Project Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Total Sprints
                </Typography>
                <Typography variant="h6">
                  {currentProject.sprints?.length || 0}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Completed Sprints
                </Typography>
                <Typography variant="h6">
                  {currentProject.sprints?.filter((s) => s.status === 'completed').length || 0}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Project</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Project Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              margin="normal"
              required
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="on-hold">On Hold</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Sprint Duration (days)"
              name="sprintDuration"
              type="number"
              value={formData.sprintDuration}
              onChange={handleChange}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProjectDetails; 