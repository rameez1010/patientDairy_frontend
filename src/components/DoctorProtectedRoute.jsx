import { Navigate } from 'react-router-dom';

import doctorApiService from '../services/doctorApiService';

const DoctorProtectedRoute = ({ children }) => {
  const isAuthenticated = doctorApiService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default DoctorProtectedRoute;
