"use client";

import { useState } from "react";
import { Monster } from "../monsterLoader";

export default function EncounterPage() {
  const [partyLevel, setPartyLevel] = useState(3);
  const [partySize, setPartySize] = useState(4);
  const [difficulty, setDifficulty] = useState<
    "easy" | "medium" | "hard" | "deadly"
  >("medium");
  const [userPrompt, setUserPrompt] = useState("");
  const [encounter, setEncounter] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const response = await fetch("/api/gemini-encounter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partyLevel, partySize, difficulty, userPrompt }),
    });
    const data = await response.json();
    setEncounter(data.encounter || []);
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "2rem",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          borderBottom: "3px solid var(--background-tertiary)",
          paddingBottom: "1rem",
        }}
      >
        ⚔️ Random Encounter Generator ⚔️
      </h1>

      <div
        style={{
          backgroundColor: "var(--background-secondary)",
          padding: "2rem",
          borderRadius: "12px",
          marginBottom: "2rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              fontSize: "1.1rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
            }}
          >
            🎲 Party Level:
            <input
              type="number"
              value={partyLevel}
              onChange={(e) => setPartyLevel(Number(e.target.value))}
              min="1"
              max="20"
              style={{
                marginLeft: "1rem",
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                borderRadius: "6px",
                border: "2px solid var(--background-tertiary)",
                backgroundColor: "var(--background)",
                color: "var(--text-primary)",
                width: "80px",
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              fontSize: "1.1rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
            }}
          >
            👥 Party Size:
            <input
              type="number"
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
              min="1"
              max="10"
              style={{
                marginLeft: "1rem",
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                borderRadius: "6px",
                border: "2px solid var(--background-tertiary)",
                backgroundColor: "var(--background)",
                color: "var(--text-primary)",
                width: "80px",
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              fontSize: "1.1rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
            }}
          >
            💀 Difficulty:
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              style={{
                marginLeft: "1rem",
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                borderRadius: "6px",
                border: "2px solid var(--background-tertiary)",
                backgroundColor: "var(--background)",
                color: "var(--text-primary)",
                cursor: "pointer",
              }}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="deadly">Deadly</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              fontSize: "1.1rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
            }}
          >
            ✨ Additional Guidance for Gemini (optional):
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="e.g., Include undead creatures, set in a forest, make it thematic..."
              rows={4}
              style={{
                width: "100%",
                padding: "1rem",
                marginTop: "0.5rem",
                borderRadius: "8px",
                border: "2px solid var(--background-tertiary)",
                fontSize: "1rem",
                fontFamily: "inherit",
                backgroundColor: "var(--background)",
                color: "var(--text-primary)",
                resize: "vertical",
              }}
            />
          </label>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            backgroundColor: loading
              ? "var(--background-secondary)"
              : "var(--background-tertiary)",
            color: "var(--text-primary)",
            padding: "1rem 2rem",
            fontSize: "1.2rem",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            width: "100%",
            transition: "all 0.3s",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = "var(--text-secondary)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.4)";
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor =
                "var(--background-tertiary)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
            }
          }}
        >
          {loading ? "⏳ Generating..." : "🎲 Generate Encounter"}
        </button>
      </div>

      {encounter.length > 0 && (
        <div
          style={{
            backgroundColor: "var(--background-secondary)",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              borderBottom: "2px solid var(--background-tertiary)",
              paddingBottom: "0.5rem",
            }}
          >
            ⚔️ Your Encounter
          </h2>
          <p
            style={{
              fontSize: "1.2rem",
              marginBottom: "1.5rem",
              fontWeight: "600",
            }}
          >
            🐉 Monsters: {encounter.length}
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {encounter.map((monster, index) => (
              <div
                key={`${monster.name}-${index}`}
                style={{
                  border: "2px solid var(--background-tertiary)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  backgroundColor: "var(--background)",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                  transition: "transform 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <h3
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "0.5rem",
                    color: "var(--text-primary)",
                    fontWeight: "bold",
                  }}
                >
                  {monster.name}
                </h3>
                <p
                  style={{
                    fontStyle: "italic",
                    marginBottom: "1rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {monster.size} {monster.type}, {monster.alignment}
                </p>
                <hr
                  style={{
                    border: "none",
                    borderTop: "1px solid var(--background-tertiary)",
                    margin: "1rem 0",
                  }}
                />
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  <p style={{ padding: "0.25rem 0" }}>
                    <strong>🛡️ Armor Class:</strong> {monster.ac}
                  </p>
                  <p style={{ padding: "0.25rem 0" }}>
                    <strong>❤️ Hit Points:</strong> {monster.hp}
                  </p>
                  <p style={{ padding: "0.25rem 0" }}>
                    <strong>⚠️ Challenge Rating:</strong> {monster.cr}
                  </p>
                </div>
                <hr
                  style={{
                    border: "none",
                    borderTop: "1px solid var(--background-tertiary)",
                    margin: "1rem 0",
                  }}
                />
                {(monster.attack1Damage ||
                  monster.attack2Damage ||
                  monster.attack3Damage) && (
                  <div style={{ marginTop: "1rem" }}>
                    <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                      ⚔️ Attacks:
                    </p>
                    <ul
                      style={{
                        marginLeft: "1.5rem",
                        display: "grid",
                        gap: "0.5rem",
                      }}
                    >
                      {monster.attack1Damage && (
                        <li style={{ padding: "0.25rem 0" }}>
                          Attack 1: {monster.attack1Damage}
                        </li>
                      )}
                      {monster.attack2Damage && (
                        <li style={{ padding: "0.25rem 0" }}>
                          Attack 2: {monster.attack2Damage}
                        </li>
                      )}
                      {monster.attack3Damage && (
                        <li style={{ padding: "0.25rem 0" }}>
                          Attack 3: {monster.attack3Damage}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                {monster.spellcasting !== "NO" && (
                  <p
                    style={{
                      marginTop: "1rem",
                      padding: "0.75rem",
                      backgroundColor: "var(--background-secondary)",
                      borderRadius: "6px",
                      borderLeft: "4px solid var(--background-tertiary)",
                    }}
                  >
                    <strong>✨ Spellcasting:</strong> Yes
                  </p>
                )}
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    marginTop: "1rem",
                    padding: "0.5rem",
                    backgroundColor: "var(--background-secondary)",
                    borderRadius: "6px",
                    textAlign: "center",
                  }}
                >
                  📖 Monster Manual p. {monster.page}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
