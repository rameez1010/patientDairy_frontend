import { BiInfoCircle } from 'react-icons/bi';

import { biomarkers } from '../constants/biomarkers';
import { BIO_MARKER_GROUPS_WITH_GENES, genes } from '../constants/genes';
import { getHistoricalData } from '../utils/helperFunctions';
import CustomDrawer from './CustomDrawer';
import LineGraph from './doctor_components/smaller_components/LineGraph';

const BiomarkerGraphDrawer = ({ visible, onClose, biomarker, reports, group, geneResults = {} }) => {
  const { dates, values, units } = getHistoricalData(reports, group, biomarker.title);
  const header = (
    <div className="flex items-center gap-3">
      <div
        className={`w-4 h-4 rounded-full ${
          biomarker.range_status === 'normal'
            ? 'bg-[#73CEF8]'
            : biomarker.range_status === 'abnormal'
              ? 'bg-[#FFB224]'
              : biomarker.range_status === 'optimal'
                ? 'bg-[#BF7BD3]'
                : 'bg-gray-400'
        }`}
      />
      <h3 className="text-lg font-semibold">{biomarker.title}</h3>
      <span className="px-2 rounded-md text-gray-700 bg-gray-200 text-sm">
        {`${group.charAt(0).toUpperCase() + group.slice(1).replace('_', ' ')}`}
      </span>
    </div>
  );
  return (
    <CustomDrawer visible={visible} onClose={onClose} width={600} header={header}>
      <div className="h-full overflow-auto">
        <div className="p-4">
          <div className="relative w-full h-[340px] sm:h-[400px] lg:h-[420px] rounded">
            <LineGraph
              dates={dates}
              values={values}
              units={units}
              label={biomarker?.title ? `${biomarker.title} (${units})` : undefined}
            />
          </div>

          {/* Value display */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2 ">
              <div className="w-2 h-2 rounded-full bg-black"></div>
              <h4 className="text-sm font-semibold">Value:</h4>
              <span className="text-sm">
                {biomarker.value} {biomarker.unit}
              </span>
            </div>
            <div className="flex items-center gap-2 ">
              <div
                className={`w-2 h-2 ${
                  biomarker.range_status === 'normal'
                    ? 'bg-[#73CEF8]'
                    : biomarker.range_status === 'abnormal'
                      ? 'bg-[#FFB224]'
                      : biomarker.range_status === 'optimal'
                        ? 'bg-[#BF7BD3]'
                        : 'bg-gray-400'
                }`}
              ></div>
              <h4 className="text-sm font-semibold">Level:</h4>
              <span
                className={`${
                  biomarker.range_status === 'normal'
                    ? 'bg-[#73CEF8]'
                    : biomarker.range_status === 'abnormal'
                      ? 'bg-[#FFB224]'
                      : biomarker.range_status === 'optimal'
                        ? 'bg-[#BF7BD3]'
                        : 'text-gray-400'
                } px-2 rounded-full text-white text-xs`}
              >
                {biomarker.range_status}
              </span>
            </div>
          </div>

          <div className="px-4 pb-4">
            <h4 className="text-sm font-semibold mb-1">Description:</h4>
            <p className="text-gray-800 text-sm">{biomarkers[biomarker.name]?.desc || 'No description available.'}</p>
          </div>
          {geneResults && Object.keys(geneResults).length > 0 && (
            <div className="px-4 pb-4">
              <h4 className="text-sm font-semibold mb-1">Genes Associated with this Biomarker</h4>
              <div className="rounded  p-2 mt-2">
                <table className="w-full text-xs border border-gray-300 rounded">
                  <thead>
                    <tr className="bg-[#5558E4] text-white border-b border-gray-300">
                      <th className="py-2 px-3 text-left border-r border-gray-300">Gene</th>
                      <th className="py-2 px-3 text-left">Patient's Genotype</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const groupGenes = BIO_MARKER_GROUPS_WITH_GENES[group?.toLowerCase()] || [];
                      // Check if there is any gene result for this group
                      const rows = groupGenes.map((geneKey, idx) => {
                        let foundGene = null;
                        Object.values(geneResults || {}).forEach((geneArr) => {
                          geneArr.forEach((g) => {
                            if (g?.rs_id && `${g.name}_${g.rs_id}` === geneKey) foundGene = g;
                            else if (g?.name === geneKey) foundGene = g;
                          });
                        });
                        return (
                          <tr
                            key={geneKey}
                            className={
                              idx % 2 === 0
                                ? 'bg-white border-b border-gray-200'
                                : 'bg-gray-50 border-b border-gray-200'
                            }
                          >
                            <td className="py-2 px-3 font-medium text-gray-700 border-r border-gray-200">
                              {genes[geneKey]?.name || geneKey}
                            </td>
                            <td className="py-2 px-3 border-gray-200">{foundGene?.genotype || 'N/A'}</td>
                          </tr>
                        );
                      });
                      const allNoData =
                        rows.length === 0 || rows.every((row) => row.props.children[1].props.children === 'N/A');
                      if (allNoData) {
                        return (
                          <tr>
                            <td colSpan={2} className="py-3 px-3 text-center text-gray-400">
                              No data available for this biomarker group.
                            </td>
                          </tr>
                        );
                      }
                      return rows;
                    })()}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded px-3 py-2 text-sm text-blue-800 flex items-center gap-2">
                <BiInfoCircle size={18} />
                <span>
                  Visit <span className="font-semibold">Genetic Results</span> for more detailed gene or
                  genotype-related data.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </CustomDrawer>
  );
};

export default BiomarkerGraphDrawer;
