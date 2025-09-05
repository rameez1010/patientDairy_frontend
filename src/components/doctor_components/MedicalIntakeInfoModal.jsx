import { useState } from 'react';

import { FaTimes } from 'react-icons/fa';

import InfoField from './smaller_components/InfoField';
import InfoList from './smaller_components/InfoList';
import BooleanBox from './smaller_components/BooleanBox';

function PersonalInformationSection({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
      <InfoField label="Full Name" value={data.fullName} />
      <InfoField label="Phone" value={data.phone} />
      <InfoField label="Email" value={data.email} />
      <InfoField label="Date of Birth" value={data.dateOfBirth} />
      <div className="md:col-span-2">
        <InfoField label="Address" value={data.address} />
      </div>
      <InfoField label="Age" value={data.age} />
      <InfoField label="Marital Status" value={data.maritalStatus} />
      <InfoField label="Gender" value={data.gender} />
      <InfoField label="Weight" value={data.weight} />
      <InfoField label="Height" value={data.height} />
      <InfoField label="Blood Pressure" value={data.bloodPressure} />
      <InfoField label="Primary Care Provider" value={data.primaryCareProvider} />
    </div>
  );
}

function SymptomsSection({ data }) {
  return (
    <div>
      <InfoList label="General Symptoms" items={data.generalSymptoms} />
      <InfoList label="Additional Symptoms" items={data.additionalSymptoms} />
      <InfoField label="How Long Has The Patient Been Experiencing These Symptoms?" value={data.symptomDuration} />
      <InfoField label="When are symptoms usually present?" value={data.symptomTiming} />
      <InfoField label="How does the patient's condition affect their daily life?" value={data.symptomImpact} />
    </div>
  );
}

function MedicalHistorySection({ data }) {
  return (
    <div>
      <InfoList label="Past Medical History" items={data.pastMedicalHistory} />
      <InfoField label="Other Medical History" value={data.otherMedicalHistory} />
      <InfoList label="Cardiac History" items={data.cardiacHistory} />
      <InfoField label="Other Cardiac History" value={data.otherCardiacHistory} />
    </div>
  );
}

function FamilyHistorySection({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
      <div className="md:col-span-2">
        <InfoList label="Family Conditions" items={data.conditions} />
      </div>
      <div className="md:col-span-2">
        <InfoField label="Other Family History" value={data.otherFamilyHistory} />
      </div>
      <InfoField label="Father Age/Death" value={data.fatherAgeOrDeath} />
      <InfoField label="Mother Age/Death" value={data.motherAgeOrDeath} />
      <InfoField label="Father Health Status" value={data.fatherHealthStatus} />
      <InfoField label="Mother Health Status" value={data.motherHealthStatus} />
      <InfoField label="Father's Health Issues or Cause of Death" value={data.fatherHealthReason} />
      <InfoField label="Mother's Health Issues or Cause of Death" value={data.motherHealthReason} />
    </div>
  );
}

function LifestyleSection({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
      <InfoField label="Last Physical Exam" value={data.lastPhysicalExam} />
      <InfoField label="Allergies" value={data.allergies} />
      <div className="md:col-span-2">
        <InfoField label="Medications and Supplements" value={data.medicationsAndSupplements} />
      </div>
      <div className="md:col-span-2">
        <div className="flex justify-around gap-4 mb-2">
          <BooleanBox label="Hormone Therapy Used" value={!!data.hormoneTherapy?.used} />
          <BooleanBox label="Smoking or Cannabis" value={!!data.smokingOrCannabis} />
          <BooleanBox label="Recreational Drugs Used" value={!!data.recreationalDrugs?.used} />
        </div>
      </div>
      <div className="md:col-span-2">
        <InfoField label="Hormone Therapy Details" value={data.hormoneTherapy?.details} />
      </div>
      <div className="md:col-span-2">
        <InfoField label="Recreational Drugs Details" value={data.recreationalDrugs?.details} />
      </div>
      <InfoField label="Alcohol Consumption" value={data.alcoholConsumption} />
      <InfoField label="Exercise Regimen" value={data.exerciseRegimen} />
      <InfoField label="Desire For Children" value={data.desireForChildren} />
      <InfoField label="Referral Source" value={data.referralSource} />
      <InfoField label="Referrer Name" value={data.referrerName} />
    </div>
  );
}

function MaleReproductiveHormonalSection({ data }) {
  if (!data) return <div className="italic text-gray-400">No data provided.</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
      <div className="md:col-span-2">
        <InfoList label="Symptoms" items={data.symptoms} />
      </div>
      <div className="md:col-span-2">
        <InfoField label="How Long Has The Patient Been Experiencing These Symptoms?" value={data.howLong} />
        <InfoField label="When are symptoms usually present?" value={data.timing} />
        <InfoField label="How does the patient's condition affect their daily life?" value={data.effectOnLife} />
        <InfoList label="Hypogonadism or Steroids Use" items={data.hypogonadismOrSteroidsUse} />
      </div>
    </div>
  );
}

