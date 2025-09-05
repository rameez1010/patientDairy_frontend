import { useEffect, useState } from 'react';

import ValidationErrorDisplay from './ValidationErrorDisplay';
import { getFieldClassName } from './ValidationUtils';

const MenstrualReproductiveHistory = ({ data, onUpdate, validationErrors = {}, onClearErrors }) => {
  const [formData, setFormData] = useState({
    menstrualProblems: [],
    ageAtFirstPeriod: '',
    cycleRegularity: '',
    flowType: '',
    lastMenstrualCycle: '',
    iudUse: {
      used: false,
      duration: '',
    },
    premenstrualSymptoms: {
      hasSymptoms: false,
      description: '',
    },
    surgeries: '',
    hysterectomy: {
      had: false,
      ovariesRemoved: false,
      surgeryDate: '',
    },
    tubalLigation: false,
    oralContraceptives: {
      used: false,
      lastUseDate: '',
    },
    lastPelvicExam: '',
    lastBreastExam: '',
    pregnancies: {
      totalPregnancies: '',
      liveBirths: '',
      liveChildren: '',
      miscarriages: {
        total: '',
        gestationAge: '',
      },
    },
    ...data,
  });

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        ...data,
        // Ensure arrays are always initialized
        menstrualProblems: data.menstrualProblems || [],
      }));
    }
  }, [data]);

  const menstrualProblemsOptions = [
    'irregular periods',
    'heavy bleeding',
    'light bleeding',
    'painful periods',
    'missed periods',
    'spotting between periods',
    'long periods',
    'short periods',
    'clotting',
    'cramps',
    'breast tenderness',
    'mood swings',
    'fatigue',
    'bloating',
    'headaches',
    'back pain',
    'nausea',
    'no problems',
    'None',
  ];

  const handleChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onUpdate(updatedData);

    // Clear validation error for this field when user starts typing
    if (validationErrors[field] && onClearErrors) {
      onClearErrors();
    }
  };

  const handleNestedChange = (parentField, field, value) => {
    const updatedData = {
      ...formData,
      [parentField]: {
        ...formData[parentField],
        [field]: value,
      },
    };
    setFormData(updatedData);
    onUpdate(updatedData);

    // Clear validation error for this nested field when user starts typing
    const nestedFieldName = `${parentField}.${field}`;
    if (validationErrors[nestedFieldName] && onClearErrors) {
      onClearErrors();
    }
  };

  const handleMultiSelect = (field, value) => {
    const currentValues = formData[field] || [];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    handleChange(field, updatedValues);
  };

  const renderRequiredLabel = (label) => (
    <span>
      {label} <span className="text-red-500">*</span>
    </span>
  );

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-800">Menstrual and Reproductive History</h3>
        <p className="text-sm text-gray-600 mt-1">
          Please provide information about your menstrual and reproductive health
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {renderRequiredLabel('Menstrual Problems (Select all that apply)')}
          </label>
          <div
            className={`grid grid-cols-2 md:grid-cols-3 gap-3 p-4 rounded-md ${validationErrors.menstrualProblems ? 'border border-red-300 bg-red-50' : ''}`}
          >
            {menstrualProblemsOptions.map((problem) => (
              <label key={problem} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.menstrualProblems.includes(problem)}
                  onChange={() => handleMultiSelect('menstrualProblems', problem)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {problem.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </label>
            ))}
          </div>
          <ValidationErrorDisplay error={validationErrors.menstrualProblems} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {renderRequiredLabel('Age at First Period')}
            </label>
            <input
              type="number"
              min="8"
              max="20"
              value={formData.ageAtFirstPeriod}
              onChange={(e) => handleChange('ageAtFirstPeriod', e.target.value)}
              className={getFieldClassName('ageAtFirstPeriod', validationErrors)}
              placeholder="Enter age"
              required
            />
            <ValidationErrorDisplay error={validationErrors.ageAtFirstPeriod} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {renderRequiredLabel('Cycle Regularity')}
            </label>
            <select
              value={formData.cycleRegularity}
              onChange={(e) => handleChange('cycleRegularity', e.target.value)}
              className={getFieldClassName('cycleRegularity', validationErrors)}
              required
            >
              <option value="">Select regularity</option>
              <option value="Not Applicable">Not Applicable</option>
              <option value="regular">Regular (21-35 days)</option>
              <option value="irregular">Irregular</option>
              <option value="very irregular">Very irregular</option>
              <option value="no periods">No periods</option>
            </select>
            <ValidationErrorDisplay error={validationErrors.cycleRegularity} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{renderRequiredLabel('Flow Type')}</label>
            <select
              value={formData.flowType}
              onChange={(e) => handleChange('flowType', e.target.value)}
              className={getFieldClassName('flowType', validationErrors)}
              required
            >
              <option value="">Select flow type</option>
              <option value="Not Applicable">Not Applicable</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="heavy">Heavy</option>
              <option value="very heavy">Very heavy</option>
            </select>
            <ValidationErrorDisplay error={validationErrors.flowType} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {renderRequiredLabel('Last Menstrual Cycle')}
            </label>
            <input
              type="date"
              value={formData.lastMenstrualCycle}
              onChange={(e) => handleChange('lastMenstrualCycle', e.target.value)}
              className={getFieldClassName('lastMenstrualCycle', validationErrors)}
              required
            />
            <ValidationErrorDisplay error={validationErrors.lastMenstrualCycle} />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">IUD Use</label>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.iudUse.used}
                onChange={(e) => handleNestedChange('iudUse', 'used', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Currently using or have used an IUD</span>
            </label>
            {formData.iudUse.used && (
              <input
                type="text"
                value={formData.iudUse.duration}
                onChange={(e) => handleNestedChange('iudUse', 'duration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Duration of use and any side effects"
              />
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Premenstrual Symptoms</label>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.premenstrualSymptoms.hasSymptoms}
                onChange={(e) => handleNestedChange('premenstrualSymptoms', 'hasSymptoms', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Experience premenstrual symptoms</span>
            </label>
            {formData.premenstrualSymptoms.hasSymptoms && (
              <textarea
                value={formData.premenstrualSymptoms.description}
                onChange={(e) => handleNestedChange('premenstrualSymptoms', 'description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your premenstrual symptoms"
              />
            )}
          </div>
          <ValidationErrorDisplay error={validationErrors['premenstrualSymptoms.hasSymptoms']} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gynecological Surgeries</label>
          <textarea
            value={formData.surgeries}
            onChange={(e) => handleChange('surgeries', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="List any gynecological surgeries, procedures, or treatments"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Hysterectomy</label>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.hysterectomy.had}
                onChange={(e) => handleNestedChange('hysterectomy', 'had', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Had a hysterectomy</span>
            </label>
            {formData.hysterectomy.had && (
              <div className="space-y-3 ml-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.hysterectomy.ovariesRemoved}
                    onChange={(e) => handleNestedChange('hysterectomy', 'ovariesRemoved', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Ovaries were also removed</span>
                </label>
                <input
                  type="date"
                  value={formData.hysterectomy.surgeryDate}
                  onChange={(e) => handleNestedChange('hysterectomy', 'surgeryDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Date of surgery"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.tubalLigation}
              onChange={(e) => handleChange('tubalLigation', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Had tubal ligation</span>
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Oral Contraceptives</label>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.oralContraceptives.used}
                onChange={(e) => handleNestedChange('oralContraceptives', 'used', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Currently using or have used oral contraceptives</span>
            </label>
            {formData.oralContraceptives.used && (
              <input
                type="date"
                value={formData.oralContraceptives.lastUseDate}
                onChange={(e) => handleNestedChange('oralContraceptives', 'lastUseDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Last use date"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Pelvic Exam</label>
            <input
              type="date"
              value={formData.lastPelvicExam}
              onChange={(e) => handleChange('lastPelvicExam', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Breast Exam</label>
            <input
              type="date"
              value={formData.lastBreastExam}
              onChange={(e) => handleChange('lastBreastExam', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-800 mb-4">Pregnancy History</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Pregnancies</label>
              <input
                type="number"
                min="0"
                value={formData.pregnancies.totalPregnancies}
                onChange={(e) => handleNestedChange('pregnancies', 'totalPregnancies', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Live Births</label>
              <input
                type="number"
                min="0"
                value={formData.pregnancies.liveBirths}
                onChange={(e) => handleNestedChange('pregnancies', 'liveBirths', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Live Children</label>
              <input
                type="number"
                min="0"
                value={formData.pregnancies.liveChildren}
                onChange={(e) => handleNestedChange('pregnancies', 'liveChildren', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {renderRequiredLabel('Miscarriages')}
              </label>
              <input
                type="number"
                min="0"
                value={formData.pregnancies.miscarriages.total}
                onChange={(e) =>
                  handleNestedChange('pregnancies', 'miscarriages', {
                    ...formData.pregnancies.miscarriages,
                    total: e.target.value,
                  })
                }
                className={getFieldClassName('miscarriages.total', validationErrors)}
                placeholder="0"
                required
              />
              <ValidationErrorDisplay error={validationErrors['miscarriages.total']} />
            </div>
          </div>

          {formData.pregnancies.miscarriages.total > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {renderRequiredLabel('Gestation Age at Miscarriage')}
              </label>
              <select
                value={formData.pregnancies.miscarriages.gestationAge}
                onChange={(e) =>
                  handleNestedChange('pregnancies', 'miscarriages', {
                    ...formData.pregnancies.miscarriages,
                    gestationAge: e.target.value,
                  })
                }
                className={getFieldClassName('miscarriages.gestationAge', validationErrors)}
                required
              >
                <option value="">Select gestation age</option>
                <option value="first trimester">First trimester</option>
                <option value="second trimester">Second trimester</option>
                <option value="third trimester">Third trimester</option>
                <option value="various">Various stages</option>
              </select>
              <ValidationErrorDisplay error={validationErrors['miscarriages.gestationAge']} />
            </div>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Important Note</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  This information helps us understand your reproductive health and develop appropriate treatment plans.
                  All information is kept confidential and will only be used for your medical care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenstrualReproductiveHistory;
