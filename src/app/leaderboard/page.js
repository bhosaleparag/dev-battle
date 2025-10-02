"use client";
import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Users, 
  Target, 
  Gamepad2, 
  Filter,
  Medal,
  Crown,
  Star,
  Calendar,
  TrendingUp,
  Award,
  Zap,
  Shield,
  Code,
} from 'lucide-react';
import { useSocketContext } from '@/context/SocketProvider';
import { formatDate } from '@/utils/date';
import Select from '@/components/ui/Select';

const Leaderboard = () => {
  const { leaderboardState } = useSocketContext();
  const { leaderboard, myPosition, leaderboardStats, getLeaderboard, getMyPosition, getLeaderboardStats, subscribeToUpdates, unsubscribeFromUpdates } = leaderboardState
  const [filters, setFilters] = useState({gameType: 'all', timeframe: 'all', sortBy: 'totalScore'});

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  console.log(leaderboard, myPosition)

  const getAchievementIcon = (achievement) => {
    const iconMap = {
      crown: Crown,
      trophy: Trophy,
      star: Star,
      medal: Medal,
      award: Award,
      zap: Zap,
      shield: Shield,
      code: Code,
      target: Target
    };
    const IconComponent = iconMap[achievement] || Award;
    return <IconComponent className="w-4 h-4" />;
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-yellow-600" />;
    return <span className="text-gray-60 font-medium">#{rank}</span>;
  };

  useEffect(() => {
    getLeaderboard(filters);
  }, [getLeaderboard, filters]);

  useEffect(() => {
    getLeaderboardStats();
  }, [getLeaderboardStats]);

  useEffect(() => {
    getMyPosition();
  }, [getMyPosition]);

  useEffect(() => {
    subscribeToUpdates();
    return () => unsubscribeFromUpdates();
  }, []);


  return (
    <div className="min-h-screen bg-gray-08 text-white-99 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-8 h-8 text-purple-60" />
            <h1 className="text-3xl font-bold text-white-99">Leaderboard</h1>
            {/* {isSubscribed && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Live
              </div>
            )} */}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-gray-10 border border-gray-20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-purple-60" />
                <span className="text-gray-60 text-xs">Total Players</span>
              </div>
              <span className="text-white-99 text-lg font-semibold">
                {leaderboardStats?.totalUsers?.toLocaleString()}
              </span>
            </div>

            <div className="bg-gray-10 border border-gray-20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-60" />
                <span className="text-gray-60 text-xs">Top Score</span>
              </div>
              <span className="text-white-99 text-lg font-semibold">
                {leaderboardStats?.topScore?.toLocaleString()}
              </span>
            </div>

            <div className="bg-gray-10 border border-gray-20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-60 text-xs">Champion</span>
              </div>
              <span className="text-white-99 text-sm font-medium truncate">
                {leaderboardStats?.topPlayer}
              </span>
            </div>

            <div className="bg-gray-10 border border-gray-20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-purple-60" />
                <span className="text-gray-60 text-xs">Avg Score</span>
              </div>
              <span className="text-white-99 text-lg font-semibold">
                {leaderboardStats?.averageScore?.toLocaleString()}
              </span>
            </div>

            <div className="bg-gray-10 border border-gray-20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Gamepad2 className="w-4 h-4 text-purple-60" />
                <span className="text-gray-60 text-xs">Games Played</span>
              </div>
              <span className="text-white-99 text-sm font-semibold">
                {leaderboardStats?.totalGamesPlayed?.toLocaleString()}
              </span>
            </div>

            <div className="bg-gray-10 border border-gray-20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-60" />
                <span className="text-gray-60 text-xs">Updated</span>
              </div>
              <span className="text-white-99 text-sm">
                {new Date(leaderboardStats?.timestamp)?.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-10 border border-gray-20 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-purple-60" />
            <span className="text-white-99 font-medium">Filters</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-60 text-sm mb-2">Game Type</label>
              <Select
                value={filters.gameType}
                onChange={(value) => handleFilterChange('gameType', value)}
                options={[
                  { value: "all", label: "All Games" },
                  { value: "quiz", label: "Quiz Mode" },
                  { value: "debug", label: "Debug Battle" },
                  { value: "algorithm", label: "Algorithm Challenge" },
                ]}
              />
            </div>

            <div>
              <label className="block text-gray-60 text-sm mb-2">Timeframe</label>
              <Select
                value={filters.timeframe}
                onChange={(value) => handleFilterChange('timeframe', value)}
                options={[
                  { value: "all", label: "All Time" },
                  { value: "monthly", label: "This Month" },
                  { value: "weekly", label: "This Week" },
                  { value: "daily", label: "Today" },
                ]}
              />
            </div>

            <div>
              <label className="block text-gray-60 text-sm mb-2">Sort By</label>
              <Select
                value={filters.sortBy}
                onChange={(value) => handleFilterChange('sortBy', value)}
                options={[
                  { value: "totalScore", label: "Total Score" },
                  { value: "averageScore", label: "Average Score" },
                  { value: "gamesPlayed", label: "Games Played" },
                  { value: "winRate", label: "Win Rate" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="bg-gray-10 border border-gray-20 rounded-lg overflow-hidden">
            <div className="bg-gray-15 border-b border-gray-20 px-6 py-4">
              <div className="grid grid-cols-12 gap-4 text-gray-60 text-sm font-medium">
                <div className="col-span-1">Rank</div>
                <div className="col-span-2">Player</div>
                <div className="col-span-1">Score</div>
                <div className="col-span-1">Games</div>
                <div className="col-span-1">Avg Score</div>
                <div className="col-span-1">Win/Loss</div>
                <div className="col-span-1">Win Rate</div>
                <div className="col-span-2">Achievements</div>
                <div className="col-span-2">Last Played</div>
              </div>
            </div>

            <div className="divide-y divide-gray-20">
              {leaderboard.map((player) => (
                <div 
                  key={player.userId}
                  className={`px-6 py-4 hover:bg-gray-15 transition-colors ${
                    player.userId === myPosition?.userId ? 'bg-purple-99/5 border-l-4 border-purple-60' : ''
                  }`}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 flex items-center">
                      {getRankIcon(player.rank)}
                    </div>
                    
                    <div className="col-span-2">
                      <div className="font-medium text-white-99">{player.username}</div>
                      {player.userId === myPosition?.userId && (
                        <div className="text-xs text-purple-60">You</div>
                      )}
                    </div>
                    
                    <div className="col-span-1 font-semibold text-white-99">
                      {player.displayScore}
                    </div>
                    
                    <div className="col-span-1 text-gray-60">
                      {player.gamesPlayed}
                    </div>
                    
                    <div className="col-span-1 text-gray-60">
                      {player.averageScore.toFixed(1)}
                    </div>
                    
                    <div className="col-span-1">
                      <div className="text-sm">
                        <span className="text-green-400">{player.wins}W</span>
                        <span className="text-gray-60 mx-1">/</span>
                        <span className="text-red-400">{player.losses}L</span>
                      </div>
                    </div>
                    
                    <div className="col-span-1">
                      <span className={`text-sm ${player.winRate >= 70 ? 'text-green-400' : 'text-gray-60'}`}>
                        {player.winRate.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex gap-1">
                        {player.achievements.slice(0, 4).map((achievement, idx) => (
                          <div key={idx} className="text-purple-60">
                            {getAchievementIcon(achievement)}
                          </div>
                        ))}
                        {player.achievements.length > 4 && (
                          <span className="text-xs text-gray-60">+{player.achievements.length - 4}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-sm text-gray-60">
                      {formatDate(player.lastPlayed)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {leaderboard.map((player) => (
            <div 
              key={player.userId}
              className={`bg-gray-10 border border-gray-20 rounded-lg p-4 ${
                player.userId === myPosition?.userId ? 'border-purple-60 bg-purple-99/5' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getRankIcon(player.rank)}
                  <div>
                    <h3 className="font-semibold text-white-99">{player.username}</h3>
                    {player.userId === myPosition?.userId && (
                      <span className="text-xs text-purple-60">You</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white-99">{player.displayScore}</div>
                  <div className="text-xs text-gray-60">{player.lastPlayed}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs text-gray-60">Games Played</div>
                  <div className="text-white-99 font-medium">{player.gamesPlayed}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-60">Average Score</div>
                  <div className="text-white-99 font-medium">{player.averageScore.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-60">Win/Loss</div>
                  <div>
                    <span className="text-green-400">{player.wins}</span>
                    <span className="text-gray-60 mx-1">/</span>
                    <span className="text-red-400">{player.losses}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-60">Win Rate</div>
                  <div className={`font-medium ${player.winRate >= 70 ? 'text-green-400' : 'text-gray-60'}`}>
                    {player.winRate.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-60 mr-2">Achievements:</span>
                  {player.achievements.slice(0, 5).map((achievement, idx) => (
                    <div key={idx} className="text-purple-60">
                      {getAchievementIcon(achievement)}
                    </div>
                  ))}
                  {player.achievements.length > 5 && (
                    <span className="text-xs text-gray-60">+{player.achievements.length - 5}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* My Position Summary (Always Visible) */}
        <div className="mt-8 bg-gradient-to-r from-purple-60/10 to-purple-70/10 border border-purple-60/20 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Crown className="w-5 h-5 text-purple-60" />
            <h3 className="text-lg font-semibold text-white-99">Your Position</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-60">Current Rank</div>
              <div className="text-2xl font-bold text-purple-60">#{myPosition?.rank}</div>
            </div>
            <div>
              <div className="text-xs text-gray-60">Total Score</div>
              <div className="text-xl font-semibold text-white-99">{myPosition?.displayScore}</div>
            </div>
            <div>
              <div className="text-xs text-gray-60">Win Rate</div>
              <div className="text-xl font-semibold text-green-400">{myPosition?.winRate?.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-60">Achievements</div>
              <div className="flex gap-1 mt-1">
                {myPosition?.achievements?.map((achievement, idx) => (
                  <div key={idx} className="text-purple-60">
                    {getAchievementIcon(achievement)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;