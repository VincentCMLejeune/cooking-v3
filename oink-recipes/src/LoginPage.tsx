import { useState } from 'react';
import { 
  Login, 
  LoginForm, 
  useLogin, 
  useNotify 
} from 'react-admin';
import { 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Alert
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

const CustomLoginForm = () => {
  const [password, setPassword] = useState('');
  const login = useLogin();
  const notify = useNotify();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ password })
      .catch(() => {
        notify('Invalid password', { type: 'error' });
      });
  };

  return (
    <Card sx={{ minWidth: 300 }}>
      <CardContent sx={{ p: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <LockOutlined sx={{ fontSize: 48, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Access
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={3}>
            Enter the admin password to access the recipe management system
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} width="100%">
            <TextField
              fullWidth
              type="password"
              label="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
            >
              Access Admin Panel
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export const LoginPage = () => (
  <Login>
    <CustomLoginForm />
  </Login>
);
