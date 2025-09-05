export const PASSWORD_CRITERIA = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

export const validatePassword = (password) => {
  const errors = [];
  const criteria = {
    minLength: password.length >= PASSWORD_CRITERIA.minLength,
    uppercase: PASSWORD_CRITERIA.requireUppercase ? /[A-Z]/.test(password) : true,
    lowercase: PASSWORD_CRITERIA.requireLowercase ? /[a-z]/.test(password) : true,
    number: PASSWORD_CRITERIA.requireNumber ? /\d/.test(password) : true,
    specialChar: PASSWORD_CRITERIA.requireSpecialChar ? /[!@#$%^&*(),.?":{}|<>]/.test(password) : true,
  };

  if (!criteria.minLength) {
    errors.push(`Password must be at least ${PASSWORD_CRITERIA.minLength} characters long`);
  }
  if (!criteria.uppercase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!criteria.lowercase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!criteria.number) {
    errors.push('Password must contain at least one number');
  }
  if (!criteria.specialChar) {
    errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    criteria,
  };
};

export const getPasswordCriteriaList = () => [
  { key: 'minLength', label: `At least ${PASSWORD_CRITERIA.minLength} characters long` },
  { key: 'uppercase', label: 'At least one uppercase letter' },
  { key: 'lowercase', label: 'At least one lowercase letter' },
  { key: 'number', label: 'At least one number' },
  { key: 'specialChar', label: 'At least one special character (!@#$%^&*(),.?":{}|<>)' },
];
