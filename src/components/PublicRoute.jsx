import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('jwtToken');
  const patientToken = localStorage.getItem('jwtPatientToken');

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  if (patientToken) {
    return <Navigate to="/patient_dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
