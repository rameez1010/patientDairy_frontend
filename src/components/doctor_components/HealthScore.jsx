import PropTypes from 'prop-types';
import { IoIosTrendingDown, IoIosTrendingUp } from 'react-icons/io';
import { MdOutlineTrendingFlat } from 'react-icons/md';

import GaugeChart from './GaugeChart';
import HealthDonut from './HealthDonut';

const HealthScore = ({ bloodWorkReports }) => {
  // Scoring system constants
  const SCORES = {
    optimal: 100,
    normal: 75,
    abnormal: 50,
  };

  // @todo make following functions in a helper file
  const getGroupName = (name) => {
    const baseName = name.split('_')[0]; // Takes everything before the first '_'
    return baseName.charAt(0).toUpperCase() + baseName.slice(1);
  };
  const getLatestReport = (reports) =>
    reports?.slice()?.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))?.[0] ?? null;

  console.log('bloodWorkReports latest are :', getLatestReport(bloodWorkReports));

  const getSecondLatestReport = (reports) =>
    reports?.slice()?.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))?.[1] ?? null;

  console.log('bloodWorkReports second latest are :', getSecondLatestReport(bloodWorkReports));

  const calculateGroupStatistics = (biomarkers) => {
    // Use reduce instead of multiple loops and if statements
    const stats = biomarkers.reduce(
      (acc, { range_status }) => ({
        ...acc,
        [range_status]: acc[range_status] + 1,
        totalScore: acc.totalScore + SCORES[range_status],
        totalTests: acc.totalTests + 1,
      }),
      {
        optimal: 0,
        normal: 0,
        abnormal: 0,
        totalScore: 0,
        totalTests: 0,
      },
    );

    return {
      optimal: stats.optimal,
      normal: stats.normal,
      abnormal: stats.abnormal,
      averageScore: Math.round(stats.totalScore / stats.totalTests),
    };
  };

  const processGroupsStatistics = (report) => {
    if (!report?.bloodWorkBioMarkerGroup) return [];

    return (
      Object.entries(report.bloodWorkBioMarkerGroup)
        // eslint-disable-next-line no-unused-vars
        .filter(([_, biomarkers]) => biomarkers?.length > 0)
        .map(([groupName, biomarkers]) => ({
          groupName: getGroupName(groupName),
          ...calculateGroupStatistics(biomarkers),
        }))
    );
  };

  // New function to calculate totalAverageScore for a single report
  const calculateReportTotalAverage = (report) => {
    const groupsStatistics = processGroupsStatistics(report);
    return groupsStatistics.length > 0
      ? groupsStatistics.reduce((sum, { averageScore }) => sum + averageScore, 0) / groupsStatistics.length
      : 0;
  };

  const latestReport = getLatestReport(bloodWorkReports);
  const secondLatestReport = getSecondLatestReport(bloodWorkReports);
  const groupsStatistics = processGroupsStatistics(latestReport);

  // Calculate latest report average score
  const latestAverageScore = calculateReportTotalAverage(latestReport);
  console.log('latestAverageScore is :', latestAverageScore);

  // Calculate second latest report average score
  const secondLatestAverageScore = calculateReportTotalAverage(secondLatestReport);
  console.log('secondLatestAverageScore is :', secondLatestAverageScore);

  // Calculate overall average across all reports
  const overallAverageScore =
    bloodWorkReports && bloodWorkReports.length > 0
      ? bloodWorkReports.reduce((sum, report) => sum + calculateReportTotalAverage(report), 0) / bloodWorkReports.length
      : 0;

  return (
    <div className="min-h-[260px] flex flex-col md:flex-row gap-4  px-3">
      {/* <div className=" w-1/4 flex flex-col justify-between gap-2 ml-3 text-xs"> */}
      <div className="text-white border rounded w-full md:w-1/4">
        <div className="bg-[#5558E4] py-1 pl-2 rounded text-xs">Average Health Score</div>
        <div className="flex justify-center gap-1 py-2 items-center h-full text-black flex-col">
          {latestAverageScore > secondLatestAverageScore ? (
            <span className="bg-[#5558E4] p-1 rounded-full">
              <IoIosTrendingUp size={20} className="text-white" />
            </span>
          ) : latestAverageScore < secondLatestAverageScore ? (
            <span className="bg-[#FFB224] p-1 rounded-full">
              <IoIosTrendingDown size={20} className="text-white" />
            </span>
          ) : (
            <span className="bg-[#73CEF8] p-1 rounded-full">
              <MdOutlineTrendingFlat size={20} className="text-white" />
            </span>
          )}
          <span className="text-4xl font-semibold">{Math.round(latestAverageScore)}%</span>
          <span className="text-xs font-light text-gray-600">Based on patient's latest Blood work</span>
        </div>
      </div>
      {/* <div className="h-1/2 text-white border rounded pb-2">
          <div className="bg-[#5558E4] p-1 rounded">Overall Health Score</div>
          <div className="flex justify-center items-center h-full text-black flex-col pt-1">
            <GaugeChart value={Math.round(overallAverageScore)} maxValue={100}/>
            <span className="text-xs font-light text-gray-600 mb-6">Based on patient's entire Blood work history</span>
          </div>
        </div> */}
      {/* </div> */}
      <div className="h-full border w-full md:mx-2">
        <div className="text-xs font-medium text-white py-1 rounded bg-[#5558E4] pl-2">
          Health Index <span className="text-xs font-light">(Based on patient's latest Blood Work)</span>
        </div>
        <div className="flex flex-wrap justify-center md:justify-start gap-4 p-4">
          {groupsStatistics.map(({ groupName, optimal, normal, abnormal, averageScore }) => (
            <div
              key={groupName}
              className="h-[95px] w-[95px] md:h-[115px] md:w-[115px] flex flex-col justify-center items-center"
            >
              <HealthDonut
                optimalVal={optimal}
                normalVal={normal}
                abnormalVal={abnormal}
                text={`${groupName} (${averageScore}%)`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="text-white border rounded w-full md:w-1/4">
        <div className="bg-[#5558E4] py-1 pl-2 rounded text-xs">Overall Health Score</div>
        <div className="flex justify-center items-center pt-5 md:pt-0 h-full text-black flex-col">
          <GaugeChart value={Math.round(overallAverageScore)} maxValue={100} />
          <span className="text-xs font-light text-gray-600 mb-6 text-center">
            Based on patient's entire Blood work history
          </span>
        </div>
      </div>
    </div>
  );
};

// @todo make this more shared
HealthScore.propTypes = {
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

export default HealthScore;
