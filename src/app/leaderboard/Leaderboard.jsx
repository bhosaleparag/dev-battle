import { Trophy, Medal, Award, User, TrendingUp, Crown } from 'lucide-react';

// Mock data - replace with your actual data fetching
const mockLeaderboardData = [
  { id: 1, name: "Alex Johnson", score: 2580, rank: 1, avatar: null, change: "+5" },
  { id: 2, name: "Sarah Chen", score: 2440, rank: 2, avatar: null, change: "-1" },
  { id: 3, name: "Mike Rodriguez", score: 2380, rank: 3, avatar: null, change: "+2" },
  { id: 4, name: "Emma Wilson", score: 2320, rank: 4, avatar: null, change: "+1" },
  { id: 5, name: "David Kim", score: 2280, rank: 5, avatar: null, change: "-2" },
  { id: 6, name: "Lisa Brown", score: 2240, rank: 6, avatar: null, change: "0" },
  { id: 7, name: "James Taylor", score: 2180, rank: 7, avatar: null, change: "+3" },
  { id: 8, name: "Maria Garcia", score: 2120, rank: 8, avatar: null, change: "-1" },
  { id: 9, name: "Tom Anderson", score: 2080, rank: 9, avatar: null, change: "+1" },
  { id: 10, name: "Anna Lee", score: 2040, rank: 10, avatar: null, change: "-1" },
];

// Server Component for individual leaderboard entry
function LeaderboardEntry({ player, index }) {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-gray-40 font-bold text-sm w-5 text-center">{rank}</span>;
    }
  };

  const getChangeColor = (change) => {
    if (change.startsWith('+')) return 'text-green-400';
    if (change.startsWith('-')) return 'text-red-400';
    return 'text-gray-50';
  };

  const getChangeIcon = (change) => {
    if (change.startsWith('+')) return '↗';
    if (change.startsWith('-')) return '↘';
    return '−';
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-10 border border-gray-15 hover:border-gray-20 transition-colors">
      {/* Rank */}
      <div className="flex items-center justify-center w-8 h-8">
        {getRankIcon(player.rank)}
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gray-15 flex items-center justify-center border border-gray-20">
        <User className="w-5 h-5 text-gray-40" />
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium truncate">{player.name}</h3>
        <p className="text-gray-40 text-sm">Rank #{player.rank}</p>
      </div>

      {/* Score */}
      <div className="text-right">
        <div className="text-white font-semibold">{player.score.toLocaleString()}</div>
        <div className={`text-xs flex items-center gap-1 justify-end ${getChangeColor(player.change)}`}>
          <span>{getChangeIcon(player.change)}</span>
          <span>{player.change.replace(/[+-]/, '')}</span>
        </div>
      </div>
    </div>
  );
}

// Server Component for leaderboard header
function LeaderboardHeader({ title = "Leaderboard", subtitle = "Top performers this week" }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 rounded-lg bg-purple-60/10 border border-purple-60/20">
        <Trophy className="w-6 h-6 text-purple-60" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-gray-40 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

// Server Component for top 3 podium
function TopThreePodium({ topThree }) {
  return (
    <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-gray-10 to-gray-15 border border-gray-20">
      <div className="flex items-end justify-center gap-4 mb-4">
        {/* 2nd Place */}
        <div className="text-center flex-1">
          <div className="w-16 h-16 rounded-full bg-gray-15 flex items-center justify-center border-2 border-gray-300 mx-auto mb-2">
            <User className="w-6 h-6 text-gray-40" />
          </div>
          <div className="bg-gray-300/10 rounded-lg p-3 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Medal className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-white font-medium text-sm truncate">{topThree[1]?.name}</p>
            <p className="text-gray-40 text-xs">{topThree[1]?.score.toLocaleString()}</p>
          </div>
        </div>

        {/* 1st Place */}
        <div className="text-center flex-1">
          <div className="w-20 h-20 rounded-full bg-gray-15 flex items-center justify-center border-3 border-yellow-400 mx-auto mb-2">
            <User className="w-8 h-8 text-gray-40" />
          </div>
          <div className="bg-yellow-400/10 rounded-lg p-4 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Crown className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-white font-semibold truncate">{topThree[0]?.name}</p>
            <p className="text-gray-40 text-sm">{topThree[0]?.score.toLocaleString()}</p>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="text-center flex-1">
          <div className="w-16 h-16 rounded-full bg-gray-15 flex items-center justify-center border-2 border-amber-600 mx-auto mb-2">
            <User className="w-6 h-6 text-gray-40" />
          </div>
          <div className="bg-amber-600/10 rounded-lg p-3 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <p className="text-white font-medium text-sm truncate">{topThree[2]?.name}</p>
            <p className="text-gray-40 text-xs">{topThree[2]?.score.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Leaderboard Server Component
export default function Leaderboard({ data = mockLeaderboardData }) {
  const topThree = data.slice(0, 3);
  const remaining = data.slice(3);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-08 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <LeaderboardHeader />
        
        {/* Top 3 Podium */}
        {topThree.length >= 3 && <TopThreePodium topThree={topThree} />}
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-10 border border-gray-15 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-60" />
              <span className="text-gray-40 text-sm">Total Players</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{data.length}</p>
          </div>
          <div className="bg-gray-10 border border-gray-15 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-purple-60" />
              <span className="text-gray-40 text-sm">Top Score</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">
              {data[0]?.score.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Full Leaderboard List */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>Full Rankings</span>
            <span className="text-gray-40 text-sm font-normal">({data.length} players)</span>
          </h2>
          
          {data.map((player, index) => (
            <LeaderboardEntry key={player.id} player={player} index={index} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-40 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}