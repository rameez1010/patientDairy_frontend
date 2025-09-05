import Sidebar from '../../components/doctor_components/Sidebar';
import SinglePatient from '../../components/doctor_components/SinglePatient';

const SinglePatientPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <SinglePatient />
    </div>
  );
};

export default SinglePatientPage;
