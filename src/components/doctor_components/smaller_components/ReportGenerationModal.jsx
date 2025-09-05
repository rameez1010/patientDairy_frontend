import { useEffect, useRef, useState } from 'react';

import { createPortal } from 'react-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AiFillCheckCircle, AiFillPlusCircle } from 'react-icons/ai';
import { FaChevronDown } from 'react-icons/fa';
import { MdBloodtype } from 'react-icons/md';
import { RxOpenInNewWindow } from 'react-icons/rx';
import { SiGooglegemini } from 'react-icons/si';
import { BeatLoader } from 'react-spinners';

import doctorApiService from '../../../services/doctorApiService';
import Spinner from '../../Spinner';
import Button from '../../common/Button';
import LabResults from './LabResults';
import RecommendationModel from './RecommendationModel';
import { extractReportType } from '../../../utils/helperFunctions';

// IMPORTANT THIS NEEDS TO MATCH WITH BACKEND BIOMARKER_GROUP
const BIO_MARKER_GROUPS = {
  lipids: false,
  glucose: false,
  renal: false,
  mineral: false,
  inflammation_Markers: false,
  vitamin: false,
  electrolytes: false,
  liver_Enzymes: false,
  thyroid_Functions: false,
  hormone: false,
  cbc: false,
};

const BIO_MARKER_GROUPS_WITH_BIO_MARKERS = {
  lipids: [
    'cholesterol',
    'ldlCholesterol',
    'hdlCholesterol',
    'nonHdlCholesterol',
    'triglyceride',
    'cholesterolToHdlRatio',
  ],
  glucose: ['hbA1c', 'insulin', 'glucose'],
  renal: ['creatinine', 'eGFR'],
  mineral: ['calcium', 'ferritin', 'magnesium', 'zinc', 'seleniumPlasma'],
  inflammation_Markers: ['sedimentationRate', 'cReactiveProtein', 'fibrinogen', 'uricAcid'],
  vitamin: ['vitaminA', 'vitaminB12', 'vitaminD'],
  electrolytes: ['sodium', 'potassium', 'phosphorus'],
  liver_Enzymes: [
    'alanineTransaminase',
    'alkalinePhosphate',
    'aspartateTransaminase',
    'albumin',
    'gammaGlutamylTransferase',
    'totalBilirubin',
  ],
  thyroid_Functions: [
    'thyroidStimulatingHormone',
    'thyroidPeroxidaseAntibody',
    'thyroglobulinAntibodies',
    'reverseT3',
    'freeT3',
    'freeT4',
  ],
  hormone: [
    'follitropin',
    'lutropin',
    'progesterone',
    'testosterone',
    'testosteroneFree',
    'dhea',
    'prolactin',
    'sexHormoneBindGlobulin',
    'cortisolAm',
  ],
  cbc: [
    'hemoglobin',
    'hematocrit',
    'rbc',
    'wbc',
    'neutrophils',
    'lymphocytes',
    'lonocytes',
    'eosinophils',
    'basophils',
    'mcv',
    'mch',
    'mchc',
    'rdw',
    'plateletCount',
  ],
};

