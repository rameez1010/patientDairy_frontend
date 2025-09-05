import { useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import logo from '../../assets/biokrystal_logo.png';
import { getPasswordCriteriaList, validatePassword } from '../../utils/passwordValidation';
import { validateEmail, validateName } from '../../utils/validation';
import ErrorMessage from '../ErrorMessage';
import Button from '../common/Button';
import ValidationErrorDisplay from '../patient_components/form_sections/ValidationErrorDisplay';

const Signup = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const navigate = useNavigate();

  const handleFirstNameChange = (e) => {
    setError('');
    const value = e.target.value;
    setFirstName(value);
    const { valid, error } = validateName(value, 'First name');
    setFirstNameError(valid ? '' : error);
  };

  const handleLastNameChange = (e) => {
    setError('');
    const value = e.target.value;
    setLastName(value);
    const { valid, error } = validateName(value, 'Last name');
    setLastNameError(valid ? '' : error);
  };

  const handleEmailChange = (e) => {
    setError('');
    const value = e.target.value;
    setEmail(value);
    const { valid, error } = validateEmail(value);
    setEmailError(valid ? '' : error);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const { criteria } = validatePassword(newPassword);
    setPasswordCriteria(criteria);
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    setError('');

    // Validate all fields before submission
    const { valid: firstNameValid, error: firstNameErr } = validateName(first_name, 'First name');
    const { valid: lastNameValid, error: lastNameErr } = validateName(last_name, 'Last name');
    const { valid: emailValid, error: emailErr } = validateEmail(email);
    const { isValid, errors } = validatePassword(password);

    setFirstNameError(firstNameValid ? '' : firstNameErr);
    setLastNameError(lastNameValid ? '' : lastNameErr);
    setEmailError(emailValid ? '' : emailErr);

    if (!firstNameValid || !lastNameValid || !emailValid) {
      return;
    }
    if (!isValid) {
      setError(errors[0]);
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/doctors/register`, {
        first_name,
        last_name,
        email,
        password,
      });

      console.log('user data :', response.data);
      navigate('/');
    } catch (err) {
      console.error('Error registering:', err);
      const response = err?.response?.data;
      if (response.statusCode === 400) {
        setError(response.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
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
          <h2 className="mt-2 text-center text-xl leading-9 text-[#5558E4]">Create an account</h2>
        </div>
        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          {error && <ValidationErrorDisplay error={{ message: error }} width="w-full" />}
          <form action="#" method="POST" onSubmit={handleSubmit} className="space-y-3 mt-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">
                First Name
              </label>
              <div className="mt-2">
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={first_name}
                  onChange={handleFirstNameChange}
                  className={`block w-full pl-2 rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${firstNameError ? 'ring-red-500' : ''}`}
                />
                {firstNameError && <ErrorMessage message={firstNameError} />}
              </div>
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">
                Last Name
              </label>
              <div className="mt-2">
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={last_name}
                  onChange={handleLastNameChange}
                  className={`block w-full pl-2 rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${lastNameError ? 'ring-red-500' : ''}`}
                />
                {lastNameError && <ErrorMessage message={lastNameError} />}
              </div>
            </div>
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
                {emailError && <ErrorMessage message={emailError} />}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="block w-full pl-2 rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
              <Button
                type="submit"
                disabled={!!firstNameError || !!lastNameError || !!emailError}
                loading={loading}
                variant="solid"
                width="w-full"
              >
                Sign up
              </Button>
            </div>
          </form>
          <p className="mt-2 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/" className="font-semibold leading-6 text-[#5558E4] hover:text-[#89deef]">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
