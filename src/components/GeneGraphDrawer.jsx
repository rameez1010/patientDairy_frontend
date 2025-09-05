import GaugeChart from 'react-gauge-chart';

import { genes } from '../constants/genes';
import { getGenotypeColor } from '../utils/helperFunctions';
import CustomDrawer from './CustomDrawer';

// Gauge meter utility for risk_level
const riskColors = {
  increased: 'bg-[#FFB224]',
  decreased: 'bg-[#BF7BD3]',
  normal: 'bg-blue-500',
};

const riskLabels = {
  increased: 'Increased',
  decreased: 'Decreased',
  normal: 'Normal',
};

function getRiskColor(level) {
  return riskColors[level] || riskColors.unknown;
}

function getRiskLabel(level) {
  return riskLabels[level] || riskLabels.unknown;
}

const Hexagon = ({ genotype }) => {
  return (
    <div
      className={`flex-shrink-0 flex ${getGenotypeColor(genotype)} justify-center items-center uppercase font-bold text-base text-white`}
      style={{
        width: '42px',
        height: '42px',
        clipPath: 'polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)',
        boxShadow: '0 2px 8px 0 rgba(80, 0, 80, 0.08)',
      }}
    >
      {genotype}
    </div>
  );
};

const Gauge = ({ risk_level }) => {
  const percentMap = {
    increased: 0.85,
    decreased: 0.15,
    normal: 0.5,
  };
  const percent = percentMap[risk_level] ?? 0.5;
  const colors = ['#BF7BD3', '#5558E4', '#FFB224'];
  return (
    <div className="w-full flex flex-col items-center py-6">
      <div className="relative flex flex-col items-center">
        <GaugeChart
          id="gene-gauge-chart"
          nrOfLevels={420}
          arcsLength={[0.33, 0.34, 0.33]}
          colors={colors}
          animDelay={200}
          percent={percent}
          arcPadding={0.02}
          needleColor="#312e81"
          needleBaseColor="#312e81"
          textColor="transparent"
          animate={true}
          style={{ width: 340, height: 140 }}
        />
        <div className="absolute w-full h-full pointer-events-none select-none">
          <span className="absolute left- text-sm" style={{ bottom: '-20px', color: '#BF7BD3' }}>
            Decreased
          </span>
          <span
            className="absolute left-1/2 text-sm"
            style={{ top: '-18px', transform: 'translateX(-50%)', color: '#5558E4' }}
          >
            Normal
          </span>
          <span className="absolute right-2 text-sm" style={{ bottom: '-20px', color: '#FFB224' }}>
            Increased
          </span>
        </div>
      </div>
    </div>
  );
};

const GeneGraphDrawer = ({ visible, onClose, gene }) => {
  const specialGeneNames = ['APOE', '9P21', 'MTHFR', 'TCF7L2'];
  const geneKey = specialGeneNames.includes(gene?.name) && gene?.rs_id ? `${gene.name}_${gene.rs_id}` : gene?.name;
  console.log({ geneKey });
  if (!gene) return null;
  const header = (
    <div className="flex items-center gap-3">
      <Hexagon genotype={gene.genotype} />
      <h3 className="text-lg font-semibold">{gene.name}</h3>
      <span className="px-2 rounded-md text-gray-700 bg-gray-200 text-sm">{gene.panel}</span>
    </div>
  );
  return (
    <CustomDrawer visible={visible} onClose={onClose} width={500} header={header}>
      <div className="h-full overflow-auto">
        <div className="p-6 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-2 w-full justify-between">
            <h4 className="text-base font-semibold text-gray-700">Risk Level</h4>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getRiskColor(gene.risk_level)} text-white`}>
              {getRiskLabel(gene.risk_level)}
            </span>
          </div>
          <Gauge risk_level={gene.risk_level} />
        </div>

        <div className="px-6 pb-2 flex flex-row items-center justify-center gap-8 w-full">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 font-medium mb-1">rsID</span>
            <span className="bg-gray-200 text-gray-700 rounded-full px-4 py-1 text-sm font-semibold shadow-sm">
              {gene?.rs_id || genes[geneKey]?.rs_id || 'N/A'}
            </span>
          </div>
        </div>

        <div className="px-6 pt-6 pb-4 flex flex-col items-start">
          <h4 className="text-sm font-semibold">Category</h4>
          <p className="text-gray-800 text-sm">{genes[geneKey]?.category || 'No category available for this gene.'}</p>
        </div>
        <div className="px-6 pb-4 flex flex-col items-start">
          <h4 className="text-sm font-semibold">Risk</h4>
          <p className="text-gray-800 text-sm">
            {genes[geneKey]?.risk || 'No risk description available for this gene.'}
          </p>
        </div>
        <div className="px-6 pb-6">
          <h4 className="text-sm font-semibold">Gene Description</h4>
          <p className="text-gray-800 text-sm">
            {genes[geneKey]?.desc || 'No gene description available for this gene.'}
          </p>
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col gap-4">
            {genes[geneKey]?.genotypes.map((g, idx) => (
              <div key={g.genotype + idx} className="flex items-center gap-4 py-2">
                <Hexagon genotype={g?.genotype} />
                <div className="text-sm text-gray-800 leading-snug">{g?.desc || 'No description available'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CustomDrawer>
  );
};

export default GeneGraphDrawer;
