import React from 'react';

import { IoCloseSharp } from 'react-icons/io5';
import { SiGooglegemini } from 'react-icons/si';

const RecommendationModel = ({ recResponse, close }) => {
  const cleanResponse =
    typeof recResponse === 'string'
      ? recResponse
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim()
      : JSON.stringify(recResponse);

  //parse to JSON
  const response = JSON.parse(cleanResponse);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white rounded shadow-lg overflow-hidden border border-gray-200">
      <div className="h-full rounded-xl p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 font-semibold text-lg text-gray-800">
            <div className="relative">
              <SiGooglegemini className="text-[#6e48ff] text-2xl" />
              <div className="absolute inset-0 bg-[#6e48ff] rounded-full opacity-10"></div>
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6e48ff] to-[#5c7cff]">
              AI Recommendations & Findings
            </span>
          </div>
          <button onClick={close} className="p-1 rounded-full hover:bg-gray-100 transition-all duration-200 group">
            <IoCloseSharp size={20} className="text-gray-500 group-hover:text-gray-700 transition-colors" />
          </button>
        </div>

        {/* Key Findings Section */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Key Biomarker Analysis</h3>
          <div className="space-y-4">
            {Object.entries(response.key_findings).map(([category, biomarkers]) => (
              <div key={category} className="bg-gray-50 rounded p-4 border border-gray-200 shadow-sm">
                <h4 className="text-sm text-gray-700 mb-2">{category}</h4>
                <ul className="space-y-2">
                  {biomarkers.map((item, index) => (
                    <li key={index} className="flex items-start text-xs">
                      <div className={`flex-1 ${item.status === 'abnormal' ? 'text-[#5558E4]' : 'text-green-600'}`}>
                        <span className="font-medium">{item.biomarker}:</span> {item.value}
                      </div>
                      <span
                        className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'abnormal'
                            ? ' text-[#FFB224] border border-red-200'
                            : 'bg-green-50 text-green-600 border border-green-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Recommendations */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
            Priority Recommendations
          </h3>
          <div className="bg-blue-50 rounded p-4 border border-blue-100 shadow-sm">
            <ul className="space-y-3">
              {response.priority_recommendations.map((rec, index) => (
                <li key={index} className="flex items-start text-sm text-gray-700">
                  <div className="flex-shrink-0 h-2 w-2 mt-2 bg-blue-400 rounded-full mr-3"></div>
                  <div className="flex-1">{rec}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Specific Recommendations */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
            Specific Recommendations
          </h3>
          <div className="space-y-4">
            {Object.entries(response.specific_recommendations).map(([category, recommendations]) => (
              <div key={category} className="bg-gray-50 rounded p-4 border border-gray-200 shadow-sm">
                <h4 className="font-medium text-gray-700 capitalize mb-3">{category}</h4>
                <ul className="space-y-3">
                  {recommendations.map((item, index) => (
                    <li key={index} className="text-sm">
                      <div className="font-medium text-blue-600 mb-1">{item.action}:</div>
                      <ul className="ml-4 space-y-2">
                        {item.details.map((detail, i) => (
                          <li key={i} className="flex items-start text-gray-600">
                            <div className="flex-shrink-0 h-1.5 w-1.5 mt-2 bg-blue-400 rounded-full mr-2"></div>
                            <div className="flex-1">{detail}</div>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Important Considerations */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
            Important Considerations
          </h3>
          <div className="bg-purple-50 rounded p-4 border border-purple-100 shadow-sm">
            <ul className="space-y-3">
              {response.important_considerations.map((item, index) => (
                <li key={index} className="flex items-start text-sm text-gray-700">
                  <div className="flex-shrink-0 h-2 w-2 mt-2 bg-purple-400 rounded-full mr-3"></div>
                  <div className="flex-1">{item}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationModel;
