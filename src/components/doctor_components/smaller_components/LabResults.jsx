/* eslint-disable react/prop-types */
import React, { useState } from 'react';

import { IoAnalyticsOutline } from 'react-icons/io5';

import BiomarkerGraphDrawer from '../../BiomarkerGraphDrawer';

const LabResults = ({ bloodWorkBioMarkerGroup, reports, geneResults = {}, isModal = false }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedBiomarker, setSelectedBiomarker] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('');

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setSelectedBiomarker(null);
    setSelectedGroup('');
  };
  return (
    <>
      <div className="w-full">
        <table className="w-full">
          <thead className="h-6 w-full text-xs font-semibold sticky top-0 bg-[#5558E4] text-white">
            <tr className="">
              <td className="py-1 pl-4 flex items-center gap-1">Bio Markers </td>
              <td>Measure</td>
              <td>Level</td>
              <td></td>
            </tr>
          </thead>

          <tbody className="">
            {Object.entries(bloodWorkBioMarkerGroup).map(([group, biomarkers]) => (
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
                    {!isModal && (
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
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {drawerVisible && (
        <BiomarkerGraphDrawer
          visible={drawerVisible}
          onClose={handleDrawerClose}
          biomarker={selectedBiomarker}
          reports={reports}
          group={selectedGroup}
          geneResults={geneResults}
        />
      )}
    </>
  );
};

export default LabResults;
