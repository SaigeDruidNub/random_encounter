"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Monster } from "../monsterLoader";

export default function MonsterSearchPage() {
  const router = useRouter();
  const [cr, setCr] = useState<string>("1");
  const [userPrompt, setUserPrompt] = useState("");
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const response = await fetch("/api/search-monsters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cr: parseFloat(cr), userPrompt }),
    });
    const data = await response.json();
    setMonsters(data.monsters || []);
    setLoading(false);
  };

  const handleClear = () => {
    setMonsters([]);
  };

  const handleUseInEncounter = (monsterName: string) => {
    router.push(`/encounter?prompt=use ${encodeURIComponent(monsterName)}`);
  };

  const crOptions = [
    "0",
    "0.125",
    "0.25",
    "0.5",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
  ];

  const formatCR = (cr: string) => {
    if (cr === "0.125") return "1/8";
    if (cr === "0.25") return "1/4";
    if (cr === "0.5") return "1/2";
    return cr;
  };

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem" }}>
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          padding: "0.5rem 1rem",
          backgroundColor: "var(--background-secondary)",
          color: "var(--text-primary)",
          textDecoration: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: "600",
          transition: "all 0.3s",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "var(--background-tertiary)";
          e.currentTarget.style.transform = "translateX(-4px)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "var(--background-secondary)";
          e.currentTarget.style.transform = "translateX(0)";
        }}
      >
        ← Back to Home
      </Link>

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
        🔍 Monster Search by CR 🐉
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
            ⚠️ Challenge Rating (CR):
            <select
              value={cr}
              onChange={(e) => setCr(e.target.value)}
              style={{
                marginLeft: "1rem",
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                borderRadius: "6px",
                border: "2px solid var(--background-tertiary)",
                backgroundColor: "var(--background)",
                color: "var(--text-primary)",
                width: "120px",
                cursor: "pointer",
              }}
            >
              {crOptions.map((option) => (
                <option key={option} value={option}>
                  {formatCR(option)}
                </option>
              ))}
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
            ✨ Additional Search Guidance (optional):
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="e.g., Focus on undead, prefer flying creatures, include spellcasters..."
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
          onClick={handleSearch}
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
          {loading ? "⏳ Searching..." : "🔍 Search Monsters"}
        </button>
      </div>

      {monsters.length > 0 && (
        <div
          style={{
            backgroundColor: "var(--background-secondary)",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              borderBottom: "2px solid var(--background-tertiary)",
              paddingBottom: "0.5rem",
            }}
          >
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              📚 Search Results
            </h2>
            <button
              onClick={handleClear}
              style={{
                backgroundColor: "var(--background-tertiary)",
                color: "var(--text-primary)",
                padding: "0.5rem 1rem",
                fontSize: "0.9rem",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.3s",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "var(--text-secondary)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--background-tertiary)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              🗑️ Clear Results
            </button>
          </div>
          <p
            style={{
              fontSize: "1.2rem",
              marginBottom: "1.5rem",
              fontWeight: "600",
            }}
          >
            🐉 Found {monsters.length} monster{monsters.length !== 1 ? "s" : ""}
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {monsters.map((monster, index) => (
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
                <button
                  onClick={() => handleUseInEncounter(monster.name)}
                  style={{
                    marginTop: "1rem",
                    width: "100%",
                    padding: "0.75rem 1.5rem",
                    fontSize: "1rem",
                    backgroundColor: "var(--background-tertiary)",
                    color: "var(--text-primary)",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.3s",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--text-secondary)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(0, 0, 0, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--background-tertiary)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0, 0, 0, 0.3)";
                  }}
                >
                  🎲 Use in Random Encounter
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
