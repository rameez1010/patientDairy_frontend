import { useState } from 'react';

import toast, { Toaster } from 'react-hot-toast';
import { FaArrowRight, FaUserCircle } from 'react-icons/fa';
import { GiMedicines } from 'react-icons/gi';
import { MdBloodtype } from 'react-icons/md';
import { TbChartHistogram } from 'react-icons/tb';

import doctorApiService from '../../../services/doctorApiService';

const PatientProfile = ({
  name,
  email,
  sex,
  age,
  address,
  phone,
  dob,
  showReport,
  patientId,
  latestBloodResults,
  onOpenMedicalIntakeModal,
  isMedicalFormCompleted,
}) => {
  // State for permission checkbox
  const [reportVisibility, setReportVisibility] = useState(showReport);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReportVisibilityChange = async (e) => {
    const newValue = e.target.checked;
    setLoading(true);
    setReportVisibility(newValue);
    setError('');
    try {
      await doctorApiService.put(`/patients/${patientId}/show-report`, {
        show_report: newValue,
      });
      notifySuccess(<div className="text-sm font-light">Report visibility updated successfully!</div>);
    } catch (err) {
      setReportVisibility(!newValue);
      setError('Failed to update visibility.');
      notifyError(<div className="text-sm font-light">Failed to update visibility!</div>);
    } finally {
      setLoading(false);
    }
  };

  const notifyError = (toastMessage) => {
    toast.error(toastMessage);
  };

  const notifySuccess = (toastMessage) => {
    toast.success(toastMessage);
  };

  return (
    <div className="w-1/6 mt-3">
      {/* Top Div */}
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-gray-50 w-full border shadow-sm flex p-3 flex-col justify-center gap-3 rounded-md">
        <FaUserCircle size={60} className="text-white p-1 bg-[#5558E4] rounded-full opacity-55" />
        <h4 className="text-sm font-medium text-gray-700">{name}</h4>
        <span className="font-light text-sm text-gray-400">{email}</span>
        <div className="border-gray-400 border-b-[1px] w-full"></div>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-semibold">Gender</span>
            <span>{sex}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-semibold">Date of birth</span>
            <span>{dob}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-semibold">Age</span>
            <span>{age}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-semibold">Phone</span>
            <span>{phone}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-semibold">Patient ID</span>
            <span>{patientId}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-semibold">Address</span>
            <span>{address}</span>
          </div>
        </div>
        {/* Permission Checkbox Section */}
        <button className="px-2 py-1 rounded text-[#5558E4] text-xs border border-[#5558E4] hover:text-white hover:bg-[#5558E4]">
          Edit Profile
        </button>
      </div>
      <div className="flex items-center gap-2 mt-3 p-2 bg-gray-100 border rounded-md">
        <input
          type="checkbox"
          id="report-visibility"
          checked={reportVisibility}
          onChange={handleReportVisibilityChange}
          className="accent-[#5558E4] h-3 w-3"
          disabled={loading}
        />
        <label htmlFor="report-visibility" className="text-xs font-medium">
          Allow Patient to Access Reports
        </label>
        {error && <span className="text-xs text-red-500 ml-2">{error}</span>}
      </div>
      <div className="bg-gray-100 p-3 mt-3 border rounded-md opacity-80 flex items-center justify-between">
        <div>
          <div className="text-xs font-light mb-2">Medical Intake Information</div>
          {isMedicalFormCompleted ? (
            <button
              onClick={onOpenMedicalIntakeModal}
              className="flex items-center gap-2 cursor-pointer text-xs font-medium"
            >
              View Medical Intake <FaArrowRight />
            </button>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-md bg-red-50/80 border border-red-200">
              <span className="text-xs text-red-600 font-medium">
                Patient has not yet completed the details. Please ask patient to complete it.
              </span>
            </div>
          )}
        </div>
        {isMedicalFormCompleted && (
          <div className="bg-white border p-2 rounded-full">
            <GiMedicines size={25} className="text-[#73CEF8]" />
          </div>
        )}
      </div>
      {latestBloodResults && (
        <div>
          <div className="bg-gray-100 p-3 mt-3 border rounded-md opacity-80 flex items-center justify-between">
            <div className="">
              <div className="text-xs font-light mb-2">View Previous Blood Results</div>
              <a href="/labs" className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                Go to Labs <FaArrowRight />
              </a>
            </div>
            <div className="bg-white border p-2 rounded-full">
              <MdBloodtype size={25} className="text-[#5558E4]" />
            </div>
          </div>
          <div className="bg-gray-100 p-3 mt-3 border rounded-md opacity-80 flex items-center justify-between">
            <div className="">
              <div className="text-xs font-light mb-2">View Patient Health Charts</div>
              <a href="/analytics" className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                Go to Analytics <FaArrowRight />
              </a>
            </div>
            <div className="bg-white border p-2 rounded-full">
              <TbChartHistogram size={25} className="text-[#FFB224]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientProfile;
