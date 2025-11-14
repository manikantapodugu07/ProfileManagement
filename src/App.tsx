// In src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container, CssBaseline } from '@mui/material';
import AppBar from './components/AppBar';
import ProfileForm from './pages/ProfileForm';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
          fontFamily: 'Roboto, sans-serif'
        }}
      >
        <AppBar />
        <Container
          component="main"
          maxWidth="lg"
          sx={{
            mt: 4,
            mb: 4,
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/profile" replace />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/create" element={<ProfileForm mode="create" />} />
            <Route path="/profile/edit" element={<ProfileForm mode="edit" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;