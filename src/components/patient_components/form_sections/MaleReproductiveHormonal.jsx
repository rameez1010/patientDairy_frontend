import { useEffect, useState } from 'react';

import ValidationErrorDisplay from './ValidationErrorDisplay';
import { getFieldClassName } from './ValidationUtils';

const MaleReproductiveHormonal = ({ data, onUpdate, validationErrors = {}, onClearErrors }) => {
  const [formData, setFormData] = useState({
    symptoms: [],
    howLong: '',
    timing: '',
    effectOnLife: '',
    hypogonadismOrSteroidsUse: [],
    ...data,
  });

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        ...data,
        // Ensure arrays are always initialized
        symptoms: data.symptoms || [],
        hypogonadismOrSteroidsUse: data.hypogonadismOrSteroidsUse || [],
      }));
    }
  }, [data]);

  const symptomsOptions = [
    'low libido',
    'erectile dysfunction',
    'fatigue',
    'decreased muscle mass',
    'increased body fat',
    'mood changes',
    'depression',
    'irritability',
    'decreased energy',
    'difficulty concentrating',
    'memory problems',
    'sleep disturbances',
    'hot flashes',
    'night sweats',
    'decreased facial hair',
    'decreased body hair',
    'gynecomastia',
    'testicular atrophy',
    'infertility',
    'None',
  ];

  const hypogonadismOrSteroidsOptions = [
    'diagnosed hypogonadism',
    'low testosterone levels',
    'previous steroid use',
    'current steroid use',
    'performance enhancing drugs',
    'testosterone replacement therapy',
    'other hormone therapy',
    'testicular surgery',
    'radiation therapy',
    'chemotherapy',
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
        <h3 className="text-lg font-semibold text-gray-800">Male Reproductive &amp; Hormonal Health</h3>
        <p className="text-sm text-gray-600 mt-1">
          Please provide information about your reproductive and hormonal health
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {renderRequiredLabel('Symptoms (Select all that apply)')}
          </label>
          <div
            className={`grid grid-cols-2 md:grid-cols-3 gap-3 p-4 rounded-md ${validationErrors.symptoms ? 'border border-red-300 bg-red-50' : ''}`}
          >
            {symptomsOptions.map((symptom) => (
              <label key={symptom} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.symptoms.includes(symptom)}
                  onChange={() => handleMultiSelect('symptoms', symptom)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {symptom.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </label>
            ))}
          </div>
          <ValidationErrorDisplay error={validationErrors.symptoms} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {renderRequiredLabel('How long have you been experiencing these symptoms?')}
            </label>
            <select
              value={formData.howLong}
              onChange={(e) => handleChange('howLong', e.target.value)}
              className={getFieldClassName('howLong', validationErrors)}
              required
            >
              <option value="">Select duration</option>
              <option value="Not Applicable">Not Applicable</option>
              <option value="less than 3 months">Less than 3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6-12 months">6-12 months</option>
              <option value="1-2 years">1-2 years</option>
              <option value="2-5 years">2-5 years</option>
              <option value="more than 5 years">More than 5 years</option>
            </select>
            <ValidationErrorDisplay error={validationErrors.howLong} />
          </div>

          <div className="flex flex-col justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {renderRequiredLabel('When do symptoms typically occur?')}
            </label>
            <select
              value={formData.timing}
              onChange={(e) => handleChange('timing', e.target.value)}
              className={getFieldClassName('timing', validationErrors)}
              required
            >
              <option value="">Select timing</option>
              <option value="Not Applicable">Not Applicable</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
              <option value="throughout the day">Throughout the day</option>
              <option value="during stress">During stress</option>
              <option value="after exercise">After exercise</option>
              <option value="random">Random</option>
            </select>
            <ValidationErrorDisplay error={validationErrors.timing} />
          </div>

          <div className="flex flex-col justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {renderRequiredLabel('How do these symptoms affect your life?')}
            </label>
            <select
              value={formData.effectOnLife}
              onChange={(e) => handleChange('effectOnLife', e.target.value)}
              className={getFieldClassName('effectOnLife', validationErrors)}
              required
            >
              <option value="">Select impact</option>
              <option value="Not Applicable">Not Applicable</option>
              <option value="mild">Mild - Minor inconvenience</option>
              <option value="moderate">Moderate - Affects daily activities</option>
              <option value="severe">Severe - Significantly impacts life</option>
              <option value="debilitating">Debilitating - Unable to function normally</option>
            </select>
            <ValidationErrorDisplay error={validationErrors.effectOnLife} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {renderRequiredLabel('Hypogonadism or Steroid Use History (Select all that apply)')}
          </label>
          <div
            className={`grid grid-cols-2 md:grid-cols-3 gap-3 p-4 rounded-md ${validationErrors.hypogonadismOrSteroidsUse ? 'border border-red-300 bg-red-50' : ''}`}
          >
            {hypogonadismOrSteroidsOptions.map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hypogonadismOrSteroidsUse.includes(option)}
                  onChange={() => handleMultiSelect('hypogonadismOrSteroidsUse', option)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {option.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </label>
            ))}
          </div>
          <ValidationErrorDisplay error={validationErrors.hypogonadismOrSteroidsUse} />
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Important Note</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  This information helps us understand your hormonal health and develop appropriate treatment plans. All
                  information is kept confidential and will only be used for your medical care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaleReproductiveHormonal;
