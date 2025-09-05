import { IoWarningOutline } from 'react-icons/io5';

import Button from '../common/Button';

const DeleteModal = ({
  onClose,
  onConfirm,
  title = 'Delete patient',
  message = 'Are you sure you want to delete this patient account? All of their data will be permanently removed. This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  loading = false,
  iconColor = 'purple',
  confirmButtonColor = 'red',
}) => {
  return (
    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div
                  className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-${iconColor}-100 sm:mx-0 sm:h-10 sm:w-10`}
                >
                  <IoWarningOutline size={20} className={`text-${iconColor}-600`} />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className={`text-base font-semibold leading-6 text-${iconColor}-700`} id="modal-title">
                    {title}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{message}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`bg-${iconColor}-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6`}>
              <Button
                onClick={onConfirm}
                type="button"
                variant="custom"
                loading={loading}
                className={`inline-flex w-full justify-center rounded bg-${confirmButtonColor}-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-${confirmButtonColor}-500 sm:ml-3 sm:w-auto`}
              >
                {confirmText}
              </Button>
              <Button
                onClick={onClose}
                type="button"
                variant="custom"
                className="mt-3 inline-flex w-full justify-center rounded bg-white px-3 py-1 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                {cancelText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
