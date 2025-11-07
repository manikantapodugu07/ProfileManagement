

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export let validateName = (name: string): ValidationResult => {
  if (!name || name.trim() === '') {
    return { isValid: false, message: 'Name is required' };
  }
  if (name.length < 3) {
    return { isValid: false, message: 'Name must be at least 3 characters long' };
  }
  return { isValid: true };
};

export let validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.trim() === '') {
    return { isValid: false, message: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true };
};

export const validateAge = (age: string): ValidationResult => {
  if (!age) return { isValid: true }; // Age is optional
  
  const ageNum = Number(age);
  if (isNaN(ageNum)) {
    return { isValid: false, message: 'Age must be a number' };
  }
  if (ageNum < 0 || ageNum > 150) {
    return { isValid: false, message: 'Please enter a valid age' };
  }
  return { isValid: true };
};

export const validateProfile = (data: {
  firstName: string;
  lastName: string;
  email: string;
  age?: string;
}) => {
  const firstNameValidation = validateName(data.firstName);
  if (!firstNameValidation.isValid) return firstNameValidation;

  const lastNameValidation = validateName(data.lastName);
  if (!lastNameValidation.isValid) return lastNameValidation;

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) return emailValidation;

  if (data.age) {
    const ageValidation = validateAge(data.age);
    if (!ageValidation.isValid) return ageValidation;
  }

  return { isValid: true };
};

