import { useRef, useState } from 'react';

import toast, { Toaster } from 'react-hot-toast';
import { FiUpload } from 'react-icons/fi';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { SiGooglegemini } from 'react-icons/si';

import doctorApiService from '../../../services/doctorApiService';
import Spinner from '../../Spinner';

const GeneUploadModal = ({ patientId, onClose, handleRefetch }) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [geneLoading, setGeneLoading] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const notifyError = (toastMessage) => {
    toast.error(toastMessage);
  };

  const notifySuccess = (toastMessage) => {
    toast.success(toastMessage);
  };

  const removeFile = (e) => {
    if (e) {
      e.stopPropagation(); // Prevent event propagation
    }
    setFile(null);
    setError(''); // Clear any error messages
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input
    }
  };

  const validateAndSetFile = (file) => {
    if (file) {
      if (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel' || file.name.endsWith('.csv')) {
        setFile(file);
        setError('');
      } else {
        setError('Only CSV files are allowed.');
      }
    } else {
      setError('Please upload a valid file.');
    }
  };

  const handleGeneResults = async (patientId) => {
    setGeneLoading(true);
    if (!file) {
      alert('Please select a file first');
      setGeneLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await doctorApiService.post(`/patients/upload/${patientId}/gene_results`, formData);

      const result = res.data;

      if (!result.success) {
        const error = new Error(result.message || 'Failed to upload gene file');
        error.status = res.status;
        error.detail = result.message;
        error.errors = result.errors;
        throw error;
      }

      notifySuccess(<div className="text-sm font-light">Results Generated Successfully!</div>);
      removeFile();
      onClose();
      handleRefetch();
    } catch (error) {
      console.log('Error uploading file: ', error);
      if (error.status === 409) {
        notifyError(
          <div className="text-sm font-light">
            {error.detail ||
              'This file has already been uploaded for this patient. Please check your previous uploads.'}
          </div>,
        );
      } else {
        notifyError(<div className="text-sm font-light">Failed To Generate Results!</div>);
      }
    }
    setGeneLoading(false);
  };

  return (
    <div className="fixed inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className=" bg-white p-4">
          <h2 className=" text-gray-600 text-sm font-semibold">Upload Gene Results</h2>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('file-input').click()}
            className={`border-[1px] border-dashed ${
              file ? 'border-[#5558E4]' : 'border-gray-300'
            } rounded-lg p-6 text-center cursor-pointer transition-colors duration-200`}
          >
            {file ? (
              <div className="flex items-center justify-center">
                <p className="text-[#5558E4] font-light text-sm">
                  File selected: <span className="text-gray-700">{file.name}</span>
                </p>
                <button onClick={(e) => removeFile(e)} className="ml-2 text-red-500 hover:text-red-700">
                  <IoIosCloseCircleOutline />
                </button>
              </div>
            ) : (
              <p className="text-gray-600 text-sm font-light flex flex-col items-center gap-2">
                <FiUpload size={20} className="text-[#5558E4" />
                Drag & drop a CSV file here or click to upload
              </p>
            )}
            <input
              id="file-input"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileInput}
              ref={fileInputRef}
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </div>
        <Toaster position="top-center" reverseOrder={false} />
        {/* Footer */}
        <div className="bg-gray-100 p-4 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-400 transition-colors duration-200"
          >
            Close
          </button>
          <button
            onClick={() => handleGeneResults(patientId)}
            disabled={!file || geneLoading}
            className="text-xs bg-gradient-to-r from-[#00b4d8] to-[#5558E4] px-3 py-1 rounded shadow-sm text-white hover:bg-gradiant-to-r hover:from-[#5558E4] hover:to-[#00b4d8]"
          >
            {geneLoading ? (
              <Spinner />
            ) : (
              <span className="flex items-center justify-between gap-2 font-medium">
                <SiGooglegemini size={16} />
                GENE AI{' '}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneUploadModal;
