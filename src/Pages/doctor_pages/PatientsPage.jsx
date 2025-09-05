import Patients from '../../components/doctor_components/Patients';
import Sidebar from '../../components/doctor_components/Sidebar';

const PatientsPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Patients />
    </div>
  );
};

export default PatientsPage;
