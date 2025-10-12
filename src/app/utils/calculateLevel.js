/**
 * Calculate user level based on XP with exponential scaling
 * @param {number} xp - Total experience points
 * @returns {object} Level stats including progress to next level
 */
export function calculateLevel(xp) {
  // Base XP required for level 2
  const baseXP = 100;
  // Exponential growth factor
  const growthFactor = 2;
  
  let level = 1;
  let xpForCurrentLevel = 0;
  let xpForNextLevel = baseXP;
  
  // Calculate current level
  while (xp >= xpForNextLevel) {
    level++;
    xpForCurrentLevel = xpForNextLevel;
    xpForNextLevel = Math.floor(baseXP * Math.pow(growthFactor, level - 1));
  }
  
  // Calculate progress to next level
  const xpInCurrentLevel = xp - xpForCurrentLevel;
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = Math.floor((xpInCurrentLevel / xpNeededForLevel) * 100);
  const xpToNextLevel = xpForNextLevel - xp;
  
  return {
    level,
    currentXP: xp,
    xpForCurrentLevel,
    xpForNextLevel,
    xpInCurrentLevel,
    xpNeededForLevel,
    progressPercentage,
    xpToNextLevel
  };
}

/**
 * Get XP required for a specific level
 * @param {number} targetLevel - Level to calculate XP for
 * @returns {number} Total XP required to reach that level
 */
export function getXPForLevel(targetLevel) {
  if (targetLevel <= 1) return 0;
  
  const baseXP = 100;
  const growthFactor = 1.5;
  
  return Math.floor(baseXP * Math.pow(growthFactor, targetLevel - 2));
}

/**
 * Award XP and return updated level stats
 * @param {number} currentXP - Current XP
 * @param {number} awardedXP - XP to add
 * @returns {object} Updated level stats with level up indicator
 */
export function awardXP(currentXP, awardedXP) {
  const oldStats = calculateLevel(currentXP);
  const newXP = currentXP + awardedXP;
  const newStats = calculateLevel(newXP);
  
  return {
    ...newStats,
    xpAwarded: awardedXP,
    leveledUp: newStats.level > oldStats.level,
    levelsGained: newStats.level - oldStats.level
  };
}

// Example usage:
// const userLevel = calculateLevel(1250);
// console.log(`Level ${userLevel.level}`);
// console.log(`Progress: ${userLevel.progressPercentage}%`);
// console.log(`XP to next level: ${userLevel.xpToNextLevel}`);

// Award XP example:
// const result = awardXP(950, 200);
// if (result.leveledUp) {
//   console.log(`Level up! Now level ${result.level}`);
// }