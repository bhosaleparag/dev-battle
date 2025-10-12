/**
 * Calculate XP for coding problem based on test cases passed
 * @param {number} passedCases - Number of test cases passed
 * @param {number} totalCases - Total number of test cases
 * @param {number} maxXP - Maximum XP for passing all cases (default: 100)
 * @returns {number} Calculated XP
 */
export function calculateXP(passedCases, totalCases, maxXP = 100) {
  if (totalCases === 0) return 0;
  const xpPerCase = maxXP / totalCases;
  return Math.round(passedCases * xpPerCase);
}