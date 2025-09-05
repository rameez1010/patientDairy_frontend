import { useState } from 'react';

import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import logo from '../../assets/biokrystal_logo.png';
import { validateEmail } from '../../utils/validation';
import ErrorMessage from '../ErrorMessage';
import Button from '../common/Button';
import ValidationErrorDisplay from '../patient_components/form_sections/ValidationErrorDisplay';

const Login = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (e) => {
    setError('');
    const value = e.target.value;
    setEmail(value);
    const { valid, error } = validateEmail(value);
    setEmailError(valid ? '' : error);
  };
  const notifyError = (toastMessage) => {
    toast.error(toastMessage);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    const { valid, error: emailValidationError } = validateEmail(email);
    if (!valid) {
      setEmailError(emailValidationError);
      return;
    }
    try {
      const response = await axios.post(`${apiUrl}/doctors/login`, {
        email,
        password,
      });

      // Handle new response structure
      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }

      // Check if OTP is required
      if (response.data.data.requires_otp) {
        // Navigate to OTP verification page with email and password
        navigate('/verify-otp', {
          state: {
            email: email,
            password: password, // Store password for potential resend
          },
        });
        console.log('OTP required, redirecting to verification page');
      } else {
        // Handle direct login (if API still supports it)
        const { token } = response.data.data;
        localStorage.setItem('jwtToken', token);
        navigate('/dashboard');
        console.log('login successful, token :', token);
      }
    } catch (err) {
      if (err.response.status === 400 && err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else if (err.response.status === 500 && err.response && err.response.data?.message) {
        // We use toast notifications for 500 errors since internal server errors don’t need to persist.
        notifyError(<div className="text-sm font-light">{err.response.data.message}</div>);
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Error logging in:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-screen flex flex-col lg:flex-row">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="lg:w-3/5 hidden md:block h-screen bg-[url('./assets/clinician.jpg')] bg-cover w-3/5 bg-opacity-0">
        <div className="h-full w-full bg-gray-600 bg-opacity-70 text-white lg:pr-60 lg:pl-36 flex flex-col items-center justify-center gap-6">
          <h1 className="text-3xl lg:text-5xl font-bold">
            Transform Patient Health Data Into{' '}
            <span className="underline underline-offset-3 decoration-8 decoration-[#5558E4]">Actionable Insights</span>
          </h1>
          <p className="text-sm lg:text-base">
            AI-powered analysis of blood biomarkers, hormones, and genetic test results for personalized health
            recommendations based on decades of expertise in functional Medicine.
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

          {/* Role Switcher */}
          <div className="flex justify-center mt-6 mb-2">
            <div
              className="flex p-1 border border-[#5558E4] rounded-full overflow-hidden bg-white"
              style={{ width: 'fit-content' }}
            >
              <button
                type="button"
                className="px-6 py-1 font-semibold text-sm focus:outline-none transition-all duration-150 rounded-full"
                style={{
                  background: '#5558E4',
                  color: '#fff',
                  border: 'none',
                  boxShadow: 'none',
                  fontWeight: 600,
                  outline: 'none',
                }}
                disabled
              >
                Sign in as Clinician
              </button>
              <button
                type="button"
                className="px-6 py-1 font-semibold text-sm focus:outline-none transition-all duration-150 rounded-full"
                style={{
                  background: 'transparent',
                  color: '#5558E4',
                  border: 'none',
                  fontWeight: 600,
                  outline: 'none',
                }}
                onClick={() => navigate('/patient_login')}
              >
                Sign in as Patient
              </button>
            </div>
          </div>
        </div>
        {error && <ValidationErrorDisplay error={{ message: error }} width="w-full" />}
        <form action="#" method="POST" onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={handleEmailChange}
                className={`block w-full pl-2 rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${emailError ? 'ring-red-500' : ''}`}
              />
            </div>
            {emailError && <ErrorMessage message={emailError} />}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="text-sm">
                <a href="/forgot-password" className=" text-[#5558E4] hover:text-[#89deef]">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => (setPassword(e.target.value), setError(''))}
                className="block w-full pl-2 pr-10 rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <Button type="submit" disabled={!!emailError} loading={loading} variant="solid" width="w-full">
              Sign in
            </Button>
          </div>
        </form>
        <p className="mt-10 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="font-semibold leading-6 text-[#5558E4] hover:text-[#89deef]">
            Signup Now
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
