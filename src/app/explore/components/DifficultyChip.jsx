export default function DifficultyChip ({ level }){
  const colors = {
    easy: 'bg-green-900/30 text-green-400 border-green-800/50',
    medium: 'bg-yellow-900/30 text-yellow-400 border-yellow-800/50',
    hard: 'bg-red-900/30 text-red-400 border-red-800/50',
  };
  
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${colors[level?.toLowerCase()] || colors.medium}`}>
      {level?.charAt(0).toUpperCase() + level?.slice(1)}
    </span>
  );
};
