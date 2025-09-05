import { useEffect, useState } from 'react';

import { jwtDecode } from 'jwt-decode';
import { PiChartBarFill } from 'react-icons/pi';

import patientApiService from '../../services/patientApiService';
import LoaderOverlay from '../common/LoaderOverlay';
import HealthScore from '../doctor_components/HealthScore';
import PatientChart from '../doctor_components/PatientChart';

const PatientAnalytics = () => {
  const [currentPatinet, setCurrentPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPatient = async () => {
      try {
        setLoading(true);
        const token = patientApiService.getAccessToken();
        const decodedToken = jwtDecode(token);

        const response = await patientApiService.get(`/patients/self/${decodedToken.sub}`);
        setCurrentPatient(response.data.data);
        console.log('patient data is :', response.data.data);
      } catch (error) {
        console.log('Error fetching current patient data :', error);
      } finally {
        setLoading(false);
      }
    };
    getPatient();
  }, []);

  const bloodWorkReports = currentPatinet?.bloodWorkReports
    ?.slice()
    ?.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate));

  return (
    <div className="h-screen bg-white w-full pt-10 px-8 static">
      <div className="flex justify-end md:justify-start w-full">
        <h1 className="text-xl font-bold text-gray-600 flex items-center gap-2">
          <PiChartBarFill />
          Analytics
        </h1>
      </div>
      <div className="bg-white border shadow w-full h-[90%] rounded-md mt-6 overflow-y-scroll">
        {/* reports */}
        <div className="flex items-center justify-between pr-4 shadow sticky top-0 bg-white">
          <h2 className="p-3 font-light flex items-center gap-2 text-gray-600">
            <PiChartBarFill />
            Analytics
          </h2>
          <div className="flex gap-3 md:gap-5 border-[1px] shadow p-1 rounded-md">
            <span className="flex items-center gap-1 text-xs font-light">
              Normal <div className="bg-[#73CEF8] h-2.5 w-2.5 md:h-3.5 md:w-3.5 rounded-full"></div>
            </span>
            <span className="flex items-center gap-1 text-xs font-light">
              Abnormal <div className="bg-[#FFB224] h-2.5 w-2.5 md:h-3.5 md:w-3.5 rounded-full"></div>
            </span>
            <span className="flex items-center gap-1 text-xs font-light">
              Optimal <div className="bg-[#BF7BD3] h-2.5 w-2.5 md:h-3.5 md:w-3.5 rounded-full"></div>
            </span>
          </div>
        </div>
        {loading ? (
          <div className=" text-gray-400 font-light h-[90%] flex items-center justify-center">
            <LoaderOverlay loading={loading} size={14} textSize="text-xs">
              Loading Analytics...
            </LoaderOverlay>
          </div>
        ) : bloodWorkReports ? (
          <div className="py-4">
            <HealthScore bloodWorkReports={bloodWorkReports} />
            <div className="flex justify-between px-4">
              <div className="w-full mt-5">
                <PatientChart bloodWorkReports={bloodWorkReports} />
              </div>
            </div>
          </div>
        ) : (
          <div className=" text-gray-400 font-light h-full flex items-center justify-center">
            <span className="flex flex-col items-center">
              <PiChartBarFill size={50} className="text-gray-300" />
              Your Charts will show here!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAnalytics;
