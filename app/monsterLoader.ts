import fs from "fs";
import path from "path";

export type Monster = {
  name: string;
  hp: number;
  ac: number;
  cr: number;
  type: string;
  alignment: string;
  size: string;
  spellcasting: string;
  attack1Damage: string;
  attack2Damage: string;
  attack3Damage: string;
  page: number;
};

export async function loadMonstersFromCSV(): Promise<Monster[]> {
  const csvPath = path.join(
    process.cwd(),
    "public",
    "D&D 5e Monster Manual.csv"
  );
  const data = await fs.promises.readFile(csvPath, "utf-8");
  const lines = data.trim().split("\n");
  const header = lines[0].split(",");
  const nameIdx = header.indexOf("Name");
  const hpIdx = header.indexOf("HP");
  const acIdx = header.indexOf("AC");
  const crIdx = header.indexOf("CR");
  const typeIdx = header.indexOf("Type");
  function parseCR(cr: string): number {
    if (cr.includes("/")) {
      const [num, denom] = cr.split("/").map(Number);
      return num / denom;
    }
    return Number(cr);
  }
  const alignmentIdx = header.indexOf("ALIGNMENT");
  const sizeIdx = header.indexOf("Size");
  const spellcastingIdx = header.indexOf("Spellcasting?");
  const attack1Idx = header.indexOf("Attack 1 damage");
  const attack2Idx = header.indexOf("Attack 2 Damage");
  const attack3Idx = header.indexOf("Attack 3 Damage");
  const pageIdx = header.indexOf("Page");

  const monsters: Monster[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    monsters.push({
      name: cols[nameIdx],
      hp: Number(cols[hpIdx]),
      ac: Number(cols[acIdx]),
      cr: parseCR(cols[crIdx]),
      type: cols[typeIdx],
      alignment: cols[alignmentIdx] || "",
      size: cols[sizeIdx] || "",
      spellcasting: cols[spellcastingIdx] || "NO",
      attack1Damage: cols[attack1Idx] || "",
      attack2Damage: cols[attack2Idx] || "",
      attack3Damage: cols[attack3Idx] || "",
      page: Number(cols[pageIdx]) || 0,
    });
  }
  return monsters;
}
