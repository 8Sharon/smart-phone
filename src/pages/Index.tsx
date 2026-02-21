import { useState, useEffect, useCallback } from "react";
import { Smartphone, ArrowRight, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FilterBar, { type Filters } from "@/components/FilterBar";
import ProductCard from "@/components/ProductCard";

const defaultFilters: Filters = {
  usage: "social",
  battery: "important",
  budget: "mid",
  secondary: "value",
  platform: "any",
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
      const { data, error } = await supabase.functions.invoke("recommend", {
        body: { answers: f },
      });
      if (error) throw error;
      setResults(data.recommendations || []);
      setHasSearched(true);
    } catch {
      toast.error("Failed to get recommendations.");
    } finally {
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
