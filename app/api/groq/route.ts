import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  // Compose the prompt for Groq
  const prompt = `give the emotional state of the user by analyzing the following lines and reply the user like talking to them: ${message}`;

  // Call Groq API (assume API key and endpoint are set in env)
  const groqRes = await fetch(process.env.GROQ_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({ prompt }),
  });

  if (!groqRes.ok) {
    return NextResponse.json({ error: "Groq API error" }, { status: 500 });
  }

  const groqData = await groqRes.json();
  // Assume groqData contains { response: string, emotional_analysis: string }
  // Adjust parsing as needed for your Groq API response format
  return NextResponse.json({
    response: groqData.response,
    emotional_analysis: groqData.emotional_analysis,
  });
}