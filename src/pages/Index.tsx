import { useState, useMemo } from "react";
import { Search, Loader2, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import FlowerCard from "@/components/FlowerCard";
import FlowerModal from "@/components/FlowerModal";
import { CATEGORIES, Flower } from "@/data/flowers";
import { searchFlowers, getSpellSuggestion } from "@/utils/search";
import { useFavorites } from "@/hooks/useFavorites";
import { useFlowers } from "@/hooks/useFlowers";

const Index = () => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFlower, setSelectedFlower] = useState<Flower | null>(null);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { data: flowers = [], isLoading } = useFlowers();

  const results = useMemo(() => {
    let filtered = flowers;
    if (selectedCategory) {
      filtered = filtered.filter((f) => f.season === selectedCategory);
    }
    return searchFlowers(filtered, query);
  }, [flowers, query, selectedCategory]);

  // ตรวจ spell suggestion
  const suggestion = useMemo(() => {
    if (!query.trim() || results.length > 0) return null;
    return getSpellSuggestion(flowers, query);
  }, [flowers, query, results.length]);

  // คำแปล EN→TH ที่ถูก detect
  const translatedQuery = results[0]?.translatedQuery;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-center font-kanit font-bold text-2xl md:text-3xl text-foreground mb-6">
          🌼 FIND YOUR FLOWER DEX 🌸
        </h2>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-2">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <input
              type="text"
              placeholder="ค้นหาชื่อ สี หรือความหมายของดอกไม้ "
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-card text-foreground font-sarabun placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* EN→TH translation hint */}
          {translatedQuery && (
            <p className="mt-1.5 ml-1 font-sarabun text-xs text-primary flex items-center gap-1">
              <Sparkles size={12} />
              ค้นหาด้วย: &quot;{query}&quot; → <strong>{translatedQuery}</strong>
            </p>
          )}

          {/* Spell suggestion */}
          {suggestion && !translatedQuery && (
            <p className="mt-1.5 ml-1 font-sarabun text-xs text-muted-foreground">
              คุณหมายถึง:{" "}
              <button
                className="text-primary underline underline-offset-2 hover:opacity-80"
                onClick={() => setQuery(suggestion)}
              >
                {suggestion}
              </button>
              ?
            </p>
          )}
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat ? null : cat)
              }
              className={`font-sarabun text-sm px-4 py-1.5 rounded-lg border transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <hr className="border-border mb-8" />

        <p className="font-sarabun text-muted-foreground mb-4">
          {query ? `ผลการค้นหา "${query}"` : "ดอกไม้ที่นิยม"}{" "}
          ({results.length} รายการ)
        </p>

        {isLoading ? (
          <div className="text-center py-16">
            <Loader2
              size={32}
              className="animate-spin mx-auto text-muted-foreground mb-3"
            />
            <p className="font-sarabun text-muted-foreground">กำลังโหลดข้อมูล...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map(({ flower }) => (
              <FlowerCard
                key={flower.id}
                flower={flower}
                isFavorite={isFavorite(flower.id)}
                onToggleFavorite={toggleFavorite}
                onClick={setSelectedFlower}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🥀</p>
            <p className="font-sarabun text-muted-foreground">
              ไม่พบดอกไม้ที่ค้นหา ลองใช้คำอื่นดูนะ
            </p>
            {suggestion && (
              <button
                className="mt-3 font-sarabun text-sm text-primary underline underline-offset-2"
                onClick={() => setQuery(suggestion)}
              >
                ลองค้นหา &ldquo;{suggestion}&rdquo;
              </button>
            )}
          </div>
        )}
      </main>

      <FlowerModal
        flower={selectedFlower}
        isOpen={!!selectedFlower}
        onClose={() => setSelectedFlower(null)}
        isFavorite={selectedFlower ? isFavorite(selectedFlower.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default Index;
