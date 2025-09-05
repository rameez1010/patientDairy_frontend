import { useState } from 'react';

import { jwtDecode } from 'jwt-decode';
import { IoClose } from 'react-icons/io5';
import { BeatLoader } from 'react-spinners';

import patientApiService from '../../services/patientApiService';
import ReportPdfView from './ReportPdfView';

const PatientReportDrawer = ({ isOpen, onClose, bloodReportUrl, title }) => {
  const [activeTab, setActiveTab] = useState('blood');
  const [geneLoading, setGeneLoading] = useState(false);
  const [genePdfUrl, setGenePdfUrl] = useState(null);

  const getGeneReport = async () => {
    try {
      setGeneLoading(true);
      const token = patientApiService.getAccessToken();
      const decodedToken = jwtDecode(token);

      const res = await patientApiService.get(
        `/patients/get_self_gene_report/${decodedToken.first_name}_${decodedToken.last_name}_${decodedToken.sub}`,
        {
          responseType: 'blob',
        },
      );

      const contentType = res.headers['content-type'];

      if (contentType && contentType.includes('application/json')) {
        // It's an error blob disguised as JSON
        const text = await res.data.text(); // Convert blob to text
        const json = JSON.parse(text);
        throw new Error(json.message || 'Failed to get gene report');
      }

      const url = window.URL.createObjectURL(res.data);
      setGeneLoading(false);
      setGenePdfUrl(url);
      setActiveTab('gene');
    } catch (error) {
      console.log('There was an error getting the gene report:', error);
    } finally {
      setGeneLoading(false);
    }
  };
  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      <div
        className={`relative flex h-full w-full max-w-4xl flex-col bg-white shadow-xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium truncate text-gray-900">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
            <IoClose className="h-6 w-6" />
          </button>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('blood')}
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors text-center ${
                activeTab === 'blood'
                  ? 'border-[#5558E4] text-[#5558E4]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Blood Report
            </button>
            <button
              onClick={() => {
                getGeneReport();
              }}
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors text-center ${
                activeTab === 'gene'
                  ? 'border-[#5558E4] text-[#5558E4]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {geneLoading ? <BeatLoader size={10} color="#5558E4" /> : 'Gene Report'}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto">
            {activeTab === 'blood' ? (
              bloodReportUrl ? (
                <ReportPdfView pdfUrl={bloodReportUrl} />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">No Blood Report Available</div>
              )
            ) : genePdfUrl ? (
              <ReportPdfView pdfUrl={genePdfUrl} />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">No Gene Report Available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientReportDrawer;
