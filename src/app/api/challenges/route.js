import { client } from "@/lib/sanity";
import { NextResponse } from "next/server";

export const revalidate = false;

const ITEMS_PER_PAGE = 10;

export async function GET(req) {
  try {
    // Extract page param from URL (default 1)
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);

    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    const [quizzesData, debuggersData, problemsData] = await Promise.all([
      client.fetch(
        `*[_type == "quiz" && mode == "multi"] | order(date desc)[${start}...${end}]{ _id, title, description, xp, difficulty }`
      ),
      client.fetch(
        `*[_type == "debuggerChallenge" && mode == "multi"] | order(_updatedAt desc)[${start}...${end}]{ _id, title, description, xp, difficulty, timeLimit }`
      ),
      client.fetch(
        `*[_type == "challenge" && mode == "multi"] | order(_updatedAt desc)[${start}...${end}]{ _id, title, description, xp, difficulty }`
      ),
    ]);

    return NextResponse.json({
      quizzes: quizzesData,
      debuggers: debuggersData,
      problems: problemsData,
    });
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
