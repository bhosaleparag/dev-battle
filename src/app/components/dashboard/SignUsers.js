"use client";
import useAuth from '@/hooks/useAuth';
import {
  Users, 
  Brain, 
  Code2, 
  Timer, 
  Play,
  Zap,
  Target,
  Crown,
  Medal,
  UserPlus,
  Swords,
  Clock,
  Plus,
  Flame,
  Award,
  User,
  MessageSquare
} from 'lucide-react';
import { SoundButton } from '../ui/SoundButton';

// Mock user data
const currentUser = {
  name: "Alex Chen",
  username: "alexcode",
  level: 12,
  xp: 2450,
  xpToNext: 3000,
  streak: 7,
  avatar: null
};

// Mock friends data
const friends = [
  { id: 1, name: "Sarah Kim", username: "sarahk", isOnline: true, status: "In Battle", avatar: null },
  { id: 2, name: "Mike Johnson", username: "mikej", isOnline: true, status: "Available", avatar: null },
  { id: 3, name: "Emma Davis", username: "emmad", isOnline: false, status: "Offline", lastSeen: "2h ago", avatar: null },
  { id: 4, name: "Tom Wilson", username: "tomw", isOnline: true, status: "In Quiz", avatar: null },
  { id: 5, name: "Lisa Brown", username: "lisab", isOnline: false, status: "Offline", lastSeen: "1d ago", avatar: null }
];

// Mock running battles
const runningBattles = [
  { 
    id: 1, 
    title: "React Hooks Challenge", 
    difficulty: "Medium", 
    timeLeft: "5:32",
    players: 3,
    maxPlayers: 4,
    prize: "75 XP",
    category: "React"
  },
  { 
    id: 2, 
    title: "Algorithm Speed Run", 
    difficulty: "Hard", 
    timeLeft: "12:45",
    players: 1,
    maxPlayers: 2,
    prize: "100 XP",
    category: "Algorithms"
  },
  { 
    id: 3, 
    title: "CSS Grid Masters", 
    difficulty: "Easy", 
    timeLeft: "8:20",
    players: 5,
    maxPlayers: 6,
    prize: "50 XP",
    category: "CSS"
  }
];

// Mock recent achievements
const recentAchievements = [
  { 
    id: 1, 
    name: "Speed Demon", 
    description: "Solved 5 problems under 30 seconds", 
    icon: Zap, 
    unlockedAt: "2 days ago",
    rarity: "rare"
  },
  { 
    id: 2, 
    name: "Perfect Score", 
    description: "Got 100% on Daily Quiz", 
    icon: Target, 
    unlockedAt: "5 days ago",
    rarity: "epic"
  },
  { 
    id: 3, 
    name: "Social Butterfly", 
    description: "Added 5 friends", 
    icon: Users, 
    unlockedAt: "1 week ago",
    rarity: "common"
  }
];

// Mock today's quiz
const todayQuiz = {
  title: "TypeScript Advanced Types",
  difficulty: "Hard",
  questions: 20,
  timeLimit: "15 min",
  completed: false,
  bestScore: null
};

