export default function Badge({ children, variant = "default" }) {
  const styles = {
    default: "bg-[var(--gray-15)] text-white",
    success: "bg-green-600 text-white",
    warning: "bg-yellow-500 text-black",
    danger: "bg-red-600 text-white",
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[variant]}`}>
      {children}
    </span>
  );
}
