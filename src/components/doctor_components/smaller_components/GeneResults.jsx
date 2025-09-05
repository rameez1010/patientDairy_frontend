/* eslint-disable react/prop-types */
import React, { useState } from 'react';

import { IoAnalyticsOutline } from 'react-icons/io5';

import { genes } from '../../../constants/genes';
import GeneGraphDrawer from '../../GeneGraphDrawer';

const GeneResults = ({ gene_results }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedGene, setSelectedGene] = useState(null);
  const specialGeneNames = ['APOE', '9P21', 'MTHFR', 'TCF7L2'];
  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setSelectedGene(null);
  };
  return (
    <div className="w-full">
      <table className="w-full">
        <thead className="h-8 w-full text-xs font-semibold sticky top-0 bg-[#5558E4] text-white">
          <tr>
            <th className="p-2 pl-4 text-center md:text-left">Gene</th>
            <th className="p-2 text-center md:text-left">rsID</th>
            <th className="p-2  text-center md:text-left">Genotype</th>
            <th className="p-2 text-center md:text-left">Category</th>
            <th className="p-2 text-center md:text-left">Risk</th>
            <th className=""></th>
          </tr>
        </thead>
        <tbody className="">
          {Object.entries(gene_results).map(([panel, gene]) => (
            <React.Fragment key={panel}>
              <tr className="text-xs bg-gray-100 text-[#5558E4]">
                <td className="py-1 pl-4 flex items-center gap-1">
                  {`${panel.charAt(0).toUpperCase() + panel.slice(1).replace(/_/g, ' ')}`}
                </td>
                <td></td>
                <td className=""></td>
                <td className="font-light"></td>
                <td className=""></td>
                <td className=""></td>
              </tr>

              {gene.map((geneItem, index) => {
                const geneKey =
                  specialGeneNames.includes(geneItem?.name) && geneItem?.rs_id
                    ? `${geneItem.name}_${geneItem.rs_id}`
                    : geneItem?.name;
                return (
                  <tr className="text-xs font-light hover:bg-gray-50" key={`${panel}-${geneItem.name}-${index}`}>
                    <td className="py-1 pl-4">{geneItem.name}</td>
                    <td className="">{geneItem.rs_id || genes[geneKey]?.rs_id || 'N/A'}</td>

                    <td className="">{geneItem.genotype}</td>
                    <td className="">{genes[geneKey]?.category}</td>
                    <td
                      className={`${
                        geneItem.risk_level === 'normal'
                          ? 'text-[#5558E4]'
                          : geneItem.risk_level === 'increased'
                            ? 'text-[#FFB224]'
                            : geneItem.risk_level === 'decreased'
                              ? 'text-blue-500'
                              : ''
                      }`}
                    >
                      {geneItem.risk_level === 'normal'
                        ? 'Normal'
                        : geneItem.risk_level === 'increased'
                          ? 'Increased'
                          : geneItem.risk_level === 'decreased'
                            ? 'Decreased'
                            : geneItem.risk_level}
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        aria-label={`Show trend graph for ${geneItem.name}`}
                        onClick={() => {
                          setDrawerVisible(true);
                          setSelectedGene(geneItem);
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
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {drawerVisible && <GeneGraphDrawer visible={drawerVisible} onClose={handleDrawerClose} gene={selectedGene} />}
    </div>
  );
};

export default GeneResults;
