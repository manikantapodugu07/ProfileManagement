// In src/components/AppBar.tsx
import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography, Box, Avatar, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/store';

const AppBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: profile } = useAppSelector((state) => state.profile);
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <MuiAppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#1a237e',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: 3,
      }}
    >
      <Toolbar 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/')}>
            Profile Management
          </Typography>
          
          <Button 
            color="inherit" 
            onClick={() => navigate('/profile')}
            sx={{
              fontWeight: isActive('/profile') ? 'bold' : 'normal',
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Profile
          </Button>
          
          {profile && (
            <Button 
              color="inherit" 
              onClick={() => navigate('/profile/edit')}
              sx={{
                fontWeight: isActive('/profile/edit') ? 'bold' : 'normal',
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        {/* Only show profile info if user is logged in */}
        {profile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" sx={{ color: 'white' }}>
              {profile.firstName}
            </Typography>
            <Avatar 
              sx={{ 
                bgcolor: 'white',
                color: '#1a237e',
                fontWeight: 'bold',
                width: 36,
                height: 36,
                fontSize: '1rem',
              }}
            >
              {profile.firstName?.[0]?.toUpperCase()}
            </Avatar>
          </Box>
        )}
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;