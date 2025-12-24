import { NextRequest, NextResponse } from "next/server";
import { loadMonstersFromCSV } from "../../monsterLoader";

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

    const { cr, userPrompt } = await req.json();
    const monsters = await loadMonstersFromCSV();
    console.log(`Loaded ${monsters.length} monsters`);

    // Filter monsters by the exact CR or within a small range
    const crTolerance = 0.1;
    const filteredMonsters = monsters.filter(
      (m) => Math.abs(m.cr - cr) <= crTolerance
    );

    console.log(`Found ${filteredMonsters.length} monsters with CR ${cr}`);

    if (filteredMonsters.length === 0) {
      return NextResponse.json({ monsters: [] });
    }

    // If there's a user prompt, use Gemini to filter/select monsters
    if (userPrompt && userPrompt.trim()) {
      // Take a sample if there are too many monsters
      const sampleSize = Math.min(50, filteredMonsters.length);
      const sampledMonsters = filteredMonsters
        .sort(() => Math.random() - 0.5)
        .slice(0, sampleSize);

      // Create a list of monsters with key details
      const monsterList = sampledMonsters
        .map(
          (m) =>
            `${m.name} (${m.type}, ${m.size}, ${
              m.spellcasting !== "NO" ? "Spellcaster" : "Non-spellcaster"
            })`
        )
        .join(", ");

      const prompt = `Given these D&D 5e monsters with CR ${cr}: ${monsterList}
User's search criteria: ${userPrompt}
Select 3-10 monsters that best match the criteria. Return JSON array of names only: ["Name1","Name2"]`;

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
        const response = await fetch(
          `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        console.log("Gemini response status:", response.status);

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Gemini API error:", response.status, errorData);
          // Fallback to returning all filtered monsters
          return NextResponse.json({ monsters: filteredMonsters });
        }

        const data = await response.json();
        console.log("Gemini response received");
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
        console.log("Gemini text:", text);

        // Parse the JSON response - handle markdown code blocks
        let jsonText = text.trim();
        jsonText = jsonText
          .replace(/^```(?:json)?\s*\n?/g, "")
          .replace(/\n?```\s*$/g, "");

        const selectedNames = JSON.parse(jsonText.trim());
        console.log("Selected monsters:", selectedNames);

        // Find the actual monster objects
        const selectedMonsters = selectedNames
          .map((name: string) => sampledMonsters.find((m) => m.name === name))
          .filter((m: any) => m !== undefined);

        return NextResponse.json({ monsters: selectedMonsters });
      } catch (error) {
        console.error("Error with Gemini filtering:", error);
        // Fallback to returning all filtered monsters
        return NextResponse.json({ monsters: filteredMonsters });
      }
    }

    // If no user prompt, return all monsters with that CR
    return NextResponse.json({ monsters: filteredMonsters });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
