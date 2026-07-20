import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Eye, GitCompare } from "lucide-react";
import { useAverageRating } from "@/hooks/usePhoneReviews";

interface ProductCardProps {
  phone: any;
  rank: number;
  onViewDetails: () => void;
  onAddToComparison?: () => void;
  isSelected?: boolean;
}

const ProductCard = ({
  phone,
  rank,
  onViewDetails,
  onAddToComparison,
  isSelected,
}: ProductCardProps) => {
  const { data: avgRating } = useAverageRating(phone.id);

  return (
    <Card className={`glass-card p-6 hover:shadow-xl transition-all duration-300 ${
      isSelected ? "ring-2 ring-primary" : ""
    }`}>
      <div className="flex justify-between items-start mb-4">
        <Badge variant="secondary" className="glow-border">
          #{rank}
        </Badge>
        <Badge>{phone.os}</Badge>
      </div>

      <h3 className="text-xl font-bold mb-2 glow-text">
        {phone.brand} {phone.model}
      </h3>

      <p className="text-muted-foreground text-sm mb-4">{phone.summary}</p>

      {/* Price */}
      <div className="mb-4">
        <p className="text-3xl font-bold text-primary">${phone.price_usd}</p>
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-secondary/20 p-3 rounded">
          <p className="text-xs text-muted-foreground">Camera</p>
          <p className="text-lg font-bold">{phone.camera_score}/10</p>
        </div>
        <div className="bg-secondary/20 p-3 rounded">
          <p className="text-xs text-muted-foreground">Performance</p>
          <p className="text-lg font-bold">{phone.performance_score}/10</p>
        </div>
        <div className="bg-secondary/20 p-3 rounded">
          <p className="text-xs text-muted-foreground">Battery</p>
          <p className="text-lg font-bold">{phone.battery_score}/10</p>
        </div>
        <div className="bg-secondary/20 p-3 rounded">
          <p className="text-xs text-muted-foreground">Display</p>
          <p className="text-lg font-bold">{phone.display_score}/10</p>
        </div>
      </div>

      {/* Rating */}
      {avgRating && avgRating > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(avgRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold">{avgRating}</span>
        </div>
      )}

      {/* Justification */}
      <p className="text-sm text-muted-foreground mb-4 italic">
        {phone.justification}
      </p>

      {/* Specs */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-4">
        <div>
          <p className="text-muted-foreground">RAM</p>
          <p className="font-semibold">{phone.ram_gb}GB</p>
        </div>
        <div>
          <p className="text-muted-foreground">Storage</p>
          <p className="font-semibold">{phone.storage_gb}GB</p>
        </div>
        <div>
          <p className="text-muted-foreground">Battery</p>
          <p className="font-semibold">{phone.battery_mah}mAh</p>
        </div>
        <div>
          <p className="text-muted-foreground">Screen</p>
          <p className="font-semibold">{phone.screen_size_inches}"</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={onViewDetails}
          className="gap-2"
        >
          <Eye className="w-4 h-4" /> Details
        </Button>
        {onAddToComparison && (
          <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={onAddToComparison}
            className="gap-2"
          >
            <GitCompare className="w-4 h-4" /> Compare
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;
