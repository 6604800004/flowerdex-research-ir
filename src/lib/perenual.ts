import { COLOR_LIST } from "@/data/flowers";

const PERENUAL_KEY = import.meta.env.VITE_PERENUAL_API_KEY ?? "";

// ── Thai ↔ English name mapping ──────────────────────────────────────────────
const THAI_TO_EN: Record<string, string> = {
  "กุหลาบ": "rose", "ทานตะวัน": "sunflower", "บัว": "lotus",
  "มะลิ": "jasmine", "กล้วยไม้": "orchid", "ทิวลิป": "tulip",
  "ดาวเรือง": "marigold", "ลิลลี่": "lily", "ชบา": "hibiscus",
  "พุด": "gardenia", "จำปี": "champak", "แก้ว": "murraya",
  "เข็ม": "ixora", "บานชื่น": "zinnia", "ดอกรัก": "crown flower",
  "กาซาเนีย": "gazania", "ราตรี": "night jasmine",
  "เฟื่องฟ้า": "bougainvillea", "พุทธรักษา": "canna",
  "ลาเวนเดอร์": "lavender", "คาร์เนชั่น": "carnation",
  "ดาเลีย": "dahlia", "ไฮเดรนเยีย": "hydrangea",
  "พีโอนี": "peony", "ซากุระ": "cherry blossom",
  "แดฟโฟดิล": "daffodil", "ไอริส": "iris",
};

const EN_TO_THAI: Record<string, string> = Object.fromEntries(
  Object.entries(THAI_TO_EN).map(([th, en]) => [en.toLowerCase(), th])
);

// ── Color mapping ────────────────────────────────────────────────────────────
const COLOR_MAP: Record<string, string> = {
  red: "แดง", pink: "ชมพู", orange: "ส้ม", yellow: "เหลือง",
  white: "ขาว", purple: "ม่วง", blue: "ฟ้า", silver: "น้ำเงิน",
  gray: "น้ำเงิน", grey: "น้ำเงิน", gold: "ทอง", green: "เหลือง",
  violet: "ม่วง", magenta: "ชมพู", cream: "ขาว", lavender: "ม่วง",
};

const WATER_MAP: Record<string, string> = {
  frequent: "รดน้ำบ่อย (ทุกวัน)",
  average: "รดน้ำปานกลาง (2–3 ครั้ง/สัปดาห์)",
  minimum: "รดน้ำน้อย (1 ครั้ง/สัปดาห์)",
  none: "ไม่ต้องการน้ำมาก",
};

const SUN_MAP: Record<string, string> = {
  "full sun": "แสงแดดเต็มที่",
  "part shade": "แสงแดดบางส่วน",
  "full shade": "ร่มเงา",
  "sun-part shade": "แสงแดดเต็ม–บางส่วน",
  "filtered shade": "แสงผ่านร่มเงา",
};

// ── Meaning mapping ──────────────────────────────────────────────────────────
const MEANING_MAP: Record<string, string> = {
  rose: "ความรัก, ความโรแมนติก",
  sunflower: "ความสุข, ความซื่อสัตย์",
  lotus: "ความบริสุทธิ์, การตื่นรู้",
  jasmine: "ความบริสุทธิ์, ความอ่อนหวาน",
  orchid: "ความสง่างาม, ความงดงาม",
  tulip: "ความรักที่สมบูรณ์แบบ",
  marigold: "ความคิดสร้างสรรค์, ความมั่งคั่ง",
  lily: "ความบริสุทธิ์, ความอุดมสมบูรณ์",
  hibiscus: "ความงามที่ละเอียดอ่อน",
  gardenia: "ความลับ, ความหวานซ่อนเร้น",
  champak: "ความสง่างาม, กลิ่นหอม",
  murraya: "ความสดชื่น, ความโชคดี",
  ixora: "ความเร่าร้อน, ความภักดี",
  zinnia: "มิตรภาพ, ความอดทน",
  "crown flower": "ความแข็งแกร่ง, ความศรัทธา",
  gazania: "ความรุ่งเรือง, ความมั่งคั่ง",
  "night jasmine": "ความรักยามค่ำคืน",
  bougainvillea: "ความเร่าร้อน, ความงามที่แข็งแกร่ง",
  canna: "ความสง่างาม, ความมั่นใจ",
  lavender: "ความสงบ, ความบริสุทธิ์",
  carnation: "ความรัก, ความชื่นชม",
  dahlia: "ความสง่างาม, ศักดิ์ศรี",
  hydrangea: "ความอดทน, ความเข้าใจ",
  peony: "ความมั่งคั่ง, ความเจริญรุ่งเรือง",
  "cherry blossom": "ความงามชั่วคราว, การเริ่มต้นใหม่",
  daffodil: "การเริ่มต้นใหม่, ความหวัง",
  iris: "ปัญญา, ความหวัง, ความกล้าหาญ",
};

// ── Season mapping ──────────────────────────────────────────────────────────
const SEASON_MAP: Record<string, string> = {
  perennial: "ดอกไม้ตลอดปี",
  annual: "ดอกไม้ตลอดปี",
  biennial: "ดอกไม้ตลอดปี",
};

