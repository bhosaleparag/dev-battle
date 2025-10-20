"use client";
import { formatTime } from "@/utils/time";
import ChatWidget from "../realtime/ChatWidget";
import { useEffect, useRef, useState } from "react";
import { Award, Clock, Flag, MessageSquare, Target, TrendingUp, Trophy, Zap, Crown, Medal } from "lucide-react";
import { SoundButton } from "./SoundButton";
import { useSound } from "@/context/SoundContext";
import PlayerCard from "./PlayerCard";

// Get event icon
const getEventIcon = (type) => {
  switch (type) {
    case 'score-update':
      return <TrendingUp className="w-4 h-4 text-green-400" />;
    case 'answer-submitted':
      return <Target className="w-4 h-4 text-purple-60" />;
    case 'game-event':
      return <Zap className="w-4 h-4 text-yellow-400" />;
    default:
      return <Award className="w-4 h-4 text-gray-50" />;
  }
};

// Get event description
const getEventDescription = (event) => {
  switch (event.type) {
    case 'score-update':
      const action = event.points > 0 ? 'gained' : 'lost';
      return `${event.username} ${action} ${Math.abs(event.points)} points${event.reason ? ` - ${event.reason}` : ''}`;
    case 'answer-submitted':
      return `${event.username} answered a question`;
    default:
      return event.message || 'Game event occurred';
  }
};

