import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { RootState } from '../store';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics: React.FC = () => {
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { sprints } = useSelector((state: RootState) => state.sprints);

  const taskStatusData = tasks.reduce((acc: any[], task) => {
    const existingStatus = acc.find((item) => item.name === task.status);
    if (existingStatus) {
      existingStatus.value++;
    } else {
      acc.push({ name: task.status, value: 1 });
    }
    return acc;
  }, []);

  const taskPriorityData = tasks.reduce((acc: any[], task) => {
    const existingPriority = acc.find((item) => item.name === task.priority);
    if (existingPriority) {
      existingPriority.value++;
    } else {
      acc.push({ name: task.priority, value: 1 });
    }
    return acc;
  }, []);

  const sprintProgressData = sprints.map((sprint) => ({
    name: sprint.name,
    progress: sprint.progress,
  }));

  const calculateCompletionRate = () => {
    const completedTasks = tasks.filter((task) => task.status === 'done').length;
    return tasks.length ? (completedTasks / tasks.length) * 100 : 0;
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Project Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Task Status Distribution
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Task Priority Distribution
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskPriorityData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {taskPriorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sprint Progress
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sprintProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="progress" fill="#8884d8" name="Progress (%)" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Overall Completion Rate
            </Typography>
            <Box display="flex" justifyContent="center" alignItems="center" height={200}>
              <CircularProgress
                variant="determinate"
                value={calculateCompletionRate()}
                size={120}
                thickness={4}
              />
              <Box
                position="absolute"
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Typography variant="h4" component="div" color="textSecondary">
                  {Math.round(calculateCompletionRate())}%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Complete
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics; 