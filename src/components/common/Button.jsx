import React from 'react';

import Spinner from '../Spinner';

/**
 * Reusable Button component supporting:
 * - loading: shows loader instead of children
 * - children: button content
 * - variant: 'solid', 'gradient', etc.
 * - background: custom bg classes (overrides variant)
 * - disabled: disables the button
 * - className: additional classes
 * - style: inline style
 * - loader: custom loader component (defaults to 'Loading...')
 * - ...rest: all other button props
 */
const VARIANT_CLASSES = {
  solid: 'bg-[#5558E4] text-white hover:bg-[#4345b8]',
  gradient: 'bg-gradient-to-r from-[#00b4d8] to-[#5558E4] text-white',
  outline: 'border border-[#5558E4] text-[#5558E4] bg-white hover:bg-[#f0f3ff]',
  custom: '',
};

const Button = React.forwardRef(
  (
    {
      children,
      loading = false,
      width = '',
      disabled = false,
      variant = 'solid',
      background = '',
      className = '',
      style = {},
      type = 'button',
      loaderColor = '#ffffff',
      ...rest
    },
    ref,
  ) => {
    // className is applied last so its Tailwind classes can overwrite base/variant styles
    const base =
      'flex items-center justify-center gap-2 rounded px-3 py-1.5 text-sm font-semibold shadow-md transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed';
    const variantClass = background ? background : VARIANT_CLASSES[variant] || '';
    return (
      <button
        ref={ref}
        type={type}
        className={`${base} ${variantClass} ${width} ${className}`.trim()}
        style={style}
        disabled={disabled || loading}
        {...rest}
      >
        {loading ? <Spinner color={loaderColor} loading={loading} /> : children}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
