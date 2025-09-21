import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {code, inputs } = await request.json();

    if (!code && inputs === undefined) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_JS_COMPILER_URL}/run`, { // `${process.env.NEXT_PUBLIC_JS_COMPILER_URL}/run`
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, inputs })
    });

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}