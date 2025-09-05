import { useState } from 'react';

import { RiCloseLargeLine } from 'react-icons/ri';
import { SiGooglegemini } from 'react-icons/si';

import doctorApiService from '../../../services/doctorApiService';
import Spinner from '../../Spinner';

const RagModal = ({ patientId, firstName, lastName, onClose }) => {
  const [query, setQuery] = useState('');
  const [ragResponse, setRagResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const eraseChat = () => {
    setQuery('');
    setRagResponse(null);
  };

  const handleRag = async () => {
    setIsLoading(true);
    try {
      const res = await doctorApiService.post(
        `/patients/${patientId}/rag`,

        { query },
      );

      const result = res.data;

      if (!result.success) {
        throw new Error(result.message || 'Failed to get RAG response');
      }

      setRagResponse(result.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="fixed inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="p-4 w-1/2 h-1/2 flex flex-col justify-between bg-white rounded">
        {/* AI RAG Query */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-bold text-gray-600">
            <SiGooglegemini size={18} className="text-[#5558E4]" /> BioKrystal AI Assistant
          </span>
          <button onClick={onClose} className="flex justify-end text-gray-600">
            <RiCloseLargeLine size={21} />
          </button>
        </div>

        <div className="h-4/5 rounded bg-white p-2 overflow-y-scroll border-2">
          {!ragResponse ? (
            <span className="text-xs font-light text-gray-400">Your response will appear here...</span>
          ) : (
            <span className="text-sm font-light">{ragResponse}</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading && query) {
                handleRag();
              }
            }}
            placeholder={`Ask me about ${firstName} ${lastName}'s medical history`}
            className="w-[75%] p-1 rounded border text-sm font-light placeholder:text-xs"
          />
          <div className="flex gap-4">
            <button
              onClick={handleRag}
              disabled={isLoading || !query}
              className="text-xs bg-[#5558E4] text-white py-[6px] px-4 shadow-sm rounded"
            >
              {isLoading ? <Spinner loading={isLoading} /> : 'Submit'}
            </button>
            <button
              onClick={eraseChat}
              disabled={isLoading}
              className="text-xs bg-[#FFB224] text-white py-[6px] px-4 shadow-sm rounded"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RagModal;
