import { useState, useRef, useEffect } from 'react';

function CustomSelect({ options, value, onChange, placeholder = 'Select...', error }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
          error ? 'border-danger' : 'border-border'
        } ${value ? 'text-text-primary' : 'text-text-secondary'} bg-surface`}
      >
        <span className="truncate">{selectedLabel}</span>
        <svg
          className={`ml-2 h-4 w-4 flex-shrink-0 text-text-secondary transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 20 20"
        >
          <path stroke="currentColor" strokeWidth="1.5" d="M6 8l4 4 4-4" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-border bg-surface py-1 text-sm shadow-soft">
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left transition hover:bg-background ${
                  opt.value === value ? 'bg-primary/10 font-medium text-primary' : 'text-text-primary'
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomSelect;