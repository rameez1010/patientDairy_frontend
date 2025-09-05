// Email regex: RFC 5322 Official Standard (simplified for practical use)
export function validateEmail(email) {
  if (!email) return { valid: false, error: 'Email is required' };
  const re = /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/;
  if (!re.test(email)) {
    return { valid: false, error: 'Invalid email address' };
  }
  return { valid: true, error: '' };
}

export function validateName(name, label = 'Name') {
  if (!name) return { valid: false, error: `${label} is required` };
  // Only letters, spaces, hyphens, apostrophes, min 3 chars
  const re = /^[A-Za-z\s'-]{3,}$/;
  if (!re.test(name)) {
    return {
      valid: false,
      error: `${label} must be at least 3 characters and contain only letters, spaces, hyphens, or apostrophes.`,
    };
  }
  return { valid: true, error: '' };
}
