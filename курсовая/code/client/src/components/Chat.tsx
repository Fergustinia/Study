import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { format } from 'date-fns';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

interface ChatProps {
  projectId: string;
}

const Chat: React.FC<ChatProps> = ({ projectId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Загрузка сообщений
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/chat`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();

    // Подписка на новые сообщения через WebSocket
    const ws = new WebSocket(`ws://localhost:5000/ws/projects/${projectId}/chat`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    return () => {
      ws.close();
    };
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        setNewMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Project Chat</Typography>
      </Box>

      <List
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {messages.map((message) => (
          <ListItem
            key={message.id}
            sx={{
              flexDirection: message.senderId === user?.id ? 'row-reverse' : 'row',
              gap: 1,
            }}
          >
            <ListItemAvatar>
              <Avatar>{message.senderName[0]}</Avatar>
            </ListItemAvatar>
            <Box
              sx={{
                maxWidth: '70%',
                backgroundColor: message.senderId === user?.id ? 'primary.main' : 'grey.200',
                color: message.senderId === user?.id ? 'white' : 'text.primary',
                borderRadius: 2,
                p: 1,
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: message.senderId === user?.id ? 'right' : 'left',
                  mt: 0.5,
                  opacity: 0.7,
                }}
              >
                {format(new Date(message.timestamp), 'HH:mm')}
              </Typography>
            </Box>
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>

      <Divider />

      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          display: 'flex',
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          size="small"
        />
        <IconButton
          type="submit"
          color="primary"
          disabled={!newMessage.trim()}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default Chat; 