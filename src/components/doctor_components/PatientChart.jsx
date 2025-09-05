import { useState } from 'react';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import PropTypes from 'prop-types';

import { getHistoricalData } from '../../utils/helperFunctions';
import LineGraph from './smaller_components/LineGraph';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const PatientChart = ({ bloodWorkReports }) => {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedBiomarker, setSelectedBiomarker] = useState('');

  /*
   @description Get all available biomarker groups from the latest report
   @returns {Array} - Array of biomarker groups
  */
  const getBiomarkerGroups = () => {
    if (!bloodWorkReports?.[0]?.bloodWorkBioMarkerGroup) return [];
    return Object.keys(bloodWorkReports[0].bloodWorkBioMarkerGroup);
  };

  /* 
    @description Get all biomarkers for the selected group
    @param {string} groupName - The name of the biomarker group
    @returns {Array} - Array of biomarkers
  */
  const getBiomarkersForGroup = (groupName) => {
    if (!bloodWorkReports?.[0]?.bloodWorkBioMarkerGroup?.[groupName]) return [];
    return bloodWorkReports[0].bloodWorkBioMarkerGroup[groupName].map((marker) => marker.title);
  };

  /* 
    @description Format the name of the biomarker group
    @param {string} name - The name of the biomarker group
    @returns {string} - The formatted name of the biomarker group
  */
  const formatName = (name) => name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' ');

  const handleGroupChange = (e) => {
    const newGroup = e.target.value;
    setSelectedGroup(newGroup);
    setSelectedBiomarker(''); // Reset biomarker selection when group changes
  };

  const handleBiomarkerChange = (e) => {
    setSelectedBiomarker(e.target.value);
  };

  const { dates, values, units } = getHistoricalData(bloodWorkReports, selectedGroup, selectedBiomarker);

  return (
    <div className="overflow-hidden flex flex-col gap-4 relative border rounded-md">
      <div className="text-xs font-medium text-white py-2 md:py-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 px-2 rounded bg-[#5558E4]">
        <div className="w-full md:w-auto">
          Biomarker Trend
          <span className="text-xs font-light"> (Select a biomarker to view trend)</span>
        </div>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          {/* Group Selection */}
          <select
            className="text-xs font-medium bg-[#5558E4] border px-1 rounded shadow-sm text-white"
            onChange={handleGroupChange}
            value={selectedGroup}
          >
            <option value="">Select Group</option>
            {getBiomarkerGroups().map((group) => (
              <option key={group} value={group}>
                {formatName(group)}
              </option>
            ))}
          </select>

          {/* Biomarker Selection */}
          {selectedGroup && (
            <select
              className="text-xs font-medium bg-[#5558E4] border px-1 rounded shadow-sm text-white"
              onChange={handleBiomarkerChange}
              value={selectedBiomarker}
            >
              <option value="">Select Biomarker</option>
              {getBiomarkersForGroup(selectedGroup).map((marker) => (
                <option key={marker} value={marker}>
                  {marker}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="relative w-full h-[340px] sm:h-[400px] lg:h-[420px] rounded">
        {selectedGroup && selectedBiomarker ? (
          <LineGraph
            dates={dates}
            values={values}
            units={units}
            label={selectedBiomarker ? `${selectedBiomarker} (${units})` : undefined}
          />
        ) : (
          <div className="flex text-xs text-center md:text-sm items-center justify-center h-full text-gray-400">
            Select a biomarker group and biomarker to view the trend
          </div>
        )}
      </div>
    </div>
  );
};

PatientChart.propTypes = {
  bloodWorkReports: PropTypes.arrayOf(
    PropTypes.shape({
      reportDate: PropTypes.string.isRequired,
      bloodWorkBioMarkerGroup: PropTypes.objectOf(
        PropTypes.arrayOf(
          PropTypes.shape({
            range_status: PropTypes.oneOf(['optimal', 'normal', 'abnormal']).isRequired,
          }),
        ),
      ).isRequired,
    }),
  ),
};

export default PatientChart;
