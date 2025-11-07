//Here the nav bar is created

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';


let Navbar: React.FC = () => {
  let profile = useAppSelector((state: RootState) => state.profile);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Profile App
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/profile">
            Profile
          </Button>
          <Button color="inherit" component={RouterLink} to="/profile-form">
            {profile ? 'Edit Profile' : 'Create Profile'}
          </Button>
          {profile && (
            <Typography variant="body1" component="span" sx={{ ml: 2 }}>
              {profile.firstName} {profile.lastName}
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};


export default Navbar;

