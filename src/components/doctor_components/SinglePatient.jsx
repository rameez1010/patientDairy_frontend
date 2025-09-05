import { useEffect, useRef, useState } from 'react';

import { jwtDecode } from 'jwt-decode';
import { createPortal } from 'react-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FaArrowLeft, FaChevronDown, FaPills, FaRegBell } from 'react-icons/fa';
import { FiSun, FiUser } from 'react-icons/fi';
import { MdBloodtype } from 'react-icons/md';
import { PiDna } from 'react-icons/pi';
import { RxOpenInNewWindow } from 'react-icons/rx';
import { SiGooglegemini } from 'react-icons/si';
import { useParams } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';

import doctorApiService from '../../services/doctorApiService';
import { extractReportType } from '../../utils/helperFunctions';
import Spinner from '../Spinner';
import Button from '../common/Button';
import LoaderOverlay from '../common/LoaderOverlay';
import MedicalIntakeInfoModal from './MedicalIntakeInfoModal';
import FullscriptIntegration from './smaller_components/FullscriptIntegration';
import GeneResults from './smaller_components/GeneResults';
import GeneUploadModal from './smaller_components/GeneUploadModal';
import LabResults from './smaller_components/LabResults';
import PatientProfile from './smaller_components/PatientProfile';
import RagModal from './smaller_components/RagModal';
import ReportGenerationModal from './smaller_components/ReportGenerationModal';
import UploadModal from './smaller_components/UploadModal';

