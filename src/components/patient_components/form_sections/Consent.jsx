import { useEffect, useState } from 'react';

import ValidationErrorDisplay from './ValidationErrorDisplay';
import { getFieldClassName } from './ValidationUtils';

const Consent = ({ data, onUpdate, validationErrors = {}, onClearErrors }) => {
  const [formData, setFormData] = useState({
    acceptedTerms: false,
    signature: '',
    healthCardNumber: '',
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

  const renderRequiredLabel = (label) => (
    <span>
      {label} <span className="text-red-500">*</span>
    </span>
  );

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-800">Consent and Agreement</h3>
        <p className="text-sm text-gray-600 mt-1">Please review and agree to the terms and conditions</p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-md font-medium text-gray-800 mb-3">Terms and Conditions</h4>
          <div className="text-sm text-gray-700 space-y-2">
            <p>By completing this Functional Medicine Intake Form, I acknowledge and agree to the following:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>I am providing accurate and complete information to the best of my knowledge</li>
              <li>I understand that this information will be used for medical assessment and treatment planning</li>
              <li>I consent to the collection, use, and storage of my personal health information</li>
              <li>I understand that my information will be kept confidential and secure</li>
              <li>I have the right to access, correct, or withdraw my information at any time</li>
              <li>I understand that this form does not establish a doctor-patient relationship</li>
              <li>I agree to be contacted regarding my health information and treatment recommendations</li>
            </ul>
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.acceptedTerms}
              onChange={(e) => handleChange('acceptedTerms', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              required
            />
            <span className="text-sm text-gray-700">
              I have read, understood, and agree to the terms and conditions above{' '}
              <span className="text-red-500">*</span>
            </span>
          </label>
          <ValidationErrorDisplay error={validationErrors.acceptedTerms} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {renderRequiredLabel('Digital Signature')}
          </label>
          <input
            type="text"
            value={formData.signature}
            onChange={(e) => handleChange('signature', e.target.value)}
            className={getFieldClassName('signature', validationErrors)}
            placeholder="Type your full name as your digital signature"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            By typing your name above, you are providing your digital signature indicating your agreement to the terms.
          </p>
          <ValidationErrorDisplay error={validationErrors.signature} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Health Card Number (optional)</label>
          <input
            type="text"
            id="healthCardNumber"
            name="healthCardNumber"
            className={getFieldClassName('healthCardNumber', validationErrors)}
            value={formData.healthCardNumber || ''}
            onChange={(e) => handleChange('healthCardNumber', e.target.value)}
            placeholder="Enter your health card number (optional)"
          />
          <p className="text-xs text-gray-500 mt-1">
            You may provide your health card or insurance number for our records. This is optional.
          </p>
          <ValidationErrorDisplay error={validationErrors.healthCardNumber} />
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
              <h3 className="text-sm font-medium text-blue-800">Important Information</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  This form is part of your comprehensive health assessment. All information provided will be reviewed
                  by our healthcare team to develop personalized treatment recommendations. Your privacy and
                  confidentiality are our top priorities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consent;
