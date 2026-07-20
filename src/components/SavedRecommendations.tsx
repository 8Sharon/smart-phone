import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchSavedRecommendations } from "@/lib/phoneService";
import { toast } from "sonner";

interface SavedRecommendationsProps {
  userId: string;
}

const SavedRecommendations = ({ userId }: SavedRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [userId]);

  const loadRecommendations = async () => {
    setLoading(true);
    const saved = await fetchSavedRecommendations(userId);
    setRecommendations(saved);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("user_recommendations")
      .delete()
      .eq("id", id);

    if (!error) {
      setRecommendations(
        recommendations.filter((r) => r.id !== id)
      );
      toast.success("Recommendation deleted");
    }
  };

  if (loading) return <div>Loading saved recommendations...</div>;

  if (recommendations.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground mb-4">No saved recommendations yet</p>
        <p className="text-sm">Complete the quiz to get personalized recommendations</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <Card key={rec.id} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {rec.quiz_answers.usage && `Quiz: ${rec.quiz_answers.usage}`}
              </h3>
              <p className="text-sm text-muted-foreground">
                Saved {new Date(rec.created_at).toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(rec.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Recommendations:</h4>
            {rec.recommendations.slice(0, 3).map((phone: any, idx: number) => (
              <div key={idx} className="text-sm bg-secondary/20 p-2 rounded">
                #{idx + 1}: {phone.brand} {phone.model} - ${phone.price_usd}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SavedRecommendations;
