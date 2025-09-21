// ToggleSwitch.jsx
'use client';

export default function ToggleSwitch({ checked, onChange, id = 'toggle', className = '' }) {
  return (
    <label
      htmlFor={id}
      className={`relative inline-flex h-6 w-11 cursor-pointer items-center ${className}`}
    >
      {/* Visually–hidden checkbox drives the state */}
      <input
        id={id}
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />

      {/* Track */}
      <span
        className="absolute inset-0 rounded-full transition-colors peer-checked:bg-blue-500 peer-not-checked:bg-gray-800"
      />

      {/* Thumb */}
      <span
        className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5 peer-not-checked:translate-x-0"
      />
    </label>
  );
}
