import { Flower } from "@/data/flowers";

// ─── EN → TH translation map ──────────────────────────────────────────────
const EN_TO_TH_COLORS: Record<string, string> = {
  red: "แดง", pink: "ชมพู", orange: "ส้ม", yellow: "เหลือง",
  white: "ขาว", purple: "ม่วง", blue: "น้ำเงิน", "light blue": "ฟ้า",
  sky: "ฟ้า", gold: "ทอง", golden: "ทอง", violet: "ม่วง",
  lavender: "ม่วง", cream: "ขาว", green: "เขียว",
  "yello": "เหลือง", "pnik": "ชมพู", "ored": "ส้ม", "whit": "ขาว",
};

const EN_TO_TH_SEASON: Record<string, string> = {
  summer: "ฤดูร้อน", winter: "ฤดูหนาว", spring: "ฤดูใบไม้ผลิ",
  rainy: "ฤดูฝน", rain: "ฤดูฝน", "all year": "ตลอดปี",
  annual: "ตลอดปี", national: "ประจำชาติ",
};

const EN_TO_TH_FLOWER: Record<string, string> = {
  rose: "กุหลาบ", lotus: "บัว", orchid: "กล้วยไม้", jasmine: "มะลิ",
  sunflower: "ทานตะวัน", marigold: "ดาวเรือง", lily: "ลิลลี่",
  peony: "พีโอนี", hydrangea: "ไฮเดรนเยีย", plumeria: "ลีลาวดี",
  gerbera: "เยอบีร่า", gazania: "กาซาเนีย",
  "bird of paradise": "สเตรลิตเซีย", "siam tulip": "กระเจียว",
  "golden shower": "ราชพฤกษ์",
};

// ─── EN meaning keywords → TH ─────────────────────────────────────────────
const EN_TO_TH_MEANING: Record<string, string> = {
  love: "ความรัก", hope: "ความหวัง", purity: "ความบริสุทธิ์",
  friendship: "มิตรภาพ", happiness: "ความสุข", beauty: "ความงาม",
  passion: "ความเร่าร้อน", loyalty: "ความภักดี", wealth: "ความมั่งคั่ง",
  prosperity: "ความเจริญรุ่งเรือง", wisdom: "ปัญญา", courage: "ความกล้าหาญ",
  grace: "ความสง่างาม", peace: "ความสงบ", faith: "ความศรัทธา",
  romance: "ความโรแมนติก", elegance: "ความสง่างาม",
};

function translateQuery(q: string): string | null {
  const lower = q.toLowerCase().trim();
  if (EN_TO_TH_COLORS[lower]) return EN_TO_TH_COLORS[lower];
  for (const [en, th] of Object.entries(EN_TO_TH_SEASON)) {
    if (lower.includes(en)) return th;
  }
  for (const [en, th] of Object.entries(EN_TO_TH_FLOWER)) {
    if (lower.includes(en)) return th;
  }
  // ตรวจ meaning EN → TH
  for (const [en, th] of Object.entries(EN_TO_TH_MEANING)) {
    if (lower.includes(en)) return th;
  }
  return null;
}

// ─── Levenshtein distance ──────────────────────────────────────────────────
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}

function fuzzySubstringDistance(query: string, target: string): number {
  const m = query.length, n = target.length;
  if (m === 0) return 0;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let j = 0; j <= n; j++) dp[0][j] = 0;
  for (let i = 1; i <= m; i++) dp[i][0] = i;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (query[i - 1] === target[j - 1] ? 0 : 1)
      );
    }
  }
  let minDist = Infinity;
  for (let j = 0; j <= n; j++) {
    if (dp[m][j] < minDist) minDist = dp[m][j];
  }
  return minDist;
}

/** ดึงคำที่ใช้ค้นหาได้จากดอกไม้ (รวม EN+TH+ความหมาย) */
function getSearchableTerms(flower: Flower): string[] {
  const terms: string[] = [
    flower.nameEn.toLowerCase(),
    flower.nameTh,
  ];

  if (flower.nameTh.startsWith("ดอก")) terms.push(flower.nameTh.slice(3));

  terms.push(...flower.colors);

  // ── เพิ่ม meaning และแต่ละคำย่อยใน meaning ────────────────
  if (flower.meaning) {
    terms.push(flower.meaning);
    // แยกคำใน meaning ด้วย , หรือ / หรือ space
    const meaningParts = flower.meaning.split(/[,\/\s]+/).map((s) => s.trim()).filter(Boolean);
    terms.push(...meaningParts);
  }

  for (const [en, th] of Object.entries(EN_TO_TH_FLOWER)) {
    if (flower.nameEn.toLowerCase().includes(en) || flower.nameTh.includes(th)) {
      terms.push(en);
    }
  }

  return terms;
}

