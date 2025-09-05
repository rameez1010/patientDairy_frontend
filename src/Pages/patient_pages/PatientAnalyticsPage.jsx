import PatientAnalytics from '../../components/patient_components/PatientAnalytics';
import PatientSidebar from '../../components/patient_components/PatientSidebar';

const PatientAnalyticsPage = () => {
  return (
    <div className="flex">
      <PatientSidebar />
      <PatientAnalytics />
    </div>
  );
};

export default PatientAnalyticsPage;
