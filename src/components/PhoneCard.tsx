import { Battery, Camera, Cpu, Monitor, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  match_score?: number;
  justification?: string;
}

interface PhoneCardProps {
  phone: Phone;
  rank: number;
}

const ScoreBar = ({ label, score, icon: Icon }: { label: string; score: number; icon: React.ElementType }) => (
  <div className="flex items-center gap-3">
    <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
    <span className="text-xs text-muted-foreground w-20 shrink-0">{label}</span>
    <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
      <div
        className="h-full bg-primary rounded-full transition-all duration-700"
        style={{ width: `${(score / 10) * 100}%` }}
      />
    </div>
    <span className="text-xs font-mono text-foreground w-6 text-right">{score}</span>
  </div>
);

const PhoneCard = ({ phone, rank }: PhoneCardProps) => {
  const rankLabels = ["Best Match", "Runner Up", "Great Value"];
  const rankColors = [
    "bg-primary/10 text-primary border-primary/30",
    "bg-secondary text-secondary-foreground border-border",
    "bg-secondary text-secondary-foreground border-border",
  ];

  return (
    <div
      className="glass-card p-6 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${rank * 0.15}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <Badge variant="outline" className={rankColors[rank]}>
            #{rank + 1} — {rankLabels[rank]}
          </Badge>
          <h3 className="text-xl font-mono font-bold mt-3 text-foreground">
            {phone.brand} {phone.model}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-2xl font-mono font-bold text-primary">${phone.price_usd}</span>
            <span className="text-xs text-muted-foreground">{phone.os} · {phone.chipset}</span>
          </div>
        </div>
        {phone.match_score && (
          <div className="text-right">
            <div className="text-3xl font-mono font-bold text-primary">
              {Math.round(phone.match_score)}%
            </div>
            <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Match</div>
          </div>
        )}
      </div>

      {phone.justification && (
        <p className="text-sm text-muted-foreground mb-5 p-3 rounded-lg bg-secondary/50 border border-border">
          {phone.justification}
        </p>
      )}

      <div className="space-y-2.5">
        <ScoreBar label="Camera" score={phone.camera_score} icon={Camera} />
        <ScoreBar label="Speed" score={phone.performance_score} icon={Cpu} />
        <ScoreBar label="Battery" score={phone.battery_score} icon={Battery} />
        <ScoreBar label="Display" score={phone.display_score} icon={Monitor} />
        <ScoreBar label="Build" score={phone.build_quality_score} icon={Shield} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {[
          `${phone.ram_gb}GB RAM`,
          `${phone.storage_gb}GB`,
          `${phone.battery_mah}mAh`,
          `${phone.screen_size_inches}"`,
        ].map((spec) => (
          <span key={spec} className="text-[10px] font-mono px-2 py-1 rounded bg-muted text-muted-foreground">
            {spec}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PhoneCard;
