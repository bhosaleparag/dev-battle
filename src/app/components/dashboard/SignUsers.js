"use client";
import { Code2, Users, Zap, Target, Award, ArrowRight, Play, Crown, Flame, UserPlus, Swords, Clock, CheckCircle2, Trophy, AlertCircle } from 'lucide-react';
import { SoundButton } from '../ui/SoundButton';
import { useRouter } from 'next/navigation';
import { useSocketContext } from '@/context/SocketProvider';
import DashboardCard from './DashboardCard';
import { AchievementIcons } from '@/lib/constants';
import FriendBar from '../ui/FriendBar';
import { useEffect, useState } from 'react';
import SentInvitesList from '../FriendMatch/SentInvitesList';
import CreateRoomModal from '@/battles/ChallengeSelector';
import { calculateLevel } from '@/utils/calculateLevel';

export default function SignedInDashboard({ user }) {
  const { friendsState, leaderboardState, achievementState, roomsState } = useSocketContext();
  const { friendList } = friendsState;
  const { leaderboard } = leaderboardState;
  const { recentUnlocked } = achievementState;
  const { inviteFriend, cancelFriendInvite, sentInvites } = roomsState;
  const [quiz, setQuiz] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const router = useRouter();
  const userStat = calculateLevel(user?.stats?.xp)

  const handleInviteFriend = (friend) => {
    setSelectedFriend(friend);
    setShowInviteModal(true);
  };

  const handleSendInvite = (friendId, friendUsername, gameSettings) => {
    inviteFriend(friendId, friendUsername, gameSettings);
  };

  const handleCancelInvite = (inviteId) => {
    cancelFriendInvite(inviteId);
  };

  // Check if friend has pending invite
  const hasPendingInvite = (friendId) => {
    return sentInvites.some(inv => inv.receiverId === friendId);
  };
 
  useEffect(() => {
    async function fetchDailyQuiz() {
      try {
        const response = await fetch(`/api/daily-quiz?userId=${user?.uid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch daily quiz');
        }
        
        const data = await response.json();
        setQuiz(data);
      } catch (err) {
        console.error(err.message);
      }
    }

    fetchDailyQuiz();
  }, []);

  return (
    <div className="min-h-screen bg-gray-08 text-white-99">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* complete user profile */}
        {!(user?.bio && user?.birthDate && user?.gender && user?.location && user?.avatar) && (
          <div className="bg-gradient-to-r from-purple-60/20 to-purple-70/20 border border-purple-60/30 rounded-lg p-4 mb-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-60/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-purple-70" />
                </div>
                <div>
                  <h4 className="text-white-99 font-semibold text-sm sm:text-base">Complete Your Profile</h4>
                  <p className="text-gray-60 text-xs sm:text-sm">Fill in your account settings to unlock all features</p>
                </div>
              </div>
              <SoundButton onClick={()=>router.push('/settings')} className="px-4 py-2 bg-purple-60 hover:bg-purple-65 text-white-99 rounded-lg text-sm font-medium transition-colors flex-shrink-0">
                Complete Now
              </SoundButton>
            </div>
          </div>
        )}
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-white-99">
            Welcome back, {user?.username}! 👋
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            {/* Level Badge */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl w-fit">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/40">
                <span className="text-lg font-bold text-purple-400">L{userStat?.level}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-60">Level {userStat?.level}</span>
                <span className="text-sm font-semibold text-white-99">{userStat?.xpToNextLevel} XP to next</span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* XP Display */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-gray-08 to-gray-10 border border-gray-15 rounded-lg">
                <Zap className="w-4 h-4 text-purple-75" />
                <span className="text-sm text-gray-60">
                  <span className="text-white-99 font-semibold">{user?.stats?.xp}</span> XP
                </span>
              </div>

              {/* Streak Display */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold text-white-99">
                  {user?.stats?.streak} streak{user?.stats?.streak !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 sm:mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-60">Progress to Level {userStat?.level + 1}</span>
              <span className="text-xs text-gray-60">{userStat?.progressPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-gray-15 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${userStat?.progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <SoundButton onClick={()=>router.push('/explore')} className="group relative bg-gradient-to-br from-gray-08 to-gray-10 border border-gray-15 rounded-xl p-4 hover:border-purple-60/30 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-60/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-center gap-3">
              <Target className="w-5 h-5 text-purple-75" />
              <span className="font-semibold text-white-99">Challenge</span>
            </div>
          </SoundButton>
          <SoundButton onClick={()=>router.push('/battles')} className="group relative bg-gradient-to-br from-gray-08 to-gray-10 border border-gray-15 rounded-xl p-4 hover:border-purple-60/30 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-60/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-center gap-3">
              <Zap className="w-5 h-5 text-purple-75" />
              <span className="font-semibold text-white-99">Quick Match</span>
            </div>
          </SoundButton>
          <SoundButton onClick={()=>router.push('/battles?openCreateRoom=true')} className="group relative bg-gradient-to-br from-gray-08 to-gray-10 border border-gray-15 rounded-xl p-4 hover:border-purple-60/30 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-60/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-center gap-3">
              <UserPlus className="w-5 h-5 text-purple-75" />
              <span className="font-semibold text-white-99">Create Room</span>
            </div>
          </SoundButton>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Daily Challenge */}
            <DashboardCard title="Daily Challenge" icon={<Code2 className="w-5 h-5" />}>
              <div className="space-y-4">
                {quiz && !quiz.completed ? (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-60">Difficulty: <span className="text-yellow-400 font-semibold">Medium</span></span>
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-75" />
                        <span className="text-gray-60">XP: <span className="text-white-99 font-semibold">{quiz?.xp}</span></span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-base sm:text-lg text-white-99">{quiz?.title}</h3>
                      <p className="text-sm text-gray-60 mb-4">{quiz?.description}</p>
                      <SoundButton onClick={()=>router.push(`/quiz/${quiz?._id}`)} className="w-full px-4 py-3 bg-purple-60 hover:bg-purple-65 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group">
                        <Play className="w-4 h-4" />
                        <span>Start Challenge</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </SoundButton>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-white-90 font-semibold">Challenge Completed!</p>
                    <p className="text-sm text-gray-40 mt-1">Come back tomorrow for a new challenge</p>
                  </div>
                )}
              </div>
            </DashboardCard>

            {/* Recent Achievements */}
            <DashboardCard title="Recent Achievements" icon={<Award className="w-5 h-5" />}>
              <div className="space-y-3">
                {recentUnlocked && recentUnlocked.length > 0 ? (
                  <>
                    {recentUnlocked.slice(0,2).map(a => {
                      const Icon = AchievementIcons[a.achievement.icon] || Trophy;
                      return (
                        <div key={a.id} className="group relative bg-gradient-to-br from-gray-08 to-gray-10 border border-gray-15 rounded-xl p-3 hover:border-purple-60/30 transition-all duration-300 overflow-hidden cursor-pointer">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-60/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative flex items-center gap-3">
                            <Icon className="w-7 h-7 text-white-99 group-hover:text-purple-75 transition-colors duration-300" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm sm:text-base text-white-99 group-hover:text-purple-75 transition-colors duration-300">{a.achievement.name}</h4>
                              <p className="text-xs sm:text-sm text-gray-60 break-words">{a.achievement.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
                      <Award className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2">No Achievements Yet</h4>
                    <p className="text-sm text-gray-400">Start coding to unlock your first achievement!</p>
                  </div>
                )}
                <SoundButton onClick={()=>router.push('/achievements')} className="w-full py-2 text-sm text-purple-75 hover:text-purple-70 transition-colors flex items-center justify-center gap-1">
                  View All Achievements
                  <ArrowRight className="w-4 h-4" />
                </SoundButton>
              </div>
            </DashboardCard>
          </div>
          
          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            
            {/* Invited friends */}
            <DashboardCard title="Invitation For Matches" icon={<Users className="w-5 h-5" />}>
              <div className="space-y-6">
                {sentInvites.length > 0 ? (
                  <SentInvitesList 
                    invites={sentInvites}
                    onCancel={handleCancelInvite}
                  />
                ):(
                  <div className="flex flex-col items-center py-6 px-4 space-y-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                      <Users className="w-6 h-6 text-purple-300" />
                    </div>
                    <div className="text-center">
                      <h4 className="text-lg font-medium text-white mb-1">No Pending Invites</h4>
                      <p className="text-xs text-gray-400">Start by inviting an online friend to play</p>
                    </div>
                  </div>
                )}
              </div>
            </DashboardCard>
            {/* Friends List */}
            <DashboardCard title="Friends" icon={<Users className="w-5 h-5" />}>
              {friendList?.accepted?.length > 0 ? (
                <>
                  {friendList?.accepted?.slice(0,2).map(friend => (
                    <FriendBar
                      key={friend.uid}
                      friend={friend}
                      isPendingInvite={hasPendingInvite(friend.id)}
                      onChallengeFriend={()=>handleInviteFriend(friend)}
                      onRemoveFriend={() => onRemoveFriend(friend.uid)}
                    />
                  ))}
                </>
              ):(
                <div className="flex flex-col items-center py-6 px-4 space-y-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <Users className="w-6 h-6 text-purple-300" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-medium text-white mb-1">Find Your Rivals</h4>
                    <p className="text-xs text-gray-400">Connect with friends and challenge them!</p>
                  </div>
                </div>
              )}
              <SoundButton onClick={()=>router.push('/friends')} className="w-full py-2 text-sm text-purple-75 hover:text-purple-70 transition-colors flex items-center justify-center gap-1">
                Add Friends
                <ArrowRight className="w-4 h-4" />
              </SoundButton>
            </DashboardCard>

            {/* Leaderboard */}
            <DashboardCard title="Leaderboard" icon={<Crown className="w-5 h-5" />}>
              <div className="space-y-2">
                {leaderboard?.slice(0,5)?.map(entry => (
                  <div key={entry.rank} className="group relative bg-gradient-to-br from-gray-08 to-gray-10 border border-gray-15 rounded-lg p-2 hover:border-purple-60/30 transition-all duration-300 overflow-hidden cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-60/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 flex items-center justify-center text-xs font-bold ${
                          entry.rank === 1 ? 'text-yellow-400' :
                          entry.rank === 2 ? 'text-white-90' :
                          entry.rank === 3 ? 'text-orange-400' :
                          'text-gray-40'
                        }`}>
                          {entry.rank === 1 ? '👑' :
                            entry.rank === 2 ? '🥈' :
                            entry.rank === 3 ? '🥉' :
                            `#${entry.rank}`}
                        </span>
                        <span className="font-semibold text-sm truncate text-white-99">{entry.username}</span>
                      </div>
                      <span className="text-sm text-gray-60">{entry.totalScore.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                <SoundButton  onClick={()=>router.push('/leaderboard')} className="w-full py-2 text-sm text-purple-75 hover:text-purple-70 transition-colors flex items-center justify-center gap-1">
                  View Full Leaderboard
                  <ArrowRight className="w-4 h-4" />
                </SoundButton>
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>

      <CreateRoomModal
        friend={selectedFriend}
        isOpen={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          setSelectedFriend(null);
        }}
        onCreateRoom={handleSendInvite}
      />
    </div>
  );
}