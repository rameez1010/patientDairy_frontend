export const getHistoricalData = (reports, group, biomarker) => {
  // console.log({ reports, group, biomarker });
  if (!group || !biomarker) return { dates: [], values: [], units: '' };
  const data = reports
    .sort((a, b) => new Date(a.reportDate) - new Date(b.reportDate))
    .reduce(
      (acc, report) => {
        const reportBiomarker = report.bloodWorkBioMarkerGroup[group]?.find((marker) => marker.title === biomarker);
        if (reportBiomarker) {
          acc.dates.push(report?.reportDate);
          acc.values.push(reportBiomarker?.value);
          acc.units = reportBiomarker?.unit;
        }
        return acc;
      },
      { dates: [], values: [], units: '' },
    );

  return data;
};

const isHomozygous = (genotype) => {
  return genotype.length === 2 && genotype[0] === genotype[1];
};

export const getGenotypeColor = (genotype) => {
  if (!genotype || genotype.length !== 2) return 'bg-purple-400 text-white';

  return isHomozygous(genotype)
    ? 'bg-purple-400 text-white' // Homozygous
    : 'bg-[#FFB224] text-white'; // Heterozygous
};

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export const extractReportType = (filename) => {
  if (!filename) return '';
  const match = filename.match(/\d{4}-\d{2}-\d{2}_(.*)/);
  return match ? match[1] : filename;
};
