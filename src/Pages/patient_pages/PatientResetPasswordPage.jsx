import PatientResetPassword from '../../components/patient_components/PatientResetPassword';

const PatientResetPasswordPage = (usingAsSetPassword) => {
  return (
    <div>
      <PatientResetPassword usingAsSetPassword={usingAsSetPassword} />
    </div>
  );
};

export default PatientResetPasswordPage;
