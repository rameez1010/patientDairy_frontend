import { MdBloodtype } from 'react-icons/md';

const Measure = ({ onClose }) => {
  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                  <MdBloodtype size={20} className="text-purple-600" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-base font-semibold leading-6 text-purple-700" id="modal-title">
                    Total Cholesterol
                  </h3>
                  <div className="my-10 grid grid-cols-3">
                    <div className="bg-[#399FAD] h-5 col-span-1 w-32 rounded-l-full"></div>
                    <div className="bg-[#8ecae6] h-5 col-span-1"></div>
                    <div className="bg-[#ff9f1c] h-5 col-span-1 rounded-r-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                onClick={onClose}
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded bg-white px-3 py-1 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Measure;
