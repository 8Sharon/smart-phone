import { Battery, Camera, Cpu, Monitor, Shield, Star } from "lucide-react";
import phoneImage from "@/assets/phone-generic.png";

interface Phone {
  id: string;
  brand: string;
  model: string;
  price_usd: number;
  camera_score: number;
  performance_score: number;
  battery_score: number;
  display_score: number;
  build_quality_score: number;
  ram_gb: number;
  storage_gb: number;
  battery_mah: number;
  screen_size_inches: number;
  chipset: string;
  os: string;
  summary: string;
  image_url?: string;
  match_score?: number;
  justification?: string;
}

interface ProductCardProps {
  phone: Phone;
  rank: number;
}

const MiniBar = ({ score }: { score: number }) => (
  <div className="w-full h-1 bg-border rounded-full overflow-hidden">
    <div className="h-full bg-primary/70 rounded-full" style={{ width: `${(score / 10) * 100}%` }} />
  </div>
);

const ProductCard = ({ phone, rank }: ProductCardProps) => {
  // Generate a local image path based on brand and model if image_url isn't provided
  // Example: brand "Samsung", model "Galaxy S24 Ultra" -> "galaxy-s24-ultra.png"
  const getLocalImage = () => {
    if (phone.image_url) return phone.image_url;
    
    // Create a slug from brand and model, or just model if brand is already in the model string
    const fullString = phone.model.toLowerCase().includes(phone.brand.toLowerCase()) 
      ? phone.model 
      : `${phone.brand} ${phone.model}`;
      
    const slug = fullString.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // We know these specific paths exist in the public/phones directory, 
    // but we can try to load them by slug. If it fails, we fall back to generic.
    // Since we're in Vite, we can just use the absolute path /phones/slug.png
    return `/phones/${slug}.png`;
  };

  const currentImage = getLocalImage();

  return (
    <div
      className="glass-card overflow-hidden group hover:border-primary/30 transition-all duration-300 opacity-0 animate-fade-in-up flex flex-col"
      style={{ animationDelay: `${rank * 0.08}s` }}
    >
      {/* Image area */}
      <div className="relative h-48 bg-gradient-to-br from-muted/50 to-background flex items-center justify-center overflow-hidden">
        <img
          src={currentImage}
          onError={(e) => {
            // Fallback to generic image if local phone specific image doesn't exist
            (e.target as HTMLImageElement).src = phoneImage;
          }}
          alt={`${phone.brand} ${phone.model}`}
          className="h-36 w-auto object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
        />
        {phone.match_score && (
          <div className="absolute top-3 right-3 bg-primary/15 backdrop-blur-sm border border-primary/30 rounded-lg px-2 py-1">
            <span className="text-xs font-mono font-bold text-primary">{Math.round(phone.match_score)}% match</span>
          </div>
        )}
        {rank < 3 && (
          <div className="absolute top-3 left-3 bg-card/80 backdrop-blur-sm border border-border rounded-lg px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 text-primary fill-primary" />
            <span className="text-[10px] font-mono text-foreground">#{rank + 1}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{phone.brand}</p>
            <h3 className="font-mono font-bold text-foreground text-sm leading-tight">{phone.model}</h3>
          </div>
          <span className="text-lg font-mono font-bold text-primary">${phone.price_usd}</span>
        </div>

        <p className="text-[11px] text-muted-foreground mt-2 mb-3 line-clamp-2 flex-1">
          {phone.justification || phone.summary}
        </p>

        {/* Mini spec bars */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Camera className="w-3 h-3 text-muted-foreground" />
            <MiniBar score={phone.camera_score} />
            <span className="text-[10px] font-mono text-muted-foreground w-4">{phone.camera_score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3 text-muted-foreground" />
            <MiniBar score={phone.performance_score} />
            <span className="text-[10px] font-mono text-muted-foreground w-4">{phone.performance_score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Battery className="w-3 h-3 text-muted-foreground" />
            <MiniBar score={phone.battery_score} />
            <span className="text-[10px] font-mono text-muted-foreground w-4">{phone.battery_score}</span>
          </div>
        </div>

        {/* Spec chips */}
        <div className="mt-3 flex flex-wrap gap-1">
          {[`${phone.ram_gb}GB`, `${phone.storage_gb}GB`, `${phone.battery_mah}mAh`, phone.chipset].filter(Boolean).map((s) => (
            <span key={s} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
