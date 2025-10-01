export default function StatCard({ icon, label, value, color, bgColor }) {
  return (
    <div className="bg-gray-10 rounded-xl border border-gray-15 p-4 md:p-6 hover:border-gray-20 transition-colors">
      <div className={`w-10 h-10 md:w-12 md:h-12 ${bgColor} rounded-xl flex items-center justify-center mb-3 ${color}`}>
        {icon}
      </div>
      <div className="text-2xl md:text-3xl font-bold text-white-99 mb-1">
        {value}
      </div>
      <div className="text-xs md:text-sm text-gray-50">
        {label}
      </div>
    </div>
  );
}