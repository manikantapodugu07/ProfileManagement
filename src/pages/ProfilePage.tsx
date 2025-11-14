import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { clearProfile, fetchProfile, deleteProfile, ProfileData } from '../redux/profileSlice';
// Import selectors directly from the slice
import { selectProfile, selectProfileStatus, selectProfileError } from '../redux/profileSlice';
import { CircularProgress, useTheme } from '@mui/material';

import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
  Avatar,
  Divider,
  CardHeader,
  CardActions,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import ErrorIcon from '@mui/icons-material/Error';   // ✅ ADDED HERE
import { deepPurple } from '@mui/material/colors';

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Get profile and status from Redux with proper typing
  const profile = useAppSelector(selectProfile) as ProfileData | null;
  const status = useAppSelector(selectProfileStatus);
  const error = useAppSelector(selectProfileError);

  // Fetch profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        await dispatch(fetchProfile()).unwrap();
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load profile',
          severity: 'error',
        });
      }
    };

    loadProfile();
  }, [dispatch]);
  
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleDeleteProfile = async () => {
    try {
      // Use the deleteProfile thunk to handle the deletion
      const resultAction = await dispatch(deleteProfile());
      
      if (deleteProfile.fulfilled.match(resultAction)) {
        setSnackbar({
          open: true,
          message: 'Profile deleted successfully!',
          severity: 'success',
        });
        setOpenDeleteDialog(false);
        // The profile state will be updated by the deleteProfile.fulfilled reducer
        // No need to navigate, as the component will automatically show the "No Profile" state
      } else {
        throw new Error('Failed to delete profile');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete profile. Please try again.',
        severity: 'error',
      });
    }
  };

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" component="h1" gutterBottom>
            No Profile Found
          </Typography>
          <Typography color="text.secondary" paragraph>
            You don't have a profile yet. Create one to get started!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/profile/create')}
            sx={{ mt: 2 }}
          >
            Create Your Profile
          </Button>
        </Card>
      </Container>
    );
  }

  // Format the user's initials for the avatar
  const userInitials = profile.firstName?.[0]?.toUpperCase() || '';

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box 
          sx={{
            height: 120,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${deepPurple[500]} 100%)`,
          }}
        />
        
        <CardHeader
          avatar={
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mt: -6,
                ml: 3,
                border: '4px solid white',
                bgcolor: deepPurple[500],
                fontSize: '2.5rem',
                fontWeight: 'bold',
              }}
            >
              {userInitials}
            </Avatar>
          }
          title={
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mt: 1 }}>
              {profile.firstName}
            </Typography>
          }
          subheader={
            <Typography variant="subtitle1" color="text.secondary">
              Profile Information
            </Typography>
          }
          sx={{ pb: 0 }}
        />
        
        <CardContent sx={{ pt: 3, px: 4 }}>
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
              <EmailIcon color="action" sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="caption" color="text.secondary">Email</Typography>
                <Typography variant="body1">{profile.email}</Typography>
              </Box>
            </Box>
            
            {profile.age && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                <CakeIcon color="action" sx={{ mr: 2, color: 'secondary.main' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Age</Typography>
                  <Typography variant="body1">{profile.age} years</Typography>
                </Box>
              </Box>
            )}
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <CardActions sx={{ justifyContent: 'flex-end', px: 0 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setOpenDeleteDialog(true)}
              sx={{
                textTransform: 'none',
                px: 3,
                py: 1,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'error.light',
                  color: 'error.contrastText',
                },
              }}
            >
              Delete Profile
            </Button>
          </CardActions>
        </CardContent>
      </Card>
      
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 'bold', pb: 1 }}>
          Delete Profile?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your profile? This action cannot be undone and all your data will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteProfile} 
            color="error" 
            variant="contained"
            autoFocus
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
                backgroundColor: 'error.dark',
              },
            }}
          >
            {status === 'loading' ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
          icon={snackbar.severity === 'error' ? <ErrorIcon /> : undefined}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;
