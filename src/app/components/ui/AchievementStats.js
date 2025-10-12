import { Trophy, Star, TrendingUp } from "lucide-react";

export default function AchievementStats({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-gray-15 p-4 rounded-xl border border-gray-20">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-purple-60" />
          <span className="text-sm text-gray-60">Unlocked</span>
        </div>
        <p className="text-2xl font-bold text-white-99">
          {stats.unlocked}/{stats.total}
        </p>
      </div>

      <div className="bg-gray-15 p-4 rounded-xl border border-gray-20">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-5 h-5 text-purple-60" />
          <span className="text-sm text-gray-60">Total Points</span>
        </div>
        <p className="text-2xl font-bold text-white-99">{stats.totalPoints}</p>
      </div>

      <div className="bg-gray-15 p-4 rounded-xl border border-gray-20">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-purple-60" />
          <span className="text-sm text-gray-60">Completion</span>
        </div>
        <p className="text-2xl font-bold text-white-99">
          {Math.round((stats.unlocked / stats.total) * 100)}%
        </p>
      </div>
    </div>
  );
}