import { useState, forwardRef } from 'react';

const PasswordInput = forwardRef(function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false);
  const { className, ...rest } = props;

  return (
    <div className="relative">
      <input
        ref={ref}
        type={visible ? 'text' : 'password'}
        {...rest}
        className={`w-full rounded-lg border border-border px-3 py-2 pr-10 text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${className || ''}`}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-text-secondary hover:text-text-primary"
        tabIndex={-1}
      >
        {visible ? 'Hide' : 'Show'}
      </button>
    </div>
  );
});

export default PasswordInput;