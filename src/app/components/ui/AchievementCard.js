import { AchievementIcons } from "@/lib/constants";
import { formatDate } from "@/utils/date";
import { Trophy, CheckCircle2, Star, Lock } from "lucide-react";

const rarityConfig = {
  common: {
    gradient: 'from-gray-30 to-gray-40',
    glow: 'shadow-gray-500/20',
    border: 'border-gray-40',
    text: 'text-gray-50',
    iconBg: 'bg-gray-30',
    badgeBg: 'bg-gray-500/20',
    badgeText: 'text-gray-300'
  },
  rare: {
    gradient: 'from-blue-600 to-blue-700',
    glow: 'shadow-blue-300/30 shadow-lg',
    border: 'border-blue-300',
    text: 'text-blue-300',
    iconBg: 'bg-gradient-to-br from-blue-300 to-blue-600',
    badgeBg: 'bg-blue-300/20',
    badgeText: 'text-blue-300'
  },
  epic: {
    gradient: 'from-purple-600 to-pink-600',
    glow: 'shadow-purple-500/40 shadow-xl',
    border: 'border-purple-500',
    text: 'text-purple-400',
    iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-300'
  },
  legendary: {
    gradient: 'from-yellow-500 via-orange-500 to-red-500',
    glow: 'shadow-yellow-500/50 shadow-2xl',
    border: 'border-yellow-500',
    text: 'text-yellow-400',
    iconBg: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500',
    badgeBg: 'bg-yellow-500/20',
    badgeText: 'text-yellow-200'
  }
};

export default function AchievementCard({ achievement, unlocked = false, unlockedAt, progress = 0 }) {
  const Icon = AchievementIcons[achievement.icon] || Trophy;
  const rarity = achievement.rarity || 'common';
  const config = rarityConfig[rarity];

  return (
    <div
      className={`
        relative p-5 rounded-xl border-2 transition-all duration-500 overflow-hidden
        ${unlocked 
          ? `bg-gradient-to-br ${config.gradient} ${config.border} ${config.glow} scale-100` 
          : 'bg-gray-15 border-gray-30 opacity-70 grayscale hover:grayscale-0'
        }
        hover:scale-105 cursor-pointer group
      `}
    >
      {/* Animated background effect for unlocked */}
      {unlocked && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
        </div>
      )}

      {/* Rarity badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className={`
          text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide
          ${unlocked ? config.badgeBg + ' ' + config.badgeText : 'bg-gray-30 text-gray-60'}
          ${rarity === 'legendary' ? 'animate-pulse' : ''}
        `}>
          {rarity}
        </span>
      </div>

      {/* Unlock status indicator */}
      {unlocked && (
        <div className="absolute top-3 left-3 z-10">
          <div className="relative">
            <CheckCircle2 className={`w-6 h-6 ${config.text} drop-shadow-lg`} />
            <div className="absolute inset-0 blur-md bg-current opacity-50" />
          </div>
        </div>
      )}

      {/* Icon container */}
      <div className="flex justify-center mb-4">
        <div className={`
          relative w-20 h-20 rounded-2xl flex items-center justify-center
          ${unlocked 
            ? `${config.iconBg} shadow-lg transform rotate-3 group-hover:rotate-6 transition-transform` 
            : 'bg-gray-30'
          }
        `}>
          {!unlocked ? (
            <Lock className="w-10 h-10 text-gray-50" />
          ) : (
            <>
              <Icon className="w-10 h-10 text-white drop-shadow-md relative z-10" />
              {rarity === 'legendary' && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400 to-red-500 animate-pulse opacity-30" />
              )}
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 relative z-10">
        <div className="text-center">
          <h3 className={`font-bold text-lg mb-1
            ${unlocked ? 'text-white' : 'text-gray-50'}
          `}>
            {achievement.name}
          </h3>
          <p className={`text-sm leading-relaxed
            ${unlocked ? 'text-white/80' : 'text-gray-60'}
          `}>
            {achievement.description}
          </p>
        </div>

        {/* Progress bar for locked achievements */}
        {!unlocked && progress > 0 && (
          <div className="space-y-1 mt-3">
            <div className="flex justify-between text-xs text-gray-60">
              <span className="font-medium">Progress</span>
              <span className="font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-30 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${config.gradient} transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Divider */}
        <div className={`h-px w-full
          ${unlocked ? 'bg-white/20' : 'bg-gray-30'}
        `} />

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Points */}
          <div className="flex items-center gap-2">
            <Star className={`w-4 h-4 ${unlocked ? config.text : 'text-gray-60'}`} />
            <span className={`
              text-sm font-bold
              ${unlocked ? 'text-white' : 'text-gray-60'}
            `}>
              {achievement.points} pts
            </span>
          </div>

          {/* Unlocked date */}
          {unlocked && unlockedAt && (
            <div className="text-xs text-white/60">
              {formatDate(unlockedAt, {
                month: 'short',
                day: 'numeric'
              })}
            </div>
          )}

          {/* Category badge for locked */}
          {!unlocked && achievement.category && (
            <span className="text-xs px-2 py-1 bg-gray-30 text-gray-60 rounded-md capitalize">
              {achievement.category}
            </span>
          )}
        </div>
      </div>

      {/* Shine effect on hover for unlocked */}
      {unlocked && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      )}
    </div>
  );
}