// ── Types ────────────────────────────────────────────────────────────────────
export interface PerenualSpecies {
  id: number;
  common_name: string;
  scientific_name: string[];
  default_image?: { small_url?: string; thumbnail?: string; medium_url?: string; regular_url?: string };
}

export interface PerenualDetail {
  description?: string;
  flower_color?: string[];
  sunlight?: string[];
  watering?: string;
  hardiness?: { min?: string; max?: string };
  type?: string;
  cycle?: string;
  default_image?: { medium_url?: string; regular_url?: string; original_url?: string };
}

export interface AutofillResult {
  slug: string;
  name_en: string;
  name_th: string;
  description: string;
  colors: string[];
  image_color: string;
  season: string;
  meaning: string;
  care_watering: string;
  care_sunlight: string;
  care_soil: string;
  care_temperature: string;
  imageUrl: string;
}

// ── Detect if input is Thai ──────────────────────────────────────────────────
function isThai(text: string): boolean {
  return /[\u0E00-\u0E7F]/.test(text);
}

/** Translate Thai query → English for Perenual search */
function translateQuery(query: string): string {
  const q = query.trim().toLowerCase().replace(/^ดอก/, "");
  // Exact match
  if (THAI_TO_EN[q]) return THAI_TO_EN[q];
  // Partial match
  for (const [th, en] of Object.entries(THAI_TO_EN)) {
    if (th.includes(q) || q.includes(th)) return en;
  }
  return query; // fallback: search as-is
}

// ── API calls ────────────────────────────────────────────────────────────────
export function isApiKeySet(): boolean {
  return !!PERENUAL_KEY;
}

export async function searchSpecies(query: string): Promise<PerenualSpecies[]> {
  if (!query.trim() || !PERENUAL_KEY) return [];

  const searchQuery = isThai(query) ? translateQuery(query) : query;

  const res = await fetch(
    `https://perenual.com/api/species-list?key=${PERENUAL_KEY}&q=${encodeURIComponent(searchQuery)}&per_page=12`
  );
  if (!res.ok) return [];

  const json = await res.json();
  const data: PerenualSpecies[] = json.data ?? [];

  const lower = searchQuery.toLowerCase();
  return data.filter((item) =>
    item.common_name?.toLowerCase().includes(lower) ||
    item.scientific_name?.some((s) => s.toLowerCase().includes(lower))
  );
}

export async function fetchDetail(id: number): Promise<PerenualDetail> {
  if (!PERENUAL_KEY) return {};
  const res = await fetch(
    `https://perenual.com/api/species/details/${id}?key=${PERENUAL_KEY}`
  );
  if (!res.ok) return {};
  return res.json();
}

/** Full autofill: fetch detail + map to form-ready data */
export async function autofillFromSpecies(
  species: PerenualSpecies
): Promise<AutofillResult> {
  const detail = await fetchDetail(species.id);

  // Colors
  const rawColors = detail.flower_color ?? [];
  const mappedColors = [...new Set(
    rawColors
      .map((c) => COLOR_MAP[c.toLowerCase()])
      .filter((c): c is string => !!c && COLOR_LIST.includes(c))
  )];

  // Image color = first mapped color
  const imageColor = mappedColors[0] ?? "";

  // Care
  const sunRaw = detail.sunlight?.[0]?.toLowerCase() ?? "";
  const waterRaw = (detail.watering ?? "").toLowerCase();

  // Slug
  const slug = `${species.common_name}-${species.id}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Thai name
  const nameTh = EN_TO_THAI[species.common_name.toLowerCase()] ?? "";

  // Meaning
  const meaning = MEANING_MAP[species.common_name.toLowerCase()] ?? "";

  // Season from cycle
  const cycleRaw = (detail.cycle ?? "").toLowerCase();
  const season = SEASON_MAP[cycleRaw] ?? "ดอกไม้ตลอดปี";

  // Image — pick best quality available
  const img =
    detail.default_image?.original_url ||
    detail.default_image?.regular_url ||
    detail.default_image?.medium_url ||
    species.default_image?.regular_url ||
    species.default_image?.medium_url ||
    species.default_image?.small_url ||
    species.default_image?.thumbnail ||
    "";

  // Temperature from hardiness
  let tempStr = "";
  if (detail.hardiness?.min || detail.hardiness?.max) {
    tempStr = `Zone ${detail.hardiness.min ?? "?"} – ${detail.hardiness.max ?? "?"}`;
  }

  return {
    slug,
    name_en: species.common_name,
    name_th: nameTh,
    description: detail.description ?? "",
    colors: mappedColors,
    image_color: imageColor,
    season,
    meaning,
    care_watering: WATER_MAP[waterRaw] ?? detail.watering ?? "",
    care_sunlight: SUN_MAP[sunRaw] ?? detail.sunlight?.[0] ?? "",
    care_soil: detail.type ? `ประเภท: ${detail.type}` : "",
    care_temperature: tempStr,
    imageUrl: img,
  };
}
