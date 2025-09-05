import { BeatLoader } from 'react-spinners';

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(30, 41, 59, 0.5)', // semi-transparent dark overlay
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

/**
 * FullPageLoader - Large loader for page/global loading with overlay
 * @param {boolean} loading
 * @param {number} size - loader size (default 24)
 * @param {string} color - loader color (default #5558E4)
 * @param {React.ReactNode} children - optional content below loader
 */
const FullPageLoader = ({ loading = true, size = 24, color = '#5558E4', children = null }) => {
  if (!loading) return null;
  return (
    <div style={overlayStyle}>
      <div className="flex flex-col items-center gap-4">
        <BeatLoader color={color} loading={loading} size={size} />
        {children && <div className="text-white text-lg font-semibold text-center">{children}</div>}
      </div>
    </div>
  );
};

export default FullPageLoader;
