import { useEffect, useRef, useState } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  TextField,
  Button,
  Container,
  Divider
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useAppSelector } from '../app/hooks.ts';
import { selectUser } from '../store/slices/userSlice.ts';

interface Message {
  username: string;
  message: string;
  timestamp: string;
  _id: string;
}

const Chat = () => {
  const user = useAppSelector(selectUser);

  const messagesRef = useRef<HTMLDivElement | null>(null);

  const [ws, setWs] = useState<WebSocket | null>(null);
  const [users, setUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/chat');
    setWs(socket);

    if (user) {
      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            type: 'LOGIN',
            payload: { token: user.token }
          })
        );
      };
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'USER_LIST') {
        setUsers(data.users);
      }
      else if (data.type === 'MESSAGES') {
        setMessages(data.payload);
      }
      else if (data.type === 'NEW_MESSAGE') {
        setMessages(prev => [...prev, data.payload]);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (ws && messageText.trim() !== '' && user) {
      ws.send(
        JSON.stringify({
          type: 'MESSAGE',
          payload: {
            username: user.username,
            message: messageText
          }
        })
      );
      setMessageText('');
    }
  };

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight });
  }, [messages]);

  return (
    <Container maxWidth="md">
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid size={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Online users
            </Typography>
            <List>
              {users.map((user, index) => (
                <ListItem key={index + user}>
                  <ListItemText primary={user} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid
          size={9}
          sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}
        >
          <Paper
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              mb: 2
            }}
          >
            <Box sx={{ overflowY: 'scroll', maxHeight: '70vh' }} ref={messagesRef}>
              {messages.map((msg) => (
                <Box key={msg._id} >
                  <Typography variant="subtitle2" sx={{fontWeight: 700}}>{msg.username}</Typography>
                  <Box display='flex' alignItems='baseline'>
                    <Typography variant="body1" sx={{marginRight: '10px', fontWeight: 300}}>{msg.message}</Typography>
                    <Typography variant="caption" sx={{marginTop: '2px', fontSize: '10px'}}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Box>
                  <Divider sx={{marginY: '10px'}}/>
                </Box>
              ))}
            </Box>
          </Paper>
          <Box sx={{ display: 'flex' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <Button variant="contained" sx={{ ml: 1 }} onClick={handleSendMessage}>
              Send
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;
