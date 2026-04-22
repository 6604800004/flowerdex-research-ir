import { Flower } from "@/data/flowers";
import { X, Heart, Droplets, Sun, Thermometer, Shrub } from "lucide-react";

interface FlowerModalProps {
  flower: Flower | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const FlowerModal = ({ flower, isOpen, onClose, isFavorite, onToggleFavorite }: FlowerModalProps) => {
  if (!isOpen || !flower) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <X size={18} />
          </button>
          <div className="p-6">
            <div className="text-center mb-4">
              <h2 className="font-kanit font-bold text-xl text-foreground">
                {flower.nameEn}
              </h2>
              <p className="font-sarabun text-muted-foreground text-sm">
                ({flower.nameTh})
              </p>
            </div>

            <div className="rounded-xl overflow-hidden mb-4 aspect-square max-w-[240px] mx-auto">
              <img
                src={flower.imageUrl}
                alt={flower.nameTh}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="font-sarabun text-foreground text-sm leading-relaxed mb-4">
              {flower.description}
            </p>

            <div className="space-y-2 font-sarabun text-sm">
              <p>
                <span className="font-semibold text-flower-brown">สี:</span>{" "}
                <span className="text-foreground">{flower.colors.join(", ")}</span>
              </p>
              <p>
                <span className="font-semibold text-flower-brown">ฤดูกาล:</span>{" "}
                <span className="text-foreground">{flower.season}</span>
              </p>
              <p>
                <span className="font-semibold text-flower-brown">ความหมาย:</span>{" "}
                <span className="text-foreground">{flower.meaning}</span>
              </p>
            </div>

            {/* Care info from Perenual API data */}
            {flower.care && (
              <div className="mt-4 p-3 bg-secondary rounded-xl">
                <h4 className="font-kanit font-semibold text-sm text-foreground mb-2">
                  🌱 วิธีดูแล (Perenual API)
                </h4>
                <div className="space-y-1.5 font-sarabun text-xs">
                  <div className="flex items-start gap-2">
                    <Droplets size={14} className="text-flower-pink mt-0.5 shrink-0" />
                    <span className="text-foreground"><span className="font-semibold">น้ำ:</span> {flower.care.watering}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sun size={14} className="text-accent mt-0.5 shrink-0" />
                    <span className="text-foreground"><span className="font-semibold">แสง:</span> {flower.care.sunlight}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shrub size={14} className="text-flower-brown mt-0.5 shrink-0" />
                    <span className="text-foreground"><span className="font-semibold">ดิน:</span> {flower.care.soil}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Thermometer size={14} className="text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground"><span className="font-semibold">อุณหภูมิ:</span> {flower.care.temperature}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => onToggleFavorite(flower.id)}
              className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-kanit text-sm hover:bg-muted transition-colors border border-border"
            >
              <Heart
                size={16}
                className={isFavorite ? "fill-primary text-primary" : "text-muted-foreground"}
              />
              {isFavorite ? "ลบออกจากรายการโปรด" : "เพิ่มโปรด"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowerModal;
