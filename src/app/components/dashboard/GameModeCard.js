import { CheckCircle2 } from "lucide-react";

export default function GameModeCard({ icon, title, description, features }) {
  return (
    <div className="group relative bg-gradient-to-br from-gray-08 to-gray-10 border border-gray-15 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-purple-60/30 cursor-pointer overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-60/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6 sm:p-8 group-hover:scale-[1.01] transition-transform duration-300">
        <div className="text-purple-75 group-hover:text-purple-70 transition-colors duration-300 mb-4">
          {icon}
        </div>
        
        <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-white-99 group-hover:text-purple-75 transition-colors duration-300">{title}</h3>
        <p className="text-base text-gray-60 mb-6 leading-relaxed">{description}</p>
        
        <div className="space-y-2 pt-4 border-t border-gray-15">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-60" />
              <span className="text-sm text-white-90">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}