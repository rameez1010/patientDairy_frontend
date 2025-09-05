import { FaExclamationTriangle } from 'react-icons/fa';

const ValidationErrorDisplay = ({ error, width = '' }) => {
  if (!error) return null;

  return (
    <div className={`mt-1 p-2 bg-red-50 border border-red-200 rounded-md ${width}`}>
      <div className="flex items-center space-x-2">
        <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" size={14} />
        <div className="flex-1">
          <p className="text-sm text-red-700 font-semibold">{error.message}</p>
        </div>
      </div>
    </div>
  );
};

export default ValidationErrorDisplay;