const MultiplayerTopBar = ({ 
  roomData, 
  currentUserId,
  roomEvents = [],
  onSurrender,
  onChatOpen,
  gameState = '',
  onTimeUp
}) => {
  const { play } = useSound();
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const eventsRef = useRef(null);

  // Get timer color based on remaining time
  const getTimerColor = () => {
    if (timeRemaining === null) return 'text-gray-50';
    if (timeRemaining <= 30) return 'text-red-400 animate-pulse';
    if (timeRemaining <= 60) return 'text-yellow-400';
    return 'text-green-400';
  };
  
  // Get all players and sort by score
  const players = roomData?.participantDetails || {};
  const playersArray = Object.values(players).sort((a, b) => (b.score || 0) - (a.score || 0));
  const playerCount = playersArray.length;

  // Timer effect
  useEffect(() => {
    if (!roomData?.challenge?.timeLimit || gameState !== 'playing') {
      return;
    }

    const timeLimit = roomData.challenge.timeLimit;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed++;
      const remaining = Math.max(0, timeLimit - elapsed);
      
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        clearInterval(interval);
        onTimeUp?.();
      }
      if(remaining <= 5){
        play('timeout')
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [roomData?.challenge?.timeLimit, gameState, onTimeUp]);

  return (
    <>
      <div 
        className="sticky top-0 z-40 border-b border-gray-20"
        style={{
          backgroundColor: 'var(--gray-10)',
          backdropFilter: 'blur(12px)'
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex lg:hidden flex-col gap-3">
            <div className="relative">
              <div className={`flex gap-2 ${playerCount > 2 ? 'overflow-x-auto scrollbar-hide pb-2' : 'justify-between'}`}>
                {playersArray.map((player, index) => (
                  <PlayerCard
                    key={player.userId}
                    player={player}
                    isCurrentUser={player.userId === currentUserId}
                    position={index}
                    compact={playerCount > 3}
                  />
                ))}
              </div>
              {playerCount > 2 && (
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-10 to-transparent pointer-events-none" />
              )}
            </div>

            {/* Game Info & Actions */}
            <div className="flex items-center justify-between gap-2">
              {/* Game Info */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Clock className={`w-4 h-4 flex-shrink-0 ${getTimerColor()}`} />
                <span className={`font-mono font-bold text-xs ${getTimerColor()}`}>
                  {formatTime(timeRemaining)}
                </span>
                {roomData?.currentQuestion !== undefined && (
                  <>
                    <span className="text-gray-50">•</span>
                    <Target className="w-4 h-4 text-purple-60 flex-shrink-0" />
                    <span className="text-white font-semibold text-xs">
                      {roomData.currentQuestion + 1}/{roomData.quiz?.totalQuestions || 10}
                    </span>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <SoundButton
                  onClick={() => setShowEvents(!showEvents)}
                  className="relative p-2 bg-gray-15 border border-gray-20 rounded-lg"
                >
                  <Zap className="w-4 h-4 text-gray-50" />
                  {roomEvents.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-60 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {roomEvents.length > 9 ? '9' : roomEvents.length}
                    </span>
                  )}
                </SoundButton>

                <SoundButton
                  onClick={() => {
                    setChatOpen(!chatOpen);
                    if (onChatOpen) onChatOpen();
                  }}
                  className="p-2 bg-gray-15 border border-gray-20 rounded-lg"
                >
                  <MessageSquare className="w-4 h-4 text-gray-50" />
                </SoundButton>

                <SoundButton
                  onClick={onSurrender}
                  className="p-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg"
                >
                  <Flag className="w-4 h-4" />
                </SoundButton>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
            <div className="hidden lg:flex items-start justify-between gap-4">
              {/* Left Side - Players */}
              <div className={`flex ${playerCount <= 2 ? 'items-center gap-4' : 'gap-2 overflow-x-auto max-w-[600px]'} flex-1`}>
              {playersArray.map((player, index) => (
                <PlayerCard
                  key={player.userId}
                  player={player}
                  isCurrentUser={player.userId === currentUserId}
                  position={index}
                  compact={playerCount > 4}
                />
              ))}
              
              {/* VS Badge for 2 players */}
              {playerCount === 2 && (
                <div className="px-3 py-1 bg-gradient-to-r from-purple-60 to-purple-70 rounded-lg">
                  <span className="text-white font-bold text-xs">VS</span>
                </div>
              )}
            </div>

            {/* Center - Game Info */}
            <div className="flex flex-col items-center gap-1 min-w-[200px]">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold text-sm truncate max-w-[200px]">
                  {roomData?.quiz?.title || 'Battle Quiz'}
                </h3>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  roomData?.quiz?.difficulty === 'easy' ? 'bg-green-400/10 text-green-400' :
                  roomData?.quiz?.difficulty === 'medium' ? 'bg-yellow-400/10 text-yellow-400' :
                  'bg-red-400/10 text-red-400'
                }`}>
                  {roomData?.quiz?.difficulty || 'Medium'}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Timer */}
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${getTimerColor()}`} />
                  <span className={`font-mono font-bold text-sm ${getTimerColor()}`}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>

                {/* Question Progress */}
                {roomData?.currentQuestion !== undefined && (
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-60" />
                    <span className="text-white font-semibold text-sm">
                      {roomData.currentQuestion + 1}/{roomData.quiz?.totalQuestions || 10}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-3">
              {/* Events Button */}
              <SoundButton
                onClick={() => setShowEvents(!showEvents)}
                className="relative p-2.5 bg-gray-15 border border-gray-20 rounded-lg hover:border-purple-60 transition-all duration-200 group"
              >
                <Zap className="w-5 h-5 text-gray-50 group-hover:text-purple-60 transition-colors" />
                {roomEvents.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-60 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {roomEvents.length > 9 ? '9+' : roomEvents.length}
                  </span>
                )}
              </SoundButton>

              {/* Chat Button */}
              <SoundButton
                onClick={() => {
                  setChatOpen(!chatOpen);
                  if (onChatOpen) onChatOpen();
                }}
                className="relative p-2.5 bg-gray-15 border border-gray-20 rounded-lg hover:border-purple-60 transition-all duration-200 group"
              >
                <MessageSquare className="w-5 h-5 text-gray-50 group-hover:text-purple-60 transition-colors" />
              </SoundButton>

              {/* Surrender Button */}
              <SoundButton
                onClick={onSurrender}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200 font-medium text-sm"
              >
                <Flag className="w-4 h-4" />
                <span>Surrender</span>
              </SoundButton>
            </div>
          </div>
        </div>

        {/* Events Panel (Dropdown) */}
        {showEvents && (
          <div 
            ref={eventsRef}
            className="absolute right-3 sm:right-6 top-full mt-2 w-[calc(100vw-24px)] sm:w-96 max-h-80 bg-gray-15 border border-gray-20 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-3 sm:p-4 border-b border-gray-20 flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2 text-sm sm:text-base">
                <Zap className="w-4 h-4 text-purple-60" />
                Game Events
              </h3>
              <SoundButton 
                onClick={() => setShowEvents(false)}
                className="text-gray-50 hover:text-white transition-colors"
              >
                ✕
              </SoundButton>
            </div>
            
            <div className="overflow-y-auto max-h-64 scrollbar-thin scrollbar-thumb-gray-30 scrollbar-track-gray-20">
              {roomEvents.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-50 text-sm">No events yet</p>
                </div>
              ) : (
                <div className="p-2">
                  {roomEvents.slice().reverse().map((event, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 mb-2 bg-gray-20 rounded-xl hover:bg-gray-30 transition-colors"
                    >
                      <div className="mt-1">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs sm:text-sm">
                          {getEventDescription(event)}
                        </p>
                        {event.newScore !== undefined && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-50">New score:</span>
                            <span className="text-xs font-bold text-purple-60">
                              {event.newScore}
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-gray-60 mt-1">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chat Widget Placeholder */}
      <ChatWidget 
        isOpen={chatOpen}
        chatType='room'
        title={`${'Opponent'} Chat`}
        roomId={roomData?.roomId}
        onClose={() => setChatOpen(false)}
      />
    </>
  );
};

export default MultiplayerTopBar;