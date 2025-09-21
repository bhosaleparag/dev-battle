"use server";
import { db } from "@/lib/firebase";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

export async function saveDebuggerResult(userId, challengeId, completed){
  const type='debuggerChallenge';
  const score=0;
  const resultId = `${userId}_${challengeId}`;
  const docRef = doc(db, 'userProgress', resultId);
  await setDoc(docRef, {
    userId,
    challengeId,
    type,
    score,
    completed,
    date: serverTimestamp(),
  }, { merge: true })
}

export async function saveProblemResult(userId, challengeId, completed){
  const type='challenge';
  const score=0;
  const resultId = `${userId}_${challengeId}`;
  const docRef = doc(db, 'userProgress', resultId);
  await setDoc(docRef, {
    userId,
    challengeId,
    type,
    score,
    completed,
    date: serverTimestamp(),
  }, { merge: true })
}

export async function saveQuizResult(userId, challengeId, score) {
  const type='quiz';
  const completed = true;
  const resultId = `${userId}_${challengeId}`; // unique per user+quiz
  await setDoc(doc(db, "userProgress", resultId), {
    userId,
    challengeId,
    type,
    score,
    completed,
    date: serverTimestamp(),
  }, { merge: true }); // merge ensures update instead of overwrite
}
