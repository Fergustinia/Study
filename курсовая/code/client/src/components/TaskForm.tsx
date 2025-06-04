import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void;
  initialValues?: TaskFormValues;
  sprintId: string;
  projectId: string;
  users: Array<{
    id: string;
    firstName: string;
    lastName: string;
  }>;
}

export interface TaskFormValues {
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigneeId: string;
  sprintId: string;
  projectId: string;
  estimatedHours: number;
  spentHours: number;
}

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  status: yup.string().required('Status is required'),
  priority: yup.string().required('Priority is required'),
  assigneeId: yup.string().required('Assignee is required'),
  sprintId: yup.string().required('Sprint ID is required'),
  projectId: yup.string().required('Project ID is required'),
  estimatedHours: yup
    .number()
    .required('Estimated hours is required')
    .min(0, 'Estimated hours must be positive'),
  spentHours: yup
    .number()
    .required('Spent hours is required')
    .min(0, 'Spent hours must be positive'),
});

const TaskForm: React.FC<TaskFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  sprintId,
  projectId,
  users,
}) => {
  const formik = useFormik<TaskFormValues>({
    initialValues: initialValues || {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assigneeId: '',
      sprintId,
      projectId,
      estimatedHours: 0,
      spentHours: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {initialValues ? 'Edit Task' : 'Create Task'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="status"
              name="status"
              select
              label="Status"
              value={formik.values.status}
              onChange={formik.handleChange}
              error={formik.touched.status && Boolean(formik.errors.status)}
              helperText={formik.touched.status && formik.errors.status}
              sx={{ mb: 2 }}
            >
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="review">Review</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </TextField>
            <TextField
              fullWidth
              id="priority"
              name="priority"
              select
              label="Priority"
              value={formik.values.priority}
              onChange={formik.handleChange}
              error={formik.touched.priority && Boolean(formik.errors.priority)}
              helperText={formik.touched.priority && formik.errors.priority}
              sx={{ mb: 2 }}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>
            <TextField
              fullWidth
              id="assigneeId"
              name="assigneeId"
              select
              label="Assignee"
              value={formik.values.assigneeId}
              onChange={formik.handleChange}
              error={formik.touched.assigneeId && Boolean(formik.errors.assigneeId)}
              helperText={formik.touched.assigneeId && formik.errors.assigneeId}
              sx={{ mb: 2 }}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              id="estimatedHours"
              name="estimatedHours"
              label="Estimated Hours"
              type="number"
              value={formik.values.estimatedHours}
              onChange={formik.handleChange}
              error={formik.touched.estimatedHours && Boolean(formik.errors.estimatedHours)}
              helperText={formik.touched.estimatedHours && formik.errors.estimatedHours}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="spentHours"
              name="spentHours"
              label="Spent Hours"
              type="number"
              value={formik.values.spentHours}
              onChange={formik.handleChange}
              error={formik.touched.spentHours && Boolean(formik.errors.spentHours)}
              helperText={formik.touched.spentHours && formik.errors.spentHours}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {initialValues ? 'Save Changes' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm; 