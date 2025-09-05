import { FaCheck } from 'react-icons/fa';

export default function BooleanBox({ label, value }) {
  return (
    <div className="mb-4">
      <div className="text-xs font-semibold text-gray-500 mb-1">{label}</div>
      <div className="flex gap-3">
        {[true, false].map((v) => (
          <div
            key={v ? 'yes' : 'no'}
            className={`flex items-center justify-center w-20 h-10 rounded border shadow-sm font-mono text-sm transition-all
                  ${value === v ? 'bg-white border-[#5558E4] border-2 text-[#5558E4] font-bold' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
          >
            {v ? 'Yes' : 'No'}
            {value === v && <FaCheck className="ml-2 text-[#5558E4] text-xs" />}
          </div>
        ))}
      </div>
    </div>
  );
}
