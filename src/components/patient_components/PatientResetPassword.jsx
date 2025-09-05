import { useEffect, useState } from 'react';

import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import logo from '../../assets/biokrystal_logo.png';
import { getPasswordCriteriaList, validatePassword } from '../../utils/passwordValidation';
import Spinner from '../Spinner';

const PatientResetPassword = ({ usingAsSetPassword = false }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Add state for criteria
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  useEffect(() => {
    // Extract token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError(
        `Invalid or missing ${usingAsSetPassword ? 'set' : 'reset'} token. Please request a new password ${usingAsSetPassword ? 'set' : 'reset'} link.`,
      );
    }
  }, [location, usingAsSetPassword]);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const { criteria } = validatePassword(newPassword);
    setPasswordCriteria(criteria);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const { isValid, errors } = validatePassword(password);
    if (!isValid) {
      setError(errors[0]);
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${apiUrl}/patients/reset-password`,
        {
          token,
          new_password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      setSuccess(true);
      setPassword('');
      setConfirmPassword('');

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/patient_login');
      }, 3000);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(
          `Invalid or expired token. Please request a new password ${usingAsSetPassword ? 'set' : 'reset'} link.`,
        );
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Error resetting password:', err);
    } finally {
      setLoading(false);
    }
  };
  const handleResendSetPasswordLink = async () => {
    setResendLoading(true);
    try {
      await axios.post(
        `${apiUrl}/patients/resend-set-password-email`,
        { token },
        { headers: { 'Content-Type': 'application/json' } },
      );
      setResendStatus('Set password link sent!');
    } catch (err) {
      setResendStatus(err.response?.data?.message || 'Failed to resend set password link. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row">
      <div className="lg:w-3/5 hidden md:block h-screen bg-[url('./assets/patient.jpg')] bg-cover w-3/5 bg-opacity-0">
        <div className="h-full w-full bg-gray-600 bg-opacity-70 text-white lg:pr-60 lg:pl-36 flex flex-col items-center justify-center gap-6">
          <h1 className="text-3xl lg:text-5xl font-bold">
            {usingAsSetPassword ? 'Set Your Password' : 'Reset Your Password'}{' '}
            <span className="underline underline-offset-3 decoration-8 decoration-[#5558E4]">
              and Secure Your Account
            </span>
          </h1>
          <p className="text-sm lg:text-base">
            Create a strong, unique password to protect your account and health data. Your security is our priority.
          </p>
        </div>
      </div>
      <div className="lg:w-2/5 w-full h-screen flex flex-col justify-center px-6 lg:px-32">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img alt="Bio Krystal" src={logo} className="mx-auto h-10 w-auto" />
          <h1 className="mt-3 text-center text-3xl font-semibold leading-10 tracking-tight text-[#5558E4]">
            BioKrystal AI
          </h1>
          <h4 className="text-center text-sm font-light text-gray-400">Your Future Health</h4>
          <h2 className="mt-10 text-center text-xl leading-9 text-[#5558E4]">
            {usingAsSetPassword ? 'Set Patient Password' : 'Reset Patient Password'}
          </h2>
        </div>

        {success ? (
          <div className="mt-8 text-center">
            <div className="rounded-md bg-green-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {usingAsSetPassword ? 'Password set successfully!' : 'Password reset successful!'}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              {usingAsSetPassword
                ? 'Your password has been set. You will be redirected to the login page shortly.'
                : 'Your password has been successfully reset. You will be redirected to the login page shortly.'}
            </p>
            <Link to="/patient_login" className="font-semibold text-[#5558E4] hover:text-[#89deef]">
              Go to Login
            </Link>
          </div>
        ) : (
          <form action="#" method="POST" onSubmit={handleSubmit} className="space-y-6 mt-6">
            {!token && (
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      {`Invalid or missing ${usingAsSetPassword ? 'set' : 'reset'} token. Please request a new password ${usingAsSetPassword ? 'set' : 'reset'} link.`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                {usingAsSetPassword ? 'New Password' : 'New Password'}
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className="block w-full pl-2 rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter new password"
                  disabled={!token}
                />
              </div>
              {password && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">Password must contain:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {getPasswordCriteriaList().map((criterion, index) => (
                      <li
                        key={index}
                        className={`flex items-center ${passwordCriteria[criterion.key] ? 'text-green-600' : 'text-red-500'}`}
                      >
                        <span className="mr-2">{passwordCriteria[criterion.key] ? '✓' : '○'}</span>
                        {criterion.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                {usingAsSetPassword ? 'Confirm New Password' : 'Confirm New Password'}
              </label>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-2 rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Confirm new password"
                  disabled={!token}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded bg-[#5558E4] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-md"
                disabled={loading || !token}
              >
                {loading ? (
                  <span className="flex items-center">
                    {usingAsSetPassword ? 'Setting Password' : 'Resetting Password'} <Spinner />
                  </span>
                ) : usingAsSetPassword ? (
                  'Set Password'
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          </form>
        )}

        {error && (
          <>
            <div className="mt-4 text-center text-sm text-red-500">{error}</div>

            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-xs text-[#5558E4] hover:underline disabled:opacity-50"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: resendLoading ? 'not-allowed' : 'pointer',
                }}
                onClick={handleResendSetPasswordLink}
                disabled={resendLoading || !token}
              >
                {resendLoading ? 'Resending...' : 'Resend link to set password'}
              </button>
              {resendStatus && (
                <div
                  className={`mt-2 text-xs ${resendStatus.toLowerCase().includes('sent') ? 'text-green-600' : 'text-red-500'}`}
                >
                  {resendStatus}
                </div>
              )}
            </div>
          </>
        )}
        <p className="mt-10 text-center text-sm text-gray-500">
          {usingAsSetPassword ? 'Already have an account?' : 'Remember your password?'}{' '}
          <Link to="/patient_login" className="font-semibold leading-6 text-[#5558E4] hover:text-[#89deef]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PatientResetPassword;
