import { 
  Trophy, 
  Users, 
  Brain, 
  Code2, 
  Timer, 
  Star,
  ArrowRight,
  Play,
  Zap,
  Target,
  Crown,
  Medal
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import { SoundButton } from '../ui/SoundButton';

// Mock data for demonstration
const mockDailyQuiz = {
  title: "JavaScript Fundamentals",
  difficulty: "Medium",
  questions: 15,
  timeLimit: "10 min",
  participants: 1247
};

const mockLeaderboard = [
  { rank: 1, name: "CodeMaster", score: 2850, streak: 15 },
  { rank: 2, name: "BugSlayer", score: 2720, streak: 12 },
  { rank: 3, name: "AlgoWiz", score: 2680, streak: 8 },
  { rank: 4, name: "DevNinja", score: 2450, streak: 6 },
  { rank: 5, name: "ScriptKid", score: 2380, streak: 4 }
];

const mockAchievements = [
  { id: 1, name: "First Steps", description: "Complete your first quiz", icon: Star, unlocked: false },
  { id: 2, name: "Speed Demon", description: "Solve 5 problems under 30 seconds", icon: Zap, unlocked: false },
  { id: 3, name: "Social Coder", description: "Add 3 friends", icon: Users, unlocked: false },
  { id: 4, name: "Perfectionist", description: "Get 100% on any quiz", icon: Target, unlocked: false }
];

const mockBattles = [
  { id: 1, title: "Debug Challenge", players: "2/4", difficulty: "Hard", prize: "50 XP" },
  { id: 2, title: "Algorithm Race", players: "1/2", difficulty: "Medium", prize: "30 XP" },
  { id: 3, title: "React Showdown", players: "3/6", difficulty: "Expert", prize: "100 XP" }
];

function NonSignUser() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-08 text-white-99">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-60 to-purple-70 rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-3">
              Welcome to CodeBattle
            </h2>
            <p className="text-purple-95 text-lg mb-6 max-w-2xl">
              Challenge yourself with daily coding quizzes, compete in real-time battles, 
              and climb the leaderboard. Join thousands of developers improving their skills.
            </p>
            <SoundButton onClick={()=>router.push('/register')} className="bg-white text-purple-60 px-8 py-3 rounded-lg font-semibold hover:bg-white-95 transition-colors flex items-center gap-2">
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </SoundButton>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-20">
            <Trophy className="w-32 h-32 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Daily Quiz */}
            <div className="bg-gray-10 rounded-2xl p-6 border border-gray-20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-60 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white-99">Daily Quiz</h3>
                    <p className="text-gray-60">Test your knowledge daily</p>
                  </div>
                </div>
                <div className="bg-purple-90 text-purple-60 px-3 py-1 rounded-full text-sm font-medium">
                  New
                </div>
              </div>

              <div className="bg-gray-15 rounded-xl p-4 mb-4">
                <h4 className="text-lg font-semibold text-white-99 mb-2">{mockDailyQuiz.title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-60 mb-4">
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {mockDailyQuiz.difficulty}
                  </span>
                  <span className="flex items-center gap-1">
                    <Timer className="w-4 h-4" />
                    {mockDailyQuiz.timeLimit}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {mockDailyQuiz.participants.toLocaleString()} joined
                  </span>
                </div>
                <Button onClick={()=>router.push('/register')} className="w-full flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Start Quiz (Sign in required)
                </Button>
              </div>
            </div>

            {/* Coding Battles */}
            <div className="bg-gray-10 rounded-2xl p-6 border border-gray-20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white-99">Live Battles</h3>
                    <p className="text-gray-60">Join real-time coding challenges</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {mockBattles.map((battle) => (
                  <div key={battle.id} className="bg-gray-15 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white-99 mb-1">{battle.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-60">
                        <span>{battle.players} players</span>
                        <span className="text-yellow-500">{battle.difficulty}</span>
                        <span className="text-green-500">{battle.prize}</span>
                      </div>
                    </div>
                    <SoundButton onClick={()=>router.push('/register')} className="px-4 py-2 bg-gray-20 hover:bg-gray-30 text-white-99 rounded-lg text-sm transition-colors">
                      Join
                    </SoundButton>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Leaderboard */}
            <div className="bg-gray-10 rounded-2xl p-6 border border-gray-20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white-99">Leaderboard</h3>
                  <p className="text-gray-60">Top performers</p>
                </div>
              </div>

              <div className="space-y-3">
                {mockLeaderboard.map((user) => (
                  <div key={user.rank} className="flex items-center gap-3 p-3 bg-gray-15 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      user.rank === 1 ? 'bg-yellow-500 text-white' :
                      user.rank === 2 ? 'bg-gray-400 text-white' :
                      user.rank === 3 ? 'bg-yellow-600 text-white' :
                      'bg-gray-30 text-white-99'
                    }`}>
                      {user.rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white-99">{user.name}</div>
                      <div className="text-sm text-gray-60">{user.score} points</div>
                    </div>
                    <div className="text-sm text-orange-500 flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      {user.streak}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements Preview */}
            <div className="bg-gray-10 rounded-2xl p-6 border border-gray-20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-60 to-purple-70 rounded-xl flex items-center justify-center">
                  <Medal className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white-99">Achievements</h3>
                  <p className="text-gray-60">Unlock your potential</p>
                </div>
              </div>

              <div className="space-y-3">
                {mockAchievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-15 rounded-lg opacity-60">
                      <div className="w-10 h-10 bg-gray-20 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-gray-50" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white-99">{achievement.name}</div>
                        <div className="text-sm text-gray-60">{achievement.description}</div>
                      </div>
                      <div className="w-6 h-6 border-2 border-gray-30 rounded-full"></div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-gray-15 rounded-lg text-center">
                <p className="text-sm text-gray-60 mb-2">Sign in to start earning achievements</p>
                <SoundButton onClick={()=>router.push('/register')} className="text-purple-60 hover:text-purple-65 font-medium text-sm">
                  Create Account →
                </SoundButton>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Footer */}
        <div className="mt-12 bg-gray-10 rounded-2xl p-8 border border-gray-20 text-center">
          <h3 className="text-2xl font-bold text-white-99 mb-3">
            Ready to Start Your Coding Journey?
          </h3>
          <p className="text-gray-60 mb-6 max-w-2xl mx-auto">
            Join thousands of developers who are sharpening their skills, making friends, 
            and climbing the leaderboard. Your coding adventure starts here.
          </p>
          <div className="flex items-center justify-center gap-4">
            <SoundButton onClick={()=>router.push('/register')} className="px-8 py-3 bg-purple-60 hover:bg-purple-65 text-white rounded-lg font-semibold transition-colors">
              Sign Up Free
            </SoundButton>
            <SoundButton className="px-8 py-3 border border-gray-20 hover:border-gray-30 text-white-99 rounded-lg font-semibold transition-colors">
              Learn More
            </SoundButton>
          </div>
        </div>
      </div>
    </div>
  );
}
export default NonSignUser