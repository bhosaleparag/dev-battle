"use client";


import { ChevronDown } from "lucide-react";
import { useState } from "react";

const Select = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  error = "",
  className = "",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedValue) => {
    onChange?.(selectedValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full">
      {/* Label */}
      {label && (
        <label className="block mb-2 text-sm font-medium text-white-90">
          {label}
        </label>
      )}

      {/* Select Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-lg border transition-all duration-200
          flex items-center justify-between text-left
          ${disabled 
            ? 'bg-gray-15 border-gray-20 text-gray-50 cursor-not-allowed' 
            : 'bg-gray-10 border-gray-15 text-white-99 hover:border-gray-20 focus:border-purple-60'
          }
          ${error ? 'border-red-500' : ''}
          ${isOpen ? 'border-purple-60' : ''}
          ${className}
        `}
        {...props}
      >
        <span className={selectedOption ? 'text-white-99' : 'text-gray-50'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        <ChevronDown 
          className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${disabled ? 'text-gray-50' : 'text-gray-40'}`}
        />
      </button>

      {/* Dropdown Options */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-gray-10 border border-gray-15 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <button
              key={option.value || index}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`
                w-full px-4 py-3 text-left transition-colors duration-150
                hover:bg-gray-15 focus:bg-gray-15 focus:outline-none
                ${value === option.value 
                  ? 'bg-purple-60 text-white' 
                  : 'text-white-90 hover:text-white-99'
                }
                ${index === 0 ? 'rounded-t-lg' : ''}
                ${index === options.length - 1 ? 'rounded-b-lg' : ''}
              `}
            >
              {option.label}
            </button>
          ))}
          
          {options.length === 0 && (
            <div className="px-4 py-3 text-gray-50 text-center">
              No options available
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default Select;
