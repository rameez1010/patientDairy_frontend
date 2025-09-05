import { Navigate } from 'react-router-dom';

const PatientPublicRoute = ({ children }) => {
  const token = localStorage.getItem('jwtPatientToken');

  if (token) {
    return <Navigate to="/patient_dashboard" replace />;
  }

  return children;
};

export default PatientPublicRoute;
