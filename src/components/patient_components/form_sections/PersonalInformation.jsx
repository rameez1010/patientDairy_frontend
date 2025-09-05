import { useEffect, useState } from 'react';

import ValidationErrorDisplay from './ValidationErrorDisplay';
import { getFieldClassName } from './ValidationUtils';

const PersonalInformation = ({ data, onUpdate, validationErrors = {}, onClearErrors, patientData }) => {
  const [formData, setFormData] = useState({
    fullName: `${patientData?.firstName} ${patientData?.lastName}`,
    address: `${patientData?.address}`,
    phone: `${patientData?.phone}`,
    email: `${patientData?.email}`,
    dateOfBirth: '',
    age: '',
    maritalStatus: '',
    gender: `${patientData?.gender}`,
    weight: '',
    height: '',
    bloodPressure: '',
    primaryCareProvider: '',
    ...data,
  });

  useEffect(() => {
    if (data) {
      // Format date for HTML date input (YYYY-MM-DD)
      const formattedData = { ...data };
      if (data.dateOfBirth) {
        const date = new Date(data.dateOfBirth);
        if (!isNaN(date.getTime())) {
          formattedData.dateOfBirth = date.toISOString().split('T')[0];
        }
      }
      setFormData((prev) => ({ ...prev, ...formattedData }));
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

  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age.toString();
  };

  const renderRequiredLabel = (label) => (
    <span>
      {label} <span className="text-red-500">*</span>
    </span>
  );

  console.log('Form data', formData);
  // listen on the date of birth change and calculate the age
  useEffect(() => {
    if (formData.dateOfBirth) {
      const age = calculateAge(formData.dateOfBirth);
      handleChange('age', age);
    }
  }, [formData.dateOfBirth]);
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
        <p className="text-sm text-gray-600 mt-1">Please provide your basic personal details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{renderRequiredLabel('Full Name')}</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className={getFieldClassName('fullName', validationErrors)}
            placeholder="Enter your full name"
            required
          />
          <ValidationErrorDisplay error={validationErrors.fullName} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{renderRequiredLabel('Email Address')}</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={getFieldClassName('email', validationErrors)}
            placeholder="Enter your email address"
            required
          />
          <ValidationErrorDisplay error={validationErrors.email} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{renderRequiredLabel('Phone Number')}</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={getFieldClassName('phone', validationErrors)}
            placeholder="Enter your phone number"
            required
          />
          <ValidationErrorDisplay error={validationErrors.phone} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{renderRequiredLabel('Date of Birth')}</label>
          <input
            type="date"
            defaultValue={formData.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            className={getFieldClassName('dateOfBirth', validationErrors)}
            required
          />
          <ValidationErrorDisplay error={validationErrors.dateOfBirth} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{renderRequiredLabel('Age')}</label>
          <input
            type="number"
            value={formData.age}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            placeholder="Calculated from date of birth"
            required
          />
          <ValidationErrorDisplay error={validationErrors.age} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{renderRequiredLabel('Gender')}</label>
          <select
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className={getFieldClassName('gender', validationErrors)}
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <ValidationErrorDisplay error={validationErrors.gender} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {renderRequiredLabel('Marital Status')}
          </label>
          <select
            value={formData.maritalStatus}
            onChange={(e) => handleChange('maritalStatus', e.target.value)}
            className={getFieldClassName('maritalStatus', validationErrors)}
            required
          >
            <option value="">Select marital status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
            <option value="separated">Separated</option>
          </select>
          <ValidationErrorDisplay error={validationErrors.maritalStatus} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{renderRequiredLabel('Weight (kg)')}</label>
          <input
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            className={getFieldClassName('weight', validationErrors)}
            placeholder="Enter weight in kg"
            required
          />
          <ValidationErrorDisplay error={validationErrors.weight} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{renderRequiredLabel('Height')}</label>
          <input
            type="text"
            value={formData.height}
            onChange={(e) => handleChange('height', e.target.value)}
            className={getFieldClassName('height', validationErrors)}
            placeholder="e.g., 5'10&quot; or 178 cm"
            required
          />
          <ValidationErrorDisplay error={validationErrors.height} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {renderRequiredLabel('Blood Pressure')}
          </label>
          <input
            type="text"
            value={formData.bloodPressure}
            onChange={(e) => handleChange('bloodPressure', e.target.value)}
            className={getFieldClassName('bloodPressure', validationErrors)}
            placeholder="e.g., 120/80"
            required
          />
          <ValidationErrorDisplay error={validationErrors.bloodPressure} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {renderRequiredLabel('Primary Care Provider')}
          </label>
          <input
            type="text"
            value={formData.primaryCareProvider}
            onChange={(e) => handleChange('primaryCareProvider', e.target.value)}
            className={getFieldClassName('primaryCareProvider', validationErrors)}
            placeholder="Enter your primary care provider's name"
            required
          />
          <ValidationErrorDisplay error={validationErrors.primaryCareProvider} />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">{renderRequiredLabel('Address')}</label>
          <textarea
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className={getFieldClassName('address', validationErrors)}
            rows="3"
            placeholder="Enter your full address"
            required
          />
          <ValidationErrorDisplay error={validationErrors.address} />
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
