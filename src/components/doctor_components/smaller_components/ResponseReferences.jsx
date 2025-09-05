import { IoMdOpen } from 'react-icons/io';

const ResponseReferences = ({
  message,
  openReferenceId,
  setOpenReferenceId,
  setSelectedPdfUrl,
  setSelectedOriginalUrl,
  setSelectedPdfTitle,
  setDrawerOpen,
}) => {
  if (!Array.isArray(message.references) || message.references.length === 0) {
    return null;
  }
  const handleLog = (ref) => {
    console.log({ ref });
  };
  return (
    <div className="mt-3 mb-2 w-full ">
      <div
        className={`transition-all duration-300 max-w-xl`}
        style={{ borderRadius: '1rem', border: '1px solid #E0E7FF', background: '#fff' }}
      >
        <button
          type="button"
          className="w-full flex items-center justify-between px-4 py-3 font-semibold text-gray-800 tracking-wide text-base transition-colors rounded-xl"
          style={{
            borderRadius: openReferenceId === message.id ? '1rem 1rem 0 0' : '1rem',
          }}
          onClick={() => setOpenReferenceId(openReferenceId === message.id ? null : message.id)}
          aria-expanded={openReferenceId === message.id}
        >
          <span>
            References{' '}
            <span className="ml-1 text-xs text-[#5558E4] font-normal">({Math.min(message.references.length, 5)})</span>
          </span>
          <svg
            className={`w-5 h-5 text-[#5558E4] transform transition-transform duration-200 ${openReferenceId === message.id ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${openReferenceId === message.id ? 'max-h-[700px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'}`}
          style={{
            borderRadius: openReferenceId === message.id ? '0 0 1rem 1rem' : '0 0 1rem 1rem',
            background: '#fff',
          }}
        >
          <ol className="list-decimal pl-6 space-y-2 px-4 pb-4 pt-2">
            {message.references.slice(0, 5).map((ref, idx) => (
              <li key={idx} className="flex items-center group">
                <button
                  type="button"
                  className="flex-1 text-left text-[#5558E4] hover:underline focus:outline-none font-regular truncate"
                  title={ref.title || ref.url}
                  onClick={() => {
                    handleLog(ref);
                    setSelectedPdfUrl(ref.url || ref);
                    setSelectedOriginalUrl(ref.originalUrl);
                    setSelectedPdfTitle(ref.title || ref);
                    setDrawerOpen(true);
                  }}
                >
                  <>
                    <span className="text-black mr-1">{idx + 1}.</span> {ref.title || ref}
                  </>
                </button>
                <button
                  type="button"
                  className="ml-2  text-black opacity-70 group-hover:opacity-100  focus:outline-none"
                  title="Open reference"
                  onClick={() => {
                    setSelectedPdfUrl(ref.url || ref);
                    setSelectedOriginalUrl(ref.originalUrl);
                    setSelectedPdfTitle(ref.title || ref);
                    setDrawerOpen(true);
                  }}
                >
                  <IoMdOpen />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ResponseReferences;
