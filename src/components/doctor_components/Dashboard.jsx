import { useEffect, useState } from 'react';

import { jwtDecode } from 'jwt-decode';
import { FaArrowRight, FaRegBell } from 'react-icons/fa';
import { FiSun } from 'react-icons/fi';
import { LuUsers } from 'react-icons/lu';
import { MdBloodtype, MdDashboard } from 'react-icons/md';
import { PiDna } from 'react-icons/pi';

import doctorApiService from '../../services/doctorApiService';
import { getGreeting } from '../../utils/helperFunctions';
import { ReportsChart } from '../ReportsChart';
import LoaderOverlay from '../common/LoaderOverlay';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = doctorApiService.getAccessToken();
  const decodedToken = jwtDecode(token);

  useEffect(() => {
    const getPatients = async () => {
      setLoading(true);
      try {
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
  if (loading) {
    return (
      <div className="h-screen bg-white w-full overflow-y-scroll">
        <div className="h-12 bg-white flex items-center justify-between p-3 border-b-[1px] gap-1 mt-[1px] md:pl-3 pl-[50px]">
          <span className="flex items-center gap-2">
            <FiSun className="text-gray-500" /> {getGreeting()}, {decodedToken.first_name}!
          </span>
          <span>
            <FaRegBell className="text-gray-400" />
          </span>
        </div>
        <div className="flex items-center h-full justify-center">
          <LoaderOverlay loading={true} size={16} className="static bg-transparent" textSize="text-sm">
            Loading Dashboard...
          </LoaderOverlay>
        </div>
      </div>
    );
  }
  return (
    <div className="h-screen bg-white w-full overflow-y-scroll">
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
            <MdDashboard />
            Dashboard
          </h1>
          <span className="text-sm font-light text-gray-500">Overview of all your patients and related metrics</span>
        </div>
        <a
          href="/patients"
          className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded bg-[#5558E4] text-xs font-medium text-white"
        >
          Go to Patients <FaArrowRight />
        </a>
      </div>
      {/* End of TOP NAVBAR */}
      <div className="flex">
        <div className="w-3/4">
          <div className="mt-6 flex gap-4 ml-3 w-full">
            <div className="border-[1px] w-1/3 h-32 text-sm font-light rounded-md shadow-sm">
              <div className="flex gap-2 p-5">
                <span className="bg-[#5558E4] p-[6px] rounded mb-1">
                  <LuUsers size={23} className="text-white" />
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-700">Total Patients</span>
                  <span className="text-sm font-bold text-gray-700">{patients.length}</span>
                </div>
              </div>
              <div className="w-full border-t-[1px] pl-5 pt-3 text-xs font-medium text-[#5558E4]">
                <a href="/patients" className="flex items-center gap-2 cursor-pointer">
                  See Details <FaArrowRight />
                </a>
              </div>
            </div>
            <div className="border-[1px] w-1/3 h-32 text-sm font-light rounded-md shadow-sm">
              <div className="flex gap-2 p-5">
                <span className="bg-[#FFB224] p-[6px] rounded mb-1">
                  <PiDna size={23} className="text-white" />
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-700">Total Genetics</span>
                  <span className="text-sm font-bold text-gray-700">
                    {patients.reduce(
                      (acc, patient) => acc + (patient.geneResultReports ? patient.geneResultReports.length : 0),
                      0,
                    )}
                  </span>
                </div>
              </div>
              <div className="w-full border-t-[1px] pl-5 pt-3 text-xs font-medium text-[#5558E4]">
                <a href="" className="flex items-center gap-2">
                  See Details <FaArrowRight />
                </a>
              </div>
            </div>
            <div className="border-[1px] w-1/3 h-32 text-sm font-light rounded-md shadow-sm">
              <div className="flex gap-2 p-5">
                <span className="bg-[#73CEF8] p-[6px] rounded mb-1">
                  <MdBloodtype size={23} className="text-white" />
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-700">Total Labs</span>
                  <span className="text-sm font-bold text-gray-700">
                    {patients.reduce(
                      (acc, patient) => acc + (patient.bloodWorkReports ? patient.bloodWorkReports.length : 0),
                      0,
                    )}
                  </span>
                </div>
              </div>
              <div className="w-full border-t-[1px] pl-5 pt-3 text-xs font-medium text-[#5558E4]">
                <a href="/labs" className="flex items-center gap-2">
                  See Details <FaArrowRight />
                </a>
              </div>
            </div>
          </div>

          <div className="px-1 w-full mt-6 border rounded-md shadow-sm ml-3">
            <div className="flex items-center justify-between">
              <h2 className="p-3 font-medium text-sm text-gray-700">
                Reports Generated <span className="text-sm font-light text-gray-400">(Over a time span)</span>
              </h2>
              <a
                href="/reports"
                className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#5558E4] mr-2"
              >
                Go to reports <FaArrowRight />
              </a>
            </div>
            <div className="min-w-full">
              <ReportsChart />
            </div>
          </div>
          <div className="px-3 w-full mt-6 border rounded-md shadow-sm ml-3 overflow-hidden">
            <div className="flex items-center justify-between">
              <h2 className="p-3 flex  items-center  gap-1 font-medium text-sm text-gray-700">
                My Frequent Patients
                <span className="text-sm font-light text-gray-400">(Patients you interact with the most)</span>
              </h2>
              <a href="/patients" className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#5558E4]">
                Go to Patients <FaArrowRight />
              </a>
            </div>
            <table className="min-w-full min-h-full border-collapse">
              <thead className="bg-[#5558E4]">
                <tr className="text-white text-xs font-light">
                  <th className="py-1 px-4 text-left rounded-l-md">Name</th>
                  <th className="py-1 px-4 text-left">Gender</th>
                  <th className="py-1 px-4 text-left">Phone</th>
                  <th className="py-1 px-4 text-left rounded-r-md">Patient ID</th>
                </tr>
              </thead>
              <tbody className="font-normal text-gray-500 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center">
                      <LoaderOverlay loading={true} size={14} className="static bg-transparent" textSize="text-xs">
                        Loading frequent patients...
                      </LoaderOverlay>
                    </td>
                  </tr>
                ) : patients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">
                      No frequent patients found.
                    </td>
                  </tr>
                ) : (
                  patients.map((patient, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4">
                        {patient.firstName} {patient.lastName}
                      </td>
                      <td className="py-2 px-4">
                        {patient?.bloodWorkReports?.[0]?.sex || 'Waiting for blood results'}
                      </td>
                      <td className="py-2 px-4">{patient.phone}</td>
                      <td className="py-2 px-4">{patient.id}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className=" w-1/4 pl-8 pr-3 mt-6 flex flex-col gap-4">
          <div className="h-1/3 bg-[url('./assets/lifestyle.jpg')] bg-cover text-white border rounded-md shadow-sm p-4">
            <div className="h-28 w-28 bg-white rounded-full flex items-center justify-center border-[#5558E4] border-8 border-opacity-70">
              <span className="text-sm font-bold text-[#5558E4]">Lifestyle</span>
            </div>
          </div>
          <div className="h-1/3 bg-[url('./assets/supplements.jpg')] bg-cover text-white border rounded-md shadow-sm p-4">
            <div className="h-28 w-28 bg-white rounded-full flex items-center justify-center border-[#FFB224] border-8 border-opacity-70">
              <span className="text-sm font-bold text-[#5558E4]">Supplements</span>
            </div>
          </div>
          <div className="h-1/3 bg-[url('./assets/medications.jpg')] bg-cover text-white border rounded-md shadow-sm p-4">
            <div className="h-28 w-28 bg-white rounded-full flex items-center justify-center border-[#73CEF8] border-8 border-opacity-70">
              <span className="text-sm font-bold text-[#5558E4]">Medication</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
