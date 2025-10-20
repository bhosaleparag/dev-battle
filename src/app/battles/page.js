"use client";
import { useState, useEffect, useRef } from 'react';
import { 
  Swords, Trophy, Users, Plus, Search, X, 
  Zap, LogOut, Check, Loader2, ChevronRight,
  Code, Bug, BookOpen
} from 'lucide-react';
import { useSocketContext } from '@/context/SocketProvider';
import useAuth from '@/hooks/useAuth';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import GameStartCountdown from '@/components/ui/GameStartCountdown';
import { useRouter } from 'next/navigation';
import { SoundButton } from '@/components/ui/SoundButton';

const getDifficultyColor = (difficulty) => {
  switch(difficulty) {
    case 'easy': return 'text-green-400';
    case 'medium': return 'text-yellow-400';
    case 'hard': return 'text-red-400';
    default: return 'text-gray-40';
  }
};

const getGameTypeIcon = (type) => {
  switch(type) {
    case 'quiz': return <BookOpen className="w-4 h-4" />;
    case 'debuggers': return <Bug className="w-4 h-4" />;
    case 'problem': return <Code className="w-4 h-4" />;
    default: return <Swords className="w-4 h-4" />;
  }
};

const gameTimeLimit = (type) => {
  switch(type) {
    case 'quiz': return 600;
    case 'debuggers': return 1200;
    case 'problem': return 2500;
    default: return 600
  }
};

async function fetchChallenges(page) {
  const res = await fetch(`/api/challenges?page=${page}`);
  if (!res.ok) toast.error("Failed to fetch challenges");
  return res.json();
}

async function fetchRandomChallenges(type) {
  let tempType = {
    quiz: 'quiz',
    debuggers: 'debuggerChallenge',
    problem: 'challenge'
  }
  const res = await fetch(`/api/challenges/random?challengeType=${tempType[type]}`);
  if (!res.ok) {
    toast.error("Failed to fetch random challenges");
  }
  return res.json();
}

