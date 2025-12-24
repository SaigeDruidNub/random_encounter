import { NextRequest, NextResponse } from "next/server";
// import fetch from 'node-fetch'; // Not needed in Next.js 13+ edge runtime
import { loadMonstersFromCSV } from "../../monsterLoader";

// You should store your Gemini API key securely, e.g., in environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent";

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const { partyLevel, partySize, difficulty, userPrompt } = await req.json();
    const monsters = await loadMonstersFromCSV();
    console.log(`Loaded ${monsters.length} monsters`);

    // Filter monsters to appropriate CR range (roughly partyLevel/4 to partyLevel + 3)
    const minCR = Math.max(0, partyLevel / 4);
    const maxCR = partyLevel + 3;
    const filteredMonsters = monsters.filter(
      (m) => m.cr >= minCR && m.cr <= maxCR
    );

    // Take random sample of 40 monsters to reduce prompt size
    const sampleSize = Math.min(40, filteredMonsters.length);
    const sampledMonsters = filteredMonsters
      .sort(() => Math.random() - 0.5)
      .slice(0, sampleSize);

    console.log(
      `Sampled ${sampledMonsters.length} monsters (CR ${minCR}-${maxCR})`
    );

    // Create a concise list of available monsters
    const monsterList = sampledMonsters
      .map((m) => `${m.name}:${m.cr}`)
      .join(",");

    // Prepare a prompt for Gemini
    const basePrompt = `D&D 5e encounter for ${partySize} level ${partyLevel} characters, ${difficulty} difficulty.
Monsters (name:CR): ${monsterList}
Select 1-5 monsters. Return JSON array of names only: ["Name1","Name2"]`;

    const prompt = userPrompt
      ? `${basePrompt}\nAdditional guidance: ${userPrompt}`
      : basePrompt;

    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    console.log("Sending request to Gemini...");
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      console.log("Gemini response status:", response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Gemini API error:", response.status, errorData);
        return NextResponse.json(
          { error: "Gemini API error", details: errorData },
          { status: 500 }
        );
      }

      const data = await response.json();
      console.log("Gemini response received");
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      console.log("Gemini text:", text);

      // Parse the JSON response - handle markdown code blocks
      let jsonText = text.trim();
      // Remove markdown code blocks (```json or ``` at start and end)
      jsonText = jsonText
        .replace(/^```(?:json)?\s*\n?/g, "")
        .replace(/\n?```\s*$/g, "");

      const selectedNames = JSON.parse(jsonText.trim());
      console.log("Selected monsters:", selectedNames);

      // Find the actual monster objects from sampled list
      const encounter = selectedNames
        .map((name: string) => sampledMonsters.find((m) => m.name === name))
        .filter((m: any) => m !== undefined);

      return NextResponse.json({ encounter });
    } catch (error) {
      console.error("Error generating encounter:", error);
      return NextResponse.json(
        { error: "Failed to generate encounter" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
