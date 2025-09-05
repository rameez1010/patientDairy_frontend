import React, { useEffect, useState } from 'react';

import { jwtDecode } from 'jwt-decode';
import { FaChevronDown, FaCircleArrowRight, FaCircleArrowUp, FaRegBell } from 'react-icons/fa6';
import { FiSun } from 'react-icons/fi';
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';
import { MdBloodtype, MdOutlineCalendarMonth } from 'react-icons/md';

import doctorApiService from '../../services/doctorApiService';
import { getGreeting } from '../../utils/helperFunctions';
import Button from '../common/Button';
import LoaderOverlay from '../common/LoaderOverlay';
import Measure from './Measure';

const Labs = () => {
  const [singlePatient, setSinglePatient] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [patients, setPatients] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [measure, setMeasure] = useState(false);
  const [loading, setLoading] = useState(false);
  const [singlePatientLoading, setSinglePatientLoading] = useState(false);

  const handleShowDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  const handleShowMeasure = () => {
    setMeasure(!measure);
  };

  const clearPatientData = () => {
    setSinglePatient([]);
    setShowDropDown(false);
    setExpandedRows([]);
  };

  const handleShowResults = (rowIndex) => {
    setExpandedRows((prevExpandedRows) => {
      if (prevExpandedRows.includes(rowIndex)) {
        return prevExpandedRows.filter((index) => index !== rowIndex);
      } else {
        return [...prevExpandedRows, rowIndex];
      }
    });
  };

  const token = localStorage?.getItem('jwtToken');
  const decodedToken = jwtDecode(token);

  useEffect(() => {
    const getPatients = async () => {
      try {
        setLoading(true);
        const res = await doctorApiService.get(`/patients/`);
        const result = await res.data;

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
      const res = await doctorApiService.get(`/patients/${patientId}`);
      const result = res.data;

      if (!result.success) {
        throw new Error(result.message || 'Failed to get patient data');
      }

      setSinglePatient(result.data);
      setShowDropDown(false);
      setExpandedRows([]);
      console.log('Single Patient data is :', result.data);
    } catch (error) {
      console.log('There was an error getting the patient:', error);
    } finally {
      setSinglePatientLoading(false);
    }
  };

  function formatDate(input_date) {
    const date = new Date(input_date);

    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    return date.toLocaleString('en-US', options);
  }

  const extractStatusCount = (bloodWorkBioMarkerGroup, status) => {
    let count = 0;
    Object.values(bloodWorkBioMarkerGroup).forEach((biomarkers) => {
      biomarkers.forEach((biomarker) => {
        if (biomarker.range_status === status) {
          count++;
        }
      });
    });
    return count;
  };

  const bloodWorkReports = singlePatient?.bloodWorkReports
    ?.slice()
    ?.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate));
  console.log('bloodWorkReports:', bloodWorkReports);

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
            <MdBloodtype />
            Labs
          </h1>
          <span className="text-sm font-light text-gray-500">History of all your patients lab results</span>
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
          Lab History
          <span className="text-sm font-light text-gray-400">
            Select a patient from the dropdown to view lab history
          </span>
        </h2>
        {measure && <Measure onClose={handleShowMeasure} />}

        {singlePatientLoading ? (
          <div className="font-light text-sm h-3/4 flex items-center justify-center">
            <LoaderOverlay loading={singlePatientLoading} size={14}>
              Loading Lab Reports...
            </LoaderOverlay>
          </div>
        ) : bloodWorkReports ? (
          <div className="">
            {bloodWorkReports.map((report, index) => (
              <div className="w-full" key={index}>
                <div className="bg-[#5558E4] border-collapse border-b-[1px] rounded px-1">
                  <tr
                    className={`text-sm font-light flex items-center ${
                      expandedRows.includes(index) && 'bg-[#5558E4]'
                    } justify-between text-white font-medium text-sm rounded-md`}
                  >
                    <td className="flex items-center gap-2">
                      <MdOutlineCalendarMonth className="text-white" size={18} /> {formatDate(report.reportDate)}
                    </td>
                    <td className="flex items-center gap-2">
                      <span
                        className={`text-xs font-light text-white flex items-center ${
                          expandedRows.includes(index) && 'bg-[#5558E4] text-[#5558E4]'
                        } gap-2 border px-2 rounded-full py-[2px]`}
                      >
                        {extractStatusCount(report.bloodWorkBioMarkerGroup, 'abnormal')} Abnormal{' '}
                        <FaCircleArrowUp size={14} />
                      </span>
                      <span
                        className={`text-xs font-light text-white flex items-center ${
                          expandedRows.includes(index) && 'bg-[#5558E4] text-[#5558E4]'
                        } gap-2 border px-2 rounded-full py-[2px]`}
                      >
                        {extractStatusCount(report.bloodWorkBioMarkerGroup, 'optimal')} Optimal{' '}
                        <FaCircleArrowRight size={14} />
                      </span>
                      <span
                        className={`text-xs font-light text-white flex items-center ${
                          expandedRows.includes(index) && 'bg-[#5558E4] text-[#5558E4]'
                        } gap-2 border px-2 rounded-full py-[2px]`}
                      >
                        {extractStatusCount(report.bloodWorkBioMarkerGroup, 'normal')} Normal
                        <FaCircleArrowUp size={14} className="rotate-45" />
                      </span>
                    </td>
                    <td
                      onClick={() => handleShowResults(index)}
                      className="p-[6px] mr-2 text-white cursor-pointer hover:purple-600"
                    >
                      {expandedRows.includes(index) ? (
                        <IoIosArrowDropup size={22} className="text-white" />
                      ) : (
                        <IoIosArrowDropdown size={22} />
                      )}
                    </td>
                  </tr>
                  {expandedRows.includes(index) && (
                    <div className="bg-gray-50 border-b p-4 shadow-sm">
                      <table className="w-full table-fixed">
                        <thead className="border-b-[1px] text-sm font-medium">
                          <tr className="">
                            <td>Bio Marker</td>
                            <td>Result</td>
                            <td>Level</td>
                            <td>Measure</td>
                          </tr>
                        </thead>
                        <tbody className="">
                          {Object.entries(report.bloodWorkBioMarkerGroup).map(([group, biomarkers]) => (
                            <React.Fragment key={group}>
                              <tr className="text-xs bg-gray-100 text-[#5558E4] border-b">
                                <td className="py-2 font-medium">
                                  {`${group.charAt(0).toUpperCase() + group.slice(1).replace('_', ' ')}`}
                                </td>
                                <td className=""></td>
                                <td className=""></td>
                                <td className=""></td>
                              </tr>

                              {biomarkers.map((biomarker, biomarkerIndex) => (
                                <tr className="text-xs font-light" key={biomarkerIndex}>
                                  <td className="py-2">{biomarker.title}</td>
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
                                  <td>
                                    <button
                                      onClick={() => handleShowMeasure()}
                                      className="text-xs text-[#5558E4] hover:text-[#5558E4]/80"
                                    >
                                      Measure
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className=" text-gray-400 font-light text-sm h-3/4 flex items-center justify-center">
            <span className="flex flex-col items-center gap-3">
              <MdBloodtype size={50} className="text-gray-300" />
              Select a patient to view Lab history!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Labs;
