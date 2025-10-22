import { db } from "@/lib/firebase";
import { client } from "@/lib/sanity";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

// Revalidate daily quiz every 2 hours (7200 seconds)
export const revalidate = 7200;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0).toISOString();

    const dailyQuizQuery = `*[_type == "quiz" 
      && daily == true && mode == "single" 
      && date >= $today && date < $tomorrow][0]`;

    const quizData = await client.fetch(dailyQuizQuery, { today, tomorrow });
    if (!quizData) {
      return NextResponse.json({ error: "No daily quiz found for today." }, { status: 404 });
    }
    
    const progressRef = doc(db, 'userProgress', userId);
    const progressSnap = await getDoc(progressRef);
    if (progressSnap.exists()) {
      const progressData = progressSnap.data();
      const isCompleted = progressData.challenges?.[quizData._id]?.completed || false;
      
      return NextResponse.json({
        ...quizData,
        completed: isCompleted
      });
    }

    return NextResponse.json({
      ...quizData,
      completed: false
    });

  } catch (error) {
    console.error("Error fetching daily quiz:", error);
    return NextResponse.json({ error: "Failed to fetch daily quiz" }, { status: 500 });
  }
}
