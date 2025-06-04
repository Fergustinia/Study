import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Avatar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

interface UserCardProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'developer' | 'tester';
  avatar?: string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  id,
  firstName,
  lastName,
  email,
  role,
  avatar,
  onView,
  onEdit,
  onDelete,
}) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'warning';
      case 'developer':
        return 'info';
      case 'tester':
        return 'success';
      default:
        return 'default';
    }
  };

  const fullName = `${firstName} ${lastName}`;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            src={avatar}
            alt={fullName}
            sx={{ width: 64, height: 64, mr: 2 }}
          >
            {firstName.charAt(0)}{lastName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6" component="h2">
              {fullName}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {email}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center">
          <Chip
            label={role}
            color={getRoleColor(role) as any}
            size="small"
          />
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

export default UserCard; 