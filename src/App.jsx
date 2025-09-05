import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import NotFoundPage from './Pages/NotFoundPage';
import AIKnowledgePage from './Pages/doctor_pages/AIKnowledgePage';
import AnalyticsPage from './Pages/doctor_pages/AnalyticsPage';
import ForgotPasswordPage from './Pages/doctor_pages/ForgotPasswordPage';
import HomePage from './Pages/doctor_pages/HomePage';
import LabsPage from './Pages/doctor_pages/LabsPage';
import LoginPage from './Pages/doctor_pages/LoginPage';
import PatientsPage from './Pages/doctor_pages/PatientsPage';
import ReportsPage from './Pages/doctor_pages/ReportsPage';
import ResetPasswordPage from './Pages/doctor_pages/ResetPasswordPage';
import SettingsPage from './Pages/doctor_pages/SettingsPage';
import SignupPage from './Pages/doctor_pages/SignupPage';
import SinglePatientPage from './Pages/doctor_pages/SinglePatientPage';
import VerifyOTPPage from './Pages/doctor_pages/VerifyOTPPage';
import PatientAnalyticsPage from './Pages/patient_pages/PatientAnalyticsPage';
import PatientForgotPasswordPage from './Pages/patient_pages/PatientForgotPasswordPage';
import PatientHomePage from './Pages/patient_pages/PatientHomePage';
import PatientLabsPage from './Pages/patient_pages/PatientLabsPage';
import PatientLoginPage from './Pages/patient_pages/PatientLoginPage';
import PatientReportsPage from './Pages/patient_pages/PatientReportsPage';
import PatientResetPasswordPage from './Pages/patient_pages/PatientResetPasswordPage';
import PatientSettingsPage from './Pages/patient_pages/PatientSettingsPage';
import PatientVerifyOTPPage from './Pages/patient_pages/PatientVerifyOTPPage';
import DoctorProtectedRoute from './components/DoctorProtectedRoute';
import PatientProtectedRoute from './components/PatientProtectedRoute';
import PatientPublicRoute from './components/PatientPublicRoute';
import PublicRoute from './components/PublicRoute';
import FullscriptCallback from './components/doctor_components/FullscriptCallback';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
    errorElement: <NotFoundPage />,
  },
  {
    path: '/verify-otp',
    element: (
      <PublicRoute>
        <VerifyOTPPage />
      </PublicRoute>
    ),
  },
  {
    path: '/patient_verify_otp',
    element: (
      <PatientPublicRoute>
        <PatientVerifyOTPPage />
      </PatientPublicRoute>
    ),
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/patient_login',
    element: (
      <PatientPublicRoute>
        <PatientLoginPage />
      </PatientPublicRoute>
    ),
  },
  {
    path: '/patient_forgot_password',
    element: <PatientForgotPasswordPage />,
  },
  {
    path: '/patient_reset_password',
    element: <PatientResetPasswordPage usingAsSetPassword={false} />,
  },
  {
    path: '/patient_set_password',
    element: <PatientResetPasswordPage usingAsSetPassword={true} />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/patient_dashboard',
    element: (
      <PatientProtectedRoute>
        <PatientHomePage />
      </PatientProtectedRoute>
    ),
  },
  {
    path: '/patient_labs',
    element: (
      <PatientProtectedRoute>
        <PatientLabsPage />
      </PatientProtectedRoute>
    ),
  },
  {
    path: '/patient_reports',
    element: (
      <PatientProtectedRoute>
        <PatientReportsPage />
      </PatientProtectedRoute>
    ),
  },
  {
    path: '/patient_analytics',
    element: (
      <PatientProtectedRoute>
        <PatientAnalyticsPage />
      </PatientProtectedRoute>
    ),
  },
  {
    path: '/patient_settings',
    element: (
      <PatientProtectedRoute>
        <PatientSettingsPage />
      </PatientProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <DoctorProtectedRoute>
        <HomePage />
      </DoctorProtectedRoute>
    ),
  },
  {
    path: '/patients',
    element: (
      <DoctorProtectedRoute>
        <PatientsPage />
      </DoctorProtectedRoute>
    ),
  },
  {
    path: '/patients/:patientId',
    element: (
      <DoctorProtectedRoute>
        <SinglePatientPage />
      </DoctorProtectedRoute>
    ),
  },
  {
    path: '/reports',
    element: (
      <DoctorProtectedRoute>
        <ReportsPage />
      </DoctorProtectedRoute>
    ),
  },
  {
    path: '/labs',
    element: (
      <DoctorProtectedRoute>
        <LabsPage />
      </DoctorProtectedRoute>
    ),
  },
  {
    path: '/analytics',
    element: (
      <DoctorProtectedRoute>
        <AnalyticsPage />
      </DoctorProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <DoctorProtectedRoute>
        <SettingsPage />
      </DoctorProtectedRoute>
    ),
  },
  {
    path: '/fullscript/callback',
    element: (
      <DoctorProtectedRoute>
        <FullscriptCallback />
      </DoctorProtectedRoute>
    ),
  },
  {
    path: '/ai-knowledge',
    element: (
      <DoctorProtectedRoute>
        <AIKnowledgePage />
      </DoctorProtectedRoute>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
