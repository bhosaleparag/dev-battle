import { client } from "@/lib/sanity";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const challengeType = searchParams.get("challengeType") || "quiz";
    const quizIds = await client.fetch(`*[_type == "${challengeType}"  && mode == "multi"]._id`);
    if (!quizIds.length) {
      return NextResponse.json({ error: "No quizzes found" }, {status: 400});
    }

    const randomId = quizIds[Math.floor(Math.random() * quizIds.length)];

    const quiz = await client.fetch(
      `*[_id == "${randomId}"][0]{ _id, title, difficulty, xp, timeLimit }`);

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Error fetching random quiz:", error);
    NextResponse.json({ error: "Failed to fetch random quiz" }, {status: 500});
  }
}
