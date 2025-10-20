'use client';
import { Check } from 'lucide-react';

export default function Checkbox ({ 
  label, 
  checked = false, 
  onChange, 
  disabled = false, 
  id,
  className = '' 
}){
  const handleChange = () => {
    if (!disabled && onChange) {
      console.log(!checked)
      onChange({ target: { checked: !checked } });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleChange();
    }
  };

  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-3 cursor-pointer select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onClick={(e)=>handleChange(e)}
        className={`
          relative w-5 h-5 rounded border-2 flex items-center justify-center
          transition-all duration-200 ease-in-out
          ${
            checked
              ? 'bg-purple-600 border-purple-600'
              : 'bg-gray-800 border-gray-600'
          }
          ${
            !disabled && !checked
              ? 'hover:border-gray-500'
              : ''
          }
          ${
            !disabled && checked
              ? 'hover:bg-purple-700 hover:border-purple-700'
              : ''
          }
          focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-gray-900
        `}
        style={{
          backgroundColor: checked 
            ? 'var(--purple-60, #703BF7)' 
            : 'var(--gray-15, #262626)',
          borderColor: checked 
            ? 'var(--purple-60, #703BF7)' 
            : 'var(--gray-40, #666666)'
        }}
      >
        {checked && (
          <Check 
            size={14} 
            className="text-white animate-scale-in"
            strokeWidth={3}
          />
        )}
      </div>
      {label && (
        <span 
          className="text-sm"
          style={{ color: 'var(--white-99, #FCFCFD)' }}
        >
          {label}
        </span>
      )}
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={() => {}}
        disabled={disabled}
        className="sr-only"
        aria-hidden="true"
      />
    </label>
  );
};