import { useEffect, useState } from 'react';

import { jwtDecode } from 'jwt-decode';
import { FaFileMedicalAlt } from 'react-icons/fa';
import { FaChevronDown, FaRegBell } from 'react-icons/fa6';
import { FiSun } from 'react-icons/fi';
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';
import { RxOpenInNewWindow } from 'react-icons/rx';
import { TbReportAnalytics } from 'react-icons/tb';

import doctorApiService from '../../services/doctorApiService';
import { extractReportType, getGreeting } from '../../utils/helperFunctions';
import Button from '../common/Button';
import LoaderOverlay from '../common/LoaderOverlay';

const Reports = () => {
  const [singlePatient, setSinglePatient] = useState([]);
  const [viewReportLoading, setViewReportLoading] = useState(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [singlePatientLoading, setSinglePatientLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);
  const [reportData, setReportData] = useState([]);

  const handleShowDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  const clearPatientData = () => {
    setSinglePatient([]);
    setShowDropDown(false);
  };
  const token = localStorage?.getItem('jwtToken');
  const decodedToken = jwtDecode(token);
  useEffect(() => {
    const getPatients = async () => {
      try {
        setLoading(true);
        const res = await doctorApiService.get(`/patients/`);
        const result = res.data;

        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch patients');
        }

        setPatients(result.data);
        console.log('patients data is :', result.data);
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
      setShowDropDown(false);
      setSinglePatientLoading(true);
      const patient = patients.find((patient) => patient.id === patientId);
      const res = await doctorApiService.get(
        `/patients/get_all_reports_grouped/${patient.firstName}_${patient.lastName}_${patientId}`,
      );
      const result = res.data;

      if (!result.success) {
        throw new Error(result.message || 'Failed to get patient data');
      }

      setSinglePatient(patient);
      setReportData(result.data);
    } catch (error) {
      console.log('There was an error getting the patient:', error);
    } finally {
      setSinglePatientLoading(false);
    }
  };

  const getLabReport = async (fileName) => {
    try {
      setViewReportLoading(fileName);
      const res = await doctorApiService.get(`/patients/get_report_by_file/${fileName}`, { responseType: 'blob' });

      const contentType = res.headers['content-type'];

      if (contentType && contentType.includes('application/json')) {
        const text = await res.data.text();
        const errorJson = JSON.parse(text);
        throw new Error(errorJson.message || 'Failed to get lab report');
      }

      const blob = new Blob([res.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      window.open(url, '_blank');
      window.URL.revokeObjectURL(url); // Optional: cleanup
    } catch (error) {
      console.error('There was an error getting the patient report:', error);
    } finally {
      setViewReportLoading(null);
    }
  };

  return (
    <div className="h-screen bg-white w-full overflow-y-scroll static">
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
            <TbReportAnalytics />
            Reports
          </h1>
          <span className="text-sm font-light text-gray-500">History of all your patients reports</span>
        </div>
        <Button
          loading={loading || singlePatientLoading}
          onClick={handleShowDropDown}
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
          <div className="text-sm font-light bg-gray-100 absolute py-2 right-4 top-28 w-40 rounded">
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
      <div className="mt-6 border rounded-md shadow-sm px-3 m-3 h-screen">
        <h2 className="py-3 flex items-center gap-2 font-medium text-sm text-gray-700">
          Report History
          <span className="text-sm font-light text-gray-400">Select a patient from the dropdown to view reports</span>
        </h2>
        {/* Report History List */}
        {singlePatientLoading ? (
          <div className="font-light text-sm h-3/4 flex items-center justify-center">
            <LoaderOverlay loading={singlePatientLoading} size={14}>
              Loading Reports...
            </LoaderOverlay>
          </div>
        ) : singlePatient && singlePatient.bloodWorkReports && singlePatient.bloodWorkReports.length > 0 ? (
          <div className="w-full">
            {singlePatient.bloodWorkReports
              .slice()
              .sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))
              .map((report, index) => (
                <div className="w-full mb-2" key={index}>
                  <div className="bg-[#5558E4] border-collapse border-b-[1px] rounded pl-1">
                    <div
                      className={`text-sm font-light flex items-center justify-between text-white font-medium rounded-md cursor-pointer`}
                      onClick={() => {
                        setExpandedRows((prev) =>
                          prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
                        );
                      }}
                    >
                      <div className="flex items-center gap-2 py-2">
                        <span className="flex items-center gap-2">
                          <FaFileMedicalAlt className="text-white" size={18} />{' '}
                          {new Date(report.reportDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="p-[6px] mr-2 text-white">
                        {expandedRows.includes(index) ? (
                          <IoIosArrowDropup size={22} className="text-white" />
                        ) : (
                          <IoIosArrowDropdown size={22} />
                        )}
                      </div>
                    </div>
                    {expandedRows.includes(index) && (
                      <div className="bg-gray-50 border-b p-4 shadow-sm">
                        <div className="flex flex-col gap-2">
                          {(() => {
                            // Format report.reportDate to "YYYY-MM-DD"
                            const dateKey = new Date(report.reportDate).toISOString().slice(0, 10);
                            const files = reportData[dateKey]?.files || [];
                            if (files.length === 0) {
                              return (
                                <span className="text-xs text-gray-500">No reports generated for this blood work.</span>
                              );
                            }
                            return files.map((file, fileIdx) => (
                              <div
                                key={fileIdx}
                                className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0"
                              >
                                <span className="text-xs">{extractReportType(file)}</span>
                                <Button
                                  onClick={() => getLabReport(file)}
                                  variant="custom"
                                  loaderColor="black"
                                  loading={viewReportLoading && viewReportLoading === file}
                                  className="px-2 py-1 flex items-center gap-1 rounded bg-[#73CEF8] text-xs border border-[#73CEF8] hover:text-white"
                                >
                                  View
                                  <RxOpenInNewWindow />
                                </Button>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className=" text-gray-400 font-light text-sm h-3/4 flex items-center justify-center">
            <span className="flex flex-col items-center gap-3">
              <TbReportAnalytics size={50} className="text-gray-300" />
              No reports found.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
