import { useEffect, useState } from 'react';

import { FaFileAlt } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

import doctorApiService from '../../services/doctorApiService';
import Button from '../common/Button';
import SummaryContainer from './smaller_components/SummaryContainer';

const PdfReferenceDrawer = ({ isOpen, onClose, pdfUrl, title, originalUrl }) => {
  const [activeTab, setActiveTab] = useState('view');
  const [summary, setSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSummary('');
      setActiveTab('view');
    }
  }, [isOpen]);

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      console.log({ originalUrl });
      const result = await doctorApiService.post(`/ai-knowledge/summarize-pdf`, {
        gsUrl: originalUrl,
      });
      if (!result.data.success) {
        throw new Error(result.data.message || 'Failed to generate summary');
      }
      setSummary(result.data.data.summary);
    } catch (error) {
      setSummary('Error generating summary. Please try again.');
      console.error('Error generating summary:', error);
    } finally {
      setIsGeneratingSummary(false);
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
              onClick={() => setActiveTab('view')}
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors text-center ${
                activeTab === 'view'
                  ? 'border-[#5558E4] text-[#5558E4]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              View PDF
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors text-center ${
                activeTab === 'summary'
                  ? 'border-[#5558E4] text-[#5558E4]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Summary
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto">
            {activeTab === 'view' ? (
              pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  className="h-full w-full min-h-[80vh]"
                  title="PDF Viewer"
                  frameBorder="0"
                  allow="autoplay"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">Select a reference to view</div>
              )
            ) : (
              <div className="p-6 h-full">
                {!summary ? (
                  <div className="flex h-full items-center justify-center p-4">
                    <div className="bg-white rounded-xl   p-8  w-full">
                      <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#5558E4]/10 mb-6">
                          <FaFileAlt size={''} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Generate PDF Summary</h3>
                        <div className="mb-8">
                          <div className="bg-gray-50 rounded-lg p-4 mb-2">
                            <p className="text-[#5558E4] font-semibold text-sm break-words leading-relaxed">{title}</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            This will analyze the PDF content and provide key insights
                          </p>
                        </div>
                        <Button
                          variant="gradient"
                          onClick={handleGenerateSummary}
                          disabled={isGeneratingSummary}
                          loading={isGeneratingSummary}
                          className="w-full items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl shadow-sm text-white bg-[#5558E4] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform"
                        >
                          Generate Summary
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <SummaryContainer summary={summary} title={title} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfReferenceDrawer;
