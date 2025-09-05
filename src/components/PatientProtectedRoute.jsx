import { Navigate } from 'react-router-dom';

import patientApiService from '../services/patientApiService';

const PatientProtectedRoute = ({ children }) => {
  const isAuthenticated = patientApiService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/patient_login" replace />;
  }

  return children;
};

export default PatientProtectedRoute;
