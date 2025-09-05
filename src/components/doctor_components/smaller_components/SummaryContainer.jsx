import { marked } from 'marked';
import { FaFileAlt } from 'react-icons/fa';

const SummaryContainer = ({ summary, title }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="relative flex flex-col bg-gradient-to-br from-[#f5f7ff] to-[#eef2fb] rounded-xl shadow-md p-6 border border-[#E0E7FF] overflow-y-auto max-h-[80vh]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <FaFileAlt className="text-[#5558E4] h-6 w-6" />
            <a
              // href={originalUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#5558E4] hover:underline text-base truncate"
              title={title}
            >
              {title}
            </a>
          </div>
        </div>
        {/* Markdown Summary */}
        <div className="prose prose-sm max-w-none text-gray-800 leading-normal whitespace-break-spaces overflow-y-auto prose-headings:mt-6">
          <span dangerouslySetInnerHTML={{ __html: marked(summary) }} />
        </div>
      </div>
    </div>
  );
};

export default SummaryContainer;
