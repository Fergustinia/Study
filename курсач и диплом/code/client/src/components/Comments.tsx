import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Avatar,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { RootState } from '../store';
import { fetchComments, addComment, deleteComment } from '../store/slices/commentSlice';

interface CommentsProps {
  taskId: string;
}

const Comments: React.FC<CommentsProps> = ({ taskId }) => {
  const dispatch = useDispatch();
  const { comments, loading } = useSelector((state: RootState) => state.comments);
  const { user } = useSelector((state: RootState) => state.auth);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    dispatch(fetchComments(taskId));
  }, [dispatch, taskId]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      dispatch(addComment({ taskId, content: newComment.trim() }));
      setNewComment('');
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      dispatch(deleteComment({ taskId, commentId }));
    }
  };

  if (loading) {
    return <Typography>Loading comments...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>

      <form onSubmit={handleAddComment}>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!newComment.trim()}
        >
          Add Comment
        </Button>
      </form>

      <List>
        {comments.map((comment) => (
          <React.Fragment key={comment.id}>
            <ListItem alignItems="flex-start">
              <Avatar sx={{ mr: 2 }}>
                {comment.user?.firstName?.[0]}
                {comment.user?.lastName?.[0]}
              </Avatar>
              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="subtitle1">
                      {comment.user?.firstName} {comment.user?.lastName}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}
                    </Typography>
                  </Box>
                }
                secondary={comment.content}
              />
              {user?.id === comment.userId && (
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Comments; 