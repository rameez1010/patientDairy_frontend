import { useEffect, useState } from 'react';

import { Fullscript } from '@fullscript/fullscript-js';
import toast from 'react-hot-toast';
import { FaPrescriptionBottleAlt } from 'react-icons/fa';

import fullscriptService from '../../../services/fullscriptService';
import Spinner from '../../Spinner';
import FullscriptTreatmentPlans from './FullscriptTreatmentPlans';

const FULLSCRIPT_PUBLIC_KEY = import.meta.env.VITE_FULLSCRIPT_PUBLIC_KEY;
const VITE_FULLSCRIPT_ENV = import.meta.env.VITE_FULLSCRIPT_ENV;

const FullscriptIntegration = ({ patientData }) => {
  const [fullscriptClient, setFullscriptClient] = useState(null);
  const [isFullscriptLoading, setIsFullscriptLoading] = useState(false);
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [fullscriptModal, setFullscriptModal] = useState(false);
  const [fullscriptPatientId, setFullscriptPatientId] = useState(null);
  const [activeTab, setActiveTab] = useState('treatmentPlans'); // 'prescriptions' or 'treatmentPlans'

  useEffect(() => {
    if (patientData.fullscriptPatientId) {
      setFullscriptPatientId(patientData.fullscriptPatientId);
    }
  }, [patientData.fullscriptPatientId]);

  const handlePatientSelected = (payload) => {
    console.log('Patient selected payload:', payload);
  };

  const handleTreatmentPlanActivated = (payload) => {
    console.log('Treatment plan activated payload:', payload);
  };

  // Initialize Fullscript client on component mount
  useEffect(() => {
    const initializeFullscript = async () => {
      setIsFullscriptLoading(true);
      try {
        const client = Fullscript({
          publicKey: FULLSCRIPT_PUBLIC_KEY,
          env: VITE_FULLSCRIPT_ENV,
        });
        setFullscriptClient(client);
      } catch (error) {
        console.error('Error initializing Fullscript:', error);
        toast.error('Failed to initialize Fullscript');
      } finally {
        setIsFullscriptLoading(false);
      }
    };

    initializeFullscript();
  }, []);

  // Handle opening the Fullscript modal
  const handleFullscriptModal = async () => {
    setFullscriptModal(true);
    if (!fullscriptClient) {
      toast.error('Fullscript is not initialized');
      return;
    }

    try {
      console.log('Getting a new session Grant Token');

      const sessionGrantToken = await fullscriptService.getSessionGrantToken();

      const platformFeature = fullscriptClient.create('treatmentPlan', {
        secretToken: sessionGrantToken,
        patient: {
          id: fullscriptPatientId,
        },
      });

      try {
        platformFeature.mount('fullscript-embed-container');
      } catch (error) {
        console.log('Mounting error:', error);
        toast.error('Error mounting Fullscript component');
      }

      platformFeature.on('treatmentPlan.activated', handleTreatmentPlanActivated);
      platformFeature.on('patient.selected', handlePatientSelected);
    } catch (error) {
      console.error('Error opening Fullscript modal:', error);
      toast.error('Failed to open prescription form');
    }
  };

  // Close the Fullscript modal
  const closeFullscriptModal = () => {
    setFullscriptModal(false);
  };

  const addPatientToFullscript = async () => {
    setIsAddingPatient(true);
    try {
      const response = await fullscriptService.addPatientToFullscript(patientData.id);
      if (response.success) {
        toast.success('Patient added to Fullscript successfully');
        setFullscriptPatientId(response.data.fullscript_patient_id);
      } else {
        toast.error('Failed to add patient to Fullscript');
      }
    } catch (error) {
      console.error('Error adding patient to Fullscript:', error);
      toast.error('Error adding patient to Fullscript');
    } finally {
      setIsAddingPatient(false);
    }
  };

  return (
    <>
      {/* Prescription Section UI */}
      <div className="mt-6 border rounded-md shadow-sm px-3 m-3">
        <div className="flex items-center justify-between border-b-[1px]">
          <span className="p-3 font-medium text-sm text-gray-700 flex items-center gap-1">
            <FaPrescriptionBottleAlt size={20} /> Fullscript Integration
          </span>
          <div className="space-x-2 pr-2 flex items-center justify-end">
            {!fullscriptPatientId && (
              <button
                onClick={addPatientToFullscript}
                disabled={isAddingPatient}
                className="px-2 py-1 rounded text-xs font-medium bg-[#73CEF8] text-white hover:bg-[#60BDE7] disabled:bg-gray-300 disabled:text-gray-500"
              >
                {isAddingPatient ? (
                  <span className="flex items-center">
                    <Spinner /> Adding Patient...
                  </span>
                ) : (
                  'Add Patient to Fullscript'
                )}
              </button>
            )}
            <button
              onClick={handleFullscriptModal}
              disabled={isFullscriptLoading}
              className={`px-2 py-1 rounded text-xs font-medium ${
                fullscriptClient
                  ? 'bg-[#5558E4] text-white hover:bg-[#4548D4]'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isFullscriptLoading ? (
                <span className="flex items-center">
                  <Spinner /> Loading...
                </span>
              ) : fullscriptClient ? (
                'New Prescription'
              ) : (
                'Connect Fullscript First'
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('treatmentPlans')}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === 'treatmentPlans'
                  ? 'border-b-2 border-[#5558E4] text-[#5558E4]'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Treatment Plans
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {!fullscriptClient ? (
            <div className="text-center py-8">
              <FaPrescriptionBottleAlt size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-sm text-gray-500">Connect to Fullscript in Settings to manage prescriptions</p>
              <a href="/settings" className="mt-3 inline-block px-4 py-2 text-sm text-[#5558E4] hover:underline">
                Go to Settings
              </a>
            </div>
          ) : activeTab === 'prescriptions' ? (
            <div className="text-sm text-gray-600">
              <p>Prescription history will be displayed here</p>
            </div>
          ) : (
            // Show treatment plans when that tab is active
            fullscriptPatientId && (
              <FullscriptTreatmentPlans
                patientId={patientData.id}
                patientName={`${patientData.firstName} ${patientData.lastName}`}
              />
            )
          )}

          {activeTab === 'treatmentPlans' && !fullscriptPatientId && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">
                Please add this patient to Fullscript first to view treatment plans.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fullscript Modal */}
      {fullscriptModal && (
        <FullscriptModal
          onClose={closeFullscriptModal}
          patientName={`${patientData.firstName} ${patientData.lastName}`}
        />
      )}
    </>
  );
};

// Separate Fullscript Modal component
const FullscriptModal = ({ onClose, patientName }) => {
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg w-11/12 h-5/6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Create Prescription for {patientName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
        <div style={{ width: '100%', height: '90%' }} id="fullscript-embed-container"></div>
      </div>
    </div>
  );
};

export default FullscriptIntegration;
