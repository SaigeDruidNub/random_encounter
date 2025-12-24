"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className="flex min-h-screen items-center justify-center font-sans"
      style={{ background: "var(--background)", color: "var(--text-primary)" }}
    >
      <main
        className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-8"
        style={{
          background: "var(--background-secondary)",
          borderRadius: "16px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            fontSize: "3rem",
            opacity: 0.2,
          }}
        >
          🐉
        </div>
        <div
          style={{
            position: "absolute",
            top: "2rem",
            right: "2rem",
            fontSize: "3rem",
            opacity: 0.2,
          }}
        >
          ⚔️
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "3rem",
            fontSize: "2.5rem",
            opacity: 0.2,
          }}
        >
          🎲
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            right: "3rem",
            fontSize: "2.5rem",
            opacity: 0.2,
          }}
        >
          🛡️
        </div>

        <h1
          className="text-3xl font-bold mb-8"
          style={{
            color: "var(--text-primary)",
            fontSize: "3rem",
            textAlign: "center",
            textShadow: "3px 3px 6px rgba(0, 0, 0, 0.5)",
            borderBottom: "3px solid var(--background-tertiary)",
            paddingBottom: "1rem",
            marginBottom: "2rem",
          }}
        >
          D&D Random Encounter Generator
        </h1>
        <p
          className="text-lg mb-8 text-center"
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.25rem",
            maxWidth: "600px",
            lineHeight: "1.8",
            padding: "1.5rem",
            backgroundColor: "var(--background)",
            borderRadius: "12px",
            border: "2px solid var(--background-tertiary)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          Generate balanced encounters for your D&D 5e sessions powered by
          Gemini 3 Pro ✨
        </p>
        <Link
          href="/encounter"
          style={{
            backgroundColor: "var(--background-tertiary)",
            color: "var(--text-primary)",
            padding: "1rem 2.5rem",
            fontSize: "1.25rem",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "bold",
            textDecoration: "none",
            display: "inline-block",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
            transition: "all 0.3s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "var(--text-secondary)";
            e.currentTarget.style.transform = "translateY(-4px) scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.5)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor =
              "var(--background-tertiary)";
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.4)";
          }}
        >
          🎲 Generate Encounter
        </Link>

        <Link
          href="/monster-search"
          style={{
            backgroundColor: "var(--background-tertiary)",
            color: "var(--text-primary)",
            padding: "1rem 2.5rem",
            fontSize: "1.25rem",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "bold",
            textDecoration: "none",
            display: "inline-block",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
            transition: "all 0.3s",
            marginTop: "1rem",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "var(--text-secondary)";
            e.currentTarget.style.transform = "translateY(-4px) scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.5)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor =
              "var(--background-tertiary)";
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.4)";
          }}
        >
          🔍 Search Monsters by CR
        </Link>

        <div
          style={{
            marginTop: "3rem",
            padding: "1rem 2rem",
            backgroundColor: "var(--background)",
            borderRadius: "8px",
            borderLeft: "4px solid var(--background-tertiary)",
            maxWidth: "500px",
          }}
        >
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              textAlign: "center",
              margin: 0,
            }}
          >
            💡 Create encounters based on party level, size, and difficulty with
            AI-powered monster selection
          </p>
        </div>
      </main>
    </div>
  );
}
