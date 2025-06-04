import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface PageHeaderProps {
  title: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  buttonText,
  onButtonClick,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
    >
      <Typography variant="h4" component="h1">
        {title}
      </Typography>
      {buttonText && onButtonClick && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default PageHeader; 