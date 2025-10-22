export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="group relative bg-gradient-to-br from-gray-08 to-gray-10 border border-gray-15 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-purple-60/30 max-h-[240px] cursor-pointer overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-60/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6 flex flex-col h-full group-hover:scale-[1.02] transition-transform duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="text-purple-75 group-hover:text-purple-70 transition-colors duration-300">{icon}</div>
        </div>
        
        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white-99 group-hover:text-purple-75 transition-colors duration-300">{title}</h3>
        <p className="text-sm sm:text-base text-gray-60 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}