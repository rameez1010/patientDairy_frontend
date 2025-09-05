import { useEffect, useRef, useState } from 'react';

import { FaCheck, FaChevronLeft, FaChevronRight, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

import patientApiService from '../../services/patientApiService';
import Consent from './form_sections/Consent';
import FamilyHistory from './form_sections/FamilyHistory';
import Lifestyle from './form_sections/Lifestyle';
import MaleReproductiveHormonal from './form_sections/MaleReproductiveHormonal';
import MedicalHistory from './form_sections/MedicalHistory';
import MenstrualReproductiveHistory from './form_sections/MenstrualReproductiveHistory';
import PersonalInformation from './form_sections/PersonalInformation';
import Symptoms from './form_sections/Symptoms';

const MedicalIntakeFormModal = ({ isOpen, onClose, patientData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completedSections, setCompletedSections] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const scrollableContentRef = useRef(null);
  // Define form sections based on gender
  const getFormSections = () => {
    const commonSections = [
      { id: 'personalInformation', title: 'Personal Information', component: PersonalInformation },
      { id: 'symptoms', title: 'Symptoms', component: Symptoms },
      { id: 'medicalHistory', title: 'Medical History', component: MedicalHistory },
      { id: 'familyHistory', title: 'Family History', component: FamilyHistory },
      { id: 'lifestyle', title: 'Lifestyle', component: Lifestyle },
    ];

    if (patientData?.gender === 'male') {
      commonSections.push({
        id: 'maleReproductiveHormonal',
        title: 'Male Reproductive & Hormonal',
        component: MaleReproductiveHormonal,
      });
    }
    if (patientData?.gender === 'female') {
      commonSections.push({
        id: 'menstrualReproductiveHistory',
        title: 'Menstrual & Reproductive History',
        component: MenstrualReproductiveHistory,
      });
    }
    commonSections.push({ id: 'consent', title: 'Consent', component: Consent });

    return commonSections;
  };

  const formSections = getFormSections();

  useEffect(() => {
    if (isOpen) {
      checkFormCompletion();
    }
  }, [isOpen]);

  const checkFormCompletion = async () => {
    setLoading(true);
    try {
      const response = await patientApiService.get('/medical-form/completion-status');
      const isComplete = response.data.data.is_complete;

      if (!isComplete) {
        // Load existing form data
        await loadFormData();
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error checking form completion:', error);
      // If error, still try to load form data
      await loadFormData();
    } finally {
      setLoading(false);
    }
  };

  const loadFormData = async () => {
    try {
      const response = await patientApiService.get('/medical-form/');
      const data = response.data.data;
      setFormData(data || {});

      // Determine completed sections
      const completed = [];
      Object.keys(data)?.forEach((section) => {
        if (data?.[section] && Object.keys(data?.[section])?.length > 0) {
          completed.push(section);
        }
      });
      setCompletedSections(completed);

      // Set current step to first incomplete section
      const firstIncompleteIndex = formSections.findIndex((section) => !completed.includes(section.id));
      setCurrentStep(firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0);
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  const updateFormData = (sectionId, sectionData) => {
    setFormData((prev) => ({
      ...prev,
      [sectionId]: sectionData,
    }));
  };

  // Clean form data by removing empty fields
  const cleanFormData = (data) => {
    console.log('Section Form data', data);
    const cleaned = {};

    Object.keys(data).forEach((sectionKey) => {
      const sectionData = data[sectionKey];
      if (!sectionData || typeof sectionData !== 'object') return;

      const cleanedSection = {};
      let hasValidData = false;

      Object.keys(sectionData).forEach((fieldKey) => {
        const fieldValue = sectionData[fieldKey];

        if (typeof fieldValue === 'string') {
          if (fieldValue.trim() !== '') {
            cleanedSection[fieldKey] = fieldValue.trim();
            hasValidData = true;
          }
        } else if (Array.isArray(fieldValue)) {
          if (fieldValue.length > 0) {
            cleanedSection[fieldKey] = fieldValue;
            hasValidData = true;
          }
        } else if (typeof fieldValue === 'object' && fieldValue !== null) {
          // Handle nested objects (like hormoneTherapy, pregnancies, etc.)
          const cleanedNested = {};
          let hasNestedData = false;

          Object.keys(fieldValue).forEach((nestedKey) => {
            const nestedValue = fieldValue[nestedKey];

            if (typeof nestedValue === 'string') {
              if (nestedValue.trim() !== '') {
                cleanedNested[nestedKey] = nestedValue.trim();
                hasNestedData = true;
              }
            } else if (Array.isArray(nestedValue)) {
              if (nestedValue.length > 0) {
                cleanedNested[nestedKey] = nestedValue;
                hasNestedData = true;
              }
            } else if (typeof nestedValue === 'boolean') {
              // Handle boolean values (both true and false are valid)
              cleanedNested[nestedKey] = nestedValue;
              hasNestedData = true;
            } else if (nestedValue !== null && nestedValue !== undefined) {
              cleanedNested[nestedKey] = nestedValue;
              hasNestedData = true;
            }
          });

          if (hasNestedData) {
            cleanedSection[fieldKey] = cleanedNested;
            hasValidData = true;
          }
        } else if (typeof fieldValue === 'boolean') {
          // Handle boolean values (both true and false are valid)
          cleanedSection[fieldKey] = fieldValue;
          hasValidData = true;
        } else if (fieldValue !== null && fieldValue !== undefined) {
          cleanedSection[fieldKey] = fieldValue;
          hasValidData = true;
        }
      });

      if (hasValidData) {
        cleaned[sectionKey] = cleanedSection;
      }
    });

    return cleaned;
  };

  const parseValidationErrors = (errors) => {
    const parsedErrors = {};

    if (errors?.validation_errors) {
      errors.validation_errors.forEach((error) => {
        // Extract section and field from the field path (e.g., "body.personalInformation.age")
        const fieldPath = error.field;
        const pathParts = fieldPath.split('.');

        if (pathParts.length >= 3) {
          const section = pathParts[1]; // personalInformation
          const field = pathParts.slice(2).join('.'); // age or hormoneTherapy.used

          if (!parsedErrors[section]) {
            parsedErrors[section] = {};
          }

          parsedErrors[section][field] = {
            message: error.message,
            type: error.type,
            value: error.value,
            suggestions: error.suggestions || [],
          };
        }
      });
    }

    return parsedErrors;
  };

  const saveFormData = async () => {
    setSaving(true);
    setValidationErrors({});
    setGeneralError('');

    try {
      await patientApiService.post('/medical-form/', cleanFormData(formData));
      console.log('Form data saved successfully');
      return true; // Success - 200 OK
    } catch (error) {
      console.error('Error saving form data:', error);

      if (error.response?.status === 422 && error.response?.data?.errors) {
        // Handle validation errors
        const parsedErrors = parseValidationErrors(error.response.data.errors);
        setValidationErrors(parsedErrors);

        // Set general error message
        setGeneralError(error.response.data.message || 'Validation failed. Please check the form and try again.');

        // Navigate to the first section with errors
        const sectionsWithErrors = Object.keys(parsedErrors);
        if (sectionsWithErrors.length > 0) {
          const firstErrorSection = sectionsWithErrors[0];
          const sectionIndex = formSections.findIndex((section) => section.id === firstErrorSection);
          if (sectionIndex >= 0) {
            setCurrentStep(sectionIndex);
          }
        }
        return false; // Failed - 422 validation error
      } else {
        // Handle other errors
        setGeneralError(error.response?.data?.message || 'An error occurred while saving the form. Please try again.');
        return false; // Failed - other error
      }
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    // Check if current section has any data
    const currentSectionId = formSections[currentStep]?.id;
    const currentSectionData = formData[currentSectionId] || {};

    // Special check for Consent step: acceptedTerms must be true
    if (currentSectionId === 'consent' && !currentSectionData.acceptedTerms) {
      setValidationErrors((prev) => ({
        ...prev,
        acceptedTerms: 'You must accept the terms and conditions to proceed.'
      }));
      setGeneralError('You must accept the terms and conditions to proceed.');
      return;
    }

    // Check if section is empty (no meaningful data)
    const hasData = Object.keys(currentSectionData).some((key) => {
      const value = currentSectionData[key];
      if (typeof value === 'string') {
        return value.trim() !== '';
      } else if (Array.isArray(value)) {
        return value.length > 0;
      } else if (typeof value === 'boolean') {
        // Handle boolean values (both true and false are valid)
        return true;
      } else if (typeof value === 'object' && value !== null) {
        return Object.keys(value).some((subKey) => {
          const subValue = value[subKey];
          if (typeof subValue === 'string') {
            return subValue.trim() !== '';
          } else if (Array.isArray(subValue)) {
            return subValue.length > 0;
          } else if (typeof subValue === 'boolean') {
            // Handle boolean values (both true and false are valid)
            return true;
          }
          return subValue !== null && subValue !== undefined;
        });
      }
      return value !== null && value !== undefined;
    });

    if (!hasData) {
      // Set error message for empty section
      setGeneralError('Please fill in at least some information in this section before proceeding.');
      return;
    }

    // Clear any existing validation errors for current section
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[currentSectionId];
      return newErrors;
    });
    setGeneralError('');

    // Save current data before moving to next step
    const saveSuccess = await saveFormData();

    // Scroll to top after step change
    if (scrollableContentRef.current) {
      scrollableContentRef.current.scrollTop = 0;
    }
    // Only proceed if save was successful (200 OK)
    if (saveSuccess) {
      if (currentStep < formSections.length - 1) {
        setCurrentStep(currentStep + 1);
        await loadFormData();
      } else {
        // Form completed
        onClose();
      }
    }
    // If saveSuccess is false, validation errors or other errors are already set by saveFormData
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      if (scrollableContentRef.current) {
        scrollableContentRef.current.scrollTop = 0;
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const clearValidationErrors = (sectionId) => {
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[sectionId];
      return newErrors;
    });
  };

  const CurrentStepComponent = formSections[currentStep]?.component;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Functional Medicine Intake Form</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <FaTimes size={20} />
          </button>
        </div>
        {/* Progress Bar */}
        <div className="relative w-full px-6 pt-6 pb-2 h-[100px]">
          <div className="absolute left-0 right-0 top-[38px] h-1 bg-gray-300 z-0 rounded ml-4 mr-4"></div>
          <div
            className="absolute left-0 top-[38px] h-1 bg-green-500 z-10 rounded ml-4 mr-4 transition-all duration-700"
            style={{
              maxWidth: '800px',
              width: formSections.length > 1 ? `calc(${(currentStep / (formSections.length - 1)) * 100}%)` : '0%',
            }}
          ></div>
          <div className="flex items-start justify-between w-full relative z-20 h-[80px]">
            {formSections.map((section, idx) => {
              const isCompleted = completedSections.includes(section.id);
              const isCurrent = idx === currentStep;
              return (
                <div key={section.id} className="flex flex-col items-center flex-1 min-w-0 relative">
                  <div
                    className={`
              flex items-center justify-center w-8 h-8 rounded-full border-2 mb-1 relative z-10 transition-colors
              ${isCompleted ? 'bg-green-500 border-green-500 text-white' : ''}
              ${isCurrent ? 'bg-blue-600 border-blue-600 text-white' : ''}
              ${!isCompleted && !isCurrent ? 'bg-white border-gray-300 text-gray-600' : ''}
            `}
                  >
                    {isCompleted ? <FaCheck size={12} /> : idx + 1}
                  </div>
                  <span
                    className={`text-xs text-center break-words ${isCurrent ? 'font-semibold text-blue-700' : 'text-gray-600'}`}
                    style={{ maxWidth: '90px', minHeight: '16px' }}
                  >
                    {section.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* General Error Display */}
        {generalError && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start space-x-3">
              <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Validation Error</h3>
                <p className="text-sm text-red-700 mt-1">{generalError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6" ref={scrollableContentRef}>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            CurrentStepComponent && (
              <CurrentStepComponent
                data={formData[formSections[currentStep].id] || {}}
                onUpdate={(data) => updateFormData(formSections[currentStep].id, data)}
                patientData={patientData}
                validationErrors={validationErrors[formSections[currentStep].id] || {}}
                onClearErrors={() => clearValidationErrors(formSections[currentStep].id)}
              />
            )
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t">
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronLeft size={14} />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  {currentStep === formSections.length - 1 ? 'Complete' : 'Next'}
                  <FaChevronRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalIntakeFormModal;
