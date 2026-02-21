import { Smartphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onStart: () => void;
}

const HeroSection = ({ onStart }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-bg overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/50 mb-8 opacity-0 animate-fade-in-up">
          <Smartphone className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono text-muted-foreground">
            Knowledge-Based Decision Support
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <span className="text-foreground">Smart</span>
          <span className="glow-text">Pick</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 opacity-0 animate-fade-in-up font-light" style={{ animationDelay: '0.2s' }}>
          Stop guessing. Start choosing.
        </p>
        <p className="text-sm md:text-base text-muted-foreground/70 max-w-xl mx-auto mb-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          Answer a few simple questions about how you actually use your phone, and our algorithm finds the perfect match for your budget.
        </p>

        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Button
            onClick={onStart}
            size="lg"
            className="group bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-base px-8 py-6 rounded-xl animate-pulse-glow"
          >
            Find My Phone
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-md mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          {[
            { value: "20+", label: "Phones" },
            { value: "5", label: "Criteria" },
            { value: "Top 3", label: "Results" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-mono font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
