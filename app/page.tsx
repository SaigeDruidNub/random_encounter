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
        style={{ background: "var(--background-secondary)" }}
      >
        <h1
          className="text-3xl font-bold mb-8"
          style={{ color: "var(--text-primary)" }}
        >
          D&D Random Encounter Generator
        </h1>
        <p
          className="text-lg mb-8 text-center"
          style={{ color: "var(--text-secondary)" }}
        >
          Generate balanced encounters for your D&D 5e sessions powered by
          Gemini 3 Pro
        </p>
        <Link
          href="/encounter"
          style={{
            backgroundColor: "var(--background-tertiary)",
            color: "var(--text-primary)",
            padding: "12px 24px",
            fontSize: "16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Generate Encounter
        </Link>
      </main>
    </div>
  );
}