const ReportGenerationModal = ({
  onClose,
  onGenerate,
  results,
  reports,
  reportLoading,
  setReportLoading,
  patient,
  viewReportLoading,
  getLabReport,
  patientId,
  bloodWorkBioMarkers,
}) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [selectedRecommendations, setSelectedRecommendations] = useState([]);
  const [showViewDropDown, setShowViewDropDown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [reportDataLoading, setReportDataLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const viewButtonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Get latest blood work report files
  const latestBloodWorkReport = reports?.slice()?.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))[0];

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

      console.log(result.data[latestBloodWorkReport.reportDate]);
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
          top: rect.top + window.scrollY - 5, // Position above the button
          left: rect.right + window.scrollX - 125, // Align with right edge of button
          transform: 'translateY(-100%)', // Move up by 100% of dropdown height
        });
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showViewDropDown]);
  const [selectedPanels, setSelectedPanels] = useState({
    full: false,
    ...BIO_MARKER_GROUPS,
  });
  const [recommendations, setRecommendations] = useState({});
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [recResponse, setRecResponse] = useState('');
  const [isLoadingAIRec, setIsLoadingAIRec] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoadingRecommendations(true);
      try {
        const response = await doctorApiService.get(`/recommendation/bloodwork`);

        const result = response.data;

        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch recommendations');
        }

        // do data cleanup to group by biomarker_group
        let cleaned_recommendations = {};
        result.data.forEach((item) => {
          cleaned_recommendations[`${item.biomarker_group}`] = item;
        });

        setRecommendations(cleaned_recommendations);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, [apiUrl]);

  const notifyError = (toastMessage) => {
    toast.error(toastMessage);
  };

  const handleCheckboxChange = (panel) => {
    if (panel === 'full') {
      // If "Full Report" is selected, uncheck all other panels
      setSelectedPanels({
        ...Object.fromEntries(Object.keys(selectedPanels).map((key) => [key, false])),
        full: !selectedPanels.full,
      });
    } else {
      // If any other panel is selected, uncheck "Full Report"
      setSelectedPanels((prev) => ({
        ...prev,
        [panel]: !prev[panel],
        full: false,
      }));
    }
  };
  const handleGenerate = async () => {
    const selectedPanelsList = Object.keys(selectedPanels).filter((panel) => selectedPanels[panel]);
    console.log(selectedPanelsList);

    if (selectedPanelsList.length === 0) {
      notifyError(<div className="text-sm font-light">Please select at least one panel.</div>);
      return;
    }

    setReportLoading(true);

    let filteredResults = {};

    if (selectedPanels.full) {
      // If "Full Report" is selected, include all keys from all panels
      Object.values(BIO_MARKER_GROUPS_WITH_BIO_MARKERS).forEach((keys) => {
        keys.forEach((key) => {
          if (results && results[key] !== undefined) {
            filteredResults[key] = results[key];
          }
        });
      });
    } else {
      // Otherwise, include only the selected panels
      selectedPanelsList.forEach((panel) => {
        BIO_MARKER_GROUPS_WITH_BIO_MARKERS[panel].forEach((key) => {
          if (results && results[key] !== undefined) {
            filteredResults[key] = results[key];
          }
        });
      });
    }

    // Include selected recommendations in the report data
    const reportData = {
      ...filteredResults,
      recommendations: selectedRecommendations,
    };

    await onGenerate(reportData, selectedPanelsList);
    setReportLoading(false);
  };

  // Toggle item selection
  const toggleRecommendation = (panel, category, item) => {
    const key = `${panel}-${category}-${item.action}`;
    setSelectedRecommendations((prev) =>
      prev.some((r) => r.key === key)
        ? prev.filter((r) => r.key !== key)
        : [...prev, { key, panel, category, ...item }],
    );
  };

  const handleRec = async () => {
    setIsLoadingAIRec(true);
    try {
      const res = await doctorApiService.post(`/patients/${patientId}/recommendationAI`);

      const result = res.data;

      if (!result.success) {
        throw new Error(result.message || 'Failed to get AI recommendations');
      }

      setRecResponse(result.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoadingAIRec(false);
    }
  };
  // Render recommendations for a specific panel
  const renderPanelRecommendations = (panel) => {
    if (!recommendations[panel]) return null;
    return (
      <div className="bg-white w-full border border-purple-400 rounded-md p-2 mb-4">
        <h4 className="text-xs font-medium text-gray-500">
          {panel.charAt(0).toUpperCase() + panel.slice(1)} Recommendations
        </h4>
        <span className="text-xs font-light text-gray-400">
          Click + to add the recommendation to the report or hover to see details
        </span>

        {['diet', 'activity', 'lifestyle', 'supplements'].map(
          (category) =>
            recommendations[panel][category]?.length > 0 && (
              <div key={category} className="mt-4 flex text-sm gap-2 items-center flex-wrap">
                <h4 className="font-medium text-gray-500">{category.charAt(0).toUpperCase() + category.slice(1)}:</h4>
                {recommendations[panel][category].map((item) => {
                  const isSelected = selectedRecommendations.some(
                    (r) => r.key === `${panel}-${category}-${item.action}`,
                  );

                  return (
                    <span
                      key={`${panel}-${category}-${item.action}`}
                      className={`pl-[6px] pr-[3px] py-[2px] hover:underline cursor-pointer border-2 rounded-full text-xs flex items-center ${
                        isSelected ? 'border-[#5558E4] bg-blue-50' : 'border-gray-300 text-gray-500'
                      }`}
                      title={item.details.join('\n')}
                    >
                      {item.action}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRecommendation(panel, category, item);
                        }}
                        className="ml-1"
                      >
                        {isSelected ? (
                          <AiFillCheckCircle className="text-green-500" size={21} />
                        ) : (
                          <AiFillPlusCircle className="text-[#5558E4]" size={21} />
                        )}
                      </button>
                    </span>
                  );
                })}
              </div>
            ),
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white rounded-lg shadow-lg w-4/5 h-3/4 overflow-hidden flex flex-col justify-between">
        <div className=" p-4 flex items-center justify-between mr-3">
          <div>
            <h2 className="text-gray-600 text-sm font-semibold">Generate Blood Report</h2>
            <span className="text-xs font-light text-gray-400">
              Using the options below to generate a full or custom blood report
            </span>
          </div>

          <button
            onClick={handleRec}
            disabled={isLoadingAIRec}
            className="text-xs bg-gradient-to-r from-[#00b4d8] to-[#5558E4] px-3 py-2 rounded shadow-sm text-white hover:bg-gradiant-to-r hover:from-[#5558E4] hover:to-[#00b4d8]"
          >
            <span className="flex items-center justify-between gap-2 font-medium">
              {isLoadingAIRec ? (
                <span className="flex items-center gap-2">
                  <Spinner /> Recommendations AI (Beta)
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <SiGooglegemini size={15} /> Recommendations AI (Beta)
                </span>
              )}
            </span>
          </button>
        </div>
        <div className="flex p-6 gap-4 w-full flex-1 overflow-y-auto">
          {/* panels */}
          <div className="flex w-1/6 overflow-y-auto gap-12">
            <div className="space-y-3 text-xs font-medium text-gray-700">
              <span className="text-sm font-medium text-gray-500">Panels</span>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedPanels.full}
                  onChange={() => handleCheckboxChange('full')}
                  className="form-checkbox h-3 w-3 text-[#5558E4]"
                />
                <span className="ml-2 text-[#5558E4]">Full Report</span>
              </label>
              {Object.keys(selectedPanels)
                .filter(
                  (panel) => panel !== 'full' && bloodWorkBioMarkers[panel] && bloodWorkBioMarkers[panel].length > 0,
                )
                .map((panel) => (
                  <label key={panel} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedPanels[panel]}
                      onChange={() => handleCheckboxChange(panel)}
                      className="form-checkbox h-3 w-3 text-[#5558E4]"
                    />
                    <span className="ml-2">{panel.charAt(0).toUpperCase() + panel.slice(1)}</span>
                  </label>
                ))}
            </div>
          </div>

          {/* recommendations */}

          {isLoadingRecommendations ? (
            <div className="w-3/5 overflow-y-scroll">
              <div className="flex items-center justify-center h-full">
                <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="w-3/5 overflow-y-scroll">
              {recResponse ? (
                // Show AI Recommendations Modal
                <RecommendationModel close={() => setRecResponse('')} recResponse={recResponse} />
              ) : Object.keys(selectedPanels).filter(
                  (panel) => panel !== 'full' && panel !== 'cbc' && selectedPanels[panel],
                ).length > 0 ? (
                // Show selected panels
                Object.keys(selectedPanels)
                  .filter((panel) => panel !== 'full' && panel !== 'cbc' && selectedPanels[panel])
                  .map((panel) => renderPanelRecommendations(panel))
              ) : (
                // Show default message when no panels are selected and AI recommendations is not active
                <div className="text-center py-4 gap-1 text-gray-400 text-sm font-light bg-white h-full rounded flex flex-col items-center justify-center border">
                  Please select one or multiple panels to add recommendations!
                  <span>Full Report and CBC does not include recommendations!</span>
                  <span>Click on Recommendations AI to generate AI based recommendations!</span>
                </div>
              )}
            </div>
          )}

          <div className="w-2/5 border rounded-md bg-white overflow-y-scroll">
            {results ? (
              <LabResults bloodWorkBioMarkerGroup={results?.bloodWorkBioMarkerGroup} reports={reports} isModal={true} />
            ) : (
              <div className="text-xs font-medium text-gray-400 gap-3 flex flex-col items-center justify-center h-2/3">
                <MdBloodtype size={40} />
                No Blood Results Uploaded For This Patient Yet!
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-100 p-2 flex justify-end space-x-3 font-medium">
          <button
            onClick={onClose}
            className="flex text-xs justify-end items-center bg-gray-400 gap-1 px-3 py-1 text-white rounded hover:text-gray-800"
          >
            Close
          </button>
          <button
            onClick={handleGenerate}
            className="px-2 py-1 rounded bg-[#FFB224] text-xs border border-[#FFB224] hover:text-white"
          >
            {reportLoading ? (
              <span className="flex items-center">
                <Spinner /> Generating
              </span>
            ) : (
              'Generate'
            )}
          </button>
          {/* Dropdown Button for View */}
          <div className="flex items-center" ref={viewButtonRef}>
            <div className="relative">
              <Button
                onClick={() => handleFetchReportData(patientId)}
                variant="custom"
                loading={reportDataLoading || viewReportLoading}
                loaderColor="black"
                className="px-2 py-1 h-[26px] flex items-center gap-1 rounded bg-[#73CEF8] text-xs border border-[#73CEF8] hover:text-white"
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
                    className="absolute right-0 z-50 border-l-4 border-[#5558E4]  rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto max-h-60"
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
      </div>
    </div>
  );
};

export default ReportGenerationModal;
