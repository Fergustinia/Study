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

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void;
  initialValues?: UserFormValues;
}

export interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'admin' | 'manager' | 'developer' | 'tester';
}

const validationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().when('$isNew', {
    is: true,
    then: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    otherwise: yup.string().min(6, 'Password must be at least 6 characters'),
  }),
  role: yup.string().required('Role is required'),
});

const UserForm: React.FC<UserFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
}) => {
  const formik = useFormik<UserFormValues>({
    initialValues: initialValues || {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'developer',
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
          {initialValues ? 'Edit User' : 'Create User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              id="firstName"
              name="firstName"
              label="First Name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
              helperText={formik.touched.firstName && formik.errors.firstName}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="lastName"
              name="lastName"
              label="Last Name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="password"
              name="password"
              label={initialValues ? 'New Password (optional)' : 'Password'}
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="role"
              name="role"
              select
              label="Role"
              value={formik.values.role}
              onChange={formik.handleChange}
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="developer">Developer</MenuItem>
              <MenuItem value="tester">Tester</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {initialValues ? 'Save Changes' : 'Create User'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserForm; 