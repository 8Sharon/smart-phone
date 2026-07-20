import { useState, useEffect, useCallback } from "react";
import { Smartphone, ArrowRight, Loader2, Search, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FilterBar, { type Filters } from "@/components/FilterBar";
import ProductCard from "@/components/ProductCard";
import AdvancedFilterBar, { type AdvancedFilters } from "@/components/AdvancedFilterBar";
import PhoneSearch from "@/components/PhoneSearch";
import PhoneComparison from "@/components/PhoneComparison";
import UserProfile from "@/components/UserProfile";
import ThemeToggle from "@/components/ThemeToggle";
import { saveRecommendation } from "@/lib/phoneService";
import phonesData from "@/data/phones.json";
import { useNavigate } from "react-router-dom";

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

  filtered = filtered.filter(p => p.price_usd >= minPrice && p.price_usd <= maxPrice);

  const scored = filtered.map(phone => ({
    ...phone,
    score:
      (phone.camera_score * weights.camera +
        phone.performance_score * weights.performance +
        phone.battery_score * weights.battery +
        phone.display_score * weights.display +
        phone.build_quality_score * weights.build) /
      totalWeight,
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((phone, rank) => ({
      ...phone,
      justification: generateJustification(phone, answers.usage, answers.secondary, rank),
    }));
}

function Index() {
  const navigate = useNavigate();
  const [quizStarted, setQuizStarted] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    brands: [],
    priceMin: 0,
    priceMax: 2000,
    os: [],
    features: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedForComparison, setSelectedForComparison] = useState<any[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user);
    };
    fetchUser();
  }, []);

  const handleQuizComplete = useCallback(async (answers: Filters) => {
    setLoading(true);
    try {
      const recs = calculateOfflineRecommendations(answers);
      setRecommendations(recs);

      // Save recommendation if user is logged in
      if (user) {
        await saveRecommendation(user.id, answers, recs);
      }

      toast.success("Here are your personalized recommendations!");
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast.error("Failed to generate recommendations");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const filteredRecommendations = recommendations.filter((phone) => {
    // Advanced filters
    if (advancedFilters.brands.length > 0 && !advancedFilters.brands.includes(phone.brand)) {
      return false;
    }
    if (phone.price_usd < advancedFilters.priceMin || phone.price_usd > advancedFilters.priceMax) {
      return false;
    }
    if (advancedFilters.os.length > 0 && !advancedFilters.os.includes(phone.os)) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        phone.brand.toLowerCase().includes(query) ||
        phone.model.toLowerCase().includes(query) ||
        phone.chipset.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    return true;
  });

  const handleAddToComparison = (phone: any) => {
    if (selectedForComparison.length < 3 && !selectedForComparison.find((p) => p.id === phone.id)) {
      setSelectedForComparison([...selectedForComparison, phone]);
      toast.success(`${phone.model} added to comparison`);
    } else if (selectedForComparison.find((p) => p.id === phone.id)) {
      setSelectedForComparison(selectedForComparison.filter((p) => p.id !== phone.id));
      toast.success(`${phone.model} removed from comparison`);
    } else {
      toast.error("Max 3 phones for comparison");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("Signed out successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold glow-text">SMART PICK</h1>
                <p className="text-xs text-muted-foreground">Knowledge-Based Phone Finder</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/compare")}
              >
                Compare
              </Button>
              {user ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowProfile(true)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => navigate("/auth")}>Sign In</Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!quizStarted ? (
          /* Hero Section */
          <div className="text-center py-12 md:py-20">
            <div className="mb-8">
              <h2 className="text-5xl md:text-6xl font-bold mb-4">
                Find Your Perfect Phone
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Answer a few simple questions and get personalized smartphone
                recommendations tailored to your needs, budget, and lifestyle.
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => setQuizStarted(true)}
              className="gap-2"
            >
              Start Quiz <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Analyzing your preferences...</p>
          </div>
        ) : recommendations.length > 0 ? (
          /* Results Section */
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Your Personalized Recommendations</h2>
              <p className="text-muted-foreground mb-6">
                Based on your preferences, here are the best phones for you
              </p>

              {/* Search */}
              <PhoneSearch onSearch={setSearchQuery} />

              {/* Advanced Filters */}
              <AdvancedFilterBar
                onFilterChange={setAdvancedFilters}
                onClear={() => setAdvancedFilters({
                  brands: [],
                  priceMin: 0,
                  priceMax: 2000,
                  os: [],
                  features: [],
                })}
              />
            </div>

            {/* Comparison Selection */}
            {selectedForComparison.length > 0 && (
              <div className="mb-6 p-4 bg-secondary/20 rounded-lg border border-border">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">
                    Selected for Comparison: {selectedForComparison.length}/3
                  </span>
                  <Button
                    size="sm"
                    onClick={() => setShowComparison(true)}
                  >
                    View Comparison
                  </Button>
                </div>
              </div>
            )}

            {/* Results Grid */}
            {filteredRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecommendations.map((phone, index) => (
                  <ProductCard
                    key={phone.id}
                    phone={phone}
                    rank={index + 1}
                    onViewDetails={() => navigate(`/phone/${phone.id}`)}
                    onAddToComparison={() => handleAddToComparison(phone)}
                    isSelected={selectedForComparison.some((p) => p.id === phone.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">No phones match your filters</p>
              </div>
            )}

            {/* New Quiz Button */}
            <div className="mt-12 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setQuizStarted(false);
                  setRecommendations([]);
                  setSelectedForComparison([]);
                }}
              >
                Start New Quiz
              </Button>
            </div>
          </div>
        ) : null}
      </main>

      {/* Modals */}
      {quizStarted && recommendations.length === 0 && !loading && (
        <FilterBar onQuizComplete={handleQuizComplete} />
      )}

      {showComparison && selectedForComparison.length > 0 && (
        <PhoneComparison
          phones={selectedForComparison}
          onClose={() => setShowComparison(false)}
        />
      )}

      {showProfile && user && (
        <UserProfile userId={user.id} onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}

export default Index;
