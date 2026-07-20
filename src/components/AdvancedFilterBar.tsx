import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";

export interface AdvancedFilters {
  brands: string[];
  priceMin: number;
  priceMax: number;
  os: string[];
  features: string[];
}

interface AdvancedFilterBarProps {
  onFilterChange: (filters: AdvancedFilters) => void;
  onClear: () => void;
}

const BRANDS = ["Apple", "Samsung", "Google", "OnePlus", "Motorola", "Xiaomi", "Nothing", "Realme", "Tecno", "Sony", "Huawei", "LG", "Poco"];
const FEATURES = [
  "5G",
  "Wireless Charging",
  "Under-Display Camera",
  "IP Rating",
  "Headphone Jack",
  "Fast Charging",
  "Water Resistant",
];

const AdvancedFilterBar = ({ onFilterChange, onClear }: AdvancedFilterBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<AdvancedFilters>({
    brands: [],
    priceMin: 0,
    priceMax: 2000,
    os: [],
    features: [],
  });

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    const newFilters = { ...filters, brands: newBrands };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleOSToggle = (os: string) => {
    const newOS = filters.os.includes(os)
      ? filters.os.filter((o) => o !== os)
      : [...filters.os, os];
    const newFilters = { ...filters, os: newOS };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter((f) => f !== feature)
      : [...filters.features, feature];
    const newFilters = { ...filters, features: newFeatures };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...filters, priceMin: value[0], priceMax: value[1] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    const clearedFilters: AdvancedFilters = {
      brands: [],
      priceMin: 0,
      priceMax: 2000,
      os: [],
      features: [],
    };
    setFilters(clearedFilters);
    onClear();
  };

  const activeFiltersCount =
    filters.brands.length + filters.os.length + filters.features.length;

  return (
    <div className="mb-6">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        <span>
          Advanced Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${
          isOpen ? "rotate-180" : ""
        }`} />
      </Button>

      {isOpen && (
        <Card className="p-6 mt-4 space-y-6">
          {/* Brands */}
          <div>
            <h3 className="font-semibold mb-3">Brand</h3>
            <div className="grid grid-cols-2 gap-3">
              {BRANDS.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={() => handleBrandToggle(brand)}
                    id={`brand-${brand}`}
                  />
                  <label
                    htmlFor={`brand-${brand}`}
                    className="text-sm cursor-pointer"
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold mb-3">Price Range</h3>
            <Slider
              min={0}
              max={2000}
              step={50}
              value={[filters.priceMin, filters.priceMax]}
              onValueChange={handlePriceChange}
              className="mb-3"
            />
            <div className="flex justify-between text-sm">
              <span>${filters.priceMin}</span>
              <span>${filters.priceMax}</span>
            </div>
          </div>

          {/* OS */}
          <div>
            <h3 className="font-semibold mb-3">Operating System</h3>
            <div className="space-y-2">
              {["iOS", "Android", "HarmonyOS"].map((os) => (
                <div key={os} className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.os.includes(os)}
                    onCheckedChange={() => handleOSToggle(os)}
                    id={`os-${os}`}
                  />
                  <label htmlFor={`os-${os}`} className="text-sm cursor-pointer">
                    {os}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-3">Features</h3>
            <div className="grid grid-cols-2 gap-3">
              {FEATURES.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.features.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                    id={`feature-${feature}`}
                  />
                  <label
                    htmlFor={`feature-${feature}`}
                    className="text-sm cursor-pointer"
                  >
                    {feature}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Clear Button */}
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleClear}
            >
              <X className="w-4 h-4 mr-2" /> Clear All Filters
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

export default AdvancedFilterBar;
