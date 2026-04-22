import { useState } from "react";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import FlowerCard from "@/components/FlowerCard";
import FlowerModal from "@/components/FlowerModal";
import { Flower } from "@/data/flowers";
import { useFavorites } from "@/hooks/useFavorites";
import { useFlowers } from "@/hooks/useFlowers";

const Favorites = () => {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [selectedFlower, setSelectedFlower] = useState<Flower | null>(null);
  const { data: flowers = [], isLoading } = useFlowers();

  const favoriteFlowers = flowers.filter(f => favorites.includes(f.id));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-center font-kanit font-bold text-2xl md:text-3xl text-foreground mb-2">
          💖 รายการโปรด
        </h2>
        <p className="text-center font-sarabun text-muted-foreground mb-8">
          ดอกไม้ที่คุณชื่นชอบ ({favoriteFlowers.length} รายการ)
        </p>

        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 size={32} className="animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : favoriteFlowers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favoriteFlowers.map((flower) => (
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
            <p className="text-4xl mb-3">🌷</p>
            <p className="font-sarabun text-muted-foreground">
              ยังไม่มีดอกไม้ในรายการโปรด
            </p>
            <p className="font-sarabun text-muted-foreground text-sm mt-1">
              กดหัวใจ ♥ ที่ดอกไม้เพื่อเพิ่มเข้ารายการ
            </p>
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

export default Favorites;
