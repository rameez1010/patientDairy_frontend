// Utility function to get field CSS classes based on validation state
export const getFieldClassName = (fieldName, validationErrors) => {
  const baseClass = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
  const errorClass = 'border-red-300 focus:ring-red-500';
  const normalClass = 'border-gray-300';

  return `${baseClass} ${validationErrors[fieldName] ? errorClass : normalClass}`;
};

// Utility function to clear validation errors when user starts typing
export const handleFieldChange = (field, value, formData, setFormData, onUpdate, validationErrors, onClearErrors) => {
  const updatedData = { ...formData, [field]: value };
  setFormData(updatedData);
  onUpdate(updatedData);

  // Clear validation error for this field when user starts typing
  if (validationErrors[field] && onClearErrors) {
    onClearErrors();
  }
};
