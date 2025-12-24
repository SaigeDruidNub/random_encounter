import fs from "fs";
import path from "path";
import { Monster } from "./monsterLoader";

export async function generateEncounter(
  partyLevel: number,
  partySize: number,
  difficulty: "easy" | "medium" | "hard" | "deadly"
): Promise<Monster[]> {
  const monsters = await loadMonstersFromCSV();

  // Read LVLtoXP.csv for XP thresholds
  const csvPath = path.join(process.cwd(), "public", "LVLtoXP.csv");
  const data = await fs.promises.readFile(csvPath, "utf-8");
  const lines = data.trim().split("\n");
  const header = lines[0].split(",");
  const levelIdx = header.indexOf("Character Level");
  const easyIdx = header.indexOf("Custom Easy");
  const mediumIdx = header.indexOf("Custom Medium");
  const hardIdx = header.indexOf("Custom Hard");
  const deadlyIdx = header.indexOf("Custom Deadly");

  let xpPerChar = 0;
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (Number(cols[levelIdx]) === partyLevel) {
      if (difficulty === "easy") xpPerChar = Number(cols[easyIdx]);
      else if (difficulty === "medium") xpPerChar = Number(cols[mediumIdx]);
      else if (difficulty === "hard") xpPerChar = Number(cols[hardIdx]);
      else if (difficulty === "deadly") xpPerChar = Number(cols[deadlyIdx]);
      break;
    }
  }
  const targetXP = xpPerChar * partySize;
  console.log(`Target XP: ${targetXP}, XP per char: ${xpPerChar}`);

  // Load CR to XP mapping from CSV
  const crXpPath = path.join(process.cwd(), "public", "CRtoXP.csv");
  const crXpData = await fs.promises.readFile(crXpPath, "utf-8");
  const crXpLines = crXpData.trim().split("\n");
  const crToXPMap = new Map<number, number>();

  for (let i = 1; i < crXpLines.length; i++) {
    const cols = crXpLines[i].split(",");
    const cr = parseFloat(cols[0]?.trim());
    const xp = Number(cols[1]?.trim());
    if (!isNaN(cr) && !isNaN(xp)) {
      crToXPMap.set(cr, xp);
    }
  }

  const crToXP = (cr: number) => {
    const xp = crToXPMap.get(cr);
    if (xp === undefined) {
      console.log(`Warning: CR ${cr} not mapped to XP`);
      return 0;
    }
    return xp;
  };

  // Filter monsters that have valid XP values
  const validMonsters = monsters.filter((m) => crToXP(m.cr) > 0);
  console.log(
    `Valid monsters with XP: ${validMonsters.length} out of ${monsters.length}`
  );

  // Greedy selection for demo
  let encounter: Monster[] = [];
  let totalXP = 0;
  for (const monster of validMonsters.sort(
    (a, b) => crToXP(b.cr) - crToXP(a.cr)
  )) {
    if (totalXP + crToXP(monster.cr) <= targetXP) {
      encounter.push(monster);
      totalXP += crToXP(monster.cr);
    }
  }
  console.log(
    `Generated encounter with ${encounter.length} monsters, total XP: ${totalXP}`
  );
  return encounter;
}

async function loadMonstersFromCSV(): Promise<Monster[]> {
  const csvPath = path.join(
    process.cwd(),
    "public",
    "D&D 5e Monster Manual.csv"
  );
  const data = await fs.promises.readFile(csvPath, "utf-8");
  const lines = data.trim().split("\n");
  const monsters: Monster[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    const name = cols[0]?.trim();
    const cr = parseFloat(cols[4]?.trim()); // CR is column 4
    const hp = Number(cols[6]?.trim()); // HP is column 6
    const ac = Number(cols[5]?.trim()); // AC is column 5
    const type = cols[1]?.trim(); // Type is column 1

    if (name && !isNaN(cr) && !isNaN(hp) && !isNaN(ac)) {
      monsters.push({ 
        name, 
        cr, 
        hp, 
        ac, 
        type: type || "",
        alignment: cols[2]?.trim() || "",
        size: cols[3]?.trim() || "",
        spellcasting: "NO",
        attack1Damage: "",
        attack2Damage: "",
        attack3Damage: "",
        page: 0
      });
    }
  }

  console.log(`Loaded ${monsters.length} monsters`);
  return monsters;
}