const BattleMatchmaking = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { roomsState, leaderboardState } = useSocketContext();
  const {
    availableRooms, currentRoom, isLoading, countdown, isConnected,
    createRoom, joinRoom, leaveRoom, getAvailableRooms, toggleReady,
    quickMatch, cancelMatchmaking
  } = roomsState;
  const { myPosition, getMyPosition } = leaderboardState;
  const [activeTab, setActiveTab] = useState('quick-match');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGameType, setSelectedGameType] = useState('quiz');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [searchQuery, setSearchQuery] = useState('');
  const [playerReady, setPlayerReady] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [debuggers, setDebuggers] = useState([]);
  const [problems, setProblems] = useState([]);
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(false);
  const [page, setPage] = useState(1);
  const hasFetchedRef = useRef(false);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 10;
  
  const getChallengesByType = () => {
    switch(selectedGameType) {
      case 'quiz': return quizzes;
      case 'debuggers': return debuggers;
      case 'problem': return problems;
      default: return [];
    }
  };
  
  const filteredChallenges = getChallengesByType().filter(challenge =>
    challenge.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuickMatch = async() => {
    //here add xp later on
    const randChallenge = await fetchRandomChallenges(selectedGameType || 'quiz');
    const gameSettings = {
      ...randChallenge,
      mode: selectedGameType || 'quiz',
      timeLimit: randChallenge.timeLimit || gameTimeLimit(selectedGameType), 
    };
    await quickMatch(user?.stats?.xp, gameSettings);
  };

  const handleCancelMatch = () => {
    cancelMatchmaking();
  };

  const handleCreateRoom = () => {
    if (!roomName.trim() || !selectedChallenge) return;
    const gameSettings = {
      ...selectedChallenge,
      mode: selectedGameType || 'quiz',
      timeLimit: selectedChallenge.timeLimit || gameTimeLimit(selectedGameType), 
    };
    
    createRoom(roomName, 'public', maxPlayers, gameSettings, user?.stats?.xp)
    setShowCreateModal(false);
    setRoomName('');
    setSelectedChallenge(null);
  };

  const handleJoinRoom = async (roomId) => {
    await joinRoom(roomId)
    setActiveTab('current-room');
  };

  const handleToggleReady = () => {
    toggleReady(currentRoom.id, !playerReady)
    setPlayerReady(!playerReady);
  };

  const handleLeaveRoom = () => {
    leaveRoom(currentRoom.id);
    setPlayerReady(false);
    setActiveTab('quick-match');
  };

  // Auto-refresh available rooms every 15 seconds
  useEffect(() => {
    if (isConnected && !currentRoom) {
      getAvailableRooms();
      
      const interval = setInterval(() => {
        getAvailableRooms();
      }, 15000);      
      return () => clearInterval(interval);
    }
  }, [isConnected, currentRoom, getAvailableRooms]);

  const fetchData = async () => {
    // Prevent duplicate calls
    if (hasFetchedRef.current) return;
    
    hasFetchedRef.current = true;
    setIsLoadingChallenges(true);
    
    try {
      const data = await fetchChallenges(page);
      setQuizzes(prev => [...prev, ...data.quizzes]);
      setDebuggers(prev => [...prev, ...data.debuggers]);
      setProblems(prev => [...prev, ...data.problems]);
      
      // Check if there's more data
      if (data.quizzes.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setIsLoadingChallenges(false);
    }
  };

  useEffect(() => {
    // Reset ref when page changes
    hasFetchedRef.current = false;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  
  useEffect(() => {
    if(currentRoom){
      setActiveTab('current-room');
    }
  }, [currentRoom]);

  useEffect(() => {
    if(getMyPosition){
      getMyPosition();
    }
  }, [getMyPosition]);

  return (
    <div className="min-h-screen bg-gray-08 text-white-99">
      {/* Header */}
      <div className="border-b border-gray-20 bg-gray-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-60 rounded-lg">
                <Swords className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Battle Arena</h1>
                <p className="text-sm text-gray-50">Compete with developers worldwide</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-50">Rating:</span>
                  <span className="font-bold text-white-99">{myPosition?.totalScore}</span>
                </div>
                <div className="h-4 w-px bg-gray-30"></div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-50">W/L:</span>
                  <span className="font-bold text-green-400">{myPosition?.wins}</span>
                  <span className="text-gray-50">/</span>
                  <span className="font-bold text-red-400">{myPosition?.losses}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      {!currentRoom && (
        <div className="border-b border-gray-20 bg-gray-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-8">
              <SoundButton
                onClick={() => setActiveTab('quick-match')}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === 'quick-match'
                    ? 'border-purple-60 text-white-99'
                    : 'border-transparent text-gray-50 hover:text-white-99'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">Quick Match</span>
                </div>
              </SoundButton>
              
              <SoundButton
                onClick={() => setActiveTab('browse-rooms')}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === 'browse-rooms'
                    ? 'border-purple-60 text-white-99'
                    : 'border-transparent text-gray-50 hover:text-white-99'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">Browse Rooms</span>
                </div>
              </SoundButton>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Match Tab */}
        {activeTab === 'quick-match' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Quick Match</h2>
              <p className="text-gray-50">Get matched with an opponent instantly</p>
            </div>

            {/* Game Type Selection */}
            <div className="bg-gray-10 rounded-xl p-6 border border-gray-20">
              <label className="block text-sm font-medium text-gray-50 mb-3">Select Game Mode</label>
              <div className="grid grid-cols-3 gap-3">
                <SoundButton
                  onClick={() => setSelectedGameType('quiz')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedGameType === 'quiz'
                      ? 'border-purple-60 bg-purple-60/10'
                      : 'border-gray-20 hover:border-gray-30'
                  }`}
                >
                  <BookOpen className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">Quiz</div>
                </SoundButton>
                
                <SoundButton
                  onClick={() => setSelectedGameType('debuggers')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedGameType === 'debuggers'
                      ? 'border-purple-60 bg-purple-60/10'
                      : 'border-gray-20 hover:border-gray-30'
                  }`}
                >
                  <Bug className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">Debugger</div>
                </SoundButton>
                
                <SoundButton
                  onClick={() => setSelectedGameType('problem')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedGameType === 'problem'
                      ? 'border-purple-60 bg-purple-60/10'
                      : 'border-gray-20 hover:border-gray-30'
                  }`}
                >
                  <Code className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">Problem</div>
                </SoundButton>
              </div>
            </div>

            {/* Match SoundButton */}
            <div className="bg-gray-10 rounded-xl p-6 border border-gray-20">
              {!isLoading ? (
                <SoundButton
                  onClick={handleQuickMatch}
                  className="w-full py-4 bg-purple-60 hover:bg-purple-65 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Swords className="w-5 h-5" />
                  Find Match
                </SoundButton>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3 py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-60" />
                    <span className="text-lg font-medium">Searching for opponent...</span>
                  </div>
                  <SoundButton
                    onClick={handleCancelMatch}
                    className="w-full py-3 bg-gray-20 hover:bg-gray-30 rounded-lg font-medium transition-colors"
                  >
                    Cancel Search
                  </SoundButton>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Browse Rooms Tab */}
        {activeTab === 'browse-rooms' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Available Rooms</h2>
                <p className="text-gray-50">Join an existing room or create your own</p>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="font-medium gap-2 inline-flex items-center"
              >
                <Plus className="w-4 h-4" />
                Create Room
              </Button>
            </div>

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableRooms.map((room) => (
                <div key={room.id} className="bg-gray-10 rounded-xl p-5 border border-gray-20 hover:border-purple-60 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{room.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-50">
                        <Users className="w-3 h-3" />
                        <span>by {room.creatorUsername}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-purple-60/20 rounded text-xs font-medium text-purple-60">
                      {getGameTypeIcon(room.gameSettings.gameType)}
                      <span className="capitalize">{room.gameSettings.gameType}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-20">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-50" />
                      <span className="font-medium">{room.currentPlayers}/{room.maxPlayers}</span>
                    </div>
                    <button
                      onClick={() => handleJoinRoom(room.id)}
                      className="px-4 py-1.5 bg-purple-60 hover:bg-purple-65 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      Join
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {availableRooms.length === 0 && (
              <div className="text-center py-16">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-40" />
                <h3 className="text-xl font-bold mb-2">No rooms available</h3>
                <p className="text-gray-50 mb-6">Be the first to create a room!</p>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="font-medium inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Room
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Current Room View */}
        {currentRoom && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gray-10 rounded-xl p-6 border border-gray-20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{currentRoom?.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-50">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{currentRoom?.currentPlayers}/{currentRoom?.maxPlayers} Players</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getGameTypeIcon(currentRoom?.gameSettings?.mode)}
                      <span className="capitalize">{currentRoom?.gameSettings?.mode}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLeaveRoom}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Leave
                </button>
              </div>

              {/* Players List */}
              <div className="space-y-3 mb-6">
                <h3 className="font-medium text-gray-50">Players</h3>
                {currentRoom?.participantDetails?.map((player, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-15 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-60 rounded-full flex items-center justify-center font-bold">
                        {player?.username[0] || 'U'}
                      </div>
                      <div>
                        <div className="font-medium">{player?.username}</div>
                        <div className="text-sm text-gray-50">XP: {player?.skillLevel}</div>
                      </div>
                    </div>
                    {player?.isReady && (
                      <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                        <Check className="w-4 h-4" />
                        Ready
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Challenge Info */}
              <div className="p-4 bg-gray-15 rounded-lg mb-6">
                <h3 className="font-medium mb-2">Challenge</h3>
                <div className="text-gray-50 text-sm">{currentRoom?.gameSettings?.title}</div>
              </div>

              {/* Ready Button */}
              {!countdown && (
                <button
                  onClick={handleToggleReady}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-colors ${
                    playerReady
                      ? 'bg-gray-20 hover:bg-gray-30 text-gray-50'
                      : 'bg-purple-60 hover:bg-purple-65'
                  }`}
                >
                  {playerReady ? 'Cancel Ready' : 'Ready to Play'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-20">
            <div className="sticky top-0 bg-gray-10 border-b border-gray-20 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Create Room</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Room Name */}
              <div>
                <label className="block text-sm font-medium text-gray-50 mb-2">Room Name</label>
                <Input
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter room name..."
                  maxLength={50}
                />
              </div>

              {/* Game Type */}
              <div>
                <label className="block text-sm font-medium text-gray-50 mb-3">Game Type</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      setSelectedGameType('quiz');
                      setSelectedChallenge(null);
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedGameType === 'quiz'
                        ? 'border-purple-60 bg-purple-60/10'
                        : 'border-gray-20 hover:border-gray-30'
                    }`}
                  >
                    <BookOpen className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Quiz</div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedGameType('debuggers');
                      setSelectedChallenge(null);
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedGameType === 'debuggers'
                        ? 'border-purple-60 bg-purple-60/10'
                        : 'border-gray-20 hover:border-gray-30'
                    }`}
                  >
                    <Bug className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Debugger</div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedGameType('problem');
                      setSelectedChallenge(null);
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedGameType === 'problem'
                        ? 'border-purple-60 bg-purple-60/10'
                        : 'border-gray-20 hover:border-gray-30'
                    }`}
                  >
                    <Code className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Problem</div>
                  </button>
                </div>
              </div>

              {/* Max Players */}
              <div>
                <label className="block text-sm font-medium text-gray-50 mb-2">Max Players</label>
                <Select
                  value={maxPlayers}
                  onChange={(value) => {
                    setMaxPlayers(value)
                  }}
                  options={[{label: '2 Players', value: '2'}, {label: '3 Players', value: '3'}, {label: '4 Players', value: '4'}, {label: '5 Players', value: '5'}]}
                />
              </div>

              {/* Challenge Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-50 mb-2">
                  Select Challenge
                </label>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search challenges..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-15 border border-gray-20 rounded-lg focus:outline-none focus:border-purple-60 transition-colors text-sm"
                  />
                </div>
                {isLoadingChallenges ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-60" />
                    <span className="ml-2 text-gray-50">Loading challenges...</span>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredChallenges.map((challenge) => (
                      <button
                        key={challenge._id}
                        onClick={() => setSelectedChallenge(challenge)}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                          selectedChallenge?._id === challenge._id
                            ? 'border-purple-60 bg-purple-60/10'
                            : 'border-gray-20 hover:border-gray-30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium mb-1">{challenge.title}</div>
                            <div className="text-sm text-gray-50 truncate">{challenge.description}</div>
                          </div>
                          {challenge.difficulty && (
                            <span className={`text-xs font-medium px-2 py-1 rounded ${getDifficultyColor(challenge.difficulty)} bg-gray-20`}>
                              {challenge.difficulty}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {hasMore && (
                  <button
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={isLoadingChallenges}
                    className="w-full py-2 text-sm text-purple-60 hover:text-purple-65 font-medium"
                  >
                    {isLoadingChallenges ? 'Loading...' : 'Load More'}
                  </button>
                )}
                {filteredChallenges.length === 0 && !isLoadingChallenges && (
                  <div className="text-center py-8 text-gray-50">No challenges found.</div>
                )}
              </div>

              {/* Create Button */}
              <Button
                onClick={handleCreateRoom}
                disabled={!roomName.trim() || !selectedChallenge}
                className="w-full rounded-lg font-bold text-lg transition-colors"
              >
                Create Room
              </Button>
            </div>
          </div>
        </div>
      )}
      {countdown && (
        <GameStartCountdown 
          duration={countdown} 
          onComplete={() => {
            router.push(`${currentRoom?.gameSettings?.mode || 'quiz'}/${currentRoom?.gameSettings?._id}/${currentRoom.id}`)
          }} 
        />
      )}
    </div>
  );
};

export default BattleMatchmaking;