import { useEffect, useState } from 'react';

import { jwtDecode } from 'jwt-decode';
import toast, { Toaster } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa6';
import { GiMedicines } from 'react-icons/gi';
import { IoIosLock, IoMdSettings } from 'react-icons/io';

import patientApiService from '../../services/patientApiService';
import { getPasswordCriteriaList, validatePassword } from '../../utils/passwordValidation';
import LoaderOverlay from '../common/LoaderOverlay';
import MedicalIntakeFormModal from './MedicalIntakeFormModal';
import ValidationErrorDisplay from './form_sections/ValidationErrorDisplay';

const PatientSettings = () => {
  const [currentPatinet, setCurrentPatient] = useState(null);
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [isMedicalFormCompleted, setIsMedicalFormCompleted] = useState(false);
  const [reCheckCompletion, setReCheckCompletion] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCriteria, setNewPasswordCriteria] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(true);

  const notifyError = (toastMessage) => {
    toast.error(toastMessage);
  };

  const notifySuccess = (toastMessage) => {
    toast.success(toastMessage);
  };
  const discardChanges = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setNewPasswordCriteria({
      minLength: false,
      uppercase: false,
      lowercase: false,
      number: false,
      specialChar: false,
    });
    setCurrentPasswordError('');
    setApiError('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePasswordFieldError = (field, value, currentPasswordValue, newPasswordValue) => {
    setApiError('');
    if (field === 'newPassword') {
      if (!currentPasswordValue || !value) {
        setPasswordError('All fields are required.');
      } else {
        setPasswordError('');
      }
    } else if (field === 'confirmPassword') {
      if (!currentPasswordValue || !newPasswordValue || !value) {
        setPasswordError('All fields are required.');
      } else if (newPasswordValue !== value) {
        setPasswordError('New password and confirm password do not match.');
      } else {
        setPasswordError('');
      }
    } else if (field === 'currentPassword') {
      if (!value || value.length < 3) {
        setCurrentPasswordError('Password must be at least 3 characters.');
      } else {
        setCurrentPasswordError('');
      }
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }
    if (!currentPassword || currentPassword.length < 3) {
      setCurrentPasswordError('Password must be at least 3 characters.');
      return;
    }
    if (
      !newPasswordCriteria.minLength ||
      !newPasswordCriteria.uppercase ||
      !newPasswordCriteria.lowercase ||
      !newPasswordCriteria.number ||
      !newPasswordCriteria.specialChar
    ) {
      return;
    }
    setPasswordLoading(true);
    try {
      const response = await patientApiService.put('/patients/update-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Password update failed');
      }
      notifySuccess(<div className="text-sm font-light">Password updated successfully.</div>);
      discardChanges();
    } catch (err) {
      if (err.response && err.response.data?.message) {
        notifyError(<div className="text-sm font-light">{err.response.data.message}</div>);
        setApiError(err.response.data.message);
      } else if (err.response && err.response.status === 400) {
        notifyError(<div className="text-sm font-light">Current password is incorrect.</div>);
        setApiError('Current password is incorrect.');
      } else {
        notifyError(<div className="text-sm font-light">Failed to update password. Please try again.</div>);
        setApiError('Failed to update password. Please try again.');
      }
      console.error('Error updating password:', err);
    } finally {
      setPasswordLoading(false);
    }
  };

  const checkFormCompletion = async () => {
    try {
      const response = await patientApiService.get('/medical-form/completion-status');
      const isComplete = response.data.data.is_complete;

      if (isComplete) {
        setIsMedicalFormCompleted(true);
      }
    } catch (error) {
      console.log('Error checking form completion:', error);
      setIsMedicalFormCompleted(false);
    }
  };

  useEffect(() => {
    const getPatient = async () => {
      try {
        setLoading(true);
        const token = patientApiService.getAccessToken();
        const decodedToken = jwtDecode(token);

        const response = await patientApiService.get(`/patients/self/${decodedToken.sub}`);
        setCurrentPatient(response.data.data);
        console.log('patient data is :', response.data);
      } catch (error) {
        console.log('Error fetching current patient data :', error);
      } finally {
        setLoading(false);
      }
    };
    getPatient();
  }, []);

  useEffect(() => {
    checkFormCompletion();
  }, [reCheckCompletion]);

  if (loading) {
    return (
      <div className="h-screen bg-white w-full pt-10 pl-8 flex items-center justify-center">
        <LoaderOverlay loading={loading} size={14} textSize="text-xs">
          Loading Profile Data...
        </LoaderOverlay>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white w-full pt-10 px-8">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-end md:justify-start w-full">
        <h1 className="text-xl font-bold text-gray-600 flex items-center gap-2">
          <IoMdSettings />
          Settings
        </h1>
      </div>
      <div className="bg-white border shadow w-full rounded-md mt-6">
        {/* profile */}
        <h2 className="p-3 font-light flex items-center gap-2 text-gray-600">
          <FaUser />
          Your Profile
        </h2>
        <div className="">
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-purple-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">First Name</dt>
                <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">{currentPatinet?.firstName}</dd>
              </div>
              <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">{currentPatinet?.lastName}</dd>
              </div>
              <div className="bg-purple-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Title</dt>
                <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">Patient</dd>
              </div>
              <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">{currentPatinet?.email}</dd>
              </div>
              <div className="bg-purple-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 rounded-b sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">{currentPatinet?.phone}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <div className="p-4 bg-white border shadow w-full rounded-md mt-6">
        <div className="flex flex-col md:flex-row gap-2 md:gap-6">
          {/* Change Password */}
          <div className="w-full md:w-1/2">
            <h2 className="font-light pb-2 flex items-center gap-2 text-gray-600 border-b">
              <IoIosLock />
              Change Password
            </h2>
            {apiError && <ValidationErrorDisplay error={{ message: apiError }} width="w-full" />}
            <form id="changePasswordForm" className="space-y-2 w-full mt-4 mb-6" onSubmit={handlePasswordChange}>
              <div>
                <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 block mb-2">
                  Current Password *
                </label>
                <div className="relative mt-2">
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPassword.currentPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      handlePasswordFieldError('currentPassword', e.target.value, e.target.value, newPassword);
                    }}
                    className="block w-full px-2 rounded border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                    onClick={() => togglePasswordVisibility('currentPassword')}
                  >
                    {showPassword.currentPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {currentPasswordError && <div className="text-red-500 text-xs mt-2">{currentPasswordError}</div>}
              </div>
              <div>
                <label htmlFor="newPassword" className="text-sm font-medium text-gray-700 block mb-2">
                  New Password *
                </label>
                <div className="relative mt-2">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword.newPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      const { criteria } = validatePassword(e.target.value);
                      setNewPasswordCriteria(criteria);
                      handlePasswordFieldError('newPassword', e.target.value, currentPassword, e.target.value);
                    }}
                    className="block w-full px-2 rounded border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                    onClick={() => togglePasswordVisibility('newPassword')}
                  >
                    {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {newPassword && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Password must contain:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {getPasswordCriteriaList().map((criterion, index) => (
                        <li
                          key={index}
                          className={`flex items-center ${newPasswordCriteria[criterion.key] ? 'text-green-600' : 'text-red-500'}`}
                        >
                          <span className="mr-2">{newPasswordCriteria[criterion.key] ? '✓' : '○'}</span>
                          {criterion.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block mb-2">
                  Confirm New Password *
                </label>
                <div className="relative mt-2">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword.confirmPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      handlePasswordFieldError('confirmPassword', e.target.value, currentPassword, newPassword);
                    }}
                    className="block w-full px-2 rounded border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                  >
                    {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {passwordError && <div className="text-red-500 text-xs mt-2">{passwordError}</div>}
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={discardChanges}
                  className="px-4 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring focus:border-blue-300"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 text-sm font-medium text-white rounded bg-gradient-to-r from-purple-600 to-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring focus:border-blue-300"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? 'Applying...' : 'Apply Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Intake Form Button */}
          <div className="w-full md:w-1/2 flex flex-col border-l md:border-l-2 border-gray-100 pl-0 md:pl-8 mt-8 md:mt-0">
            <h2 className="font-light pb-2 flex items-center gap-2 text-gray-600 border-b">
              <GiMedicines />
              Medical Intake Form Completion
            </h2>
            <div className="flex flex-col items-center justify-center flex-1 py-6">
              {isMedicalFormCompleted ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded text-center w-full max-w-md">
                  <span className="font-semibold">Medical Intake Form Completed!</span>
                  <br />
                  Thank you for completing your medical intake form. Your information is up to date and will help your
                  doctor provide the best care.
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    Please complete your medical intake form. This information will help your doctor provide you with
                    the best possible care and ensure your records are up to date.
                  </p>
                  <button
                    className="px-6 py-2 text-white rounded bg-gradient-to-r from-purple-600 to-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring focus:border-blue-300"
                    onClick={() => setShowIntakeModal(true)}
                  >
                    Complete Medical Intake Form
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Modal for Intake Form */}
        {showIntakeModal && (
          <MedicalIntakeFormModal
            patientData={currentPatinet}
            isOpen={showIntakeModal}
            onClose={() => {
              setShowIntakeModal(false);
              setReCheckCompletion(!reCheckCompletion);
            }}
          />
        )}{' '}
      </div>
    </div>
  );
};

export default PatientSettings;