export default function SignedInDashboard() {
  const { user } = useAuth();
  const progressPercentage = (currentUser.xp / currentUser.xpToNext) * 100;

  return (
    <div className="min-h-screen bg-gray-08 text-white-99 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-60 to-purple-70 rounded-2xl p-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back, {user?.name || user?.username}! 👋
                </h1>
                <p className="text-purple-95 mb-4">
                  Ready to continue your coding journey? You're on a {currentUser?.stats?.streak}-day streak!
                </p>
                <div className="flex items-center gap-6">
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2 text-white">
                      <Crown className="w-5 h-5" />
                      <span className="font-semibold">Level {currentUser?.level || 0}</span>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2 text-white">
                      <Flame className="w-5 h-5" />
                      <span className="font-semibold">{currentUser?.stats?.streak} day streak</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* XP Progress */}
              <div className="bg-white/20 rounded-2xl p-4 min-w-[200px]">
                <div className="text-white text-sm mb-2">XP Progress</div>
                <div className="bg-white/20 rounded-full h-3 mb-2">
                  <div 
                    className="bg-white rounded-full h-3 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="text-white text-sm">
                  {currentUser.xp} / {currentUser.xpToNext} XP
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -right-8 -top-8 opacity-20">
            <Code2 className="w-32 h-32 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Today's Quiz */}
            <div className="bg-gray-10 rounded-2xl p-6 border border-gray-20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-60 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white-99">Today's Quiz</h3>
                  <p className="text-gray-60">Daily challenge awaits!</p>
                </div>
                {!todayQuiz.completed && (
                  <div className="ml-auto bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                    New
                  </div>
                )}
              </div>

              <div className="bg-gray-15 rounded-xl p-5">
                <h4 className="text-lg font-semibold text-white-99 mb-3">{todayQuiz.title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-60 mb-4">
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {todayQuiz.difficulty}
                  </span>
                  <span className="flex items-center gap-1">
                    <Timer className="w-4 h-4" />
                    {todayQuiz.timeLimit}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {todayQuiz.questions} questions
                  </span>
                </div>
                
                {todayQuiz.completed ? (
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-center">
                    <div className="text-green-400 font-medium">✅ Completed Today!</div>
                    <div className="text-sm text-gray-60 mt-1">
                      Best Score: {todayQuiz.bestScore}% • Come back tomorrow for more
                    </div>
                  </div>
                ) : (
                  <SoundButton className="w-full bg-purple-60 hover:bg-purple-65 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <Play className="w-5 h-5" />
                    Start Quiz
                  </SoundButton>
                )}
              </div>
            </div>

            {/* Running Battles */}
            <div className="bg-gray-10 rounded-2xl p-6 border border-gray-20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Swords className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white-99">Live Battles</h3>
                    <p className="text-gray-60">Join ongoing challenges</p>
                  </div>
                </div>
                <SoundButton className="bg-purple-60 hover:bg-purple-65 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Battle
                </SoundButton>
              </div>

              <div className="space-y-4">
                {runningBattles.map((battle) => (
                  <div key={battle.id} className="bg-gray-15 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-white-99 mb-1">{battle.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-60">
                          <span className="bg-purple-90 text-purple-60 px-2 py-1 rounded text-xs font-medium">
                            {battle.category}
                          </span>
                          <span className="text-yellow-500">{battle.difficulty}</span>
                          <span className="text-green-400">{battle.prize}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-red-400 font-mono text-lg font-semibold flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {battle.timeLeft}
                        </div>
                        <div className="text-sm text-gray-60">
                          {battle.players}/{battle.maxPlayers} players
                        </div>
                      </div>
                    </div>
                    <SoundButton className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors">
                      Join Battle
                    </SoundButton>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Battle Card */}
            <div className="bg-gray-10 rounded-2xl p-6 border border-gray-20 border-dashed">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-60/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-purple-60" />
                </div>
                <h3 className="text-lg font-semibold text-white-99 mb-2">Create Your Own Battle</h3>
                <p className="text-gray-60 mb-4">
                  Challenge friends or create a public battle room. Set your own rules and difficulty.
                </p>
                <SoundButton className="bg-purple-60 hover:bg-purple-65 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto">
                  <Swords className="w-5 h-5" />
                  Create Battle Room
                </SoundButton>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* Friends List */}
            <div className="bg-gray-10 rounded-2xl p-6 border border-gray-20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white-99">Friends</h3>
                    <p className="text-gray-60">{friends.filter(f => f.isOnline).length} online</p>
                  </div>
                </div>
                <SoundButton className="bg-gray-20 hover:bg-gray-30 text-white-99 p-2 rounded-lg transition-colors">
                  <UserPlus className="w-5 h-5" />
                </SoundButton>
              </div>

              <div className="space-y-3 mb-4">
                {friends.slice(0, 4).map((friend) => (
                  <div key={friend.id} className="flex items-center gap-3 p-3 bg-gray-15 rounded-lg hover:bg-gray-20 transition-colors">
                    <div className="relative">
                      <div className="w-10 h-10 bg-purple-60 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-15 ${
                        friend.isOnline ? 'bg-green-500' : 'bg-gray-50'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white-99">{friend.name}</div>
                      <div className={`text-sm ${
                        friend.isOnline 
                          ? friend.status === 'Available' 
                            ? 'text-green-400' 
                            : 'text-yellow-400'
                          : 'text-gray-60'
                      }`}>
                        {friend.isOnline ? friend.status : `Offline • ${friend.lastSeen}`}
                      </div>
                    </div>
                    {friend.isOnline && friend.status === 'Available' && (
                      <SoundButton className="bg-purple-60 hover:bg-purple-65 text-white px-3 py-1 rounded text-sm transition-colors">
                        Invite
                      </SoundButton>
                    )}
                  </div>
                ))}
              </div>

              <SoundButton className="w-full bg-gray-20 hover:bg-gray-30 text-white-99 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <UserPlus className="w-5 h-5" />
                Add More Friends
              </SoundButton>
            </div>

            {/* Recent Achievements */}
            <div className="bg-gray-10 rounded-2xl p-6 border border-gray-20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white-99">Recent Achievements</h3>
                  <p className="text-gray-60">Your latest unlocks</p>
                </div>
              </div>

              <div className="space-y-3">
                {recentAchievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  const rarityColors = {
                    common: 'bg-gray-50 text-gray-10',
                    rare: 'bg-blue-500 text-white',
                    epic: 'bg-purple-60 text-white',
                    legendary: 'bg-yellow-500 text-white'
                  };
                  
                  return (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-15 rounded-lg">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${rarityColors[achievement.rarity]}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white-99">{achievement.name}</div>
                        <div className="text-sm text-gray-60">{achievement.description}</div>
                        <div className="text-xs text-gray-60 mt-1">{achievement.unlockedAt}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <SoundButton className="w-full mt-4 bg-gray-20 hover:bg-gray-30 text-white-99 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <Medal className="w-5 h-5" />
                View All Achievements
              </SoundButton>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}