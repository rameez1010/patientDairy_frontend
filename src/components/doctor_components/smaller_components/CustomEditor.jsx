import { IoSend } from 'react-icons/io5';

const CustomEditor = ({ inputValue, setInputValue, loading, width, handleSend }) => {
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !loading) {
        e.target.form.requestSubmit();
      }
    }
  };
  return (
    <form className={`flex ${width} items-center gap-2 p-3`} onSubmit={handleSend}>
      <div className={width}>
        <div className="relative bg-white border border-gray-300 rounded-xl shadow-lg p-1">
          <textarea
            className="w-full px-4 py-3 bg-transparent resize-none outline-none text-gray-700 placeholder-gray-400 max-h-[200px] overflow-y-auto"
            placeholder="Ask your question here..."
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ minHeight: '24px', lineHeight: '24px' }}
            onInput={(e) => {
              e.target.style.height = '24px';
              e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
            }}
            disabled={loading}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition-colors disabled:opacity-50"
            disabled={!inputValue.trim() || loading}
          >
            <IoSend />
          </button>
        </div>
      </div>
    </form>
  );
};

export default CustomEditor;
