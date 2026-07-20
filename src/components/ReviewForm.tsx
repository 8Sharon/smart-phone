import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAddReview } from "@/hooks/usePhoneReviews";
import { Star } from "lucide-react";

interface ReviewFormProps {
  phoneId: string;
  userId: string;
  onSuccess?: () => void;
}

const ReviewForm = ({ phoneId, userId, onSuccess }: ReviewFormProps) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addReviewMutation = useAddReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addReviewMutation.mutateAsync({
        phoneId,
        userId,
        rating,
        title,
        content,
      });

      setTitle("");
      setContent("");
      setRating(5);
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your take?"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Review</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience with this phone..."
            rows={4}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post Review"}
        </Button>
      </form>
    </Card>
  );
};

export default ReviewForm;
