import { BeatLoader } from 'react-spinners';

/**
 * LoaderOverlay - Loader that covers only its parent container (full width/height of parent)
 * @param {boolean} loading
 * @param {number} size - loader size (default 24)
 * @param {string} color - loader color (default #5558E4)
 * @param {React.ReactNode} children - optional content below loader
 * @param {string} className - additional classes for overlay
 */
const LoaderOverlay = ({
  loading = true,
  size = 24,
  color = '#5558E4',
  children = null,
  className = '',
  style = {},
  textSize = 'text-base',
}) => {
  if (!loading) return null;
  return (
    <div className={`flex flex-col items-center justify-center ${className}`} style={style}>
      <BeatLoader color={color} loading={loading} size={size} />
      {children && <div className={`text-[#5558E4] ${textSize} font-semibold mt-3 text-center`}>{children}</div>}
    </div>
  );
};

export default LoaderOverlay;
