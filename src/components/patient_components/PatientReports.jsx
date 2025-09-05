import { useEffect, useState } from 'react';

import { jwtDecode } from 'jwt-decode';
import toast, { Toaster } from 'react-hot-toast';
import { BiInfoCircle } from 'react-icons/bi';
import { FaFileMedicalAlt } from 'react-icons/fa';
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';
import { RxOpenInNewWindow } from 'react-icons/rx';
import { TbReportAnalytics } from 'react-icons/tb';

import patientApiService from '../../services/patientApiService';
import { extractReportType } from '../../utils/helperFunctions';
import Button from '../common/Button';
import LoaderOverlay from '../common/LoaderOverlay';
import PatientReportDrawer from './PatientReportDrawer';

const PatientReports = () => {
  const [drawerState, setDrawerState] = useState({
    isOpen: false,
    bloodReportUrl: null,
    title: '',
  });
  const handleCloseDrawer = () => {
    setDrawerState({
      isOpen: false,
      bloodReportUrl: null,
      title: '',
    });
  };

  const [viewReportLoading, setViewReportLoading] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    const getPatient = async () => {
      try {
        setLoading(true);
        const token = patientApiService.getAccessToken();
        const decodedToken = jwtDecode(token);

        const response = await patientApiService.get(`/patients/self/${decodedToken.sub}`);
        setPatientData(response.data.data);

        // If patient has reports, fetch the grouped reports
        if (response.data.data?.bloodWorkReports?.length > 0) {
          const res = await patientApiService.get(
            `/patients/get_all_reports_grouped/${response.data.data.firstName}_${response.data.data.lastName}_${response.data.data.id}`,
          );
          setReportData(res.data.data || {});
        }
      } catch (error) {
        console.log('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };
    getPatient();
  }, []);

  const getLabReport = async (fileName) => {
    try {
      setViewReportLoading(fileName);
      const res = await patientApiService.get(`/patients/get_report_by_file/${fileName}`, {
        responseType: 'blob',
      });

      const contentType = res.headers['content-type'];

      if (contentType && contentType.includes('application/json')) {
        const text = await res.data.text();
        const errorJson = JSON.parse(text);
        throw new Error(errorJson.message || 'Failed to get lab report');
      }

      const blob = new Blob([res.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      // Instead of opening in new window, return the url
      return url;
    } catch (error) {
      console.error('There was an error getting the report:', error);
      notifyError(<div className="text-sm font-light">Failed to fetch report</div>);
      return null;
    } finally {
      setViewReportLoading(null);
    }
  };
  const notifyError = (toastMessage) => {
    toast.error(toastMessage);
  };
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="h-screen bg-white w-full pt-10 px-8 static ">
        <div className="flex justify-end md:justify-start w-full">
          <h1 className="text-xl font-bold text-gray-600 flex items-center gap-2">
            <TbReportAnalytics />
            My Reports
          </h1>
        </div>
        <div className="bg-white border shadow w-full h-[92%] rounded-md mt-6 overflow-y-hidden">
          {/* reports */}
          <div className="flex items-center justify-center md:justify-between gap-2 shadow sticky top-0 bg-white py-2 md:px-0">
            <h2 className="px-3 font-light flex items-center gap-2 text-gray-600  md:flex">
              <TbReportAnalytics />
              Reports History
            </h2>
          </div>
          <div
            className={`text-gray-400 font-light h-full flex px-5 py-5 justify-center ${
              (patientData && !patientData?.showReport) || loading ? 'items-center' : 'items-start'
            }`}
          >
            {patientData && !patientData?.showReport ? (
              <div className="flex items-center max-h-[100px] bg-red-50 border border-red-200 rounded-md p-6 w-full max-w-lg mx-auto">
                <BiInfoCircle size={30} className="text-red-600 flex-shrink-0 mr-4" />
                <div className="flex flex-col justify-center">
                  <span className="text-red-600 font-semibold text-sm text-left">
                    You are not allowed to view your blood or genetics report
                  </span>
                  <span className="text-xs text-red-500 text-left mt-1">
                    Please ask your doctor to give permission.
                  </span>
                </div>
              </div>
            ) : loading ? (
              <LoaderOverlay loading={loading} size={10} textSize="text-xs">
                Loading Reports...
              </LoaderOverlay>
            ) : patientData ? (
              <div className="w-full">
                {patientData.bloodWorkReports
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
                          <div className="bg-gray-50 border-b text-black p-4 shadow-sm">
                            <div className="flex flex-col gap-2">
                              {(() => {
                                // Format report.reportDate to "YYYY-MM-DD"
                                const dateKey = new Date(report.reportDate).toISOString().slice(0, 10);
                                const files = reportData[dateKey]?.files || [];
                                if (files.length === 0) {
                                  return (
                                    <span className="text-xs text-gray-500">
                                      No reports generated for this blood work.
                                    </span>
                                  );
                                }
                                return files.map((file, fileIdx) => (
                                  <div
                                    key={fileIdx}
                                    className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0"
                                  >
                                    <span className="text-xs truncate  max-w-full sm:max-w-xs">
                                      {extractReportType(file)}
                                    </span>
                                    <Button
                                      onClick={async () => {
                                        setViewReportLoading(file);
                                        const url = await getLabReport(file);
                                        setViewReportLoading(null);
                                        setDrawerState({
                                          isOpen: true,
                                          bloodReportUrl: url,
                                          title: extractReportType(file),
                                        });
                                      }}
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
              <span className="flex flex-col items-center">
                <TbReportAnalytics size={50} className="text-gray-300" />
                No reports found.
              </span>
            )}
          </div>
        </div>
      </div>
      <PatientReportDrawer
        isOpen={drawerState.isOpen}
        onClose={handleCloseDrawer}
        bloodReportUrl={drawerState.bloodReportUrl}
        title={drawerState.title}
      />
    </>
  );
};

export default PatientReports;
