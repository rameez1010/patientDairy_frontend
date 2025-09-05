import Dashboard from '../../components/doctor_components/Dashboard';
import Sidebar from '../../components/doctor_components/Sidebar';

const HomePage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Dashboard />
    </div>
  );
};

export default HomePage;
