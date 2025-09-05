import { useState } from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';

import logo from '../../assets/biokrystal_logo.png';
import Spinner from '../Spinner';

const ForgotPassword = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);

    try {
      await axios.post(
        `${apiUrl}/doctors/forgot-password`,
        {
          email,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      setSuccess(true);
      setEmail('');
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Email not found. Please check your email address.');
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Error requesting password reset:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row">
      <div className="lg:w-3/5 hidden md:block h-screen bg-[url('./assets/clinician.jpg')] bg-cover w-3/5 bg-opacity-0">
        <div className="h-full w-full bg-gray-600 bg-opacity-70 text-white lg:pr-60 lg:pl-36 flex flex-col items-center justify-center gap-6">
          <h1 className="text-3xl lg:text-5xl font-bold">
            Forgot Your Password?{' '}
            <span className="underline underline-offset-3 decoration-8 decoration-[#5558E4]">
              We&apos;ve Got You Covered
            </span>
          </h1>
          <p className="text-sm lg:text-base">
            Enter your email address and we&apos;ll send you a link to reset your password. You&apos;ll be back to
            analyzing patient data in no time.
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
          <h2 className="mt-10 text-center text-xl leading-9 text-[#5558E4]">Forgot Password</h2>
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
                    Password reset link sent! Please check your email.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              We&apos;ve sent a password reset link to your email address. Please check your inbox and follow the
              instructions to reset your password.
            </p>
            <Link to="/" className="font-semibold text-[#5558E4] hover:text-[#89deef]">
              Return to Login
            </Link>
          </div>
        ) : (
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-2 rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded bg-[#5558E4] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-md"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    Sending Reset Link <Spinner />
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>
          </form>
        )}

        {error && <div className="mt-4 text-center text-sm text-red-500">{error}</div>}

        <p className="mt-10 text-center text-sm text-gray-500">
          Remember your password?{' '}
          <Link to="/" className="font-semibold leading-6 text-[#5558E4] hover:text-[#89deef]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
