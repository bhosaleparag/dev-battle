"use client";
import { useState } from 'react';
import { X, Swords, Clock } from 'lucide-react';

// Invite Friend Modal Component
export const InviteFriendModal = ({ friend, isOpen, onClose, onInvite }) => {
  const [gameSettings, setGameSettings] = useState({
    difficulty: 'medium',
    timeLimit: 600,
    xp: 50
  });

  if (!isOpen) return null;

  const difficulties = [
    { value: 'easy', label: 'Easy', xp: 30 },
    { value: 'medium', label: 'Medium', xp: 50 },
    { value: 'hard', label: 'Hard', xp: 75 },
    { value: 'expert', label: 'Expert', xp: 100 }
  ];

  const timeLimits = [
    { value: 300, label: '5 minutes' },
    { value: 600, label: '10 minutes' },
    { value: 900, label: '15 minutes' },
    { value: 1200, label: '20 minutes' }
  ];

  const handleInvite = () => {
    onInvite(friend.id, friend.username, gameSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-10 border border-gray-20 rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-60 flex items-center justify-center">
              <Swords className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white-99 font-semibold text-lg">Invite Friend</h3>
              <p className="text-gray-50 text-sm">{friend.username}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-50 hover:text-white-99 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Game Settings */}
        <div className="space-y-4 mb-6">
          {/* Difficulty */}
          <div>
            <label className="text-white-95 text-sm font-medium block mb-2">
              Difficulty
            </label>
            <div className="grid grid-cols-2 gap-2">
              {difficulties.map(diff => (
                <button
                  key={diff.value}
                  onClick={() => setGameSettings(prev => ({ 
                    ...prev, 
                    difficulty: diff.value,
                    xp: diff.xp 
                  }))}
                  className={`p-3 rounded-lg border transition-all ${
                    gameSettings.difficulty === diff.value
                      ? 'bg-purple-60 border-purple-60 text-white'
                      : 'bg-gray-15 border-gray-20 text-gray-50 hover:border-purple-60'
                  }`}
                >
                  <div className="font-medium">{diff.label}</div>
                  <div className="text-xs opacity-80">{diff.xp} XP</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Limit */}
          <div>
            <label className="text-white-95 text-sm font-medium block mb-2">
              Time Limit
            </label>
            <div className="grid grid-cols-2 gap-2">
              {timeLimits.map(time => (
                <button
                  key={time.value}
                  onClick={() => setGameSettings(prev => ({ 
                    ...prev, 
                    timeLimit: time.value 
                  }))}
                  className={`p-3 rounded-lg border transition-all ${
                    gameSettings.timeLimit === time.value
                      ? 'bg-purple-60 border-purple-60 text-white'
                      : 'bg-gray-15 border-gray-20 text-gray-50 hover:border-purple-60'
                  }`}
                >
                  <Clock className="w-4 h-4 mx-auto mb-1" />
                  <div className="text-sm">{time.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-15 text-white-95 rounded-lg hover:bg-gray-20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            className="flex-1 px-4 py-3 bg-purple-60 text-white rounded-lg hover:bg-purple-65 transition-colors font-medium"
          >
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
};