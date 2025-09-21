export default function Skeleton({ className = '', ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={`skeleton ${className}`}
      {...props}
    />
  );
}
