import { useEffect, useState } from 'react';

import ValidationErrorDisplay from './ValidationErrorDisplay';
import { getFieldClassName } from './ValidationUtils';

const Lifestyle = ({ data, onUpdate, validationErrors = {}, onClearErrors }) => {
  const [formData, setFormData] = useState({
    lastPhysicalExam: '',
    allergies: '',
    medicationsAndSupplements: '',
    hormoneTherapy: {
      used: false,
      details: '',
    },
    smokingOrCannabis: false,
    recreationalDrugs: {
      used: false,
      details: '',
    },
    alcoholConsumption: '',
    exerciseRegimen: '',
    desireForChildren: '',
    referralSource: '',
    referrerName: '',
    ...data,
  });

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({ ...prev, ...data }));
    }
  }, [data]);

  const handleChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onUpdate(updatedData);

    // Clear validation error for this field when user starts typing
    if (validationErrors[field] && onClearErrors) {
      onClearErrors();
    }
  };

  const handleNestedChange = (parentField, field, value) => {
    const updatedData = {
      ...formData,
      [parentField]: {
        ...formData[parentField],
        [field]: value,
      },
    };
    setFormData(updatedData);
    onUpdate(updatedData);

    // Clear validation error for this nested field when user starts typing
    const nestedFieldName = `${parentField}.${field}`;
    if (validationErrors[nestedFieldName] && onClearErrors) {
      onClearErrors();
    }
  };

  const renderRequiredLabel = (label) => (
    <span>
      {label} <span className="text-red-500">*</span>
    </span>
  );

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-800">Lifestyle</h3>
        <p className="text-sm text-gray-600 mt-1">
          Please provide information about your lifestyle and health behaviors
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {renderRequiredLabel('Last Physical Examination')}
          </label>
          <select
            value={formData.lastPhysicalExam}
            onChange={(e) => handleChange('lastPhysicalExam', e.target.value)}
            className={getFieldClassName('lastPhysicalExam', validationErrors)}
            required
          >
            <option value="">Select timeframe</option>
            <option value="Not Applicable">Not Applicable</option>
            <option value="within 6 months">Within 6 months</option>
            <option value="6-12 months ago">6-12 months ago</option>
            <option value="1-2 years ago">1-2 years ago</option>
            <option value="2-5 years ago">2-5 years ago</option>
            <option value="more than 5 years ago">More than 5 years ago</option>
            <option value="never">Never</option>
          </select>
          <ValidationErrorDisplay error={validationErrors.lastPhysicalExam} />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">{renderRequiredLabel('Allergies')}</label>
          <input
            type="text"
            value={formData.allergies}
            onChange={(e) => handleChange('allergies', e.target.value)}
            className={getFieldClassName('allergies', validationErrors)}
            placeholder="List any allergies or write 'None'"
            required
          />
          <ValidationErrorDisplay error={validationErrors.allergies} />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {renderRequiredLabel('Current Medications and Supplements')}
          </label>
          <textarea
            value={formData.medicationsAndSupplements}
            onChange={(e) => handleChange('medicationsAndSupplements', e.target.value)}
            rows={3}
            className={getFieldClassName('medicationsAndSupplements', validationErrors)}
            placeholder="List all current medications, supplements, vitamins, and dosages"
            required
          />
          <ValidationErrorDisplay error={validationErrors.medicationsAndSupplements} />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Hormone Therapy</label>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.hormoneTherapy.used}
                onChange={(e) => handleNestedChange('hormoneTherapy', 'used', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Currently using or have used hormone therapy</span>
            </label>
            {formData.hormoneTherapy.used && (
              <textarea
                value={formData.hormoneTherapy.details}
                onChange={(e) => handleNestedChange('hormoneTherapy', 'details', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Please describe the hormone therapy, duration, and any side effects"
              />
            )}
          </div>
          <ValidationErrorDisplay error={validationErrors['hormoneTherapy.used']} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {renderRequiredLabel('Smoking or Cannabis Use')}
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="smokingOrCannabis"
                checked={formData.smokingOrCannabis === true}
                onChange={() => handleChange('smokingOrCannabis', true)}
                className="border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="smokingOrCannabis"
                checked={formData.smokingOrCannabis === false}
                onChange={() => handleChange('smokingOrCannabis', false)}
                className="border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">No</span>
            </label>
          </div>
          <ValidationErrorDisplay error={validationErrors.smokingOrCannabis} />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Recreational Drug Use</label>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.recreationalDrugs.used}
                onChange={(e) => handleNestedChange('recreationalDrugs', 'used', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Currently using or have used recreational drugs</span>
            </label>
            {formData.recreationalDrugs.used && (
              <textarea
                value={formData.recreationalDrugs.details}
                onChange={(e) => handleNestedChange('recreationalDrugs', 'details', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Please describe the recreational drug use, frequency, and any concerns"
              />
            )}
          </div>
          <ValidationErrorDisplay error={validationErrors['recreationalDrugs.used']} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {renderRequiredLabel('Alcohol Consumption')}
          </label>
          <select
            value={formData.alcoholConsumption}
            onChange={(e) => handleChange('alcoholConsumption', e.target.value)}
            className={getFieldClassName('alcoholConsumption', validationErrors)}
            required
          >
            <option value="">Select frequency</option>
            <option value="never">Never</option>
            <option value="occasional">Occasional (1-2 drinks/week)</option>
            <option value="moderate">Moderate (3-7 drinks/week)</option>
            <option value="heavy">Heavy (8+ drinks/week)</option>
            <option value="former">Former drinker</option>
          </select>
          <ValidationErrorDisplay error={validationErrors.alcoholConsumption} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {renderRequiredLabel('Exercise Regimen')}
          </label>
          <select
            value={formData.exerciseRegimen}
            onChange={(e) => handleChange('exerciseRegimen', e.target.value)}
            className={getFieldClassName('exerciseRegimen', validationErrors)}
            required
          >
            <option value="">Select frequency</option>
            <option value="none">No exercise</option>
            <option value="1-2 times per week">1-2 times per week</option>
            <option value="3 times per week">3 times per week</option>
            <option value="4-5 times per week">4-5 times per week</option>
            <option value="6+ times per week">6+ times per week</option>
          </select>
          <ValidationErrorDisplay error={validationErrors.exerciseRegimen} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {renderRequiredLabel('Desire for Children')}
          </label>
          <select
            value={formData.desireForChildren}
            onChange={(e) => handleChange('desireForChildren', e.target.value)}
            className={getFieldClassName('desireForChildren', validationErrors)}
            required
          >
            <option value="">Select option</option>
            <option value="yes">Yes, planning to have children</option>
            <option value="no">No, not planning to have children</option>
            <option value="unsure">Unsure</option>
            <option value="not applicable">Not applicable</option>
          </select>
          <ValidationErrorDisplay error={validationErrors.desireForChildren} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {renderRequiredLabel('How did you hear about us?')}
          </label>
          <select
            value={formData.referralSource}
            onChange={(e) => handleChange('referralSource', e.target.value)}
            className={getFieldClassName('referralSource', validationErrors)}
            required
          >
            <option value="">Select source</option>
            <option value="self">Self-referral</option>
            <option value="friend">Friend or family</option>
            <option value="doctor">Doctor referral</option>
            <option value="internet">Internet search</option>
            <option value="social media">Social media</option>
            <option value="advertisement">Advertisement</option>
            <option value="other">Other</option>
          </select>
          <ValidationErrorDisplay error={validationErrors.referralSource} />
        </div>

        {formData.referralSource && formData.referralSource !== 'self' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Referrer Name</label>
            <input
              type="text"
              value={formData.referrerName}
              onChange={(e) => handleChange('referrerName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Name of person who referred you"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Lifestyle;
