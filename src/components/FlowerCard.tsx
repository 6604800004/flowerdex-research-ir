import { Flower } from "@/data/flowers";
import { Heart } from "lucide-react";

interface FlowerCardProps {
  flower: Flower;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: (flower: Flower) => void;
}

const FlowerCard = ({ flower, isFavorite, onToggleFavorite, onClick }: FlowerCardProps) => {
  return (
    <div
      className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
      onClick={() => onClick(flower)}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={flower.imageUrl}
          alt={flower.nameTh}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(flower.id);
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
        >
          <Heart
            size={18}
            className={isFavorite ? "fill-primary text-primary" : "text-muted-foreground"}
          />
        </button>
      </div>
      <div className="p-3 text-center">
        <h3 className="font-kanit font-semibold text-foreground text-sm">
          {flower.nameEn}
        </h3>
        <p className="font-sarabun text-muted-foreground text-xs">
          ({flower.nameTh})
        </p>
      </div>
    </div>
  );
};

export default FlowerCard;
