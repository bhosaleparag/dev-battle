export default function DashboardCard({ title, icon, children }) {
  return (
    <div className="relative bg-gradient-to-br from-gray-08 to-gray-10 border border-gray-15 rounded-xl p-4 sm:p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-purple-75">{icon}</div>
        <h2 className="text-lg sm:text-xl font-bold text-white-99">{title}</h2>
      </div>
      {children}
    </div>
  );
}