const SinglePatient = () => {
  const { patientId } = useParams();
  const token = localStorage?.getItem('jwtToken');
  const decodedToken = jwtDecode(token);
  const [patient, setPatient] = useState('');
  const [loading, setLoading] = useState(true);
  const [geneReportLoading, setGeneRreportLoading] = useState(false);
  const [reportLoading, setRreportLoading] = useState(false);
  const [bloodUploadModal, setBloodUploadModal] = useState(false);
  const [geneUploadModal, setGeneUploadModal] = useState(false);
  const [generateReportModal, setGenerateReportModal] = useState(false);
  const [ragModal, setRagModal] = useState(false);
  const [medicalIntakeModal, setMedicalIntakeModal] = useState(false);
  const [activeTab, setActiveTab] = useState('blood');
  const [refetch, setRefetch] = useState(false);
  const [isMedicalFormCompleted, setIsMedicalFormCompleted] = useState(false);
  const [viewReportLoading, setViewReportLoading] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [reportDataLoading, setReportDataLoading] = useState(false);
  const [showViewDropDown, setShowViewDropDown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const viewButtonRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleFetchReportData = async (patientId) => {
    try {
      if (showViewDropDown) {
        setShowViewDropDown(false);
        return;
      }
      setReportDataLoading(true);

      const res = await doctorApiService.get(
        `/patients/get_all_reports_grouped/${patient.firstName}_${patient.lastName}_${patientId}`,
      );
      const result = res.data;

      if (!result.success) {
        throw new Error(result.message || 'Failed to get patient data');
      }

      setReportData(result.data[latestBloodWorkReport.reportDate]);
      setShowViewDropDown((prev) => !prev);
    } catch (error) {
      console.log('There was an error getting the patient:', error);
    } finally {
      setReportDataLoading(false);
    }
  };
  // Handle view report click
  const handleViewReport = (fileName) => {
    getLabReport(fileName);
    setShowViewDropDown(false);
  };

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        viewButtonRef.current &&
        !viewButtonRef.current.contains(event.target)
      ) {
        setShowViewDropDown(false);
      }
    };

    if (showViewDropDown) {
      document.addEventListener('mousedown', handleClickOutside);
      // Calculate position when dropdown is shown
      if (viewButtonRef.current) {
        const rect = viewButtonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.top + window.scrollY - 5,
          left: rect.right + window.scrollX - 125, 
          transform: 'translateY(-100%)', 
        });
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showViewDropDown]);
  const handleBloodUploadModal = () => {
    setBloodUploadModal(!bloodUploadModal);
  };
  const onOpenMedicalIntakeModal = () => {
    setMedicalIntakeModal(true);
  };
  const handleGeneUploadModal = () => {
    setGeneUploadModal(!geneUploadModal);
  };
  const notifyError = (toastMessage) => {
    toast.error(toastMessage);
  };
  const handleRefetch = () => {
    setRefetch(!refetch);
  };
  const handShowRagModal = () => {
    setRagModal(!ragModal);
  };

  const handleGenerateReportModal = () => {
    setGenerateReportModal(!generateReportModal);
  };

  const notifySuccess = (toastMessage) => {
    toast.success(toastMessage);
  };

  useEffect(() => {
    const getPatient = async (patientId) => {
      try {
        setLoading(true);
        const res = await doctorApiService.get(`/patients/${patientId}`);
        const result = await res.data;

        if (!result.success) {
          throw new Error(result.message || 'Failed to get patient data');
        }

        setPatient(result.data);
      } catch (error) {
        console.log('There was an error getting the patient:', error);
      } finally {
        setLoading(false);
      }
    };
    const checkFormCompletion = async (patientId) => {
      try {
        const response = await doctorApiService.get(`/medical-form/completion-status/${patientId}`);
        const isComplete = response.data.data.is_complete;

        if (isComplete) {
          setIsMedicalFormCompleted(true);
        }
      } catch (error) {
        console.log('Error checking form completion:', error);
        setIsMedicalFormCompleted(false);
      }
    };
    getPatient(patientId);
    checkFormCompletion(patientId);
  }, [patientId, refetch]);

  const generateReport = async (patientId, results, selectedPanelsList, firstName, lastName) => {
    setRreportLoading(true);
    try {
      const res = await doctorApiService.post(`/patients/generate_report`, {
        id: patientId,
        firstName: firstName,
        lastName: lastName,
        selectedBioMarkerGroups: selectedPanelsList,
        ...results,
      });
      const result = res.data;

      if (!result.success) {
        throw new Error(result.message || 'Failed to generate report');
      }

      notifySuccess(<div className="text-sm font-light">Lab Report Generated Successfully!</div>);
    } catch (error) {
      console.log('Error , it did not work! : ', error);
      notifyError(<div className="text-sm font-light">Report generation failed!</div>);
    } finally {
      setRreportLoading(false);
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

  const generateGeneReport = async (patientId, results, firstName, lastName) => {
    setGeneRreportLoading(true);
    try {
      const res = await doctorApiService.post(`/patients/generate_gene_report`, {
        id: patientId,
        firstName: firstName,
        lastName: lastName,
        ...results,
      });
      const result = res.data;

      if (!result.success) {
        throw new Error(result.message || 'Failed to generate gene report');
      }

      notifySuccess(<div className="text-sm font-light">Gene Report Generated Successfully!</div>);
    } catch (error) {
      console.log('Error , it did not work! : ', error);
    } finally {
      setGeneRreportLoading(false);
    }
  };

  const getGeneLabReport = async (patientId, firstName, lastName) => {
    try {
      setViewReportLoading(true);
      const res = await doctorApiService.get(`/patients/get_gene_report/${firstName}_${lastName}_${patientId}`, {
        responseType: 'blob', // Important for binary files like PDFs
      });

      const blob = res.data; // Axios puts blob directly in `data`
      const contentType = res.headers['content-type'];

      // Optional: Check if the response was actually JSON (error case)
      if (contentType && contentType.includes('application/json')) {
        const text = await blob.text();
        const json = JSON.parse(text);
        throw new Error(json.message || 'Failed to get gene report');
      }

      // Open PDF in new tab
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');

      // Optionally, clean up the URL object if you no longer need it
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log('There was an error getting the patient report:', error);
      notifyError(<div className="text-sm font-light">No report! Click Generate Report.</div>);
    } finally {
      setViewReportLoading(false);
    }
  };

  // const gene_results = patient.gene_results?.slice()?.sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.results;
  const latestGeneReport = patient.geneResultReports
    ?.slice()
    ?.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))[0];

  const latestBloodWorkReport = patient.bloodWorkReports
    ?.slice()
    ?.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))[0];

  if (loading) {
    return (
      <div className="h-screen bg-white w-full overflow-auto">
        <div className="h-12 bg-white flex items-center justify-between p-3 border-b-[1px] gap-1 mt-[1px]">
          <span className="flex items-center gap-2">
            <FiSun className="text-gray-500" /> Good Morning, {decodedToken.first_name}!
          </span>
          <span>
            <FaRegBell className="text-gray-400" />
          </span>
        </div>
        <div className="flex items-center h-full justify-center">
          <LoaderOverlay loading={loading} size={14}>
            Loading Patient Data...
          </LoaderOverlay>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white w-full flex flex-col overflow-hidden">
      {/* TOP NAVBAR */}
      <div className="h-12 bg-white flex items-center justify-between p-3 border-b-[1px] gap-1 mt-[1px]">
        <span className="flex items-center gap-2">
          <FiSun className="text-gray-500" /> Good Morning, {decodedToken.first_name}!
        </span>
        <span>
          <FaRegBell className="text-gray-400" />
        </span>
      </div>
      <div className="px-3 mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-medium font-bold text-gray-600 flex items-center gap-2">
            <FiUser />
            Patient
          </h1>
          <span className="text-sm font-light text-gray-400">Detailed patient information and results</span>
        </div>
        <div className="flex gap-2">
          <a
            href="/patients"
            className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded bg-[#5558E4] text-xs font-medium text-white"
          >
            <FaArrowLeft />
            Back to Patients
          </a>
          <button
            onClick={handShowRagModal}
            className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded bg-[#5558E4] text-xs font-medium text-white"
          >
            <SiGooglegemini /> BK AI Assistant
          </button>
        </div>
      </div>
      {/* End of TOP NAVBAR */}
      <Toaster position="top-center" reverseOrder={false} />
      {bloodUploadModal && (
        <UploadModal patientId={patientId} onClose={handleBloodUploadModal} handleRefetch={handleRefetch} />
      )}
      {geneUploadModal && (
        <GeneUploadModal patientId={patientId} onClose={handleGeneUploadModal} handleRefetch={handleRefetch} />
      )}
      {generateReportModal && (
        <ReportGenerationModal
          onClose={handleGenerateReportModal}
          bloodWorkBioMarkers={latestBloodWorkReport?.bloodWorkBioMarkerGroup}
          viewReportLoading={viewReportLoading}
          onGenerate={(filteredResults, selectedPanelsList) =>
            generateReport(patientId, filteredResults, selectedPanelsList, patient.firstName, patient.lastName)
          }
          reports={patient.bloodWorkReports}
          results={latestBloodWorkReport}
          reportLoading={reportLoading}
          setReportLoading={setRreportLoading}
          getLabReport={(fileName) => getLabReport(fileName)}
          patient={patient}
          patientId={patientId}
          handleFetchReportData={handleFetchReportData}
          reportData={reportData}
          reportDataLoading={reportDataLoading}
        />
      )}
      {ragModal && (
        <RagModal
          patientId={patientId}
          firstName={patient.firstName}
          lastName={patient.lastName}
          onClose={handShowRagModal}
        />
      )}
      <div className="flex flex-1 min-h-0 overflow-hidden ml-3">
        <PatientProfile
          name={patient.firstName + ' ' + patient.lastName}
          email={patient.email}
          sex={patient?.gender}
          address={patient.address}
          phone={patient.phone}
          patientId={patient.id}
          dob={latestBloodWorkReport?.dateOfBirth || 'Waiting for blood results'}
          age={latestBloodWorkReport?.age || 'Waiting for blood results'}
          latestBloodResults={latestBloodWorkReport}
          onOpenMedicalIntakeModal={onOpenMedicalIntakeModal}
          isMedicalFormCompleted={isMedicalFormCompleted}
        />
        <div className="flex-1 flex px-3 gap-3 mt-3 mb-2 min-h-0">
          {/* Combined container for all tabs */}
          <div className="w-full border shadow-sm rounded-md flex flex-col">
            {/* Tab buttons */}
            <div className="flex border-b-[1px] bg-gray-50 rounded-md">
              <button
                onClick={() => setActiveTab('blood')}
                className={`p-3 font-medium text-sm flex items-center gap-1 ${activeTab === 'blood' ? 'text-[#5558E4] border-b-2 border-[#5558E4]' : 'text-gray-700'}`}
              >
                <MdBloodtype size={20} /> Latest Blood Results
              </button>
              <button
                onClick={() => setActiveTab('gene')}
                className={`p-3 font-medium text-sm flex items-center gap-1 ${activeTab === 'gene' ? 'text-[#5558E4] border-b-2 border-[#5558E4]' : 'text-gray-700'}`}
              >
                <PiDna size={18} /> Genetic Results
              </button>
              <button
                onClick={() => setActiveTab('fullscript')}
                className={`p-3 font-medium text-sm flex items-center gap-1 ${activeTab === 'fullscript' ? 'text-[#5558E4] border-b-2 border-[#5558E4]' : 'text-gray-700'}`}
              >
                <FaPills size={18} /> Fullscript
              </button>
              <div className="flex-1 flex justify-end pr-2">
                {activeTab === 'blood' ? (
                  <div className="space-x-2 flex items-center">
                    <Button
                      onClick={handleBloodUploadModal}
                      variant="custom"
                      className="px-2 py-1 rounded bg-[#5558E4] text-white text-xs border border-[#5558E4] hover:text-black"
                    >
                      Upload
                    </Button>
                    <Button
                      onClick={handleGenerateReportModal}
                      disabled={!latestBloodWorkReport}
                      variant="custom"
                      className="px-2 py-1 rounded bg-[#FFB224] text-xs border border-[#FFB224] hover:text-white"
                    >
                      Generate
                    </Button>
                    <div className="flex items-center" ref={viewButtonRef}>
                      <div className="relative">
                        <Button
                          onClick={() => handleFetchReportData(patientId)}
                          variant="custom"
                          loading={reportDataLoading || viewReportLoading}
                          loaderColor="black"
                          className="px-2 py-1 flex items-center gap-1 rounded bg-[#73CEF8] text-xs border border-[#73CEF8] hover:text-white"
                        >
                          View Reports
                          <span className="ml-1">
                            <FaChevronDown />
                          </span>
                        </Button>

                        {showViewDropDown &&
                          createPortal(
                            <div
                              ref={dropdownRef}
                              className="absolute right-0 z-50  rounded-md bg-white border-l-4 border-[#5558E4] py-1 w-80 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto max-h-60"
                              style={{
                                position: 'fixed',
                                top: dropdownPosition.top,
                                left: dropdownPosition.left,
                                transform: 'translateX(-100%)',
                              }}
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="view-menu"
                            >
                              {reportData?.files?.length > 0 ? (
                                reportData?.files?.map((file, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleViewReport(file)}
                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                    role="menuitem"
                                  >
                                    {viewReportLoading === file ? (
                                      <BeatLoader size={10} />
                                    ) : (
                                      <RxOpenInNewWindow className="mr-2 flex-shrink-0" />
                                    )}
                                    <span className="truncate">{extractReportType(file)}</span>
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-2 text-sm text-gray-500">No reports available</div>
                              )}
                            </div>,
                            document.body,
                          )}
                      </div>
                    </div>
                  </div>
                ) : activeTab === 'gene' ? (
                  <div className="space-x-2 flex items-center">
                    <Button
                      onClick={handleGeneUploadModal}
                      variant="custom"
                      className="px-2 py-1 rounded bg-[#5558E4] text-white text-xs border border-[#5558E4] hover:text-black"
                    >
                      Upload
                    </Button>
                    <Button
                      onClick={() =>
                        generateGeneReport(patientId, latestGeneReport, patient.firstName, patient.lastName)
                      }
                      disabled={!latestGeneReport}
                      variant="custom"
                      className="px-2 py-1 rounded bg-[#FFB224] text-xs border border-[#FFB224] hover:text-white"
                    >
                      {geneReportLoading ? (
                        <span className="flex items-center">
                          <Spinner /> Generating
                        </span>
                      ) : (
                        'Generate'
                      )}
                    </Button>
                    <Button
                      onClick={() => getGeneLabReport(patientId, patient.firstName, patient.lastName)}
                      variant="custom"
                      loading={viewReportLoading}
                      className="px-2 py-1 flex items-center gap-1 rounded bg-[#73CEF8] text-xs border border-[#73CEF8] hover:text-white"
                    >
                      View
                      <RxOpenInNewWindow />
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'blood' ? (
                latestBloodWorkReport ? (
                  <LabResults
                    bloodWorkBioMarkerGroup={latestBloodWorkReport.bloodWorkBioMarkerGroup}
                    reports={patient.bloodWorkReports}
                    geneResults={latestGeneReport?.geneResultsGrouped || {}}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-xs font-medium text-gray-400 flex flex-col items-center justify-center gap-3">
                      <MdBloodtype size={40} />
                      No Blood Results Uploaded For This Patient Yet!
                    </div>
                  </div>
                )
              ) : activeTab === 'gene' ? (
                latestGeneReport ? (
                  <GeneResults gene_results={latestGeneReport.geneResultsGrouped} />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-xs font-medium text-gray-400 flex flex-col items-center justify-center gap-3">
                      <PiDna size={40} />
                      No Gene Results Uploaded For This Patient Yet!
                    </div>
                  </div>
                )
              ) : (
                <FullscriptIntegration patientData={patient} />
              )}
            </div>
            <MedicalIntakeInfoModal
              isOpen={medicalIntakeModal}
              onClose={() => setMedicalIntakeModal(false)}
              gender={patient.gender}
              data={patient.functionalMedicineIntakeForm}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePatient;
