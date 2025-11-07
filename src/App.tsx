import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from './components/Navbar';
import ProfileForm from './pages/ProfileForm';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Container component="main" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<ProfilePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile-form" element={<ProfileForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
