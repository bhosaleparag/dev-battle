"use client";
import { useState, useEffect } from 'react';
import { Trophy, Users, TrendingUp, Crown, Target, Gamepad2, Calendar, Filter } from 'lucide-react';
import { useSocketContext } from '@/context/SocketProvider';
import useAuth from '@/hooks/useAuth';
import { getAchievementIcon, getRankIcon } from '@/lib/constants';
import { formatDate } from '@/utils/date';
import { calculateLevel } from '@/utils/calculateLevel';
import Select from '@/components/ui/Select';

const Leaderboard = () => {
  const { leaderboardState } = useSocketContext();
  const { user } = useAuth();
  const { leaderboard, myPosition, leaderboardStats, getLeaderboard, getMyPosition, getLeaderboardStats } = leaderboardState;
  const [filters, setFilters] = useState({gameType: 'all', timeframe: 'all', sortBy: 'totalScore'});

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
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

  // Calculate user level from XP
  const userLevel = user?.stats?.xp ? calculateLevel(user.stats.xp) : null;

  // Create enriched myPosition data
  const enrichedMyPosition = myPosition ? {
    ...myPosition,
    rank: myPosition.position,
    userId: user?.uid,
    username: user?.userName || user?.displayName || user?.email?.split('@')[0],
    displayScore: myPosition.totalScore,
    wins: user?.stats?.battlesWon || 0,
    losses: myPosition.gamesPlayed - (user?.stats?.battlesWon || 0),
    winRate: myPosition.gamesPlayed > 0 ? ((user?.stats?.battlesWon || 0) / myPosition.gamesPlayed) * 100 : 0,
    achievements: myPosition.achievements || [],
    level: userLevel?.level || 1
  } : null;

  return (
    <div className="min-h-screen bg-gray-08 text-white-99 p-4 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <Trophy className="w-6 h-6 md:w-8 md:h-8 text-purple-60" />
            <h1 className="text-2xl md:text-3xl font-bold text-white-99">Leaderboard</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="bg-gray-10 border border-gray-20 rounded-lg p-3 md:p-4">
              <div className="flex items-center gap-2 mb-1 md:mb-2">
                <Users className="w-3 h-3 md:w-4 md:h-4 text-purple-60" />
                <span className="text-gray-60 text-xs">Players</span>
              </div>
              <span className="text-white-99 text-base md:text-lg font-semibold">
                {leaderboardStats?.totalUsers?.toLocaleString() || 0}
              </span>
            </div>

            <div className="bg-gray-10 border border-gray-20 rounded-lg p-3 md:p-4">
              <div className="flex items-center gap-2 mb-1 md:mb-2">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-purple-60" />
                <span className="text-gray-60 text-xs">Top Score</span>
              </div>
              <span className="text-white-99 text-base md:text-lg font-semibold">
                {leaderboardStats?.topScore?.toLocaleString() || 0}
              </span>
            </div>

            <div className="bg-gray-10 border border-gray-20 rounded-lg p-3 md:p-4">
              <div className="flex items-center gap-2 mb-1 md:mb-2">
                <Crown className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
                <span className="text-gray-60 text-xs">Champion</span>
              </div>
              <span className="text-white-99 text-xs md:text-sm font-medium truncate">
                {leaderboardStats?.topPlayer || '-'}
              </span>
            </div>

            <div className="bg-gray-10 border border-gray-20 rounded-lg p-3 md:p-4">
              <div className="flex items-center gap-2 mb-1 md:mb-2">
                <Target className="w-3 h-3 md:w-4 md:h-4 text-purple-60" />
                <span className="text-gray-60 text-xs">Avg Score</span>
              </div>
              <span className="text-white-99 text-base md:text-lg font-semibold">
                {leaderboardStats?.averageScore?.toLocaleString() || 0}
              </span>
            </div>

            <div className="bg-gray-10 border border-gray-20 rounded-lg p-3 md:p-4">
              <div className="flex items-center gap-2 mb-1 md:mb-2">
                <Gamepad2 className="w-3 h-3 md:w-4 md:h-4 text-purple-60" />
                <span className="text-gray-60 text-xs">Games</span>
              </div>
              <span className="text-white-99 text-sm md:text-base font-semibold">
                {leaderboardStats?.totalGamesPlayed?.toLocaleString() || 0}
              </span>
            </div>

            <div className="bg-gray-10 border border-gray-20 rounded-lg p-3 md:p-4">
              <div className="flex items-center gap-2 mb-1 md:mb-2">
                <Calendar className="w-3 h-3 md:w-4 md:h-4 text-purple-60" />
                <span className="text-gray-60 text-xs">Updated</span>
              </div>
              <span className="text-white-99 text-xs md:text-sm">
                {leaderboardStats?.timestamp ? new Date(leaderboardStats.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-10 border border-gray-20 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Filter className="w-4 h-4 text-purple-60" />
            <span className="text-white-99 text-sm md:text-base font-medium">Filters</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div>
              <label className="block text-gray-60 text-xs md:text-sm mb-2">Game Type</label>
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
              <label className="block text-gray-60 text-xs md:text-sm mb-2">Timeframe</label>
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
              <label className="block text-gray-60 text-xs md:text-sm mb-2">Sort By</label>
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

        {/* Empty State */}
        {!leaderboard || leaderboard.length === 0 ? (
          <div className="bg-gray-10 border border-gray-20 rounded-lg p-8 text-center">
            <Trophy className="w-12 h-12 text-gray-40 mx-auto mb-4" />
            <p className="text-gray-60 text-sm">No players found for the selected filters</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="bg-gray-10 border border-gray-20 rounded-lg overflow-hidden">
                <div className="bg-gray-15 border-b border-gray-20 px-6 py-4">
                  <div className="grid grid-cols-12 gap-4 text-gray-60 text-sm font-medium">
                    <div className="col-span-1">Rank</div>
                    <div className="col-span-2">Player</div>
                    <div className="col-span-1">Level</div>
                    <div className="col-span-1">Score</div>
                    <div className="col-span-1">Games</div>
                    <div className="col-span-1">Avg</div>
                    <div className="col-span-1">W/L</div>
                    <div className="col-span-1">Win %</div>
                    <div className="col-span-2">Achievements</div>
                    <div className="col-span-1">Last Played</div>
                  </div>
                </div>

                <div className="divide-y divide-gray-20">
                  {leaderboard.map((player) => {
                    const isCurrentUser = player.userId === user?.uid;
                    const playerLevel = calculateLevel(player.totalScore);
                    
                    return (
                      <div 
                        key={player.userId}
                        className={`px-6 py-4 hover:bg-gray-15 transition-colors ${
                          isCurrentUser ? 'bg-purple-99/5 border-l-4 border-purple-60' : ''
                        }`}
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-1 flex items-center">
                            {getRankIcon(player.rank)}
                          </div>
                          
                          <div className="col-span-2">
                            <div className="font-medium text-white-99 truncate">{player.username}</div>
                            {isCurrentUser && (
                              <div className="text-xs text-purple-60">You</div>
                            )}
                          </div>
                          
                          <div className="col-span-1">
                            <span className="text-purple-60 text-sm font-semibold">
                              Lv {playerLevel.level}
                            </span>
                          </div>
                          
                          <div className="col-span-1 font-semibold text-white-99">
                            {player.displayScore || player.totalScore}
                          </div>
                          
                          <div className="col-span-1 text-gray-60 text-sm">
                            {player.gamesPlayed}
                          </div>
                          
                          <div className="col-span-1 text-gray-60 text-sm">
                            {player.averageScore?.toFixed(0)}
                          </div>
                          
                          <div className="col-span-1">
                            <div className="text-xs">
                              <span className="text-green-400">{player.wins || 0}</span>
                              <span className="text-gray-60">/</span>
                              <span className="text-red-400">{player.losses || 0}</span>
                            </div>
                          </div>
                          
                          <div className="col-span-1">
                            <span className={`text-sm ${player.winRate >= 70 ? 'text-green-400' : player.winRate >= 50 ? 'text-yellow-400' : 'text-gray-60'}`}>
                              {player.winRate?.toFixed(0)}%
                            </span>
                          </div>
                          
                          <div className="col-span-2">
                            <div className="flex gap-1">
                              {player.achievements && player.achievements.length > 0 ? (
                                <>
                                  {player.achievements.slice(0, 4).map((achievement, idx) => (
                                    <div key={idx} className="text-purple-60 text-sm">
                                      {getAchievementIcon(achievement)}
                                    </div>
                                  ))}
                                  {player.achievements.length > 4 && (
                                    <span className="text-xs text-gray-60">+{player.achievements.length - 4}</span>
                                  )}
                                </>
                              ) : (
                                <span className="text-xs text-gray-50">-</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="col-span-1 text-xs text-gray-60">
                            {formatDate(player.lastPlayed)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3">
              {leaderboard.map((player) => {
                const isCurrentUser = player.userId === user?.uid;
                const playerLevel = calculateLevel(player.totalScore);
                
                return (
                  <div 
                    key={player.userId}
                    className={`bg-gray-10 border rounded-lg p-4 ${
                      isCurrentUser ? 'border-purple-60 bg-purple-99/5' : 'border-gray-20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-xl">
                          {getRankIcon(player.rank)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white-99 text-sm">{player.username}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {isCurrentUser && (
                              <span className="text-xs text-purple-60">You</span>
                            )}
                            <span className="text-xs text-purple-60">Lv {playerLevel.level}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white-99">{player.displayScore || player.totalScore}</div>
                        <div className="text-xs text-gray-60">{formatDate(player.lastPlayed)}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <div className="text-xs text-gray-60">Games</div>
                        <div className="text-white-99 text-sm font-medium">{player.gamesPlayed}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-60">Avg Score</div>
                        <div className="text-white-99 text-sm font-medium">{player.averageScore?.toFixed(0)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-60">Win/Loss</div>
                        <div className="text-sm">
                          <span className="text-green-400">{player.wins || 0}</span>
                          <span className="text-gray-60 mx-1">/</span>
                          <span className="text-red-400">{player.losses || 0}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-60">Win Rate</div>
                        <div className={`text-sm font-medium ${player.winRate >= 70 ? 'text-green-400' : player.winRate >= 50 ? 'text-yellow-400' : 'text-gray-60'}`}>
                          {player.winRate?.toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    {player.achievements && player.achievements.length > 0 && (
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-20">
                        <span className="text-xs text-gray-60">Achievements:</span>
                        <div className="flex gap-1">
                          {player.achievements.slice(0, 5).map((achievement, idx) => (
                            <div key={idx} className="text-purple-60 text-sm">
                              {getAchievementIcon(achievement)}
                            </div>
                          ))}
                          {player.achievements.length > 5 && (
                            <span className="text-xs text-gray-60">+{player.achievements.length - 5}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* My Position Summary */}
        {enrichedMyPosition && (
          <div className="mt-6 md:mt-8 bg-gradient-to-r from-purple-60/10 to-purple-70/10 border border-purple-60/20 rounded-lg p-4 md:p-5">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <Crown className="w-5 h-5 text-purple-60" />
              <h3 className="text-base md:text-lg font-semibold text-white-99">Your Position</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
              <div>
                <div className="text-xs text-gray-60 mb-1">Rank</div>
                <div className="text-xl md:text-2xl font-bold text-purple-60">#{enrichedMyPosition.rank}</div>
              </div>
              <div>
                <div className="text-xs text-gray-60 mb-1">Level</div>
                <div className="text-lg md:text-xl font-semibold text-purple-60">Lv {enrichedMyPosition.level}</div>
              </div>
              <div>
                <div className="text-xs text-gray-60 mb-1">Score</div>
                <div className="text-lg md:text-xl font-semibold text-white-99">{enrichedMyPosition.displayScore}</div>
              </div>
              <div>
                <div className="text-xs text-gray-60 mb-1">Win Rate</div>
                <div className={`text-lg md:text-xl font-semibold ${enrichedMyPosition.winRate >= 70 ? 'text-green-400' : enrichedMyPosition.winRate >= 50 ? 'text-yellow-400' : 'text-gray-60'}`}>
                  {enrichedMyPosition.winRate.toFixed(0)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-60 mb-1">Achievements</div>
                <div className="flex gap-1 mt-1">
                  {enrichedMyPosition.achievements && enrichedMyPosition.achievements.length > 0 ? (
                    <>
                      {enrichedMyPosition.achievements.slice(0, 3).map((achievement, idx) => (
                        <div key={idx} className="text-purple-60 text-sm">
                          {getAchievementIcon(achievement)}
                        </div>
                      ))}
                      {enrichedMyPosition.achievements.length > 3 && (
                        <span className="text-xs text-gray-60">+{enrichedMyPosition.achievements.length - 3}</span>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-gray-50">None yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;