import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  Assignment as ProjectIcon,
  ViewTimeline as SprintIcon,
  Task as TaskIcon,
} from '@mui/icons-material';
import { RootState } from '../store';
import {
  fetchProjectsStart,
  fetchProjectsSuccess,
  fetchProjectsFailure,
} from '../store/slices/projectSlice';
import {
  fetchSprintsStart,
  fetchSprintsSuccess,
  fetchSprintsFailure,
} from '../store/slices/sprintSlice';
import {
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFailure,
} from '../store/slices/taskSlice';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { projects, loading: projectsLoading } = useSelector(
    (state: RootState) => state.projects
  );
  const { sprints, loading: sprintsLoading } = useSelector(
    (state: RootState) => state.sprints
  );
  const { tasks, loading: tasksLoading } = useSelector(
    (state: RootState) => state.tasks
  );

  useEffect(() => {
    // Здесь будут запросы к API
    // Пока используем моковые данные
    const mockProjects = [
      { id: '1', name: 'Project 1', status: 'active' },
      { id: '2', name: 'Project 2', status: 'active' },
    ];
    const mockSprints = [
      { id: '1', number: 1, status: 'active' },
      { id: '2', number: 2, status: 'planned' },
    ];
    const mockTasks = [
      { id: '1', title: 'Task 1', status: 'todo' },
      { id: '2', title: 'Task 2', status: 'in-progress' },
    ];

    dispatch(fetchProjectsStart());
    dispatch(fetchProjectsSuccess(mockProjects));

    dispatch(fetchSprintsStart());
    dispatch(fetchSprintsSuccess(mockSprints));

    dispatch(fetchTasksStart());
    dispatch(fetchTasksSuccess(mockTasks));
  }, [dispatch]);

  if (projectsLoading || sprintsLoading || tasksLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const activeSprints = sprints.filter((s) => s.status === 'active').length;
  const todoTasks = tasks.filter((t) => t.status === 'todo').length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ProjectIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Projects</Typography>
              </Box>
              <Typography variant="h3">{activeProjects}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <SprintIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Sprints</Typography>
              </Box>
              <Typography variant="h3">{activeSprints}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TaskIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Todo Tasks</Typography>
              </Box>
              <Typography variant="h3">{todoTasks}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 