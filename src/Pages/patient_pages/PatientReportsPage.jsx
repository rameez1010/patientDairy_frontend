import React from 'react';

import PatientReports from '../../components/patient_components/PatientReports';
import PatientSidebar from '../../components/patient_components/PatientSidebar';

const PatientReportsPage = () => {
  return (
    <div className="flex">
      <PatientSidebar />
      <PatientReports />
    </div>
  );
};

export default PatientReportsPage;
