import React from 'react';

import PatientSettings from '../../components/patient_components/PatientSettings';
import PatientSidebar from '../../components/patient_components/PatientSidebar';

const PatientSettingsPage = () => {
  return (
    <div className="flex">
      <PatientSidebar />
      <PatientSettings />
    </div>
  );
};

export default PatientSettingsPage;
