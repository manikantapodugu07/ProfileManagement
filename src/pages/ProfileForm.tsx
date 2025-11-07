import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { createProfile, updateProfile } from '../redux/profileSlice';
import { validateProfile } from '../utils/validation';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';

const ProfileForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        age: profile.age?.toString() || '',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateProfile({
      ...formData,
      age: formData.age || undefined,
    });
    
    if (!validation.isValid) {
      setErrors(prev => ({
        ...prev,
        ...(validation.message ? { form: validation.message } : {}),
      }));
      return;
    }
    
    try {
      const profileData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        age: formData.age ? parseInt(formData.age, 10) : undefined,
      };
      
      if (profile) {
        dispatch(updateProfile(profileData));
      } else {
        dispatch(createProfile(profileData));
      }
      
      setSnackbar({
        open: true,
        message: profile ? 'Profile updated successfully!' : 'Profile created successfully!',
        severity: 'success',
      });
      
      // Redirect to profile page after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save profile. Please try again.',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {profile ? 'Edit Profile' : 'Create Profile'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="given-name"
            value={formData.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            value={formData.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          
          <TextField
            margin="normal"
            fullWidth
            id="age"
            label="Age (Optional)"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            error={!!errors.age}
            helperText={errors.age}
            inputProps={{
              min: 0,
              max: 150,
            }}
          />
          
          {errors.form && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.form}
            </Alert>
          )}
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate('/profile')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {profile ? 'Update Profile' : 'Create Profile'}
            </Button>
          </Box>
        </Box>
      </Paper>
      
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

export default ProfileForm;
