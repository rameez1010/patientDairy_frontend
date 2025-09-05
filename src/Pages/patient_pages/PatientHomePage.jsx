import PatientDashboard from '../../components/patient_components/PatientDashboard';
import PatientSidebar from '../../components/patient_components/PatientSidebar';

const PatientHomePage = () => {
  return (
    <div className="flex">
      <PatientSidebar />
      <PatientDashboard />
    </div>
  );
};

export default PatientHomePage;
