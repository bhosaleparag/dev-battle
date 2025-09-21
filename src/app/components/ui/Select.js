"use client";

import { ChevronDown } from "lucide-react";
import React from "react";

const Select = ({
  label,
  options,
  className = "",
  ...props
}) => {
  return (
    <div className="relative w-full">
      {label && (
        <label className="block mb-1 text-sm text-gray-400">{label}</label>
      )}

      <select
        {...props}
        className={`
          w-full px-3 py-2 rounded-md border border-gray-15
          bg-transparent text-white placeholder-gray-60
          focus:outline-none appearance-none
          ${className}
        `}
      >
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-gray-15 text-white">
            {opt.label}
          </option>
        ))}
      </select>

      {/* Custom dropdown icon */}
      <ChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
        size={18}
      />
    </div>
  );
};

export default Select;
