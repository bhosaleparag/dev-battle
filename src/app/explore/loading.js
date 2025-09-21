import React from 'react';

// Skeleton animation component
const SkeletonPulse = ({ className = "", children, ...props }) => (
  <div 
    className={`animate-pulse bg-gray-20 rounded ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Individual Card Skeleton
const QuizCardSkeleton = () => {
  return (
    <div className="relative bg-gradient-to-br from-gray-08 to-gray-10 border border-gray-15 rounded-2xl shadow-lg min-w-[320px] max-w-[320px] max-h-[220px] overflow-hidden">
      {/* Animated gradient overlay for shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-15/20 to-transparent animate-shimmer" />

      <div className="relative p-6 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {/* Title Skeleton */}
            <SkeletonPulse className="h-6 w-4/5 mb-2" />
            
            {/* Random chance for "Today's Challenge" badge skeleton */}
            {Math.random() > 0.7 && (
              <div className="flex items-center gap-1 mb-2">
                <SkeletonPulse className="w-3 h-3 rounded-full" />
                <SkeletonPulse className="h-3 w-20" />
              </div>
            )}
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="flex-1 mb-4">
          <SkeletonPulse className="h-4 w-full mb-2" />
          <SkeletonPulse className="h-4 w-5/6 mb-2" />
          <SkeletonPulse className="h-4 w-3/4" />
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-15">
          <div className="flex items-center gap-3">
            {/* Random difficulty chip or knowledge test badge */}
            {Math.random() > 0.5 ? (
              <SkeletonPulse className="h-6 w-16 rounded-lg" />
            ) : (
              <div className="flex items-center gap-1">
                <SkeletonPulse className="w-4 h-4 rounded" />
                <SkeletonPulse className="h-3 w-20" />
              </div>
            )}
          </div>
          {/* Arrow Icon Skeleton */}
          <SkeletonPulse className="w-5 h-5 rounded" />
        </div>
      </div>
    </div>
  );
};

// Horizontal Skeleton Grid
const HorizontalCardGridSkeleton = ({ count = 4 }) => {
  return (
    <div className="relative mt-6">
      {/* Navigation buttons skeleton */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
        <SkeletonPulse className="w-12 h-12 rounded-full" />
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
        <SkeletonPulse className="w-12 h-12 rounded-full" />
      </div>

      {/* Cards Container */}
      <div className="flex gap-5 overflow-hidden px-16 py-4">
        {Array.from({ length: count }).map((_, index) => (
          <QuizCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

// Section Header Skeleton
const SectionHeaderSkeleton = () => {
  return (
    <div className="relative mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Icon skeleton */}
          <SkeletonPulse className="w-16 h-16 rounded-2xl" />
          <div>
            <div className="flex items-center gap-3 mb-1">
              {/* Title skeleton */}
              <SkeletonPulse className="h-8 w-32" />
              {/* Count badge skeleton (random appearance) */}
              {Math.random() > 0.6 && (
                <SkeletonPulse className="h-6 w-16 rounded-full" />
              )}
            </div>
            {/* Description skeleton */}
            <SkeletonPulse className="h-4 w-64" />
          </div>
        </div>
        
        {/* Filter button skeleton */}
        <SkeletonPulse className="h-10 w-32 rounded-xl" />
      </div>
      
      {/* Decorative line skeleton */}
      <SkeletonPulse className="w-20 h-1 rounded-full" />
    </div>
  );
};

// Complete Page Skeleton
const CodingChallengesAppSkeleton = () => {
  return (
    <div 
      className="min-h-screen p-6 pt-8"
      style={{ 
        backgroundColor: 'var(--gray-08)',
        backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(112, 59, 247, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(148, 108, 249, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(130, 84, 248, 0.05) 0%, transparent 50%)
        `
      }}
    >
      <div className="max-w-7xl mx-auto mb-12">
        {/* Hero Section Skeleton */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-75 to-purple-60 bg-clip-text text-transparent">
            Daily Code Challenges
          </h1>
          <p className="text-xl text-gray-50 max-w-2xl mx-auto">
            Sharpen your coding skills with our curated collection of daily challenges, debugging exercises, and algorithmic problems.
          </p>
        </div>
        {/* Challenge Sections Skeleton */}
        <div className="space-y-16">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="w-full relative">
              <SectionHeaderSkeleton />
              <HorizontalCardGridSkeleton count={4} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodingChallengesAppSkeleton;