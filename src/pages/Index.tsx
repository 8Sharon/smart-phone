import { useState, useEffect, useCallback } from "react";
import { Smartphone, ArrowRight, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FilterBar, { type Filters } from "@/components/FilterBar";
import ProductCard from "@/components/ProductCard";
import phonesData from "@/data/phones.json";

function getBudgetRange(budget: string): [number, number] {
  switch (budget) {
    case 'budget': return [0, 300];
    case 'mid': return [300, 600];
    case 'premium': return [600, 1000];
    case 'ultra': return [1000, 9999];
    default: return [0, 9999];
  }
}

function getWeights(usage: string, battery: string, secondary: string) {
  const w = { camera: 1, performance: 1, battery: 1, display: 1, build: 1 };
  switch (usage) {
    case 'photography': w.camera = 3; break;
    case 'gaming': w.performance = 3; break;
    case 'social': w.camera = 2; w.display = 1.5; break;
    case 'work': w.performance = 2; w.build = 1.5; break;
  }
  switch (battery) {
    case 'critical': w.battery = 3; break;
    case 'important': w.battery = 2; break;
    case 'moderate': w.battery = 1.2; break;
    case 'low': w.battery = 0.5; break;
  }
  switch (secondary) {
    case 'display': w.display += 1.5; break;
    case 'build': w.build += 1.5; break;
    case 'camera': w.camera += 1.5; break;
    case 'value': break; 
  }
  return w;
}

function generateJustification(phone: any, usage: string, secondary: string, rank: number): string {
  const strengths: string[] = [];
  if (phone.camera_score >= 8.5) strengths.push("exceptional camera");
  if (phone.performance_score >= 9) strengths.push("top-tier performance");
  if (phone.battery_score >= 8.5) strengths.push("outstanding battery life");
  if (phone.display_score >= 9) strengths.push("stunning display");
  if (phone.build_quality_score >= 9) strengths.push("premium build quality");

  const top = strengths.slice(0, 2).join(" and ");
  if (rank === 0) return `Best overall match for your needs. Features ${top || "a great balance of features"} at its price point.`;
  if (rank === 1) return `Strong alternative with ${top || "solid all-around specs"}. Worth considering if availability or preference differs.`;
  return `Great value pick offering ${top || "reliable everyday performance"} at a competitive price.`;
}

function calculateOfflineRecommendations(answers: Filters) {
  const [minPrice, maxPrice] = getBudgetRange(answers.budget);
  const weights = getWeights(answers.usage, answers.battery, answers.secondary);
  const totalWeight = weights.camera + weights.performance + weights.battery + weights.display + weights.build;

  let filtered = phonesData as any[];
  if (answers.platform === 'ios') {
    filtered = filtered.filter(p => p.os === 'iOS');
  } else if (answers.platform === 'android') {
    filtered = filtered.filter(p => p.os === 'Android');
  }

  if (answers.brand !== 'any') {
    if (answers.brand === 'other') {
      filtered = filtered.filter(p => !['Apple', 'Samsung', 'Google', 'Huawei', 'Tecno', 'LG'].includes(p.brand));
    } else {
      filtered = filtered.filter(p => p.brand.toLowerCase() === answers.brand.toLowerCase());
    }
  }

  if (answers.formFactor !== 'any') {
    if (answers.formFactor === 'compact') {
      filtered = filtered.filter(p => p.screen_size_inches < 6.4);
    } else if (answers.formFactor === 'large') {
      filtered = filtered.filter(p => p.screen_size_inches >= 6.4 && !p.model.toLowerCase().includes('fold') && !p.model.toLowerCase().includes('flip'));
    } else if (answers.formFactor === 'foldable') {
      filtered = filtered.filter(p => p.model.toLowerCase().includes('fold') || p.model.toLowerCase().includes('flip'));
    }
  }

  filtered = filtered.filter(p => p.price_usd >= minPrice * 0.9 && p.price_usd <= maxPrice * 1.05);

  const scored = filtered.map(phone => {
    const rawScore = (
      phone.camera_score * weights.camera +
      phone.performance_score * weights.performance +
      phone.battery_score * weights.battery +
      phone.display_score * weights.display +
      phone.build_quality_score * weights.build
    ) / totalWeight;

    let valueBonus = 0;
    if (answers.secondary === 'value') {
      const avgScore = (phone.camera_score + phone.performance_score + phone.battery_score + phone.display_score + phone.build_quality_score) / 5;
      valueBonus = (avgScore / (phone.price_usd / 100)) * 2;
    }

    const match_score = Math.min(99, ((rawScore + valueBonus) / 10) * 100);
    return { ...phone, match_score };
  });

  scored.sort((a, b) => b.match_score - a.match_score);
  return scored.slice(0, 3).map((phone, i) => ({
    ...phone,
    justification: generateJustification(phone, answers.usage, answers.secondary, i),
  }));
}

const defaultFilters: Filters = {
  usage: "social",
  battery: "important",
  budget: "mid",
  secondary: "value",
  platform: "any",
  brand: "any",
  formFactor: "any",
};

const Index = () => {
  const [started, setStarted] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchRecommendations = useCallback(async (f: Filters) => {
    setLoading(true);
    try {
      // First try hitting the API
      const { data, error } = await supabase.functions.invoke("recommend", {
        body: { answers: f },
      });
      if (error) throw error;
      setResults(data.recommendations || []);
    } catch (e) {
      console.log("API failed, falling back to offline data", e);
      // If offline or API fails, fall back to offline local data
      const offlineRecs = calculateOfflineRecommendations(f);
      setResults(offlineRecs);
      toast.success("Using offline recommendations.");
    } finally {
      setHasSearched(true);
      setLoading(false);
    }
  }, []);

  // Auto-fetch when filters change after first search
  useEffect(() => {
    if (started) {
      const timeout = setTimeout(() => fetchRecommendations(filters), 400);
      return () => clearTimeout(timeout);
    }
  }, [filters, started, fetchRecommendations]);

  if (!started) {
    return (
      <section className="relative min-h-screen flex items-center justify-center gradient-bg overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/50 mb-8 opacity-0 animate-fade-in-up">
            <Smartphone className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-muted-foreground">Knowledge-Based Decision Support</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-foreground">Smart</span>
            <span className="glow-text">Pick</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 opacity-0 animate-fade-in-up font-light" style={{ animationDelay: '0.2s' }}>
            Stop guessing. Start choosing.
          </p>
          <p className="text-sm md:text-base text-muted-foreground/70 max-w-xl mx-auto mb-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            Tell us how you use your phone and your budget. Our algorithm finds the perfect phones — ranked with images, prices, and scores.
          </p>
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={() => setStarted(true)}
              size="lg"
              className="group bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-base px-8 py-6 rounded-xl animate-pulse-glow"
            >
              Find My Phone
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-md mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            {[
              { value: "20+", label: "Phones" },
              { value: "5", label: "Criteria" },
              { value: "Top 3", label: "Picks" },
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
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => setStarted(false)} className="flex items-center gap-2 group">
            <Smartphone className="w-5 h-5 text-primary" />
            <span className="font-mono font-bold text-foreground text-lg">
              Smart<span className="text-primary">Pick</span>
            </span>
          </button>
          <span className="text-xs font-mono text-muted-foreground hidden sm:block">
            Optimized Smartphone Acquisition
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
          {/* Filters sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <FilterBar filters={filters} onChange={setFilters} />
          </aside>

          {/* Results grid */}
          <main>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-mono font-bold text-foreground text-xl">
                  {hasSearched ? "Your Top Picks" : "Set your preferences"}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {hasSearched
                    ? `${results.length} phones matched — ranked by your priorities`
                    : "Adjust the filters and we'll find your perfect phone"}
                </p>
              </div>
              {loading && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
            </div>

            {!hasSearched && !loading && (
              <div className="glass-card p-16 text-center">
                <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-sm font-mono">
                  Your recommendations will appear here
                </p>
              </div>
            )}

            {hasSearched && results.length === 0 && !loading && (
              <div className="glass-card p-16 text-center">
                <p className="text-muted-foreground text-sm font-mono">
                  No phones matched. Try adjusting your filters.
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.map((phone, i) => (
                  <ProductCard key={phone.id} phone={phone} rank={i} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
