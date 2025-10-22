'use client';

import { Trophy, Award, TrendingUp, RotateCcw, Home } from 'lucide-react';
import { SoundButton } from './SoundButton';
import { useSound } from '@/context/SoundContext';
import { useEffect } from 'react';

export default function GameResultsScreen({ gameResult, currentUserId, onPlayAgain, onExitToLobby}) {
  const { play } = useSound();
  const myResult = gameResult?.allPlayerResults?.find(
    (result) => result.userId === currentUserId
  );

  useEffect(()=>{
    if(myResult.result === 'win'){
      play('victory')
    } else {
      play('defeat')
    }
  },[myResult.result])

  return (
    <div className="min-h-screen bg-gray-10 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Game Over Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-15 border-2 border-purple-60 mb-4">
            <Trophy className="w-10 h-10 text-purple-60" />
          </div>
          <h1 className="text-4xl font-bold text-white-90 mb-2">Game Over!</h1>
          {myResult && (
            <div
              className={`text-2xl font-semibold ${
                myResult.result === 'win'
                  ? 'text-green-500'
                  : myResult.result === 'draw'
                  ? 'text-yellow-500'
                  : 'text-red-500'
              }`}
            >
              {myResult.result === 'win'
                ? '🏆 You Won!'
                : myResult.result === 'draw'
                ? '🤝 Draw Game!'
                : '😔 Better Luck Next Time!'}
            </div>
          )}
          <p className="text-gray-60 mt-2">
            {gameResult?.gameSettings?.title}
          </p>
        </div>

        {/* Current User Stats */}
        {myResult && (
          <div className="bg-gray-15 rounded-xl p-6 mb-6 border border-purple-60">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-purple-60" />
              <h2 className="text-xl font-bold text-white-90">
                Your Performance
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-10 rounded-lg p-4 border border-gray-20">
                <div className="text-3xl font-bold text-purple-60 mb-1">
                  #{myResult.rank}
                </div>
                <div className="text-sm text-gray-60">Rank</div>
              </div>
              <div className="bg-gray-10 rounded-lg p-4 border border-gray-20">
                <div className="text-3xl font-bold text-purple-65 mb-1">
                  {myResult.finalScore}
                </div>
                <div className="text-sm text-gray-60">Score</div>
              </div>
              <div className="bg-gray-10 rounded-lg p-4 border border-gray-20">
                <div className="text-3xl font-bold text-green-500 mb-1">
                  +{myResult.points}
                </div>
                <div className="text-sm text-gray-60">Points Earned</div>
              </div>
              <div className="bg-gray-10 rounded-lg p-4 border border-gray-20">
                <div className="text-3xl font-bold text-purple-70 mb-1">
                  {myResult.totalParticipants}
                </div>
                <div className="text-sm text-gray-60">Players</div>
              </div>
            </div>
          </div>
        )}

        {/* Final Leaderboard */}
        <div className="bg-gray-15 rounded-xl p-6 mb-6 border border-gray-20">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-60" />
            <h2 className="text-xl font-bold text-white-90">Final Standings</h2>
          </div>
          <div className="space-y-3">
            {gameResult?.finalScores?.map((player, index) => {
              const isCurrentUser = player.userId === currentUserId;
              const isWinner = gameResult?.winners?.includes(player.userId);

              return (
                <div
                  key={player.userId}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                    isCurrentUser
                      ? 'bg-gray-10 border-2 border-purple-60'
                      : 'bg-gray-10 border border-gray-20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        index === 0
                          ? 'bg-yellow-500/20 text-yellow-500 border-2 border-yellow-500'
                          : index === 1
                          ? 'bg-gray-400/20 text-gray-400 border-2 border-gray-400'
                          : index === 2
                          ? 'bg-orange-500/20 text-orange-500 border-2 border-orange-500'
                          : 'bg-gray-15 text-gray-60 border border-gray-20'
                      }`}
                    >
                      {index === 0
                        ? '🥇'
                        : index === 1
                        ? '🥈'
                        : index === 2
                        ? '🥉'
                        : `#${player.rank}`}
                    </div>

                    {/* Player Info */}
                    <div>
                      <div className="font-semibold text-white-90 flex items-center gap-2 flex-wrap">
                        {player.username || 'Anonymous'}
                        {isCurrentUser && (
                          <span className="text-xs bg-purple-60 text-white-90 px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                        {isWinner && (
                          <span className="text-xs bg-purple-70 text-white-90 px-2 py-1 rounded-full flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            Winner
                          </span>
                        )}
                        {player.surrendered && (
                          <span className="text-xs bg-red-500/80 text-white-90 px-2 py-1 rounded-full">
                            Surrendered
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-60 mt-1">
                        Rank #{player.rank} of {gameResult.finalScores.length}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white-90">
                      {player.score || 0}
                    </div>
                    <div className="text-xs text-gray-60">points</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <SoundButton
            onClick={onPlayAgain}
            className="flex items-center gap-2 px-8 py-3 bg-purple-60 text-white-90 rounded-lg font-semibold hover:bg-purple-65 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </SoundButton>
          <SoundButton
            onClick={onExitToLobby}
            className="flex items-center gap-2 px-8 py-3 bg-gray-20 text-white-90 rounded-lg font-semibold hover:bg-gray-30 transition-colors"
          >
            <Home className="w-5 h-5" />
            Exit to Lobby
          </SoundButton>
        </div>
      </div>
    </div>
  );
}