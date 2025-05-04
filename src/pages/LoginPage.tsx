
import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import { LoginForm } from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
          Sistema de Medições OC GROUP
        </Typography>
        
        <Paper 
          elevation={3} 
          sx={{ 
            width: '100%', 
            overflow: 'hidden',
            borderRadius: 2
          }}
        >
          <LoginForm />
        </Paper>
      </Box>
    </Container>
  );
}
