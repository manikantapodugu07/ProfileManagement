import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { saveProfile, ProfileState } from '../redux/profileSlice';

import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Button,
  Snackbar,
  Alert
} from '@mui/material';

import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

interface ProfileFormData {
  firstName: string;
  email: string;
  age: string;
}

const ProfileForm: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useAppSelector((state: { profile: ProfileState }) => state.profile);
  const isLoading = status === 'loading';
  
  // Get profile from location state or Redux store
  const profileFromState = location.state?.profile;
  const profileFromStore = useAppSelector((state: { profile: ProfileState }) => state.profile.data);
  const profile = mode === 'edit' ? (profileFromState || profileFromStore) : null;

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    email: '',
    age: '',
  });

  // Update form data when profile changes (for edit mode)
  useEffect(() => {
    if (mode === 'edit' && profile) {
      setFormData({
        firstName: profile.firstName || '',
        email: profile.email || '',
        age: profile.age?.toString() || '',
      });
    } else {
      // Reset form for create mode
      setFormData({
        firstName: '',
        email: '',
        age: '',
      });
    }
  }, [mode, profile]);

  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form in edit mode
  useEffect(() => {
    if (mode === 'edit' && profile) {
      setFormData({
        firstName: profile.firstName || '',
        email: profile.email || '',
        age: profile.age?.toString() || '',
      });
    }
  }, [mode, profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof ProfileFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Name is required';
    } else if (formData.firstName.trim().length < 3) {
      newErrors.firstName = 'Name must be at least 3 characters long';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(formData.email)) {
      newErrors.email = 'Please enter a valid Gmail address';
    }

    if (formData.age && isNaN(Number(formData.age))) {
      newErrors.age = 'Age must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* -------------------------------------------------------
     UPDATED handleSubmit (inserted exactly as you requested)
     ------------------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please fix the errors in the form',
        severity: 'error',
      });
      return;
    }

    try {
      const profileData = {
        ...(mode === 'edit' && profile?.id && { id: profile.id }), // Include ID for updates
        firstName: formData.firstName.trim(),
        email: formData.email.trim(),
        age: formData.age ? parseInt(formData.age, 10) : undefined,
        ...(mode === 'edit' && { updatedAt: new Date().toISOString() }), // Add updatedAt for edits
      };

      await dispatch(saveProfile(profileData)).unwrap();
      
      setSnackbar({
        open: true,
        message: `Profile ${mode === 'create' ? 'created' : 'updated'} successfully!`,
        severity: 'success',
      });

      // Clear the form fields
      setFormData({
        firstName: '',
        email: '',
        age: '',
      });

      // Navigate immediately
      navigate('/profile', { replace: true });

    } catch (error) {
      console.error('Error saving profile:', error);
      setSnackbar({
        open: true,
        message: `Failed to ${mode} profile. Please try again.`,
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {mode === 'create' ? 'Create New Profile' : 'Edit Profile'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>

          {/* Name */}
          <Box mb={3}>
            <FormControl fullWidth error={!!errors.firstName}>
              <InputLabel>Name *</InputLabel>
              <OutlinedInput
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                label="Name *"
              />
              {errors.firstName && (
                <Typography variant="caption" color="error">
                  {errors.firstName}
                </Typography>
              )}
            </FormControl>
          </Box>

          {/* Email */}
          <Box mb={3}>
            <FormControl fullWidth error={!!errors.email}>
              <InputLabel>Email *</InputLabel>
              <OutlinedInput
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                label="Email *"
              />
              {errors.email && (
                <Typography variant="caption" color="error">
                  {errors.email}
                </Typography>
              )}
            </FormControl>
          </Box>

          {/* Age */}
          <Box mb={4}>
            <FormControl fullWidth error={!!errors.age}>
              <InputLabel>Age (Optional)</InputLabel>
              <OutlinedInput
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                label="Age (Optional)"
                endAdornment={
                  <InputAdornment position="end">
                    <Typography variant="caption">years</Typography>
                  </InputAdornment>
                }
              />
              {errors.age && (
                <Typography variant="caption" color="error">
                  {errors.age}
                </Typography>
              )}
            </FormControl>
          </Box>

          {/* Buttons */}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={() => navigate('/profile')}>
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SaveIcon />
                )
              }
              disabled={isSubmitting}
            >
              {mode === 'create' ? 'Create Profile' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfileForm;
