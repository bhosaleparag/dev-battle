"use client";
import AchievementCard from '@/components/ui/AchievementCard';
import AchievementStats from '@/components/ui/AchievementStats';
import { SoundButton } from '@/components/ui/SoundButton';
import { useSocketContext } from '@/context/SocketProvider';
import { Award } from 'lucide-react';
import { useEffect, useState } from "react";


// Main Achievement Dashboard
function AchievementDashboard() {
  const { isConnected, achievementState } = useSocketContext();
  const { achievements, myAchievements, getAchievements, getMyAchievements } = achievementState
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = ['all', 'consistency', 'performance', 'social', 'progression', 'mastery']; // 'streak', 'coding', 'special'

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

    const stats = {
    unlocked: myAchievements.filter(ua => ua.unlockedAt).length,
    total: achievements.length,
    totalPoints: myAchievements
      .filter(ua => ua.unlockedAt)
      .reduce((sum, ua) => {
        const achievement = achievements.find(a => a.achievementId === ua.achievementId);
        return sum + (achievement?.points || 0);
      }, 0)
  };

  useEffect(()=>{
    getMyAchievements();
    getAchievements();
  },[isConnected])

  return (
    <div className="min-h-screen bg-gray-08 text-white-99 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Achievements</h1>
            <p className="text-gray-60">Track your progress and unlock rewards</p>
          </div>
          <Award className="w-12 h-12 text-purple-60" />
        </div>

        {/* Stats */}
        <AchievementStats stats={stats} />

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <SoundButton
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all
                ${selectedCategory === category
                  ? 'bg-purple-60 text-white'
                  : 'bg-gray-15 text-gray-60 hover:bg-gray-20'
                }
              `}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </SoundButton>
          ))}
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map(achievement => {
            const userAchievement = myAchievements.find(
              ua => ua.achievementId === achievement.achievementId
            );
            return (
              <AchievementCard
                key={achievement.achievementId}
                achievement={{
                  ...achievement,
                  unlockedAt: userAchievement?.unlockedAt
                }}
                unlocked={!!userAchievement?.unlockedAt}
                progress={userAchievement?.progress || 0}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AchievementDashboard;