function fuzzyMatchFlower(query: string, flower: Flower): { match: boolean; score: number } {
  const q = query.trim();
  if (!q) return { match: true, score: 0 };

  const targets = getSearchableTerms(flower);
  targets.push(flower.season, flower.description);

  let bestScore = Infinity;

  for (const target of targets) {
    if (target.toLowerCase().includes(q.toLowerCase())) {
      return { match: true, score: 0 };
    }

    if (target.length <= q.length * 2 + 5) {
      const dist = levenshtein(q.toLowerCase(), target.toLowerCase());
      const maxLen = Math.max(q.length, target.length);
      const threshold = q.length <= 3 ? 0.4 : 0.3;
      if (dist / maxLen <= threshold && dist < bestScore) bestScore = dist;
    }

    const subDist = fuzzySubstringDistance(q.toLowerCase(), target.toLowerCase());
    const threshold = q.length <= 4 ? 1 : Math.floor(q.length * 0.25);
    if (subDist <= threshold && subDist < bestScore) bestScore = subDist;
  }

  if (bestScore < Infinity) return { match: true, score: bestScore };
  return { match: false, score: Infinity };
}

function matchColor(query: string, color: string): boolean {
  const q = query.trim().toLowerCase();
  const c = color.toLowerCase();
  if (c.includes(q) || q.includes(c)) return true;
  const dist = levenshtein(q, c);
  return dist <= Math.max(1, Math.floor(q.length * 0.5));
}

export interface SearchResult {
  flower: Flower;
  score: number;
  colorMatch: boolean;
  translatedQuery?: string;
}

const ALL_COLORS_TH = ["แดง", "ชมพู", "ส้ม", "เหลือง", "ขาว", "ม่วง", "ฟ้า", "น้ำเงิน", "ทอง"];

export function searchFlowers(flowers: Flower[], query: string): SearchResult[] {
  if (!query.trim()) {
    return flowers.map((f) => ({ flower: f, score: 0, colorMatch: false }));
  }

  const q = query.trim();
  const translated = translateQuery(q);
  const effectiveQuery = translated ?? q;
  const isTranslated = !!translated;

  let matchedColor = "";
  let bestColorDist = Infinity;
  for (const c of ALL_COLORS_TH) {
    const d = levenshtein(effectiveQuery, c);
    if (d <= Math.max(1, Math.floor(effectiveQuery.length * 0.5)) && d < bestColorDist) {
      bestColorDist = d;
      matchedColor = c;
    }
  }
  if (!matchedColor && EN_TO_TH_COLORS[q.toLowerCase()]) {
    matchedColor = EN_TO_TH_COLORS[q.toLowerCase()];
  }

  const isColorQuery = matchedColor !== "";
  const results: SearchResult[] = [];

  for (const flower of flowers) {
    const result = fuzzyMatchFlower(effectiveQuery, flower);
    if (result.match) {
      const colorMatch = isColorQuery && matchColor(matchedColor, flower.imageColor);
      results.push({
        flower,
        score: result.score,
        colorMatch,
        translatedQuery: isTranslated ? translated! : undefined,
      });
    }
  }

  results.sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;
    if (a.colorMatch !== b.colorMatch) return a.colorMatch ? -1 : 1;
    return 0;
  });

  return results;
}

export function getSpellSuggestion(flowers: Flower[], query: string): string | null {
  if (!query.trim() || query.trim().length < 2) return null;

  const exactResults = searchFlowers(flowers, query);
  if (exactResults.some((r) => r.score === 0)) return null;

  let bestName = "";
  let bestDist = Infinity;

  for (const flower of flowers) {
    // เพิ่ม meaning parts ใน suggestion ด้วย
    const terms = [flower.nameEn, flower.nameTh];
    if (flower.nameTh.startsWith("ดอก")) terms.push(flower.nameTh.slice(3));
    if (flower.meaning) {
      terms.push(...flower.meaning.split(/[,\/\s]+/).map((s) => s.trim()).filter(Boolean));
    }

    for (const term of terms) {
      const d = levenshtein(query.toLowerCase(), term.toLowerCase());
      if (d < bestDist && d <= Math.max(3, Math.floor(query.length * 0.6))) {
        bestDist = d;
        bestName = term;
      }
    }
  }

  return bestName || null;
}