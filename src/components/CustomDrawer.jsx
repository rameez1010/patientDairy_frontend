import { IoCloseOutline } from 'react-icons/io5';

const CustomDrawer = ({ visible, onClose, width = 500, children, header }) => {
  return (
    <div className={`fixed top-0 left-0 right-0 bottom-0 z-50 ${visible ? 'block' : 'hidden'}`}>
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 ${visible ? 'block' : 'hidden'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-0 bg-white shadow-lg transition-all duration-300 ${visible ? '' : 'w-0'}`}
        style={{
          width: visible ? width : 0,
          maxWidth: '100vw',
          ...(visible && {
            width: `min(${width}px, 100vw)`,
            ['@media (max-width: 768px)']: { width: '400px' },
          }),
        }}
      >
        <div className="h-full flex flex-col">
          {header && (
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div>{header}</div>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                <IoCloseOutline className="h-5 w-5" />
              </button>
            </div>
          )}
          <div className="flex-1 h-full overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomDrawer;
