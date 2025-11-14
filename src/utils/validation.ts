

interface ValidationResult {
  isValid: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
}

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Field-level validators
export const validateName = (name: string, fieldName: string = 'Name'): string | undefined => {
  if (!name || name.trim() === '') {
    return `${fieldName} is required`;
  }
  if (name.trim().length < 2) {
    return `${fieldName} must be at least 2 characters long`;
  }
  if (!/^[a-zA-Z\s-']+$/.test(name)) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  }
  return undefined;
};

export const validateEmail = (email: string): string | undefined => {
  if (!email || email.trim() === '') {
    return 'Email is required';
  }
  
  const emailValue = email.trim();
  
  // Basic format validation
  if (!EMAIL_REGEX.test(emailValue)) {
    return 'Please enter a valid email address (e.g., user@example.com)';
  }
  
  // Check for common typos
  if (emailValue.includes(' ')) {
    return 'Email should not contain spaces';
  }
  
  if (emailValue.includes('..')) {
    return 'Email should not contain consecutive dots';
  }
  
  // Check for valid TLD
  const tld = emailValue.split('.').pop();
  if (!tld || tld.length < 2) {
    return 'The domain portion of the email is invalid';
  }
  
  return undefined;
};

export const validateAge = (age: string): string | undefined => {
  if (!age) return undefined; // Age is optional
  
  const ageNum = Number(age);
  if (isNaN(ageNum)) {
    return 'Age must be a number';
  }
  if (!Number.isInteger(ageNum)) {
    return 'Age must be a whole number';
  }
  if (ageNum < 1 || ageNum > 120) {
    return 'Please enter a valid age between 1 and 120';
  }
  return undefined;
};

export const validateProfile = (data: {
  firstName: string;
  lastName: string;
  email: string;
  age?: string;
}): ValidationResult => {
  const fieldErrors: Record<string, string> = {};
  
  // Validate first name
  const firstNameError = validateName(data.firstName, 'First name');
  if (firstNameError) fieldErrors.firstName = firstNameError;
  
  // Validate last name
  const lastNameError = validateName(data.lastName, 'Last name');
  if (lastNameError) fieldErrors.lastName = lastNameError;
  
  // Validate email
  const emailError = validateEmail(data.email);
  if (emailError) fieldErrors.email = emailError;
  
  // Validate age if provided
  if (data.age) {
    const ageError = validateAge(data.age);
    if (ageError) fieldErrors.age = ageError;
  }
  
  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined
  };

  return { isValid: true };
};

