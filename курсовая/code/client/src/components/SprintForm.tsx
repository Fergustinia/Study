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

interface SprintFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: SprintFormValues) => void;
  initialValues?: SprintFormValues;
  projectId: string;
}

export interface SprintFormValues {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'active' | 'completed';
  projectId: string;
}

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().required('End date is required'),
  status: yup.string().required('Status is required'),
  projectId: yup.string().required('Project ID is required'),
});

const SprintForm: React.FC<SprintFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  projectId,
}) => {
  const formik = useFormik<SprintFormValues>({
    initialValues: initialValues || {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'planned',
      projectId,
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
          {initialValues ? 'Edit Sprint' : 'Create Sprint'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
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
              id="startDate"
              name="startDate"
              label="Start Date"
              type="date"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              error={formik.touched.startDate && Boolean(formik.errors.startDate)}
              helperText={formik.touched.startDate && formik.errors.startDate}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="endDate"
              name="endDate"
              label="End Date"
              type="date"
              value={formik.values.endDate}
              onChange={formik.handleChange}
              error={formik.touched.endDate && Boolean(formik.errors.endDate)}
              helperText={formik.touched.endDate && formik.errors.endDate}
              InputLabelProps={{ shrink: true }}
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
            >
              <MenuItem value="planned">Planned</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {initialValues ? 'Save Changes' : 'Create Sprint'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SprintForm; 