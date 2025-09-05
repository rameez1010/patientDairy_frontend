export default function InfoField({ label, value }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="mb-4">
      <div className="text-xs font-semibold text-gray-500 mb-1">{label}</div>
      <div className="bg-white border border-gray-200 border-l-4 border-l-[#5558E4] shadow-sm px-4 py-2 rounded text-gray-800 font-mono text-sm whitespace-pre-line">
        {Array.isArray(value) ? value.join(', ') : String(value)}
      </div>
    </div>
  );
}
