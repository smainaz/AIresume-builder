import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Fab, Paper, Box, Typography, IconButton, TextField, Avatar, CircularProgress,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Hi! I'm here to help with anything about building, enhancing, or downloading your resume — or your account. What can I help with?",
};

function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const history = nextMessages
        .filter(m => m !== WELCOME_MESSAGE)
        .map(m => ({ role: m.role, content: m.content }));

      const res = await axios.post(`${API_URL}/api/chatbot`, { message: text, history });
      setMessages([...nextMessages, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setMessages([...nextMessages, {
        role: 'assistant',
        content: "Sorry, I'm having trouble responding right now. Please try again shortly.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <Paper
          elevation={6}
          sx={{
            position: 'fixed', bottom: 90, right: 24, width: 340, maxWidth: '90vw',
            height: 440, display: 'flex', flexDirection: 'column', borderRadius: 3,
            overflow: 'hidden', zIndex: 1300,
          }}
        >
          <Box sx={{
            bgcolor: 'primary.main', color: '#fff', px: 2, py: 1.5,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToyIcon fontSize="small" />
              <Typography variant="subtitle1" fontWeight={700}>Resume Assistant</Typography>
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: '#fff' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {messages.map((m, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  bgcolor: m.role === 'user' ? 'primary.main' : 'grey.100',
                  color: m.role === 'user' ? '#fff' : 'text.primary',
                  px: 1.5, py: 1, borderRadius: 2, maxWidth: '85%',
                }}
              >
                <Typography variant="body2">{m.content}</Typography>
              </Box>
            ))}
            {loading && (
              <Box sx={{ alignSelf: 'flex-start', px: 1.5, py: 1 }}>
                <CircularProgress size={18} />
              </Box>
            )}
            <div ref={bottomRef} />
          </Box>

          <Box component="form" onSubmit={sendMessage} sx={{ display: 'flex', gap: 1, p: 1.5, borderTop: '1px solid #e2e8f0' }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Ask a question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <IconButton type="submit" color="primary" disabled={loading || !input.trim()}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}

      <Fab
        color="primary"
        onClick={() => setOpen(o => !o)}
        sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1300 }}
        aria-label="Open chat assistant"
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </Fab>
    </>
  );
}

export default ChatbotWidget;
