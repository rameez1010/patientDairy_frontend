import React, { useEffect, useState } from 'react';

import { jwtDecode } from 'jwt-decode';
import { FaArrowRight, FaCartPlus, FaUser } from 'react-icons/fa';
import { IoAnalyticsOutline } from 'react-icons/io5';
import { MdBloodtype, MdDashboard } from 'react-icons/md';
import { TbDna2 } from 'react-icons/tb';

import patientApiService from '../../services/patientApiService';
import BiomarkerGraphDrawer from '../BiomarkerGraphDrawer';
import LoaderOverlay from '../common/LoaderOverlay';
import GeneResults from '../doctor_components/smaller_components/GeneResults';
import MedicalIntakeFormModal from './MedicalIntakeFormModal';
import PatientTestKit from './PatientTestKit';

const PatientDashboard = () => {
  const [currentPatinet, setCurrentPatient] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showMedicalForm, setShowMedicalForm] = useState(false);
  const [formCompletionChecked, setFormCompletionChecked] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedBiomarker, setSelectedBiomarker] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [loading, setLoading] = useState(true);
  const handleShowCart = () => {
    setShowCart(!showCart);
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setSelectedBiomarker(null);
    setSelectedGroup('');
  };

  const checkFormCompletion = async () => {
    // Check if we've already checked the form in this session
    const formCheckedThisSession = sessionStorage.getItem('medicalFormChecked');

    if (formCheckedThisSession) {
      setFormCompletionChecked(true);
      return;
    }

    try {
      const response = await patientApiService.get('/medical-form/completion-status');
      const isComplete = response.data.data.is_complete;

      if (!isComplete) {
        setShowMedicalForm(true);
      }

      // Mark that we've checked the form in this session
      sessionStorage.setItem('medicalFormChecked', 'true');
    } catch (error) {
      console.log('Error checking form completion:', error);
      // If there's an error, show the form anyway
      setShowMedicalForm(true);
      // sessionStorage.setItem('medicalFormChecked', 'true');
    } finally {
      setFormCompletionChecked(true);
    }
  };

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

  useEffect(() => {
    if (currentPatinet && !formCompletionChecked) {
      checkFormCompletion();
    }
  }, [currentPatinet, formCompletionChecked]);

  const latestBloodWorkReport = currentPatinet?.bloodWorkReports
    ?.slice()
    ?.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))[0];

  const latestGeneReport = currentPatinet?.geneResultReports
    ?.slice()
    ?.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))[0];

  return (
    <div className="flex flex-col h-screen bg-white w-full pt-10 px-8">
      <div className="flex justify-end md:justify-start w-full">
        <h1 className="text-xl font-bold text-gray-600 flex items-center gap-2 text-right md:text-left">
          <MdDashboard />
          Dashboard
        </h1>
      </div>

      <div className="mt-6 flex flex-col md:flex-row gap-4 w-full">
        <div className="border-[1px] w-full md:w-1/3 h-32 text-sm font-light rounded-md shadow-sm">
          <div className="flex gap-2 p-5">
            <span className="bg-[#5558E4] p-[6px] rounded mb-1">
              <MdBloodtype size={18} className="text-white" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-700">My Labs</span>
              <span className="text-xs font-medium text-gray-700">{currentPatinet?.bloodWorkReports?.length}</span>
            </div>
          </div>
          <div className="w-full border-t-[1px] pl-5 pt-3 text-xs font-medium text-[#5558E4]">
            <a href="/patient_labs" className="flex items-center gap-2 cursor-pointer">
              See Details <FaArrowRight />
            </a>
          </div>
        </div>

        <div className="border-[1px] w-full md:w-1/3 h-32 text-sm font-light rounded-md shadow-sm">
          <div className="flex gap-2 p-5">
            <span className="bg-[#FFB224] p-[6px] rounded mb-1">
              <FaUser size={18} className="text-white" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-700">My Practitioner</span>
              <span className="text-xs font-medium text-gray-700">{currentPatinet?.practitioner}</span>
            </div>
          </div>
          <div className="w-full border-t-[1px] pl-5 pt-3 text-xs font-medium text-[#5558E4]">
            <a href="#" className="flex items-center gap-2 cursor-pointer">
              See Details <FaArrowRight />
            </a>
          </div>
        </div>

        <div className="border-[1px] w-full md:w-1/3 h-32 text-sm font-light rounded-md shadow-sm">
          <div className="flex gap-2 p-5">
            <span className="bg-[#73CEF8] p-[6px] rounded mb-1">
              <FaCartPlus size={18} className="text-white" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-700">Genome Kit</span>
              <span className="text-xs font-medium text-gray-700">
                <button className="text-[#5558E4] flex items-center gap-1 font-medium" onClick={() => handleShowCart()}>
                  Order Now
                </button>
              </span>
            </div>
          </div>
          <div className="w-full border-t-[1px] pl-5 pt-3 text-xs font-medium text-[#5558E4]">
            <button onClick={() => handleShowCart()} className="flex items-center gap-2 cursor-pointer">
              See Details <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row flex-1 w-[98.5%] mt-6 gap-4 mb-2 max-h-[52rem] md:max-h-none md:overflow-hidden">
        <div className="w-full md:w-1/2 overflow-hidden flex flex-col rounded-md shadow border md:max-h-none max-h-[25rem]">
          <h2 className="p-3 font-light flex items-center gap-2 bg-white text-gray-600 sticky top-0 shadow">
            <MdBloodtype size={18} />
            My Latest Blood Results
          </h2>

          {loading ? (
            <div className="text-xs  p-5 text-gray-400 gap-2 flex flex-col items-center justify-center flex-1">
              <LoaderOverlay loading={loading} size={8} textSize="text-xs">
                Loading Blood Results...
              </LoaderOverlay>
            </div>
          ) : latestBloodWorkReport ? (
            <div className="flex-1 overflow-y-auto">
              <table className="w-full">
                <thead className="h-6 w-full text-xs font-semibold sticky top-0 bg-[#5558E4] text-white">
                  <tr className="">
                    <td className="py-1 pl-4 flex items-center gap-1">Bio Markers </td>
                    <td className="text-center md:text-left">Measure</td>
                    <td className="text-center md:text-left">Level</td>
                    <td className="text-center md:text-left"></td>
                  </tr>
                </thead>

                <tbody className="">
                  {latestBloodWorkReport &&
                    Object.entries(latestBloodWorkReport?.bloodWorkBioMarkerGroup).map(([group, biomarkers]) => (
                      <React.Fragment key={group}>
                        {biomarkers.length > 0 && (
                          <tr className="text-xs bg-gray-100 text-[#5558E4]">
                            <td className="py-1 pl-4 flex items-center gap-1">
                              {`${group.charAt(0).toUpperCase() + group.slice(1).replace('_', ' ')}`}
                            </td>
                            <td className=""></td>
                            <td className="font-light"></td>
                            <td className=""></td>
                          </tr>
                        )}

                        {biomarkers.map((biomarker, index) => (
                          <tr className="text-xs font-light hover:bg-gray-50" key={index}>
                            <td className="py-1 pl-4">{biomarker.title}</td>
                            <td className="">
                              {biomarker.value} {biomarker.unit}
                            </td>
                            <td
                              className={`${
                                biomarker.range_status === 'normal'
                                  ? 'text-[#73CEF8]'
                                  : biomarker.range_status === 'abnormal'
                                    ? 'text-[#FFB224]'
                                    : biomarker.range_status === 'optimal'
                                      ? 'text-[#BF7BD3]'
                                      : ''
                              }`}
                            >
                              {biomarker.range_status}
                            </td>
                            <td className="text-center">
                              <button
                                type="button"
                                aria-label={`Show trend graph for ${biomarker.title}`}
                                onClick={() => {
                                  setDrawerVisible(true);
                                  setSelectedBiomarker(biomarker);
                                  setSelectedGroup(group);
                                }}
                                className="focus:outline-none hover:bg-gray-100 rounded p-1"
                              >
                                <span className="flex items-center gap-1 bg-gray-100 rounded px-1 text-xs font-thin border">
                                  <IoAnalyticsOutline size={15} className="" />
                                  Details
                                </span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-xs font-medium text-gray-400 gap-3 flex flex-col items-center justify-center flex-1">
              <MdBloodtype size={40} />
              <span>No Blood Results Uploaded!</span>
              <span>Your clinician will upload your blood work after they recieve it.</span>
            </div>
          )}
        </div>
        <div className="w-full md:w-1/2 overflow-hidden flex flex-col rounded-md shadow border max-h-[25rem] md:max-h-none">
          <h2 className="p-3 font-light flex items-center gap-2 bg-white text-gray-600 sticky top-0 shadow">
            <TbDna2 size={18} />
            My Gene Results
          </h2>
          {loading ? (
            <div className="text-xs p-5 text-gray-400 gap-3 flex flex-col items-center justify-center flex-1">
              <LoaderOverlay loading={loading} size={8} textSize="text-xs">
                Loading Gene Report...
              </LoaderOverlay>
            </div>
          ) : latestGeneReport ? (
            <div className="flex-1 overflow-y-auto">
              <GeneResults gene_results={latestGeneReport.geneResultsGrouped} />
            </div>
          ) : (
            <div className="text-xs font-medium text-gray-400 gap-3 flex flex-col items-center justify-center flex-1">
              <TbDna2 size={40} />
              <span>No Gene Results Uploaded!</span>
              <span>Please order a genome kit to get your results.</span>
            </div>
          )}
        </div>
        <div className="hidden md:flex  w-1/4 flex-col gap-4">
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
      {showCart && <PatientTestKit handleClose={() => handleShowCart()} />}
      {showMedicalForm && (
        <MedicalIntakeFormModal
          isOpen={showMedicalForm}
          onClose={() => setShowMedicalForm(false)}
          patientData={currentPatinet}
        />
      )}
      {drawerVisible && (
        <BiomarkerGraphDrawer
          visible={drawerVisible}
          onClose={handleDrawerClose}
          biomarker={selectedBiomarker}
          group={selectedGroup}
          reports={currentPatinet?.bloodWorkReports}
          geneResults={latestGeneReport?.geneResultsGrouped}
        />
      )}
    </div>
  );
};

export default PatientDashboard;
