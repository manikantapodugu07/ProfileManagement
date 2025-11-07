import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { deleteProfile } from '../redux/profileSlice';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

let ProfilePage: React.FC = () => {
  let profile = useAppSelector((state: RootState) => state.profile);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleDeleteProfile = () => {
    try {
      dispatch(deleteProfile());
      setSnackbar({
        open: true,
        message: 'Profile deleted successfully!',
        severity: 'success',
      });
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting profile:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete profile. Please try again.',
        severity: 'error',
      });
    }
  };

  if (!profile) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            No Profile Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You haven't created a profile yet. Click the button below to get started.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/profile-form')}
          >
            Create Profile
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Profile Details
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">First Name</Typography>
            <Typography variant="body1">{profile.firstName}</Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">Last Name</Typography>
            <Typography variant="body1">{profile.lastName}</Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">Email</Typography>
            <Typography variant="body1">{profile.email}</Typography>
          </Box>
          
          {profile.age !== undefined && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" color="text.secondary">Age</Typography>
              <Typography variant="body1">{profile.age}</Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => navigate('/profile-form')}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setOpenDeleteDialog(true)}
            >
              Delete Profile
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Profile
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your profile? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteProfile} 
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

// export coming up — keep an eye on this
export default ProfilePage;


