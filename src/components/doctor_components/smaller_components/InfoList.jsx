export default function InfoList({ label, items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const colorStyles = ['bg-[#BF7BD3] text-white', 'bg-[#73CEF8] text-white', 'bg-[#FFB224] text-white'];
  return (
    <div className="mb-4">
      <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <span
            key={idx}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-semibold ${colorStyles[idx % colorStyles.length]}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
