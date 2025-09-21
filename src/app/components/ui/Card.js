export default function Card({ children, className = "" }) {
  return (
    <div className={`rounded-md border border-gray-15 p-4 shadow-md ${className}`}>
      {children}
    </div>
  );
}
