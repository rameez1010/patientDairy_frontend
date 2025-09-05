import React, { useEffect, useState } from 'react';

import { jwtDecode } from 'jwt-decode';
import { FaCircleArrowRight, FaCircleArrowUp } from 'react-icons/fa6';
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';
import { MdBloodtype, MdOutlineCalendarMonth } from 'react-icons/md';

import patientApiService from '../../services/patientApiService';
import LoaderOverlay from '../common/LoaderOverlay';

const PatientLabs = () => {
  const [currentPatinet, setCurrentPatient] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleShowResults = (rowIndex) => {
    setExpandedRows((prevExpandedRows) => {
      if (prevExpandedRows.includes(rowIndex)) {
        return prevExpandedRows.filter((index) => index !== rowIndex);
      } else {
        return [...prevExpandedRows, rowIndex];
      }
    });
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

  const bloodWorkReports = currentPatinet?.bloodWorkReports
    ?.slice()
    ?.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate));
  console.log('bloodWorkReports:', bloodWorkReports);

  return (
    <div className="h-screen bg-white w-full pt-10 px-8 static ">
      <div className="flex justify-end md:justify-start w-full">
        <h1 className="text-xl font-bold text-gray-600 flex items-center gap-2">
          <MdBloodtype />
          My Labs
        </h1>
      </div>
      <div className="bg-white border shadow w-full h-[90%] rounded-md mt-6 overflow-y-scroll">
        {/* labs */}
        <div className="flex items-center justify-between pr-4 shadow sticky top-0 bg-white">
          <h2 className="p-3 font-light flex items-center gap-2 text-gray-600">
            <MdBloodtype />
            Lab Results<span className="text-xs">( By Collection Date )</span>
          </h2>
        </div>
        {loading ? (
          <div className=" text-gray-400 font-light h-[90%] flex items-center justify-center">
            <LoaderOverlay loading={loading} size={14} textSize="text-xs">
              Loading Blood Results...
            </LoaderOverlay>
          </div>
        ) : bloodWorkReports ? (
          <div className="">
            {bloodWorkReports.map((report, index) => (
              <table className="w-full" key={index}>
                <tbody className="bg-white">
                  <tr
                    className={`text-sm font-light py-2 border-b flex flex-col md:flex-row items-center md:items-center ${
                      expandedRows.includes(index) && 'bg-purple-100'
                    } justify-between md:justify-between shadow-sm`}
                  >
                    <td className="p-4 flex items-center gap-2 text-xs md:text-sm ">
                      <MdOutlineCalendarMonth className="text-gray-500" size={18} /> {formatDate(report.reportDate)}
                    </td>
                    <td className="flex flex-col md:flex-row items-center gap-2 md:gap-2 w-full">
                      <span
                        className={`text-xs font-light text-[#FFB224] flex items-center ${
                          expandedRows.includes(index) && 'bg-white'
                        } gap-2 border px-2 rounded-full py-1`}
                      >
                        {extractStatusCount(report.bloodWorkBioMarkerGroup, 'abnormal')} Abnormal{' '}
                        <FaCircleArrowUp size={14} />
                      </span>
                      <span
                        className={`text-xs font-light text-[#BF7BD3] flex items-center ${
                          expandedRows.includes(index) && 'bg-white'
                        } gap-2 border px-2 rounded-full py-1`}
                      >
                        {extractStatusCount(report.bloodWorkBioMarkerGroup, 'optimal')} Optimal{' '}
                        <FaCircleArrowRight size={14} />
                      </span>
                      <span
                        className={`text-xs font-light text-[#73CEF8] flex items-center ${
                          expandedRows.includes(index) && 'bg-white'
                        } gap-2 border px-2 rounded-full py-1`}
                      >
                        {extractStatusCount(report.bloodWorkBioMarkerGroup, 'normal')} Normal{' '}
                        <FaCircleArrowUp size={14} className="rotate-45" />
                      </span>
                    </td>
                    <td
                      onClick={() => handleShowResults(index)}
                      className="p-4 mr-2 text-purple-500 cursor-pointer hover:text-purple-700"
                    >
                      {expandedRows.includes(index) ? (
                        <IoIosArrowDropup size={22} className="text-purple-500" />
                      ) : (
                        <IoIosArrowDropdown size={22} />
                      )}
                    </td>
                  </tr>
                  {expandedRows.includes(index) && (
                    <div className="bg-gray-50 border-b p-4 shadow-sm">
                      <table className="w-full">
                        <thead className="border-b-[1px] text-sm font-medium">
                          <tr className="">
                            <td>Bio Marker</td>
                            <td>Result</td>
                            <td>Level</td>
                          </tr>
                        </thead>
                        <tbody className="">
                          {Object.entries(report.bloodWorkBioMarkerGroup).map(([group, biomarkers]) => (
                            <React.Fragment key={group}>
                              <tr className="text-xs bg-gray-100 text-purple-600 border-b">
                                <td className="py-2 font-medium">{`${group.charAt(0).toUpperCase() + group.slice(1).replace('_', ' ')}`}</td>
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
                                </tr>
                              ))}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </tbody>
              </table>
            ))}
          </div>
        ) : (
          <div className=" text-gray-400 font-light h-full flex items-center justify-center">
            <span className="flex flex-col items-center">
              <MdBloodtype size={50} className="text-gray-300" />
              No Blood Results Uploaded!
              <span>Your clinician will upload your blood work after they recieve it.</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientLabs;
