// app/user/[uid]/page.tsx
import { notFound } from 'next/navigation';
import { 
  User, 
  MapPin, 
  Calendar, 
  Mail, 
  Globe, 
  Trophy, 
  Flame, 
  Zap, 
  Swords,
  Target,
  TrendingUp,
  Award
} from 'lucide-react';
import calculateLevel from '@/utils/calculateLevel';
import StatCard from '@/components/ui/StatCard';
import EditBtn from './EditBtn';
import calculateAge from '@/utils/calculateAge';
import { getUserProfile } from '@/api/firebase/users';

export default async function UserProfilePage({ params }) {
  const { uid } = await params;
  const profile = await getUserProfile(uid);
  
  if (!profile || !profile.isProfilePublic) {
    notFound();
  }

  const age = profile?.birthDate ? calculateAge(profile.birthDate) : null;
  const { level, currentXP, nextLevelXP } = calculateLevel(profile.stats.xp);
  const xpProgress = (currentXP / nextLevelXP) * 100;
  const winRate = profile?.stats?.quizzesTaken > 0 
    ? Math.round((profile.stats?.battlesWon / profile.stats.quizzesTaken) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-08 text-white-99 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-gray-10 rounded-2xl border border-gray-15 overflow-hidden mb-6">
          {/* Cover Pattern */}
          <div className="h-32 md:h-48 bg-gradient-to-br from-purple-60 via-purple-70 to-purple-75 relative">
            <div className="absolute inset-0 opacity-20" 
                 style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)' }}>
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-6 md:px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 md:-mt-20">
              {/* Avatar */}
              <div className="relative">
                <img 
                  src={profile.avatar} 
                  alt={profile.username}
                  className="w-28 h-28 md:w-36 md:h-36 rounded-2xl border-4 border-gray-10 object-cover"
                />
                <div className="absolute -bottom-2 -right-2 bg-purple-60 text-white-99 rounded-xl px-3 py-1 text-sm font-bold flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  Lv.{level}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 z-10">
                <h1 className="text-3xl md:text-4xl font-bold text-white-99 mb-2">
                  {profile.username}
                </h1>
                {profile.bio && (
                  <p className="text-white-90 text-base md:text-lg mb-4 max-w-2xl">
                    {profile.bio}
                  </p>
                )}
                
                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-50">
                  {profile.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-purple-60" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {age && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-purple-60" />
                      <span>{age} years old</span>
                    </div>
                  )}
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" 
                       className="flex items-center gap-1.5 hover:text-purple-60 transition-colors">
                      <Globe className="w-4 h-4" />
                      <span>Website</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Action Button (for viewing own profile) */}
              <EditBtn uid={uid} />
            </div>

            {/* XP Progress Bar */}
            <div className="mt-6 bg-gray-15 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-50">Experience Progress</span>
                <span className="text-purple-60 font-semibold">{currentXP} / {nextLevelXP} XP</span>
              </div>
              <div className="w-full bg-gray-20 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-60 to-purple-70 h-full rounded-full transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {profile.showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard 
              icon={<Flame className="w-6 h-6" />}
              label="Current Streak"
              value={profile.stats.streak}
              color="text-orange-500"
              bgColor="bg-orange-500/10"
            />
            <StatCard 
              icon={<Target className="w-6 h-6" />}
              label="Quizzes Taken"
              value={profile.stats.quizzesTaken}
              color="text-blue-500"
              bgColor="bg-blue-500/10"
            />
            <StatCard 
              icon={<Trophy className="w-6 h-6" />}
              label="Battles Won"
              value={profile.stats.battlesWon}
              color="text-yellow-500"
              bgColor="bg-yellow-500/10"
            />
            <StatCard 
              icon={<TrendingUp className="w-6 h-6" />}
              label="Win Rate"
              value={`${winRate}%`}
              color="text-green-500"
              bgColor="bg-green-500/10"
            />
          </div>
        )}

        {/* Achievements Section */}
        {profile.achievements && profile.achievements.length > 0 && (
          <div className="bg-gray-10 rounded-2xl border border-gray-15 p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-bold text-white-99 mb-6 flex items-center gap-3">
              <Award className="w-6 h-6 text-purple-60" />
              Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {profile.achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className="bg-gray-15 rounded-xl p-4 border border-gray-20 hover:border-purple-60 transition-colors group"
                >
                  <div className="w-12 h-12 bg-purple-60/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-60/30 transition-colors">
                    {achievement.icon === 'trophy' && <Trophy className="w-6 h-6 text-purple-60" />}
                    {achievement.icon === 'flame' && <Flame className="w-6 h-6 text-orange-500" />}
                    {achievement.icon === 'zap' && <Zap className="w-6 h-6 text-yellow-500" />}
                  </div>
                  <h3 className="text-white-99 font-semibold text-sm mb-1">
                    {achievement.name}
                  </h3>
                  <p className="text-gray-50 text-xs">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Chart Placeholder */}
        <div className="bg-gray-10 rounded-2xl border border-gray-15 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-white-99 mb-6 flex items-center gap-3">
            <Swords className="w-6 h-6 text-purple-60" />
            Recent Performance
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-50">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-40" />
              <p>Performance chart will be displayed here</p>
              <p className="text-sm text-gray-60 mt-1">Track your progress over time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
