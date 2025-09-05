import { useEffect, useState } from 'react';

import ValidationErrorDisplay from './ValidationErrorDisplay';
import { getFieldClassName } from './ValidationUtils';

const FamilyHistory = ({ data, onUpdate, validationErrors = {}, onClearErrors }) => {
  const [formData, setFormData] = useState({
    conditions: [],
    otherFamilyHistory: '',
    fatherAgeOrDeath: '',
    fatherHealthStatus: '',
    fatherHealthReason: '',
    motherAgeOrDeath: '',
    motherHealthStatus: '',
    motherHealthReason: '',
    ...data,
  });

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        ...data,
        // Ensure arrays are always initialized
        conditions: data.conditions || [],
      }));
    }
  }, [data]);

  const familyConditionsOptions = [
    'heart disease',
    'diabetes',
    'cancer',
    'hypertension',
    'high cholesterol',
    'stroke',
    'kidney disease',
    'liver disease',
    'lung disease',
    'arthritis',
    'depression',
    'anxiety',
    'bipolar disorder',
    'schizophrenia',
    'alzheimer',
    'parkinson',
    'multiple sclerosis',
    'autoimmune diseases',
    'thyroid disorders',
    'obesity',
    'substance abuse',
    'eating disorders',
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
        <h3 className="text-lg font-semibold text-gray-800">Family History</h3>
        <p className="text-sm text-gray-600 mt-1">Please provide information about your family&apos;s health history</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {renderRequiredLabel('Family Health Conditions (Select all that apply)')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {familyConditionsOptions.map((condition) => (
              <label key={condition} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.conditions.includes(condition)}
                  onChange={() => handleMultiSelect('conditions', condition)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {condition.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </label>
            ))}
          </div>
          <ValidationErrorDisplay error={validationErrors.conditions} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Other Family History</label>
          <textarea
            value={formData.otherFamilyHistory}
            onChange={(e) => handleChange('otherFamilyHistory', e.target.value)}
            rows={3}
            className={getFieldClassName('otherFamilyHistory', validationErrors)}
            placeholder="Please describe any other family health conditions not listed above"
          />
          <ValidationErrorDisplay error={validationErrors.otherFamilyHistory} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Father's Information */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-800">Father&apos;s Information</h4>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {renderRequiredLabel("Father's Age or Age at Death")}
              </label>
              <input
                type="text"
                value={formData.fatherAgeOrDeath}
                onChange={(e) => handleChange('fatherAgeOrDeath', e.target.value)}
                className={getFieldClassName('fatherAgeOrDeath', validationErrors)}
                placeholder="e.g., 65 or 65 (deceased)"
                required
              />
              <ValidationErrorDisplay error={validationErrors.fatherAgeOrDeath} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {renderRequiredLabel("Father's Health Status")}
              </label>
              <select
                value={formData.fatherHealthStatus}
                onChange={(e) => handleChange('fatherHealthStatus', e.target.value)}
                className={getFieldClassName('fatherHealthStatus', validationErrors)}
                required
              >
                <option value="">Select status</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="alive">Alive</option>
                <option value="deceased">Deceased</option>
                <option value="unknown">Unknown</option>
              </select>
              <ValidationErrorDisplay error={validationErrors.fatherHealthStatus} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Father&apos;s Health Issues or Cause of Death
              </label>
              <textarea
                value={formData.fatherHealthReason}
                onChange={(e) => handleChange('fatherHealthReason', e.target.value)}
                rows={2}
                className={getFieldClassName('fatherHealthReason', validationErrors)}
                placeholder="Describe father's health issues or cause of death"
              />
              <ValidationErrorDisplay error={validationErrors.fatherHealthReason} />
            </div>
          </div>

          {/* Mother's Information */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-800">Mother&apos;s Information</h4>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {renderRequiredLabel("Mother's Age or Age at Death")}
              </label>
              <input
                type="text"
                value={formData.motherAgeOrDeath}
                onChange={(e) => handleChange('motherAgeOrDeath', e.target.value)}
                className={getFieldClassName('motherAgeOrDeath', validationErrors)}
                placeholder="e.g., 70 or 70 (deceased)"
                required
              />
              <ValidationErrorDisplay error={validationErrors.motherAgeOrDeath} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {renderRequiredLabel("Mother's Health Status")}
              </label>
              <select
                value={formData.motherHealthStatus}
                onChange={(e) => handleChange('motherHealthStatus', e.target.value)}
                className={getFieldClassName('motherHealthStatus', validationErrors)}
                required
              >
                <option value="">Select status</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="alive">Alive</option>
                <option value="deceased">Deceased</option>
                <option value="unknown">Unknown</option>
              </select>
              <ValidationErrorDisplay error={validationErrors.motherHealthStatus} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mother&apos;s Health Issues or Cause of Death
              </label>
              <textarea
                value={formData.motherHealthReason}
                onChange={(e) => handleChange('motherHealthReason', e.target.value)}
                rows={2}
                className={getFieldClassName('motherHealthReason', validationErrors)}
                placeholder="Describe mother's health issues or cause of death"
              />
              <ValidationErrorDisplay error={validationErrors.motherHealthReason} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyHistory;
