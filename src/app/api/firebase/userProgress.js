"use server";
import { db } from "@/lib/firebase";
import { doc, runTransaction, serverTimestamp, increment } from "firebase/firestore";

/**
 * Save debugger challenge result with XP tracking
 * @param {string} userId - User ID
 * @param {string} challengeId - Challenge ID
 * @param {boolean} completed - Whether challenge was completed
 * @param {number} xp - XP earned for this challenge
 */
export async function saveDebuggerResult(userId, challengeId, completed, xp = 0) {
  await saveProgress(userId, challengeId, 'debuggerChallenge', completed, xp);
}

/**
 * Save coding problem result with XP tracking
 * @param {string} userId - User ID
 * @param {string} challengeId - Challenge ID
 * @param {boolean} completed - Whether challenge was completed
 * @param {number} xp - XP earned for this challenge
 */
export async function saveProblemResult(userId, challengeId, completed, xp = 0) {
  await saveProgress(userId, challengeId, 'challenge', completed, xp);
}

/**
 * Save quiz result with XP (score)
 * @param {string} userId - User ID
 * @param {string} challengeId - Quiz ID
 * @param {number} xp - XP earned (score)
 */
export async function saveQuizResult(userId, challengeId, xp) {
  await saveProgress(userId, challengeId, 'quiz', true, xp);
}

/**
 * Core function to save progress and sync XP
 * Uses Firestore transaction to ensure atomic updates
 */
async function saveProgress(userId, challengeId, type, completed, newXP) {
  const userProgressRef = doc(db, 'userProgress', userId);
  const userRef = doc(db, 'users', userId);

  await runTransaction(db, async (transaction) => {
    const userProgressDoc = await transaction.get(userProgressRef);

    // Get existing data
    const progressData = userProgressDoc.exists() ? userProgressDoc.data() : {
      totalXP: 0,
      challenges: {},
      stats: {
        challengesCompleted: 0,
        quizzesCompleted: 0,
        debuggersCompleted: 0
      }
    };

    // Get old XP for this specific challenge
    const oldChallengeXP = progressData.challenges[challengeId]?.xp || 0;

    // Only update if new XP is higher
    if (newXP <= oldChallengeXP) {
      return; // Skip update - don't decrease XP
    }

    // Calculate XP difference
    const xpDifference = newXP - oldChallengeXP;
    const newTotalXP = progressData.totalXP + xpDifference;

    // Update stats based on type (only increment if new completion)
    const isNewCompletion = !progressData.challenges[challengeId]?.completed && completed;
    
    // Update challenge data
    progressData.challenges[challengeId] = {
      xp: newXP,
      completed,
      type,
      completedAt: serverTimestamp()
    };

    if (isNewCompletion) {
      if (type === 'challenge') {
        progressData.stats.challengesCompleted += 1;
      } else if (type === 'quiz') {
        progressData.stats.quizzesCompleted += 1;
      } else if (type === 'debuggerChallenge') {
        progressData.stats.debuggersCompleted += 1;
      }
    }

    progressData.totalXP = newTotalXP;
    progressData.lastActive = serverTimestamp();

    // Update userProgress collection
    transaction.set(userProgressRef, progressData, { merge: true });

    // Sync XP to users.stats
    transaction.update(userRef, {
      'stats.xp': increment(xpDifference),
      lastActive: serverTimestamp()
    });
  });
}

/**
 * Helper function to get user's current XP 
 * @param {string} userId - User ID
 * @returns {Promise<{xp: number}>}
 */
export async function getUserXP(userId) {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      xp: data.stats?.xp || 0
    };
  }
  
  return { xp: 0};
}