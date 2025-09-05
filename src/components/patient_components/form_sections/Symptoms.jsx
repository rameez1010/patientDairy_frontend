import { useEffect, useState } from 'react';

import ValidationErrorDisplay from './ValidationErrorDisplay';
import { getFieldClassName } from './ValidationUtils';

const Symptoms = ({ data, onUpdate, validationErrors = {}, onClearErrors }) => {
  const [formData, setFormData] = useState({
    generalSymptoms: [],
    additionalSymptoms: [],
    symptomDuration: '',
    symptomTiming: '',
    symptomImpact: '',
    ...data,
  });

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        ...data,
        // Ensure arrays are always initialized
        generalSymptoms: data.generalSymptoms || [],
        additionalSymptoms: data.additionalSymptoms || [],
      }));
    }
  }, [data]);

  const generalSymptomsOptions = [
    'fatigue',
    'headaches',
    'joint pain',
    'muscle aches',
    'digestive issues',
    'sleep problems',
    'mood changes',
    'weight changes',
    'skin problems',
    'respiratory issues',
    'cardiovascular symptoms',
    'neurological symptoms',
  ];

  const additionalSymptomsOptions = [
    'insomnia',
    'anxiety',
    'depression',
    'brain fog',
    'memory problems',
    'concentration issues',
    'irritability',
    'hot flashes',
    'night sweats',
    'palpitations',
    'dizziness',
    'nausea',
    'bloating',
    'constipation',
    'diarrhea',
    'acid reflux',
    'food sensitivities',
    'allergies',
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
        <h3 className="text-lg font-semibold text-gray-800">Symptoms</h3>
        <p className="text-sm text-gray-600 mt-1">Please describe your current symptoms and their impact</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {renderRequiredLabel('General Symptoms (Select all that apply)')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {generalSymptomsOptions.map((symptom) => (
              <label key={symptom} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.generalSymptoms.includes(symptom)}
                  onChange={() => handleMultiSelect('generalSymptoms', symptom)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {symptom.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </label>
            ))}
          </div>
          <ValidationErrorDisplay error={validationErrors.generalSymptoms} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {renderRequiredLabel('Additional Symptoms (Select all that apply)')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {additionalSymptomsOptions.map((symptom) => (
              <label key={symptom} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.additionalSymptoms.includes(symptom)}
                  onChange={() => handleMultiSelect('additionalSymptoms', symptom)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {symptom.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </label>
            ))}
          </div>
          <ValidationErrorDisplay error={validationErrors.additionalSymptoms} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {renderRequiredLabel('How long have you been experiencing these symptoms?')}
            </label>
            <select
              value={formData.symptomDuration}
              onChange={(e) => handleChange('symptomDuration', e.target.value)}
              className={getFieldClassName('symptomDuration', validationErrors)}
              required
            >
              <option value="">Select duration</option>
              <option value="less than 1 week">Less than 1 week</option>
              <option value="1-2 weeks">1-2 weeks</option>
              <option value="1 month">1 month</option>
              <option value="3 months">3 months</option>
              <option value="6 months">6 months</option>
              <option value="1 year">1 year</option>
              <option value="more than 1 year">More than 1 year</option>
            </select>
            <ValidationErrorDisplay error={validationErrors.symptomDuration} />
          </div>

          <div className="flex flex-col justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {renderRequiredLabel('When do symptoms typically occur?')}
            </label>
            <select
              value={formData.symptomTiming}
              onChange={(e) => handleChange('symptomTiming', e.target.value)}
              className={getFieldClassName('symptomTiming', validationErrors)}
              required
            >
              <option value="">Select timing</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
              <option value="throughout the day">Throughout the day</option>
              <option value="after meals">After meals</option>
              <option value="before meals">Before meals</option>
              <option value="during stress">During stress</option>
              <option value="random">Random</option>
            </select>
            <ValidationErrorDisplay error={validationErrors.symptomTiming} />
          </div>

          <div className="flex flex-col justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {renderRequiredLabel('How do these symptoms impact your daily life?')}
            </label>
            <select
              value={formData.symptomImpact}
              onChange={(e) => handleChange('symptomImpact', e.target.value)}
              className={getFieldClassName('symptomImpact', validationErrors)}
              required
            >
              <option value="">Select impact level</option>
              <option value="mild">Mild - Minor inconvenience</option>
              <option value="moderate">Moderate - Affects daily activities</option>
              <option value="severe">Severe - Significantly impacts life</option>
              <option value="debilitating">Debilitating - Unable to function normally</option>
            </select>
            <ValidationErrorDisplay error={validationErrors.symptomImpact} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Symptoms;
