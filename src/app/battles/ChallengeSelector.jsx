import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Bug, Code, Loader2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

const ITEMS_PER_PAGE = 10;

// Fetch challenges from API
async function fetchChallenges(page) {
  const res = await fetch(`/api/challenges?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch challenges");
  return res.json();
}

// Difficulty color helper
const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: 'text-green-500',
    medium: 'text-yellow-500',
    hard: 'text-red-500',
  };
  return colors[difficulty?.toLowerCase()] || 'text-gray-50';
};

export default function CreateRoomModal({ 
  isOpen, 
  friend,
  onClose, 
  onCreateRoom // callback: (roomData) => void
}){
  // Room settings
  const [roomName, setRoomName] = useState('No Room Name');
  const [maxPlayers, setMaxPlayers] = useState('2');
  const [selectedGameType, setSelectedGameType] = useState('quiz');

  // Challenge selection
  const [quizzes, setQuizzes] = useState([]);
  const [debuggers, setDebuggers] = useState([]);
  const [problems, setProblems] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(false);
  const hasFetchedRef = useRef(false);

  // Get challenges based on selected game type
  const getChallengesByType = () => {
    switch (selectedGameType) {
      case 'quiz': return quizzes;
      case 'debuggers': return debuggers;
      case 'problem': return problems;
      default: return [];
    }
  };

  // Filter challenges by search query
  const filteredChallenges = getChallengesByType().filter((challenge) =>
    challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch data
  const fetchData = async () => {
    if (hasFetchedRef.current) return;
    
    hasFetchedRef.current = true;
    setIsLoadingChallenges(true);
    
    try {
      const data = await fetchChallenges(page);
      setQuizzes(prev => [...prev, ...data.quizzes]);
      setDebuggers(prev => [...prev, ...data.debuggers]);
      setProblems(prev => [...prev, ...data.problems]);
      
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
    if (isOpen && page === 1 && quizzes?.length > 0) {
      hasFetchedRef.current = true;
    } else if (isOpen && page >= 1) {
      // Fetch additional pages
      hasFetchedRef.current = false;
      fetchData();
    }
  }, [page, isOpen]);

  // Reset when game type changes
  useEffect(() => {
    setSelectedChallenge(null);
  }, [selectedGameType]);

  useEffect(() => {
    if(friend){
      setRoomName('No Room Name')
    }
  },[friend])
  
  // Handle create room
  const handleCreateRoom = () => {
    if (!roomName.trim() || !selectedChallenge) return;

    if(friend){
      onCreateRoom(
        friend.uid, friend.username, 
        {mode: selectedGameType, ...selectedChallenge }
      );
    } else {
      onCreateRoom(
        roomName.trim(),
        maxPlayers,
        selectedGameType,
        selectedChallenge
      );
    }

    // Reset form
    setRoomName('');
    setSelectedChallenge(null);
    setMaxPlayers('2');
    setSelectedGameType('quiz');
    onClose()
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-20">
        {/* Header */}
        <div className="sticky top-0 bg-gray-10 border-b border-gray-20 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white-99">Create Room</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white-99" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Room Name */}
          {!friend && (
            <div>
              <label className="block text-sm font-medium text-gray-50 mb-2">Room Name</label>
              <Input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name..."
                maxLength={50}
              />
            </div>
          )}

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
                <BookOpen className={`w-6 h-6 mx-auto mb-2 ${selectedGameType === 'quiz' ? 'text-purple-60' : 'text-white-99'}`} />
                <div className="text-sm font-medium text-white-99">Quiz</div>
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
                <Bug className={`w-6 h-6 mx-auto mb-2 ${selectedGameType === 'debuggers' ? 'text-purple-60' : 'text-white-99'}`} />
                <div className="text-sm font-medium text-white-99">Debugger</div>
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
                <Code className={`w-6 h-6 mx-auto mb-2 ${selectedGameType === 'problem' ? 'text-purple-60' : 'text-white-99'}`} />
                <div className="text-sm font-medium text-white-99">Problem</div>
              </button>
            </div>
          </div>

          {/* Max Players */}
          {!friend && (
            <div>
              <label className="block text-sm font-medium text-gray-50 mb-2">Max Players</label>
              <Select
                value={maxPlayers}
                onChange={(value) => setMaxPlayers(value)}
                options={[
                  {label: '2 Players', value: '2'}, 
                  {label: '3 Players', value: '3'}, 
                  {label: '4 Players', value: '4'}, 
                  {label: '5 Players', value: '5'}
                ]}
              />
            </div>
          )}

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
                className="w-full pl-10 pr-4 py-2 bg-gray-15 border border-gray-20 rounded-lg focus:outline-none focus:border-purple-60 transition-colors text-sm text-white-99"
              />
            </div>
            
            {isLoadingChallenges && page === 1 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-purple-60" />
                <span className="ml-2 text-gray-50">Loading challenges...</span>
              </div>
            ) : (
              <>
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
                          <div className="font-medium mb-1 text-white-99">{challenge.title}</div>
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

                {hasMore && !isLoadingChallenges && (
                  <button
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={isLoadingChallenges}
                    className="w-full py-2 mt-2 text-sm text-purple-60 hover:text-purple-65 font-medium transition-colors"
                  >
                    Load More
                  </button>
                )}

                {isLoadingChallenges && page > 1 && (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-60" />
                  </div>
                )}

                {filteredChallenges.length === 0 && !isLoadingChallenges && (
                  <div className="text-center py-8 text-gray-50">No challenges found.</div>
                )}
              </>
            )}
          </div>

          {/* Create Room Button */}
          <Button
            onClick={handleCreateRoom}
            disabled={!roomName.trim() || !selectedChallenge}
            className="w-full rounded-lg font-bold text-lg transition-colors py-3"
          >
            Create Room
          </Button>
        </div>
      </div>
    </div>
  );
};