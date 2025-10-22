import { Trophy, Star, TrendingUp, Target, Zap, Lock } from 'lucide-react';

export default function AchievementStats({ stats }) {
  // Get rarity stats for display
  const rarityOrder = ['common', 'rare', 'epic', 'legendary'];
  const rarityColors = {
    common: 'text-gray-50',
    rare: 'text-blue-400',
    epic: 'text-purple-60',
    legendary: 'text-yellow-400'
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-15 p-4 rounded-xl border border-gray-20 hover:border-purple-60/30 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-purple-60" />
            <span className="text-sm text-gray-60">Unlocked</span>
          </div>
          <p className="text-2xl font-bold text-white-99">
            {stats.unlocked}<span className="text-gray-60 text-lg">/{stats.total}</span>
          </p>
        </div>

        <div className="bg-gray-15 p-4 rounded-xl border border-gray-20 hover:border-purple-60/30 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-purple-60" />
            <span className="text-sm text-gray-60">Total Points</span>
          </div>
          <p className="text-2xl font-bold text-white-99">{stats.totalPoints.toLocaleString()}</p>
        </div>

        <div className="bg-gray-15 p-4 rounded-xl border border-gray-20 hover:border-purple-60/30 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-60" />
            <span className="text-sm text-gray-60">Completion</span>
          </div>
          <p className="text-2xl font-bold text-white-99">{stats.percentage}%</p>
        </div>

        <div className="bg-gray-15 p-4 rounded-xl border border-gray-20 hover:border-purple-60/30 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-gray-60" />
            <span className="text-sm text-gray-60">Locked</span>
          </div>
          <p className="text-2xl font-bold text-white-99">{stats.locked}</p>
        </div>
      </div>
      
      {/* Rarity Breakdown */}
      {Object.keys(stats.byRarity).length > 0 && (
        <div className="bg-gray-15 p-6 rounded-xl border border-gray-20">
          <h3 className="text-lg font-bold text-white-99 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-60" />
            By Rarity
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rarityOrder
              .filter(rarity => stats.byRarity[rarity])
              .map((rarity) => {
                const data = stats.byRarity[rarity];
                return (
                  <div key={rarity} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold capitalize ${rarityColors[rarity]}`}>
                        {rarity}
                      </span>
                      <span className="text-xs text-gray-50 font-medium">
                        {data.unlocked}/{data.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-20 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          rarity === 'common' ? 'bg-gray-50' :
                          rarity === 'rare' ? 'bg-blue-400' :
                          rarity === 'epic' ? 'bg-purple-60' :
                          'bg-yellow-400'
                        }`}
                        style={{ width: `${(data.unlocked / data.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-60">
                      {Math.round((data.unlocked / data.total) * 100)}%
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}