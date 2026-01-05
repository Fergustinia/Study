import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { RootState } from '../store';
import {
  fetchSprintsStart,
  fetchSprintsSuccess,
  fetchSprintsFailure,
  addSprint,
  updateSprint,
  deleteSprint,
  fetchSprints,
} from '../store/slices/sprintSlice';

interface SprintFormData {
  name: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'active' | 'completed';
  projectId: string;
}

const Sprints: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sprints, loading } = useSelector((state: RootState) => state.sprints);
  const { projects } = useSelector((state: RootState) => state.projects);
  const [open, setOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<string | null>(null);
  const [formData, setFormData] = useState<SprintFormData>({
    name: '',
    startDate: '',
    endDate: '',
    status: 'planned',
    projectId: '',
  });

  useEffect(() => {
    // Get the current project ID from the URL or state
    const projectId = window.location.pathname.split('/')[2]; // Assuming URL pattern is /projects/:projectId/sprints
    if (projectId) {
      dispatch(fetchSprints(projectId));
    }
  }, [dispatch]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSprint(null);
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      status: 'planned',
      projectId: '',
    });
  };

  const handleEdit = (sprint: any) => {
    setEditingSprint(sprint.id);
    setFormData({
      name: sprint.name,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      status: sprint.status,
      projectId: sprint.projectId,
    });
    setOpen(true);
  };

  const handleDelete = (sprintId: string) => {
    if (window.confirm('Are you sure you want to delete this sprint?')) {
      dispatch(deleteSprint(sprintId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sprintData = {
      ...formData,
      id: editingSprint || Date.now().toString(),
    };

    if (editingSprint) {
      dispatch(updateSprint(sprintData));
    } else {
      dispatch(addSprint(sprintData));
    }

    handleClose();
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
      case 'planned':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Sprints</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          New Sprint
        </Button>
      </Box>

      <Grid container spacing={3}>
        {sprints.map((sprint) => (
          <Grid item xs={12} sm={6} md={4} key={sprint.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6" gutterBottom>
                    {sprint.name}
                  </Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleEdit(sprint)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(sprint.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {sprint.projectName}
                </Typography>
                <Box display="flex" gap={1} mb={2}>
                  <Chip
                    label={sprint.status}
                    color={getStatusColor(sprint.status)}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Start: {new Date(sprint.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  End: {new Date(sprint.endDate).toLocaleDateString()}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={sprint.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {sprint.progress}%
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate(`/sprints/${sprint.id}`)}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSprint ? 'Edit Sprint' : 'New Sprint'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Sprint Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              select
              label="Project"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              margin="normal"
              required
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </TextField>
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
              <MenuItem value="planned">Planned</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingSprint ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Sprints; 