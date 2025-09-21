"use client";

export default function Button({ children, variant = "filled", className = "", ...props }) {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors duration-200";
  const filled =
    "bg-purple-60 text-white border-none hover:bg-purple-60/80";
  const outlined =
    "bg-transparent text-white border border-gray-15 hover:bg-gray-15/60";
  const text = 
    "bg-gray-800 text-white hover:bg-gray-800/60";

  const variantStyles = variant === "outlined" ? outlined : variant === "text" ? text : filled;

  return (
    <button
      {...props}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
}
