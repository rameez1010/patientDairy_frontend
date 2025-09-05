import Reports from '../../components/doctor_components/Reports';
import Sidebar from '../../components/doctor_components/Sidebar';

const ReportsPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Reports />
    </div>
  );
};

export default ReportsPage;
