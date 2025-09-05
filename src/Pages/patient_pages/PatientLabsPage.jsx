import PatientLabs from '../../components/patient_components/PatientLabs';
import PatientSidebar from '../../components/patient_components/PatientSidebar';

const PatientLabsPage = () => {
  return (
    <div className="flex">
      <PatientSidebar />
      <PatientLabs />
    </div>
  );
};

export default PatientLabsPage;
