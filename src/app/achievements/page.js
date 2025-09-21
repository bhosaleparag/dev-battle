// components/Achievements.jsx
"use client";
import { useState } from 'react';
import { 
  Trophy, 
  Star, 
  Flame, 
  Zap,
  GraduationCap,
  Heart,
  Lock,
  Calendar
} from "lucide-react";

const Achievements = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', count: 24 },
    { id: 'completed', name: 'Completed', count: 8 },
    { id: 'progress', name: 'In Progress', count: 6 },
    { id: 'locked', name: 'Locked', count: 10 }
  ];

  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first task',
      icon: GraduationCap,
      category: 'beginner',
      status: 'completed',
      progress: 100,
      maxProgress: 100,
      points: 50,
      unlockedDate: '2024-09-10',
      rarity: 'common',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 2,
      title: 'Speed Demon',
      description: 'Complete 10 tasks in under 5 minutes each',
      icon: Zap,
      category: 'speed',
      status: 'completed',
      progress: 10,
      maxProgress: 10,
      points: 150,
      unlockedDate: '2024-09-12',
      rarity: 'rare',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      id: 3,
      title: 'Consistency King',
      description: 'Log in for 7 consecutive days',
      icon: Calendar,
      category: 'consistency',
      status: 'progress',
      progress: 5,
      maxProgress: 7,
      points: 200,
      rarity: 'uncommon',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 4,
      title: 'Perfectionist',
      description: 'Complete 50 tasks with 100% accuracy',
      icon: Star,
      category: 'quality',
      status: 'progress',
      progress: 23,
      maxProgress: 50,
      points: 300,
      rarity: 'epic',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 5,
      title: 'Master of All',
      description: 'Complete 1000 tasks total',
      icon: Trophy,
      category: 'milestone',
      status: 'locked',
      progress: 234,
      maxProgress: 1000,
      points: 1000,
      rarity: 'legendary',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 6,
      title: 'Team Player',
      description: 'Help 25 other users',
      icon: Heart,
      category: 'social',
      status: 'completed',
      progress: 25,
      maxProgress: 25,
      points: 250,
      unlockedDate: '2024-09-13',
      rarity: 'rare',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      id: 7,
      title: 'Hot Streak',
      description: 'Complete 20 tasks in a row without errors',
      icon: Flame,
      category: 'streak',
      status: 'progress',
      progress: 8,
      maxProgress: 20,
      points: 400,
      rarity: 'epic',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      id: 8,
      title: 'Night Owl',
      description: 'Complete 10 tasks between 12 AM - 6 AM',
      icon: Star,
      category: 'special',
      status: 'locked',
      progress: 0,
      maxProgress: 10,
      points: 150,
      rarity: 'uncommon',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    }
  ];

  const stats = {
    totalPoints: 1250,
    completedAchievements: 8,
    totalAchievements: 24,
    currentLevel: 5,
    nextLevelPoints: 300
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'uncommon': return 'text-green-600 bg-green-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (selectedCategory === 'all') return true;
    return achievement.status === selectedCategory;
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white-99 mb-4">Achievements</h1>
          <p className="text-xl text-gray-600">Track your progress and unlock rewards</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-08 rounded-xl shadow-sm p-6 border border-gray-15">
            <div className="text-center">
              <Trophy className="h-8 w-8 fill-current text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white-99">{stats.totalPoints}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
          </div>
          <div className="bg-gray-08 rounded-xl shadow-sm p-6 border border-gray-15">
            <div className="text-center">
              <Star className="h-8 w-8 fill-current text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white-99">{stats.completedAchievements}/{stats.totalAchievements}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
          <div className="bg-gray-08 rounded-xl shadow-sm p-6 border border-gray-15">
            <div className="text-center">
              <Zap className="h-8 w-8 fill-current text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white-99">Level {stats.currentLevel}</div>
              <div className="text-sm text-gray-600">Current Level</div>
            </div>
          </div>
          <div className="bg-gray-08 rounded-xl shadow-sm p-6 border border-gray-15">
            <div className="text-center">
              <Flame className="h-8 w-8 fill-current text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white-99">{stats.nextLevelPoints}</div>
              <div className="text-sm text-gray-600">To Next Level</div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-08 text-white-99 hover:bg-gray-100 hover:text-gray-15 border border-gray-300'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => {
            const IconClasses = achievement.status === 'completed' ? `${achievement.color} fill-current` : 'text-gray-400';
            const isLocked = achievement.status === 'locked';
            
            return (
              <div
                key={achievement.id}
                className={`bg-gray-08 rounded-xl shadow-sm border-2 p-6 transition-all duration-200 hover:shadow-md ${
                  achievement.status === 'completed' 
                    ? 'border-green-800'
                    : isLocked 
                      ? 'border-gray-15 opacity-75'
                      : 'border-gray-15'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    achievement.status === 'completed' 
                      ? achievement.bgColor 
                      : isLocked 
                        ? 'bg-gray-100' 
                        : achievement.bgColor
                  }`}>
                    {isLocked ? (
                      <Lock className="h-6 w-6 text-gray-400" />
                    ) : (
                      <achievement.icon className={`h-6 w-6 ${IconClasses}`} />
                    )}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity}
                  </div>
                </div>

                <h3 className={`text-lg font-semibold mb-2 ${isLocked ? 'text-gray-400' : 'text-white-99'}`}>
                  {achievement.title}
                </h3>
                <p className={`text-sm mb-4 ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
                  {achievement.description}
                </p>

                {/* Progress Bar */}
                {!isLocked && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                      <span>{Math.round((achievement.progress / achievement.maxProgress) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-15 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          achievement.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className={`text-sm font-medium ${isLocked ? 'text-gray-400' : 'text-white-99'}`}>
                    {achievement.points} points
                  </div>
                  {achievement.status === 'completed' && achievement.unlockedDate && (
                    <div className="text-xs text-gray-500">
                      Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white-99 mb-2">No achievements found</h3>
            <p className="text-gray-600">Try selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;