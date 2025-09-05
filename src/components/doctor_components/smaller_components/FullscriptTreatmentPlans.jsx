import { useEffect, useState } from 'react';

import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { FaExternalLinkAlt, FaFileAlt, FaList, FaTimesCircle } from 'react-icons/fa';

import fullscriptService from '../../../services/fullscriptService';
import Spinner from '../../Spinner';
import LoaderOverlay from '../../common/LoaderOverlay';

const FullscriptTreatmentPlans = ({ patientId, patientName }) => {
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancellingPlan, setIsCancellingPlan] = useState(false);

  const fetchTreatmentPlans = async () => {
    if (!patientId) return;

    setIsLoading(true);
    try {
      const response = await fullscriptService.getTreatmentPlans(patientId);
      if (response.success) {
        setTreatmentPlans(response.data.treatment_plans || []);
      } else {
        toast.error('Failed to fetch treatment plans');
      }
    } catch (error) {
      console.error('Error fetching treatment plans:', error);
      toast.error('Error fetching treatment plans');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatmentPlans();
  }, [patientId]);

  const handleViewPlan = async (planId) => {
    setIsLoading(true);
    try {
      const response = await fullscriptService.getTreatmentPlan(patientId, planId);
      if (response.success) {
        setSelectedPlan(response.data.treatment_plan);
        setIsDetailModalOpen(true);
      } else {
        toast.error('Failed to fetch treatment plan details');
      }
    } catch (error) {
      console.error('Error fetching treatment plan details:', error);
      toast.error('Error fetching treatment plan details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelPlan = async (planId) => {
    if (!window.confirm('Are you sure you want to cancel this treatment plan?')) {
      return;
    }

    setIsCancellingPlan(true);
    try {
      const response = await fullscriptService.cancelTreatmentPlan(patientId, planId);
      if (response.success) {
        toast.success('Treatment plan cancelled successfully');
        fetchTreatmentPlans();
        setIsDetailModalOpen(false);
      } else {
        toast.error('Failed to cancel treatment plan');
      }
    } catch (error) {
      console.error('Error cancelling treatment plan:', error);
      toast.error('Error cancelling treatment plan');
    } finally {
      setIsCancellingPlan(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return dateString || 'N/A';
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-semibold flex items-center gap-2">
          <FaList /> Treatment Plans for {patientName}
        </h3>
        <button
          onClick={fetchTreatmentPlans}
          className="text-xs text-blue-500 hover:text-blue-700"
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : 'Refresh'}
        </button>
      </div>

      {isLoading && treatmentPlans.length === 0 ? (
        <div className="flex justify-center py-8">
          <LoaderOverlay loading={isLoading} size={14}>
            Loading treatment plans...
          </LoaderOverlay>
        </div>
      ) : treatmentPlans.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No treatment plans found for this patient.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  State
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {treatmentPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{plan.id}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatDate(plan.created_at)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        plan.state === 'active'
                          ? 'bg-green-100 text-green-800'
                          : plan.state === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {plan.state || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-blue-500">
                    <button onClick={() => handleViewPlan(plan.id)} className="text-blue-500 hover:text-blue-700 mr-3">
                      View Details
                    </button>
                    {plan.state === 'active' && (
                      <button onClick={() => handleCancelPlan(plan.id)} className="text-red-500 hover:text-red-700">
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Treatment Plan Detail Modal */}
      {isDetailModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FaFileAlt /> Treatment Plan Details
              </h2>
              <button onClick={closeDetailModal} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <p className="text-md font-medium">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedPlan.state === 'active'
                        ? 'bg-green-100 text-green-800'
                        : selectedPlan.state === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {selectedPlan.state || 'Unknown'}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Created</p>
                <p className="text-md font-medium">{formatDate(selectedPlan.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">ID</p>
                <p className="text-sm font-medium text-gray-800 truncate">{selectedPlan.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Available At</p>
                <p className="text-sm font-medium text-gray-800">{selectedPlan.available_at}</p>
              </div>
            </div>

            {selectedPlan.personal_message && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Personal Message</p>
                <p className="p-2 bg-gray-50 rounded text-sm">{selectedPlan.personal_message}</p>
              </div>
            )}

            {selectedPlan.invitation_url && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Invitation Link</p>
                <a
                  href={selectedPlan.invitation_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 flex items-center"
                >
                  <span className="truncate mr-1">{selectedPlan.invitation_url}</span>
                  <FaExternalLinkAlt size={12} />
                </a>
              </div>
            )}

            {selectedPlan.recommendations && selectedPlan.recommendations.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Recommendations</p>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Variant ID
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Frequency
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Format
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPlan.recommendations.map((rec, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-900 truncate max-w-[150px]">{rec.variant_id}</td>
                          <td className="px-4 py-2 text-sm text-gray-500">{rec.dosage?.amount || 'N/A'}</td>
                          <td className="px-4 py-2 text-sm text-gray-500">{rec.dosage?.frequency || 'N/A'}</td>
                          <td className="px-4 py-2 text-sm text-gray-500">{rec.dosage?.format || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-4 pt-4 border-t">
              {selectedPlan.state === 'active' && (
                <button
                  onClick={() => handleCancelPlan(selectedPlan.id)}
                  disabled={isCancellingPlan}
                  className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded text-red-700 bg-white hover:bg-red-50"
                >
                  {isCancellingPlan ? (
                    <>
                      <Spinner className="h-4 w-4 mr-2" /> Cancelling...
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="mr-2" /> Cancel Plan
                    </>
                  )}
                </button>
              )}
              <button
                onClick={closeDetailModal}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullscriptTreatmentPlans;
