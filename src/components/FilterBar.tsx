import FilterChip from "./FilterChip";
import { Slider } from "@/components/ui/slider";

export interface Filters {
  usage: string;
  battery: string;
  budget: string;
  secondary: string;
  platform: string;
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
    </div>
  );
};

export default FilterBar;
