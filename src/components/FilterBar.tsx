import FilterChip from "./FilterChip";
import { Slider } from "@/components/ui/slider";

export interface Filters {
  usage: string;
  battery: string;
  budget: string;
  secondary: string;
  platform: string;
  brand: string;
  formFactor: string;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const FilterBar = ({ filters, onChange }: FilterBarProps) => {
  const update = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="glass-card p-6 space-y-5">
      <h3 className="font-mono font-bold text-foreground text-sm">Tell us what you need</h3>

      <FilterChip
        label="I mostly use my phone for"
        options={[
          { id: "photography", label: "Photos & Video", icon: "📸" },
          { id: "gaming", label: "Gaming", icon: "🎮" },
          { id: "social", label: "Social & Browsing", icon: "💬" },
          { id: "work", label: "Work", icon: "💼" },
        ]}
        selected={filters.usage}
        onSelect={(id) => update("usage", id)}
      />

      <FilterChip
        label="Battery importance"
        options={[
          { id: "critical", label: "Essential", icon: "🔋" },
          { id: "important", label: "Important", icon: "⚡" },
          { id: "moderate", label: "Moderate", icon: "🔌" },
          { id: "low", label: "Not a priority", icon: "🤷" },
        ]}
        selected={filters.battery}
        onSelect={(id) => update("battery", id)}
      />

      <FilterChip
        label="Budget"
        options={[
          { id: "budget", label: "Under $300", icon: "💰" },
          { id: "mid", label: "$300–$600", icon: "💵" },
          { id: "premium", label: "$600–$1000", icon: "💎" },
          { id: "ultra", label: "$1000+", icon: "👑" },
        ]}
        selected={filters.budget}
        onSelect={(id) => update("budget", id)}
      />

      <FilterChip
        label="Also important to me"
        options={[
          { id: "display", label: "Display", icon: "🖥️" },
          { id: "build", label: "Build Quality", icon: "🛡️" },
          { id: "camera", label: "Camera", icon: "📷" },
          { id: "value", label: "Best Value", icon: "🏷️" },
        ]}
        selected={filters.secondary}
        onSelect={(id) => update("secondary", id)}
      />

      <FilterChip
        label="Platform"
        options={[
          { id: "any", label: "Any", icon: "🌐" },
          { id: "android", label: "Android", icon: "🤖" },
          { id: "ios", label: "iOS", icon: "🍎" },
        ]}
        selected={filters.platform}
        onSelect={(id) => update("platform", id)}
      />

      <FilterChip
        label="Brand Preference"
        options={[
          { id: "any", label: "Any Brand", icon: "🏢" },
          { id: "apple", label: "Apple", icon: "🍏" },
          { id: "samsung", label: "Samsung", icon: "📱" },
          { id: "google", label: "Google", icon: "🔍" },
          { id: "huawei", label: "Huawei", icon: "🌺" },
          { id: "tecno", label: "Tecno", icon: "📱" },
          { id: "lg", label: "LG", icon: "📺" },
          { id: "other", label: "Other Brands", icon: "✨" },
        ]}
        selected={filters.brand}
        onSelect={(id) => update("brand", id)}
      />

      <FilterChip
        label="Form Factor"
        options={[
          { id: "any", label: "Any Size", icon: "📏" },
          { id: "compact", label: "Compact (<6.4\")", icon: "🤏" },
          { id: "large", label: "Large (6.4\"+)", icon: "👐" },
          { id: "foldable", label: "Foldable", icon: "📖" },
        ]}
        selected={filters.formFactor}
        onSelect={(id) => update("formFactor", id)}
      />
    </div>
  );
};

export default FilterBar;
