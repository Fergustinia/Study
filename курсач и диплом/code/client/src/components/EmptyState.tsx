import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  buttonText,
  onButtonClick,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      p={3}
      textAlign="center"
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography color="textSecondary" paragraph>
        {description}
      </Typography>
      {buttonText && onButtonClick && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onButtonClick}
          sx={{ mt: 2 }}
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState; 