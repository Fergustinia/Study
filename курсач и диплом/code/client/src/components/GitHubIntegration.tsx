import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { GitHub as GitHubIcon, Link as LinkIcon, Unlink as UnlinkIcon } from '@mui/icons-material';
import axios from 'axios';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
}

interface GitHubIntegrationProps {
  projectId: string;
}

const GitHubIntegration: React.FC<GitHubIntegrationProps> = ({ projectId }) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/github/search?q=${searchQuery}`);
      setRepos(response.data.items);
    } catch (err) {
      setError('Failed to fetch GitHub repositories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkRepo = async (repoId: number) => {
    try {
      await axios.post(`/api/projects/${projectId}/github`, { repoId });
      setOpen(false);
      // Можно добавить уведомление об успешной привязке
    } catch (err) {
      setError('Failed to link repository');
      console.error(err);
    }
  };

  const handleUnlinkRepo = async (repoId: number) => {
    try {
      await axios.delete(`/api/projects/${projectId}/github/${repoId}`);
      // Можно добавить уведомление об успешной отвязке
    } catch (err) {
      setError('Failed to unlink repository');
      console.error(err);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={2}>
        <GitHubIcon sx={{ mr: 1 }} />
        <Typography variant="h6">GitHub Integration</Typography>
        <Button
          variant="contained"
          startIcon={<LinkIcon />}
          onClick={() => setOpen(true)}
          sx={{ ml: 'auto' }}
        >
          Link Repository
        </Button>
      </Box>

      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Link GitHub Repository</DialogTitle>
        <DialogContent>
          <Box display="flex" gap={1} mb={2}>
            <TextField
              fullWidth
              label="Search repositories"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
            >
              Search
            </Button>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {repos.map((repo) => (
                <ListItem key={repo.id}>
                  <ListItemText
                    primary={repo.full_name}
                    secondary={repo.description}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleLinkRepo(repo.id)}
                    >
                      <LinkIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Linked Repositories
        </Typography>
        <List>
          {repos.map((repo) => (
            <ListItem key={repo.id}>
              <ListItemText
                primary={repo.full_name}
                secondary={
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    {repo.html_url}
                  </a>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleUnlinkRepo(repo.id)}
                >
                  <UnlinkIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default GitHubIntegration; 