import { useEffect, useState } from 'react';

import { jwtDecode } from 'jwt-decode';
import toast, { Toaster } from 'react-hot-toast';
import { FaRegBell } from 'react-icons/fa';
import { FiSun } from 'react-icons/fi';
import { LuUsers } from 'react-icons/lu';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import doctorApiService from '../../services/doctorApiService';
import { getGreeting } from '../../utils/helperFunctions';
import Button from '../common/Button';
import LoaderOverlay from '../common/LoaderOverlay';
import CreateNewPatient from './CreateNewPatient';
import DeleteModal from './DeleteModal';
import InvitationButton from './smaller_components/InvitationButton';

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [newPatientModal, setNewPatientModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState('');

  const handlePatientDeleteModal = (patientId) => {
    setPatientToDelete(patientId);
    setShowDelete(!showDelete);
  };

  const handleNewPatientModal = () => {
    setNewPatientModal(!newPatientModal);
  };

  const handlePatientDetails = (patientId) => {
    navigate(`/patients/${patientId}`);
  };
  const notifyError = (toastMessage) => {
    toast.error(toastMessage);
  };

  const notifySuccess = (toastMessage) => {
    toast.success(toastMessage);
  };

  const token = doctorApiService.getAccessToken();
  const decodedToken = jwtDecode(token);

  useEffect(() => {
    const getPatients = async () => {
      try {
        setLoading(true);
        const response = await doctorApiService.get('/patients/');
        setPatients(response.data.data);
      } catch (error) {
        console.log('There was an error to fetch patients data :', error);
      } finally {
        setLoading(false);
      }
    };
    getPatients();
  }, [newPatientModal]);

  const handleInvite = async (patientId) => {
    try {
      setInviteLoading(patientId);
      await doctorApiService.post(`/patients/${patientId}/invite`);
      notifySuccess(<div className="text-sm font-light">Patient invited successfully!</div>);
      setPatients((prev) =>
        prev.map((patient) => {
          if (patient.id === patientId) {
            patient.invitation_status = 'invite_sent';
          }
          return patient;
        }),
      );
    } catch (error) {
      console.log('There was an error inviting the patient:', error);
      notifyError(<div className="text-sm font-light">There was an error inviting the patient!</div>);
    } finally {
      setInviteLoading('');
    }
  };

  const handlePatientDelete = async (patientId) => {
    try {
      setDeleteLoading(true);
      await doctorApiService.delete(`/patients/${patientId}`);
      console.log('Patient deleted successfully!');

      // Remove the deleted patient from the state to update the UI
      setPatients(patients.filter((patient) => patient.id !== patientId));
      setShowDelete(false);
    } catch (error) {
      console.log('There was an error deleting the patient:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white w-full static overflow-y-scroll">
      <Toaster position="top-center" reverseOrder={false} />
      {/* TOP NAVBAR */}
      <div className="h-12 bg-white flex items-center justify-between p-3 border-b-[1px] gap-1 mt-[1px] md:pl-3 pl-[50px]">
        <span className="flex items-center gap-2">
          <FiSun className="text-gray-500" /> {getGreeting()}, {decodedToken.first_name}!
        </span>
        <span>
          <FaRegBell className="text-gray-400" />
        </span>
      </div>
      <div className="px-3 mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-medium font-bold text-gray-600 flex items-center gap-2">
            <LuUsers />
            Patients
          </h1>
          <span className="text-sm font-light text-gray-500">A list of all your patients</span>
        </div>
        <button
          onClick={handleNewPatientModal}
          className=" px-2 py-1 rounded font-light text-sm text-white bg-[#5558E4]"
        >
          {' '}
          + Create New Patient
        </button>
      </div>
      {/* End of TOP NAVBAR */}
      <div
        className="mt-6 border rounded-md shadow-sm overflow-hidden px-3 m-3"
        style={{ height: 'calc(100vh - 160px)' }}
      >
        <h2 className="py-3 flex items-center gap-2 font-medium text-sm text-gray-700">
          Patient List
          <span className="text-sm font-light text-gray-400">Click on a patient name to view details</span>
        </h2>
        <table className="min-w-full border-collapse">
          <thead className="bg-[#5558E4]">
            <tr className="text-white text-xs font-light">
              <th className="py-1 px-4 text-left rounded-l-md">First Name</th>
              <th className="py-1 px-4 text-left">Last Name</th>
              <th className="py-1 px-4 text-left">Gender</th>
              <th className="py-1 px-4 text-left">Phone</th>
              <th className="py-1 px-4 text-left ">Patient ID</th>
              <th className="py-1 px-4 text-left rounded-r-md">Account Access</th>
            </tr>
          </thead>
          <tbody className="font-medium text-gray-600 text-xs">
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: 0 }}>
                  <div className="flex flex-col items-center justify-center" style={{ minHeight: 200 }}>
                    <LoaderOverlay loading={true} size={14} className="bg-transparent" textSize="text-xs">
                      Loading patients...
                    </LoaderOverlay>
                  </div>
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  No patients found.
                </td>
              </tr>
            ) : (
              patients.map((patient, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} cursor-pointer`}>
                  <td
                    onClick={() => handlePatientDetails(patient.id)}
                    className="py-2 px-4 rounded-l-md hover:text-[#5558E4]"
                  >
                    {patient.firstName}
                  </td>
                  <td onClick={() => handlePatientDetails(patient.id)} className="py-2 px-4 hover:text-[#5558E4]">
                    {patient.lastName}
                  </td>
                  <td onClick={() => handlePatientDetails(patient.id)} className="py-2 px-4 hover:text-[#5558E4]">
                    {patient?.gender}
                  </td>
                  <td onClick={() => handlePatientDetails(patient.id)} className="py-2 px-4 hover:text-[#5558E4]">
                    {patient.phone}
                  </td>
                  <td onClick={() => handlePatientDetails(patient.id)} className="py-2 px-4 hover:text-[#5558E4]">
                    {patient.id}
                  </td>
                  <td className="py-2 px-4 flex items-center justify-between rounded-r-md">
                    <InvitationButton
                      patientId={patient.id}
                      status={patient.invitation_status || 'not_sent'}
                      onInvite={() => handleInvite(patient.id)}
                      inviteLoading={inviteLoading}
                    />
                    <Button
                      variant="custom"
                      className="bg-[#73CEF8] rounded p-[2px]"
                      style={{ background: '#73CEF8', color: 'white', padding: '2px' }}
                      onClick={() => handlePatientDeleteModal(patient.id)}
                    >
                      <MdDeleteForever size={17} className="text-white hover:text-[#5558E4]" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showDelete && (
        <DeleteModal
          onClose={handlePatientDeleteModal}
          onDelete={handlePatientDelete}
          patientId={patientToDelete}
          deleteLoading={deleteLoading}
        />
      )}
      {newPatientModal && <CreateNewPatient closeCreatePatient={handleNewPatientModal} />}
    </div>
  );
};

export default Patients;
