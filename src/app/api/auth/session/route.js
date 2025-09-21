// src/app/api/auth/session/route.js
import { cookies } from "next/headers";

export async function POST(req) {
  const cookieStore = await cookies();

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ message: "No token provided" }, { status: 401 });
  }

  const idToken = authHeader.split("Bearer ")[1];

  cookieStore.set("authToken", idToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  return Response.json({ message: "Session created" }, { status: 200 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("authToken");

  return Response.json({ message: "Session deleted" }, { status: 200 });
}
