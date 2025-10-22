export default function StepCard({ number, title, description }) {
  return (
    <div className="group relative bg-gradient-to-br from-gray-08 to-gray-10 border border-gray-15 rounded-2xl p-6 sm:p-8 hover:border-purple-60/30 transition-all duration-300 overflow-hidden cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-60/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-60 group-hover:bg-purple-65 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto mb-4 sm:mb-6 transition-colors duration-300">
          {number}
        </div>
        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white-99 group-hover:text-purple-75 transition-colors duration-300 leading-tight">{title}</h3>
        <p className="text-sm sm:text-base text-gray-60 flex-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}