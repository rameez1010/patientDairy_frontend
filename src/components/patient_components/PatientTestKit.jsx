import React from 'react';

import { IoMdCloseCircle } from 'react-icons/io';

const PatientTestKit = ({ handleClose }) => {
  return (
    <div className="z-10">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <div className="h-full bg-white w-1/3 absolute top-0 right-0 shadow flex flex-col justify-between">
        <div>
          <div className="flex bg-gradient-to-r from-blue-700 to-blue-400 text-white p-4 items-center justify-between">
            <h1 className="text-base font-semibold leading-6">Order BIOKRYSTAL Complete Health Kit</h1>
            <span className="cursor-pointer" onClick={handleClose}>
              <IoMdCloseCircle size={26} className="hover:text-gray-200" />
            </span>
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-4">Summary</div>
            <p className="text-gray-500 mb-4 text-sm font-light">
              DNA holds the blueprint of health—revealing genetic predispositions and highlighting potential risks
              before they arise. The BIOKRYSTAL DNA Test analyzes key genes to deliver clinically relevant insights that
              support physicians in making informed decisions about patient care.
            </p>
            <p className="text-gray-500 mb-4 text-sm font-light">
              Through advanced DNA-based risk profiling, BIOKRYSTAL enables the early detection of underlying concerns
              such as inflammation and metabolic drift, providing healthcare professionals with actionable data to guide
              proactive interventions.
            </p>
            <h1 className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-4">How It Works</h1>
            <p className="text-gray-500 mb-4 text-sm font-light">
              The process is simple, efficient, and completely non-invasive:
            </p>
            <ul className="font-light text-sm text-gray-500 space-y-3">
              <li className="list-decimal">
                Collect the Sample – Using the provided swab, gently collect a sample from the inside of the patient’s
                cheek. No needles or discomfort involved.
              </li>
              <li className="list-decimal">
                Send to Laboratory – Secure the swab in the container and return it to our accredited laboratory using
                the prepaid packaging.
              </li>
              <li className="list-decimal">
                Receive Results – Within approximately 4 weeks of receipt, BIOKRYSTAL provides physicians with a clear,
                easy-to-understand report that includes full interpretation and actionable insights. This allows
                physicians to confidently share results with their patients and guide them with evidence-based
                recommendations—without needing to perform their own genetic analysis.
              </li>
            </ul>
            <div className="mt-10 text-center">
              <a
                href="https://buy.stripe.com/dRmeVdaAE4cJfUJb0qaIM00" target="_blank"
                className="text-sm bg-gradient-to-r from-blue-700 to-blue-400 hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-700 text-white px-4 py-2 rounded"
              >
                Click to place an order
              </a>
            </div>
            <div className="text-center mt-5 text-sm font-light text-gray-600">
              You will be directed to the payment page
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientTestKit;
