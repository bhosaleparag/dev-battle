export default function Chip({ label }) {

  return (
    <span
      className={`px-3 py-1 text-sm font-semibold rounded-full bg-gray-30 text-white}`}
    >
      {label}
    </span>
  );
}
