import Settings from '../../components/doctor_components/Settings';
import Sidebar from '../../components/doctor_components/Sidebar';

const SettingsPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Settings />
    </div>
  );
};

export default SettingsPage;
