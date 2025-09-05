import { useEffect, useState } from 'react';

import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

import logo from '../../assets/biokrystal_logo.png';
import doctorApiService from '../../services/doctorApiService';
import Button from '../common/Button';

const VerifyOTP = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from navigation state
  const email = location.state?.email;
  const password = location.state?.password;

  useEffect(() => {
    // If no email is provided, redirect back to login
    if (!email) {
      navigate('/');
    }
  }, [email, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/doctors/verify-otp`, {
        email,
        otp_code: otp,
      });

      // Handle new response structure
      if (!response.data.success) {
        throw new Error(response.data.message || 'OTP verification failed');
      }

      // Handle new token structure with access and refresh tokens
      const { access_token, refresh_token } = response.data.data;

      // Store both tokens using the API service
      doctorApiService.storeTokens(access_token, refresh_token);

      navigate('/dashboard');
      console.log('OTP verification successful, tokens stored');
    } catch (err) {
      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Error verifying OTP:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');
    setResendSuccess(false);

    try {
      const response = await axios.post(`${apiUrl}/doctors/login`, {
        email,
        password: password || '', // Use the stored password
      });

      // Handle new response structure
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to resend OTP');
      }

      setError(''); // Clear any previous errors
      setResendSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
      console.error('Error resending OTP:', err);
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      // Assuming 6-digit OTP
      setOtp(value);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row">
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
          <h2 className="mt-10 text-center text-xl leading-9 text-[#5558E4]">Verify Your Email</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We&apos;ve sent a verification code to <span className="font-medium">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900">
              Verification Code
            </label>
            <div className="mt-2">
              <input
                id="otp"
                name="otp"
                type="text"
                required
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter 6-digit code"
                className="block w-full pl-2 rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center text-lg tracking-widest"
                maxLength="6"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading || otp.length !== 6}
              loading={loading}
              variant="solid"
              width="w-full"
            >
              Verify Code
            </Button>
          </div>
        </form>

        {error && <div className="mt-4 text-center text-sm text-red-500">{error}</div>}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Didn&apos;t receive the code?{' '}
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendLoading}
              className="font-semibold text-[#5558E4] hover:text-[#89deef] disabled:opacity-50"
            >
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </button>
          </p>
        </div>

        {resendSuccess && <div className="mt-6 text-center text-sm text-green-500">OTP resent successfully!</div>}

        <p className="mt-6 text-center text-sm text-gray-500">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="font-semibold leading-6 text-[#5558E4] hover:text-[#89deef]"
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
