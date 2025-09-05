import { useEffect, useRef, useState } from 'react';

import { jwtDecode } from 'jwt-decode';
import { FaChevronDown, FaRegBell } from 'react-icons/fa6';
import { FiSun } from 'react-icons/fi';
import { PiChartBarFill } from 'react-icons/pi';

import doctorApiService from '../../services/doctorApiService';
import Button from '../common/Button';
import LoaderOverlay from '../common/LoaderOverlay';
import HealthScore from './HealthScore';
import PatientChart from './PatientChart';
import { getGreeting } from '../../utils/helperFunctions';

const Analytics = () => {
  const [patients, setPatients] = useState([]);
  const [singlePatient, setSinglePatient] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [singlePatientLoading, setSinglePatientLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const handleShowDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  const clearPatientData = () => {
    setSinglePatient([]);
    setShowDropDown(false);
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
  }, []);

  const handleSinglePatient = async (patientId) => {
    try {
      setSinglePatientLoading(true);
      const response = await doctorApiService.get(`/patients/${patientId}`);
      setSinglePatient(response.data.data);
      setShowDropDown(false);
      console.log('Single Patient data is :', response.data.data);
    } catch (error) {
      console.log('There was an error getting the patient:', error);
    } finally {
      setSinglePatientLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropDown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const bloodWorkReports = singlePatient?.bloodWorkReports
    ?.slice()
    ?.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate));

  return (
    <div className="h-screen bg-white w-full flex flex-col overflow-hidden">
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
            <PiChartBarFill />
            Analytics
          </h1>
          <span className="text-sm font-light text-gray-500">Trends and charts for tracking patient health</span>
        </div>
        <Button
          onClick={handleShowDropDown}
          loading={loading || singlePatientLoading}
          variant="solid"
          style={{ fontWeight: 'normal' }}
        >
          {singlePatient.firstName ? (
            <span className="flex items-center gap-2">
              {singlePatient.firstName} {singlePatient.lastName} <FaChevronDown />
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Select Patient <FaChevronDown />
            </span>
          )}
        </Button>
        {showDropDown && (
          <div className="text-sm font-light bg-gray-100 absolute py-2 z-10 right-4 top-28 w-40 rounded">
            <ul className="space-y-1">
              {patients.map((patient) => (
                <li
                  onClick={() => handleSinglePatient(patient.id)}
                  className="cursor-pointer py-1 pl-2 hover:bg-gray-500 hover:text-white"
                  key={patient.id}
                >
                  {patient.firstName} {patient.lastName}
                </li>
              ))}
              <li
                onClick={clearPatientData}
                className="cursor-pointer py-1 pl-2 text-[#5558E4] hover:text-white hover:bg-[#5558E4]"
              >
                Clear
              </li>
            </ul>
          </div>
        )}
      </div>
      {/* End of TOP NAVBAR */}
      <div className="flex-grow overflow-auto m-3 border rounded">
        {/* analytics */}
        <div className="flex items-center justify-between pl-3 pr-2">
          <h2 className=" py-2 flex items-center gap-2 font-medium text-sm text-gray-700">
            Patient Analytics
            <span className="text-sm font-light text-gray-400">
              Select a patient from the dropdown to view charts and trends
            </span>
          </h2>
          <div className="flex gap-5 border-[1px] shadow p-1 rounded-md">
            <span className="flex items-center gap-1 text-xs font-light">
              Normal <div className="bg-[#73CEF8] h-3.5 w-3.5 rounded-full"></div>
            </span>
            <span className="flex items-center gap-1 text-xs font-light">
              Abnormal <div className="bg-[#FFB224] h-3.5 w-3.5 rounded-full"></div>
            </span>
            <span className="flex items-center gap-1 text-xs font-light">
              Optimal <div className="bg-[#BF7BD3] h-3.5 w-3.5 rounded-full"></div>
            </span>
          </div>
        </div>

        {singlePatientLoading ? (
          <div className=" text-gray-400 font-light text-sm h-4/5 flex items-center justify-center">
            <LoaderOverlay loading={singlePatientLoading} size={14}>
              Loading Patient Analytics...
            </LoaderOverlay>
          </div>
        ) : bloodWorkReports ? (
          <div className="">
            <HealthScore bloodWorkReports={bloodWorkReports} />
            <div className="flex justify-between">
              <div className="w-full px-3">
                <PatientChart bloodWorkReports={bloodWorkReports} />
              </div>
            </div>
          </div>
        ) : (
          <div className=" text-gray-400 font-light text-sm h-4/5 flex items-center justify-center">
            <span className="flex flex-col items-center">
              <PiChartBarFill size={50} className="text-gray-300" />
              Select a patient to view charts!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
