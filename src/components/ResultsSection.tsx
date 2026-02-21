import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import PhoneCard from "./PhoneCard";

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

interface ResultsSectionProps {
  phones: Phone[];
  onRestart: () => void;
}

const ResultsSection = ({ phones, onRestart }: ResultsSectionProps) => {
  return (
    <section className="min-h-screen gradient-bg py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={onRestart}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Start Over
        </Button>

        <div className="mb-10 opacity-0 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-mono font-bold text-foreground mb-2">
            Your Top <span className="glow-text">3</span> Picks
          </h2>
          <p className="text-muted-foreground text-sm">
            Ranked by how well they match your usage, priorities, and budget.
          </p>
        </div>

        <div className="space-y-4">
          {phones.map((phone, i) => (
            <PhoneCard key={phone.id} phone={phone} rank={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
