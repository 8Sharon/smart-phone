import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  options: { id: string; label: string; icon?: string }[];
  selected: string;
  onSelect: (id: string) => void;
}

const FilterChip = ({ label, options, selected, onSelect }: FilterChipProps) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 border",
              selected === opt.id
                ? "bg-primary/15 text-primary border-primary/40 glow-border"
                : "bg-card/50 text-muted-foreground border-border hover:border-muted-foreground/40 hover:text-foreground"
            )}
          >
            {opt.icon && <span className="mr-1">{opt.icon}</span>}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterChip;
