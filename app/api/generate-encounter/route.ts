import { NextRequest, NextResponse } from "next/server";
import { generateEncounter } from "@/app/encounterGenerator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partyLevel, partySize, difficulty } = body;

    if (!partyLevel || !partySize || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const encounter = await generateEncounter(
      partyLevel,
      partySize,
      difficulty
    );

    return NextResponse.json({ encounter });
  } catch (error) {
    console.error("Error generating encounter:", error);
    return NextResponse.json(
      { error: "Failed to generate encounter" },
      { status: 500 }
    );
  }
}
