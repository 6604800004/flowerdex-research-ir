import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";
import type { Flower } from "@/data/flowers";

// ─── Perenual API (https://perenual.com/docs/api) ──────────────────────────
// FREE tier: 100 req/day — เราจึง cache ใน sessionStorage เพื่อลด request
// และดึงข้อมูลเฉพาะดอกไม้ที่ยังไม่มี care data เท่านั้น

const PERENUAL_KEY = import.meta.env.VITE_PERENUAL_API_KEY as string | undefined;
const PERENUAL_BASE = "https://perenual.com/api";

/** Cache key สำหรับ sessionStorage */
const CARE_CACHE_KEY = "flowerdex_care_cache_v1";

interface CareCache {
  [slug: string]: {
    watering: string;
    sunlight: string;
    soil: string;
    temperature: string;
  } | null; // null = ไม่พบใน API
}

/** อ่าน cache จาก sessionStorage */
function readCareCache(): CareCache {
  try {
    const raw = sessionStorage.getItem(CARE_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** เขียน cache ลง sessionStorage */
function writeCareCache(cache: CareCache): void {
  try {
    sessionStorage.setItem(CARE_CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* ignore quota errors */
  }
}

/** แปลง Perenual watering field → ข้อความไทย */
function translateWatering(raw: string): string {
  const map: Record<string, string> = {
    Frequent: "รดน้ำบ่อย วันละ 1-2 ครั้ง",
    Average: "รดน้ำปานกลาง 2-3 ครั้ง/สัปดาห์",
    Minimum: "รดน้ำน้อย สัปดาห์ละครั้ง",
    None: "ไม่ต้องรดน้ำ ทนแล้งได้",
  };
  return map[raw] ?? raw;
}

/** แปลง Perenual sunlight array → ข้อความไทย */
function translateSunlight(raw: string[]): string {
  const joined = raw.join(", ");
  if (joined.toLowerCase().includes("full sun")) return "แดดจัด 6+ ชม./วัน";
  if (joined.toLowerCase().includes("part shade")) return "แดดรำไร 4-6 ชม./วัน";
  if (joined.toLowerCase().includes("full shade")) return "ร่มเย็น ไม่ต้องการแสงมาก";
  return joined;
}

/**
 * ดึง care info จาก Perenual API สำหรับดอกไม้ 1 ชนิด
 * Returns null ถ้าไม่พบหรือ API key ไม่ถูกต้อง
 */
async function fetchCareFromPerenual(
  nameEn: string
): Promise<CareCache[string]> {
  if (!PERENUAL_KEY) return null;

  try {
    // Step 1: ค้นหาชื่อ (1 request per flower)
    const searchRes = await fetch(
      `${PERENUAL_BASE}/species-list?key=${PERENUAL_KEY}&q=${encodeURIComponent(nameEn)}&page=1`
    );
    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();
    const firstResult = searchData?.data?.[0];
    if (!firstResult?.id) return null;

    // Step 2: ดึง detail (1 request per flower)
    const detailRes = await fetch(
      `${PERENUAL_BASE}/species/details/${firstResult.id}?key=${PERENUAL_KEY}`
    );
    if (!detailRes.ok) return null;
    const detail = await detailRes.json();

    return {
      watering: translateWatering(detail.watering ?? "Average"),
      sunlight: translateSunlight(detail.sunlight ?? []),
      soil: detail.soil?.join(", ") || "ดินร่วนระบายน้ำดี",
      temperature: detail.hardiness
        ? `${detail.hardiness.min ?? ""}–${detail.hardiness.max ?? ""}°F (ปรับตามสภาพไทย 20-35°C)`
        : "20-35°C",
    };
  } catch {
    return null;
  }
}

/**
 * ดึงข้อมูล care สำหรับดอกไม้ทั้งหมดที่ยังไม่มีใน cache
 * — ใช้ Promise.allSettled เพื่อไม่ให้ error 1 ตัวทำลายทั้งหมด
 * — ใช้ sessionStorage cache เพื่อไม่ต้อง fetch ซ้ำใน session เดิม
 */
async function enrichFlowersWithCare(flowers: Flower[]): Promise<Flower[]> {
  if (!PERENUAL_KEY) return flowers;

  const cache = readCareCache();

  // หาดอกไม้ที่ยังไม่มีใน cache และไม่มี care data จาก Supabase
  const needFetch = flowers.filter(
    (f) => !f.care && !(f.id in cache)
  );

  if (needFetch.length > 0) {
    // Batch fetch — แต่จำกัดไว้ 10 ตัวต่อ session เพื่อประหยัด quota
    const toFetch = needFetch.slice(0, 10);

    const results = await Promise.allSettled(
      toFetch.map(async (f) => ({
        id: f.id,
        care: await fetchCareFromPerenual(f.nameEn),
      }))
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        cache[result.value.id] = result.value.care;
      }
    }

    writeCareCache(cache);
  }

  // ใส่ care data กลับไปในดอกไม้
  return flowers.map((f) => {
    if (f.care) return f; // มีจาก Supabase แล้ว
    const cached = cache[f.id];
    if (cached) {
      return { ...f, care: cached };
    }
    return f;
  });
}

export function useFlowers() {
  return useQuery({
    queryKey: ["flowers"],
    queryFn: async (): Promise<Flower[]> => {
      // ─── 1 request: ดึงจาก Supabase ─────────────────────────────────
      const { data, error } = await supabase
        .from("flowers")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      const flowers: Flower[] = (data ?? []).map((row) => ({
        id: row.slug,
        nameEn: row.name_en,
        nameTh: row.name_th,
        description: row.description,
        colors: row.colors,
        season: row.season,
        meaning: row.meaning,
        imageUrl: row.image_url ?? "",
        imageColor: row.image_color ?? "",
        care: row.care_watering
          ? {
              watering: row.care_watering,
              sunlight: row.care_sunlight ?? "",
              soil: row.care_soil ?? "",
              temperature: row.care_temperature ?? "",
            }
          : undefined,
      }));

      // ─── เสริม care จาก Perenual สำหรับดอกที่ยังไม่มีข้อมูล ─────────
      return enrichFlowersWithCare(flowers);
    },
    staleTime: 1000 * 60 * 10, // cache 10 นาที — ลด request ซ้ำ
    gcTime: 1000 * 60 * 30,    // เก็บ cache ไว้ 30 นาที
  });
}
