import { useRef, useState } from 'react';

import toast, { Toaster } from 'react-hot-toast';
import { FiUpload } from 'react-icons/fi';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { SiGooglegemini } from 'react-icons/si';

import doctorApiService from '../../../services/doctorApiService';
import Button from '../../common/Button';
import UploadAlert from './UploadAlert';

// eslint-disable-next-line react/prop-types
const UploadModal = ({ patientId, onClose, handleRefetch }) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forceUploadInfo, setForceUploadInfo] = useState(null);

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
      if (file.type === 'application/pdf') {
        setFile(file);
        setError('');
      } else {
        setError('Only PDF files are allowed.');
      }
    } else {
      setError('Please upload a valid file.');
    }
  };

  const handleLabResults = async (patientId, forceUpload = false) => {
    setLoading(true);
    if (!file) {
      alert('Please select a file first');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await doctorApiService.post(
        `/patients/upload/${patientId}/blood_work${forceUpload ? '?force_upload=true' : ''}`,
        formData,
      );
      notifySuccess(<div className="text-sm font-light">Results Generated Successfully!</div>);
      setForceUploadInfo(null);
      removeFile();
      onClose();
      handleRefetch();
    } catch (error) {
      if (
        error.response &&
        error.response.status === 409 &&
        error.response.data?.errors?.error_type === 'name_mismatch'
      ) {
        setForceUploadInfo({
          message: error.response.data.message,
          extractedName: error.response.data.errors.extracted_name,
          patientFullName: error.response.data.errors.patient_full_name,
        });
      } else if (error.response && error.response.status === 409) {
        notifyError(
          <div className="text-sm font-light">
            {error.response.data?.detail ||
              'This file has already been uploaded for this patient. Please check your previous uploads.'}
          </div>,
        );
      } else {
        notifyError(<div className="text-sm font-light">Failed To Generate Results, Please Try Again!</div>);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {forceUploadInfo && (
        <UploadAlert
          forceUploadInfo={forceUploadInfo}
          setForceUploadInfo={setForceUploadInfo}
          handleLabResults={handleLabResults}
          patientId={patientId}
          loading={loading}
        />
      )}

      {!forceUploadInfo && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className=" bg-white p-4">
              <h2 className=" text-gray-600 text-sm font-semibold">Upload Blood Results</h2>
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
                    Drag & drop a PDF file here or click to upload
                  </p>
                )}
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf"
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
              <Button
                onClick={onClose}
                variant="custom"
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-400 transition-colors duration-200"
              >
                Close
              </Button>
              <Button
                onClick={() => handleLabResults(patientId)}
                disabled={!file || loading}
                loading={loading}
                variant="gradient"
                className="text-xs px-3 py-1 rounded shadow-sm"
              >
                <span className="flex items-center justify-between gap-2 font-medium">
                  <SiGooglegemini size={16} />
                  LAB AI{' '}
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadModal;
