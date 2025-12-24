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

    // Check if user requested specific monsters (e.g., "use Goblin" or "include Troll")
    const requestedMonsters: any[] = [];
    if (userPrompt) {
      // Match "use" or "include" followed by monster name, stopping at common separator words
      const useMatch = userPrompt.match(/\b(?:use|include)\s+([A-Za-z\s'-]+?)(?:\s+(?:and|with|to|for|make|ensure|that|in|on|as|but|or|plus)\b|[,.]|$)/gi);
      if (useMatch) {
        for (const match of useMatch) {
          // Extract just the monster name
          const monsterName = match
            .replace(/\b(?:use|include)\s+/i, "")
            .replace(/\s+(?:and|with|to|for|make|ensure|that|in|on|as|but|or|plus)\b.*$/i, "")
            .replace(/[,.].*$/, "")
            .trim();
          
          if (monsterName.length === 0) continue;
          
          const found = monsters.find(
            (m) => m.name.toLowerCase() === monsterName.toLowerCase()
          );
          if (found) {
            console.log(`User requested monster: ${found.name} (CR ${found.cr})`);
            requestedMonsters.push(found);
          } else {
            console.log(`User requested monster not found: "${monsterName}" - will be part of general guidance`);
          }
        }
      }
    }

    // Filter monsters to appropriate CR range (roughly partyLevel/4 to partyLevel + 3)
    const minCR = Math.max(0, partyLevel / 4);
    const maxCR = partyLevel + 3;
    const filteredMonsters = monsters.filter(
      (m) => m.cr >= minCR && m.cr <= maxCR
    );

    // Include all filtered monsters plus any user-requested monsters
    let sampledMonsters = [...requestedMonsters];
    
    // Add all monsters in the appropriate CR range, avoiding duplicates
    const remainingMonsters = filteredMonsters.filter(
      (m) => !requestedMonsters.find((r) => r.name === m.name)
    );
    sampledMonsters.push(...remainingMonsters);

    console.log(`Sending ${sampledMonsters.length} monsters to Gemini (${requestedMonsters.length} requested, ${remainingMonsters.length} in CR range)`);

    // Create a concise list of available monsters
    const monsterList = sampledMonsters
      .map((m) => `${m.name}:${m.cr}`)
      .join(",");

    // Prepare a prompt for Gemini
    const additionalGuidance = userPrompt
      ? `\nAdditional guidance: ${userPrompt}`
      : "";
    
    const basePrompt = `D&D 5e encounter for ${partySize} level ${partyLevel} characters, ${difficulty} difficulty.

Available monsters (name:CR): ${monsterList}${additionalGuidance}

CRITICAL RULES:
1. You MUST ONLY select monsters from the "Available monsters" list above
2. Do NOT invent or suggest monsters not in the list
3. Respond ONLY with a valid JSON array of exact monster names from the list
4. Do NOT include explanations, reasoning, markdown, or any other text

Example response format: ["Goblin","Orc","Wolf"]

Select 1-5 appropriate monsters from the available list:`;

    const prompt = basePrompt;

    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Gemini API error:", response.status, errorData);
        return NextResponse.json(
          { error: "Gemini API error", details: errorData },
          { status: 500 }
        );
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      console.log("Gemini raw response:", text);

      // Parse the JSON response - handle markdown code blocks
      let jsonText = text.trim();
      
      // Try to extract JSON array from the response
      // First, try to remove markdown code blocks
      jsonText = jsonText
        .replace(/^```(?:json)?\s*\n?/g, "")
        .replace(/\n?```\s*$/g, "");
      
      // Try to find a JSON array in the text
      const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      let selectedNames: string[];
      try {
        selectedNames = JSON.parse(jsonText.trim());
        
        // Validate it's an array
        if (!Array.isArray(selectedNames)) {
          throw new Error("Response is not an array");
        }
      } catch (parseError) {
        console.error("Failed to parse Gemini response as JSON:", parseError);
        console.error("Attempted to parse:", jsonText);
        
        // Fallback: randomly select 2-4 monsters
        const count = Math.floor(Math.random() * 3) + 2; // 2-4 monsters
        const shuffled = sampledMonsters.sort(() => Math.random() - 0.5);
        const fallbackEncounter = shuffled.slice(0, count);
        console.log("Using fallback random selection");
        return NextResponse.json({ encounter: fallbackEncounter });
      }

      console.log("Selected monster names:", selectedNames);
      console.log("Available monsters:", sampledMonsters.map(m => m.name).join(", "));

      // Find the actual monster objects from sampled list with flexible matching
      const encounter = selectedNames
        .map((name: string) => {
          const trimmedName = name.trim();
          // Try exact match first
          let found = sampledMonsters.find((m) => m.name === trimmedName);
          
          // If not found, try case-insensitive match
          if (!found) {
            found = sampledMonsters.find(
              (m) => m.name.toLowerCase() === trimmedName.toLowerCase()
            );
          }
          
          if (!found) {
            console.warn(`Monster not found: "${trimmedName}"`);
          } else {
            console.log(`Matched: "${trimmedName}" -> "${found.name}"`);
          }
          
          return found;
        })
        .filter((m: any) => m !== undefined);
      
      console.log(`Successfully matched ${encounter.length} out of ${selectedNames.length} monsters`);
      
      // If we matched fewer than 2 monsters, add some random ones to ensure a valid encounter
      if (encounter.length < 2) {
        console.log(`Only ${encounter.length} valid monsters, adding random monsters to reach minimum`);
        const additionalNeeded = 2 - encounter.length;
        const availableForRandom = sampledMonsters.filter(
          m => !encounter.find(e => e.name === m.name)
        );
        const shuffled = availableForRandom.sort(() => Math.random() - 0.5);
        encounter.push(...shuffled.slice(0, additionalNeeded));
        console.log(`Added ${additionalNeeded} random monsters`);
      }
      
      // If no valid monsters found, use fallback
      if (encounter.length === 0) {
        console.log("No valid monsters matched, using fallback");
        const count = Math.floor(Math.random() * 3) + 2;
        const shuffled = sampledMonsters.sort(() => Math.random() - 0.5);
        return NextResponse.json({ encounter: shuffled.slice(0, count) });
      }

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