function MenstrualReproductiveHistorySection({ data }) {
  if (!data) return <div className="italic text-gray-400">No data provided.</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
      <div className="md:col-span-2">
        <InfoList label="Menstrual Problems" items={data.menstrualProblems} />
      </div>
      <InfoField label="Age at First Period" value={data.ageAtFirstPeriod} />
      <InfoField label="Cycle Regularity" value={data.cycleRegularity} />
      <InfoField label="Flow Type" value={data.flowType} />
      <InfoField label="Last Menstrual Cycle" value={data.lastMenstrualCycle} />
      <div className="md:col-span-2">
        <InfoField label="Gynecological Surgeries" value={data.surgeries} />
      </div>
      <div className="md:col-span-2 flex justify-between gap-4">
        <BooleanBox label="Hysterectomy" value={!!data.hysterectomy?.had} />
        <BooleanBox label="Ovaries Removed" value={!!data.hysterectomy?.ovariesRemoved} />
        <BooleanBox label="Tubal Ligation" value={!!data.tubalLigation} />
        <InfoField label="Hysterectomy Surgery Date" value={data.hysterectomy?.surgeryDate} />
      </div>
      <BooleanBox label="IUD Use" value={!!data.iudUse?.used} />
      <InfoField label="IUD Duration/Side Effect" value={data.iudUse?.duration} />
      <BooleanBox label="Premenstrual Symptoms" value={!!data.premenstrualSymptoms?.hasSymptoms} />
      <InfoField label="Premenstrual Symptoms Description" value={data.premenstrualSymptoms?.description} />
      <BooleanBox
        label="Currently Using Oral Contraceptives or Have Used Oral Contraceptives"
        value={!!data.oralContraceptives?.used}
      />
      <InfoField label="Oral Contraceptives Last Use Date" value={data.oralContraceptives?.lastUseDate} />
      <InfoField label="Last Pelvic Exam" value={data.lastPelvicExam} />
      <InfoField label="Last Breast Exam" value={data.lastBreastExam} />
      <InfoField label="Total Pregnancies" value={data.pregnancies?.totalPregnancies} />
      <InfoField label="Live Births" value={data.pregnancies?.liveBirths} />
      <InfoField label="Live Children" value={data.pregnancies?.liveChildren} />
      <InfoField label="Miscarriages (Total)" value={data.pregnancies?.miscarriages?.total} />
      <InfoField label="Miscarriages (Gestation Age)" value={data.pregnancies?.miscarriages?.gestationAge} />
    </div>
  );
}

const sectionConfig = (gender) => [
  { id: 'personalInformation', title: 'Personal Information', component: PersonalInformationSection },
  { id: 'symptoms', title: 'Symptoms', component: SymptomsSection },
  { id: 'medicalHistory', title: 'Medical History', component: MedicalHistorySection },
  { id: 'familyHistory', title: 'Family History', component: FamilyHistorySection },
  { id: 'lifestyle', title: 'Lifestyle', component: LifestyleSection },
  ...(gender === 'male'
    ? [
        {
          id: 'maleReproductiveHormonal',
          title: 'Male Reproductive & Hormonal',
          component: MaleReproductiveHormonalSection,
        },
      ]
    : []),
  ...(gender === 'female'
    ? [
        {
          id: 'menstrualReproductiveHistory',
          title: 'Menstrual & Reproductive History',
          component: MenstrualReproductiveHistorySection,
        },
      ]
    : []),
];

export default function MedicalIntakeInfoModal({ isOpen, onClose, gender = 'male', data = {} }) {
  const [currentTab, setCurrentTab] = useState(0);
  if (!isOpen) return null;
  const sections = sectionConfig(gender);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[700px] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Medical Intake Information</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="flex border-b px-6 pt-4 gap-4">
          {sections.map((section, idx) => (
            <button
              key={section.id}
              type="button"
              className={`relative pb-3 px-2 text-base  focus:outline-none transition-colors whitespace-nowrap
                ${idx === currentTab ? 'text-[#5558E4] font-semibold' : 'text-gray-500 hover:text-[#5558E4]'}
              `}
              onClick={() => setCurrentTab(idx)}
              aria-selected={idx === currentTab}
              tabIndex={0}
            >
              {section.title}
              {idx === currentTab && (
                <span className="absolute left-0 right-0 -bottom-1 h-[3px] bg-[#5558E4] rounded-full"></span>
              )}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {(() => {
            const CurrentSectionComponent = sections[currentTab]?.component;
            return CurrentSectionComponent && <CurrentSectionComponent data={data[sections[currentTab].id] || {}} />;
          })()}
        </div>
      </div>
    </div>
  );
}
