import { useEffect, useState } from 'react';

import { jwtDecode } from 'jwt-decode';
import toast, { Toaster } from 'react-hot-toast';
import { FaArrowRight, FaEye, FaEyeSlash, FaRegBell } from 'react-icons/fa';
import { FaPrescriptionBottleAlt } from 'react-icons/fa';
import { FiSun } from 'react-icons/fi';
import { IoMdSettings } from 'react-icons/io';

import doctorApiService from '../../services/doctorApiService';
import { getGreeting } from '../../utils/helperFunctions';
import { getPasswordCriteriaList, validatePassword } from '../../utils/passwordValidation';
import Button from '../common/Button';
import LoaderOverlay from '../common/LoaderOverlay';
import ValidationErrorDisplay from '../patient_components/form_sections/ValidationErrorDisplay';

const CLIENT_ID = import.meta.env.VITE_FULLSCRIPT_PUBLIC_KEY;

const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URL;

const Settings = () => {
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
  const [disconnectLoading, setDisconnectLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [doctorInfoLoading, setDoctorInfoLoading] = useState(false);

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
  const handleFullscriptDisconnect = async () => {
    try {
      setDisconnectLoading(true);
      await doctorApiService.delete('/doctors/disconnect-fullscript');
      setIsFullscriptConnected(false);
      notifySuccess(<div className="text-sm font-light">Successfully disconnected from Fullscript.</div>);
    } catch (error) {
      console.error('Error disconnecting Fullscript:', error);
      notifyError(<div className="text-sm font-light">Failed to disconnect Fullscript. Please try again.</div>);
    } finally {
      setDisconnectLoading(false);
    }
  };
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
      const response = await doctorApiService.put('/doctors/update-password', {
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
        console.log({ err });
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

  const [currentDoctor, setCurrentDoctor] = useState(null);
  const token = localStorage?.getItem('jwtToken');
  const decodedToken = jwtDecode(token);
  const [isFullscriptConnected, setIsFullscriptConnected] = useState(false);
  const [fullscriptLoading, setFullscriptLoading] = useState(false);

  useEffect(() => {
    const getDoctor = async () => {
      try {
        setDoctorInfoLoading(true);
        const res = await doctorApiService.get(`/doctors/me`);
        const result = res.data;

        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch doctor data');
        }

        setCurrentDoctor(result.data);
        console.log('doctor data is :', result.data);
        if (result.data.fullscript_data.access_token) {
          setIsFullscriptConnected(true);
        }
      } catch (error) {
        console.log('Error fetching current doctor data :', error);
      } finally {
        setDoctorInfoLoading(false);
      }
    };
    getDoctor();
  }, []);

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  const handleFullscriptConnect = async () => {
    setFullscriptLoading(true);
    // request Auth Code
    // open this link in a new tab

    const authUrl = `https://ca-snd.fullscript.io/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;

    window.open(authUrl, '_blank');
    setFullscriptLoading(false);
  };

  if (doctorInfoLoading) {
    return (
      <div className="h-screen bg-white w-full overflow-auto">
        <div className="h-12 bg-white flex items-center justify-between p-3 border-b-[1px] gap-1 mt-[1px] md:pl-3 pl-[50px]">
          <span className="flex items-center gap-2">
            <FiSun className="text-gray-500" /> {getGreeting()}, {decodedToken.first_name}!
          </span>
          <span>
            <FaRegBell className="text-gray-400" />
          </span>
        </div>
        <div className="flex items-center h-full justify-center">
          <LoaderOverlay loading={doctorInfoLoading} size={14}>
            Loading profile...
          </LoaderOverlay>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white w-full overflow-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="h-12 bg-white flex items-center justify-between p-3 border-b-[1px] gap-1 mt-[1px]">
        <span className="flex items-center gap-2">
          <FiSun className="text-gray-500" /> {getGreeting()}, {decodedToken.first_name}!
        </span>
        <span>
          <FaRegBell className="text-gray-400" />
        </span>
      </div>
      <div className="px-3 mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-medium font-bold text-gray-600 flex items-center gap-2">
            <IoMdSettings />
            Settings
          </h1>
          <span className="text-sm font-light text-gray-500">Your profile and settings</span>
        </div>
        <a
          href="/dashboard"
          className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded bg-[#5558E4] text-xs font-medium text-white"
        >
          Go to Dashboard <FaArrowRight />
        </a>
      </div>
      {/* End of TOP NAVBAR */}
      <div className="mt-6 border rounded-md shadow-sm px-3 m-3 max-h-1/2">
        <h2 className="py-3 flex items-center gap-2 font-medium text-sm text-gray-700">
          My Profile
          <span className="text-sm font-light text-gray-400">A snapshot of your account details</span>
        </h2>
        <div className="">
          <div className="border-t border-gray-200 pb-3">
            <dl>
              <div className="bg-[#5558E4] bg-opacity-15 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">First Name</dt>
                <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">{currentDoctor?.first_name}</dd>
              </div>
              <div className="bg-white py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">{currentDoctor?.last_name}</dd>
              </div>
              <div className="bg-[#5558E4] bg-opacity-15 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Title</dt>
                <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">Doctor</dd>
              </div>
              <div className="bg-white py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">{currentDoctor?.email}</dd>
              </div>
              <div className="bg-[#5558E4] bg-opacity-15 py-2 sm:grid sm:grid-cols-3 sm:gap-4 rounded-b sm:px-6">
                <dt className="text-sm font-medium text-gray-500">About</dt>
                <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">I am a clinician.</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <div className="mt-6 border rounded-md shadow-sm px-3 m-3 max-h-1/2">
        <h2 className="py-3 flex items-center gap-2 font-medium text-sm text-gray-700">
          Change Password
          <span className="text-xs font-light text-gray-400">Type in your current and new password</span>
        </h2>
        {apiError && <ValidationErrorDisplay error={{ message: apiError }} width="w-1/3" />}
        <form id="changePasswordForm" className="space-y-2 w-1/3 mt-4 mb-6" onSubmit={handlePasswordChange}>
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
            <Button type="submit" variant="solid" loading={passwordLoading} disabled={passwordLoading}>
              Apply Changes
            </Button>
          </div>
        </form>
      </div>
      {/* Add Fullscript Integration Section */}
      <div className="mt-6 border rounded-md shadow-sm px-3 m-3 max-h-1/2">
        <div className="flex items-center justify-between py-3">
          <h2 className="flex items-center gap-2 font-medium text-sm text-gray-700">
            <FaPrescriptionBottleAlt className="text-[#5558E4]" />
            Fullscript Integration
            <span className="text-xs font-light text-gray-400">
              Connect your Fullscript account to manage prescriptions
            </span>
          </h2>
          {isFullscriptConnected && (
            <Button
              onClick={handleFullscriptDisconnect}
              variant=""
              loading={disconnectLoading}
              disabled={disconnectLoading}
              className="bg-red-500 text-white text-xs text-light hover:bg-red-600 py-1"
              style={{ padding: '4px 6px' }}
              size="sm"
            >
              Disconnect
            </Button>
          )}
        </div>
        <div className="relative min-h-[120px]">
          {doctorInfoLoading ? (
            <LoaderOverlay loading={doctorInfoLoading} size={14}>
              Loading Fullscript integration...
            </LoaderOverlay>
          ) : (
            <div className="border-t border-gray-200 pb-3">
              <div className="py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Account Status</h3>
                    <p className="text-xs text-gray-500">
                      {isFullscriptConnected ? 'Connected to Fullscript' : 'Not connected to Fullscript'}
                    </p>
                  </div>
                  <Button
                    onClick={handleFullscriptConnect}
                    loading={fullscriptLoading}
                    variant={isFullscriptConnected ? 'custom' : 'solid'}
                    className={isFullscriptConnected ? 'bg-green-100 text-green-700' : ''}
                    style={{ boxShadow: 'none' }}
                  >
                    {isFullscriptConnected ? 'Connected' : 'Connect Fullscript'}
                  </Button>
                </div>

                {isFullscriptConnected && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Connected Account Details</h4>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Name:</span> {currentDoctor?.first_name}{' '}
                        {currentDoctor?.last_name}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Email:</span> {currentDoctor?.email}
                      </p>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  <p>• Manage prescriptions and supplements</p>
                  <p>• Access patient protocols</p>
                  <p>• Track patient compliance</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
