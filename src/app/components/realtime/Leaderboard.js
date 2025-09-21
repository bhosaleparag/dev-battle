"use client";

import { useEffect, useState } from 'react';
import { useSocketContext } from '@/context/SocketProvider';

const Leaderboard = () => {
  const { leaderboard: leaderboardHook, isConnected } = useSocketContext();
  const { 
    leaderboard, 
    myPosition, 
    leaderboardStats,
    getLeaderboard, 
    getMyPosition, 
    getLeaderboardStats,
    subscribeToUpdates,
    unsubscribeFromUpdates
  } = leaderboardHook;

  const [filters, setFilters] = useState({
    gameType: 'all',
    timeframe: 'all',
    sortBy: 'totalScore',
    limit: 50
  });

  useEffect(() => {
    if (isConnected) {
      getLeaderboard(filters.limit, filters.gameType, filters.sortBy, filters.timeframe);
      getMyPosition(filters.gameType);
      getLeaderboardStats();
      subscribeToUpdates(filters.gameType);
    }

    return () => {
      if (isConnected) {
        unsubscribeFromUpdates(filters.gameType);
      }
    };
  }, [isConnected, filters, getLeaderboard, getLeaderboardStats, getMyPosition, subscribeToUpdates, unsubscribeFromUpdates]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getRankMedal = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Leaderboard</h2>
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      </div>

      {/* Stats */}
      {leaderboardStats.totalUsers && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{leaderboardStats.totalUsers}</div>
            <div className="text-sm text-blue-600">Total Players</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{leaderboardStats.topScore}</div>
            <div className="text-sm text-green-600">Top Score</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">{leaderboardStats.averageScore}</div>
            <div className="text-sm text-yellow-600">Average Score</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{leaderboardStats.totalGamesPlayed}</div>
            <div className="text-sm text-purple-600">Games Played</div>
          </div>
        </div>
      )}

      {/* My Position */}
      {myPosition && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">Your Rank</div>
              <div className="text-2xl font-bold">
                #{myPosition.position} {getRankMedal(myPosition.position)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg">Score: {myPosition.totalScore}</div>
              <div className="text-sm opacity-90">
                Avg: {myPosition.averageScore} • Games: {myPosition.gamesPlayed}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <select
          value={filters.gameType}
          onChange={(e) => handleFilterChange('gameType', e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Games</option>
          <option value="general">General</option>
          <option value="speed">Speed Mode</option>
          <option value="challenge">Challenge</option>
        </select>

        <select
          value={filters.timeframe}
          onChange={(e) => handleFilterChange('timeframe', e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="totalScore">Total Score</option>
          <option value="averageScore">Average Score</option>
          <option value="gamesPlayed">Games Played</option>
        </select>

        <select
          value={filters.limit}
          onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={25}>Top 25</option>
          <option value={50}>Top 50</option>
          <option value={100}>Top 100</option>
        </select>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-2">Rank</th>
              <th className="text-left py-3 px-2">Player</th>
              <th className="text-right py-3 px-2">Score</th>
              <th className="text-right py-3 px-2">Games</th>
              <th className="text-right py-3 px-2">Avg</th>
              <th className="text-right py-3 px-2">Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => (
              <tr 
                key={player.userId} 
                className={`border-b hover:bg-gray-50 ${
                  index < 3 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100' : ''
                }`}
              >
                <td className="py-3 px-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{player.rank}</span>
                    <span>{getRankMedal(player.rank)}</span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="font-medium">{player.username}</div>
                  {player.achievements && player.achievements.length > 0 && (
                    <div className="text-xs text-gray-500">
                      {player.achievements.length} achievements
                    </div>
                  )}
                </td>
                <td className="py-3 px-2 text-right font-bold text-lg">
                  {player.displayScore || player.totalScore}
                </td>
                <td className="py-3 px-2 text-right">{player.gamesPlayed}</td>
                <td className="py-3 px-2 text-right">{player.averageScore}</td>
                <td className="py-3 px-2 text-right">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    player.winRate >= 70 
                      ? 'bg-green-100 text-green-800'
                      : player.winRate >= 50 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {player.winRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {leaderboard.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No leaderboard data available
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;