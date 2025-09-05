import { useState } from 'react';

import { jwtDecode } from 'jwt-decode';
import toast, { Toaster } from 'react-hot-toast';

import doctorApiService from '../../services/doctorApiService';
import Button from '../common/Button';
import ValidationErrorDisplay from '../patient_components/form_sections/ValidationErrorDisplay';

const CreateNewPatient = ({ closeCreatePatient }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const fieldsToValidate = {
    firstName,
    lastName,
    phone,
    email,
    gender,
    address,
  };
  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        setErrors((prev) => {
          const errs = { ...prev };
          if (!value) {
            errs[name] = `${name === 'firstName' ? 'First' : 'Last'} name is required`;
          } else if (value.trim().length < 3) {
            errs[name] = `${name === 'firstName' ? 'First' : 'Last'} name must be at least 3 characters`;
          } else {
            delete errs[name];
          }
          return errs;
        });
        break;

      case 'phone':
        setErrors((prev) => {
          const errs = { ...prev };
          if (!value) {
            errs.phone = 'Phone number is required';
          } else {
            delete errs.phone;
          }
          return errs;
        });
        break;

      case 'email':
        setErrors((prev) => {
          const errs = { ...prev };
          if (!value) {
            errs.email = 'Email is required';
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errs.email = 'Enter a valid email address';
          } else {
            delete errs.email;
          }
          return errs;
        });
        break;

      case 'gender':
        setErrors((prev) => {
          const errs = { ...prev };
          if (!value.trim()) {
            errs.gender = 'Please select a gender';
          } else {
            delete errs.gender;
          }
          return errs;
        });
        break;

      case 'address':
        setErrors((prev) => {
          const errs = { ...prev };
          if (!value.trim()) {
            errs.address = 'Address is required';
          } else {
            delete errs.address;
          }
          return errs;
        });
        break;

      default:
        break;
    }
  };

  const notifyError = (toastMessage) => {
    toast.error(toastMessage);
  };

  const notifySuccess = (toastMessage) => {
    toast.success(toastMessage);
  };

  const clearErrors = (fieldName = '') => {
    if (fieldName) {
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    } else {
      setErrors({});
    }
  };

  const handlePatientSubmit = async (event) => {
    setApiError('');
    event.preventDefault();

    Object.entries(fieldsToValidate).forEach(([fieldName, value]) => {
      validateField(fieldName, value);
    });

    if (Object.keys(errors).length > 0) {
      return;
    }
    clearErrors();

    try {
      setLoading(true);
      const token = doctorApiService.getAccessToken();
      const decodedToken = jwtDecode(token);

      await doctorApiService.post('/patients/add', {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        address: address,
        gender: gender,
        practitioner: decodedToken.first_name + ' ' + decodedToken.last_name,
      });

      notifySuccess(<div className="text-sm font-light">Patient created successfully!</div>);
      closeCreatePatient();
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.message) {
        setApiError(err.response.data.message);
      }
      if (err.response && err.response.data && err.response.data.errors) {
        const backendErrors = err.response.data.errors;

        // Handle validation errors
        if (backendErrors.errors_by_field) {
          const fieldErrors = {};

          Object.keys(backendErrors.errors_by_field).forEach((fieldKey) => {
            // Extract field name from the backend field key (e.g., "body.gender" -> "gender")
            const fieldName = fieldKey.split('.').pop();
            const fieldError = backendErrors.errors_by_field[fieldKey][0];

            fieldErrors[fieldName] = {
              message: fieldError.message,
              suggestions: fieldError.suggestions || [],
            };
          });

          setErrors(fieldErrors);
        }

        // Show general error message
        const errorMessage =
          err.response.data.message || 'Failed to create patient. Please check the form and try again.';
        notifyError(<div className="text-sm font-light">{errorMessage}</div>);
      } else {
        // Fallback for other types of errors
        notifyError(<div className="text-sm font-light">Failed to create patient. Please try again!</div>);
      }
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (fieldName) => {
    return errors[fieldName];
  };

  const renderError = (fieldName) => {
    const error = getFieldError(fieldName);
    if (!error) return null;

    return (
      <div className="text-red-500 text-xs mt-1">
        <div className="font-medium">{error.message || error}</div>
        {error.suggestions && error.suggestions.length > 0 && (
          <div className="text-gray-600 mt-1">
            <div className="font-medium">Suggestions:</div>
            <ul className="list-disc list-inside ml-2">
              {error.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
        <h2 className="p-2 border-b-[1px] text-base font-semibold leading-6 text-gray-600">Create a new patient</h2>
        {apiError && (
          <div className="px-5 pt-2">
            <ValidationErrorDisplay error={{ message: apiError }} />
          </div>
        )}
        <form onSubmit={handlePatientSubmit} className="bg-white rounded px-8 pt-6 pb-8 mb-4">
          <div className="flex justify-between gap-4">
            <div className="mb-4 flex-1 min-w-0">
              <label className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
              <input
                className={`shadow appearance-none border w-full rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  getFieldError('firstName') ? 'border-red-500' : ''
                }`}
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => {
                  const value = e.target.value;
                  setFirstName(value);
                  validateField('firstName', value);
                }}
                required
              />
              <div className="min-h-[20px]">{renderError('firstName')}</div>
            </div>
            <div className="mb-4 flex-1 min-w-0">
              <label className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
              <input
                className={`shadow appearance-none border w-full rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  getFieldError('lastName') ? 'border-red-500' : ''
                }`}
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => {
                  const value = e.target.value;
                  setLastName(value);
                  validateField('lastName', value);
                }}
                required
              />
              <div className="min-h-[20px]">{renderError('lastName')}</div>
            </div>
          </div>
          <div className="flex justify-between gap-4">
            {' '}
            <div className="mb-4 flex-1 min-w-0">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                  getFieldError('email') ? 'border-red-500' : ''
                }`}
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmail(value);
                  validateField('email', value);
                  setApiError('');
                }}
                required
              />
              {renderError('email')}
            </div>
            <div className="mb-4 flex-1 min-w-0">
              <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                  getFieldError('phone') ? 'border-red-500' : ''
                }`}
                id="phone"
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value;
                  setPhone(value);
                  validateField('phone', value);
                  setApiError('');
                }}
                required
              />
              {renderError('phone')}
            </div>
          </div>
          <Toaster position="top-center" reverseOrder={false} />
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
            <select
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                getFieldError('gender') ? 'border-red-500' : ''
              }`}
              value={gender}
              onChange={(e) => {
                const value = e.target.value;
                setGender(value);
                validateField('gender', value);
              }}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {renderError('gender')}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                getFieldError('address') ? 'border-red-500' : ''
              }`}
              id="address"
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => {
                const value = e.target.value;
                setAddress(value);
                validateField('address', value);
              }}
              required
            />
            {renderError('address')}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="solid" loading={loading} type="submit" style={{ fontWeight: 'normal' }}>
              Create Patient
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                closeCreatePatient();
              }}
              variant="custom"
              className="bg-gray-400 hover:bg-gray-500 text-white"
              style={{ fontWeight: 'normal' }}
            >
              Close
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewPatient;
