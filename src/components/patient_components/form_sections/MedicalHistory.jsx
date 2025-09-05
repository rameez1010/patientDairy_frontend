import { useEffect, useState } from 'react';

import ValidationErrorDisplay from './ValidationErrorDisplay';
import { getFieldClassName } from './ValidationUtils';

const MedicalHistory = ({ data, onUpdate, validationErrors = {}, onClearErrors }) => {
  const [formData, setFormData] = useState({
    pastMedicalHistory: [],
    otherMedicalHistory: '',
    cardiacHistory: [],
    otherCardiacHistory: '',
    ...data,
  });

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        ...data,
        // Ensure arrays are always initialized
        pastMedicalHistory: data.pastMedicalHistory || [],
        cardiacHistory: data.cardiacHistory || [],
      }));
    }
  }, [data]);

  const pastMedicalHistoryOptions = [
    'diabetes',
    'hypertension',
    'high cholesterol',
    'thyroid disorders',
    'autoimmune diseases',
    'cancer',
    'stroke',
    'heart attack',
    'kidney disease',
    'liver disease',
    'lung disease',
    'arthritis',
    'depression',
    'anxiety',
    'eating disorders',
    'substance abuse',
    'infectious diseases',
    'surgery',
    'hospitalizations',
    'None',
  ];

  const cardiacHistoryOptions = [
    'heart attack',
    'angina',
    'arrhythmia',
    'heart failure',
    'valve problems',
    'congenital heart disease',
    'pericarditis',
    'cardiomyopathy',
    'coronary artery disease',
    'high blood pressure',
    'None',
  ];

  const handleChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onUpdate(updatedData);

    // Clear validation error for this field when user starts typing
    if (validationErrors[field] && onClearErrors) {
      onClearErrors();
    }
  };

  const handleMultiSelect = (field, value) => {
    const currentValues = formData[field] || [];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    handleChange(field, updatedValues);
  };

  const renderRequiredLabel = (label) => (
    <span>
      {label} <span className="text-red-500">*</span>
    </span>
  );

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-800">Medical History</h3>
        <p className="text-sm text-gray-600 mt-1">Please provide information about your past medical conditions</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {renderRequiredLabel('Past Medical History (Select all that apply)')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {pastMedicalHistoryOptions.map((condition) => (
              <label key={condition} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.pastMedicalHistory.includes(condition)}
                  onChange={() => handleMultiSelect('pastMedicalHistory', condition)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {condition.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </label>
            ))}
          </div>
          <ValidationErrorDisplay error={validationErrors.pastMedicalHistory} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Other Medical History</label>
          <textarea
            value={formData.otherMedicalHistory}
            onChange={(e) => handleChange('otherMedicalHistory', e.target.value)}
            rows={3}
            className={getFieldClassName('otherMedicalHistory', validationErrors)}
            placeholder="Please describe any other medical conditions, surgeries, or hospitalizations not listed above"
          />
          <ValidationErrorDisplay error={validationErrors.otherMedicalHistory} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {renderRequiredLabel('Cardiac History (Select all that apply)')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {cardiacHistoryOptions.map((condition) => (
              <label key={condition} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.cardiacHistory.includes(condition)}
                  onChange={() => handleMultiSelect('cardiacHistory', condition)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {condition.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </label>
            ))}
          </div>
          <ValidationErrorDisplay error={validationErrors.cardiacHistory} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Other Cardiac History</label>
          <textarea
            value={formData.otherCardiacHistory}
            onChange={(e) => handleChange('otherCardiacHistory', e.target.value)}
            rows={3}
            className={getFieldClassName('otherCardiacHistory', validationErrors)}
            placeholder="Please describe any other cardiac conditions or procedures not listed above"
          />
          <ValidationErrorDisplay error={validationErrors.otherCardiacHistory} />
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;
