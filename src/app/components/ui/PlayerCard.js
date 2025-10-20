import { Crown, Medal, Trophy } from "lucide-react";

// Get position badge
const getPositionBadge = (index) => {
  if (index === 0) return { icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
  if (index === 1) return { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-400/10' };
  if (index === 2) return { icon: Medal, color: 'text-orange-400', bg: 'bg-orange-400/10' };
  return null;
};

export default function PlayerCard({ player, isCurrentUser, position, compact = false }){
    const positionBadge = getPositionBadge(position);
    
    return (
      <div className={`flex items-center gap-2 ${compact ? 'gap-1.5' : 'gap-3'} bg-gray-15 border ${
        isCurrentUser ? 'border-purple-60' : 'border-gray-20'
      } rounded-lg ${compact ? 'px-2 py-1.5' : 'px-3 py-2'} ${compact ? 'min-w-[140px]' : 'min-w-[160px]'} flex-shrink-0`}>
        <div className="relative">
          <div className={`${compact ? 'w-7 h-7' : 'w-10 h-10'} rounded-full ${
            isCurrentUser 
              ? 'bg-gradient-to-br from-purple-60 to-purple-75' 
              : 'bg-gradient-to-br from-gray-30 to-gray-40'
          } flex items-center justify-center text-white font-bold ${compact ? 'text-xs' : 'text-sm'}`}>
            {player?.username?.[0]?.toUpperCase() || 'P'}
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 ${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} ${
            player?.online ? 'bg-green-400' : 'bg-gray-50'
          } rounded-full border-2 border-gray-10`} />
          {positionBadge && (
            <div className={`absolute -top-1 -right-1 ${positionBadge.bg} rounded-full p-0.5`}>
              <positionBadge.icon className={`${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} ${positionBadge.color}`} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`${isCurrentUser ? 'text-white' : 'text-white-90'} font-semibold ${compact ? 'text-xs' : 'text-sm'} truncate`}>
            {player?.username || 'Player'}
          </p>
          <div className="flex items-center gap-1">
            <Trophy className={`${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} ${isCurrentUser ? 'text-purple-60' : 'text-gray-50'}`} />
            <span className={`${isCurrentUser ? 'text-purple-60' : 'text-white'} font-bold ${compact ? 'text-xs' : 'text-sm'}`}>
              {player?.score || 0}
            </span>
          </div>
        </div>
      </div>
    );
  };