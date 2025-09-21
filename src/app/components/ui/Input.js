"use client";

export default function Input({
  label,
  className = "",
  startIcon: StartIcon, // Rename props to startIcon and endIcon
  endIcon: EndIcon,
  ...props
}) {
  const iconClasses = "absolute top-1/2 -translate-y-1/2";
  const inputPaddingClasses = {
    start: StartIcon ? "pl-10" : "pl-3",
    end: EndIcon ? "pr-10" : "pr-3",
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-white-90">{label}</label>}
      <div className="relative">
        {StartIcon && (
          <div className={`left-3 text-gray-60 ${iconClasses}`}>
            {StartIcon}
          </div>
        )}
        <input
          {...props}
          className={` 
            w-full px-3 py-2 rounded-md border border-gray-15
            bg-transparent text-white placeholder-gray-60 focus:outline-none focus:border-purple-60
            ${inputPaddingClasses.start}
            ${inputPaddingClasses.end}
            ${className}
          `}
        />
        {EndIcon && (
          <div className={`right-3 text-gray-60 flex ${iconClasses}`}>
            {EndIcon}
          </div>
        )}
      </div>
    </div>
  );
}