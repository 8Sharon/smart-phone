import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPhoneReviews,
  addReview,
  getAverageRating,
  type Review,
} from "@/lib/phoneService";

export const usePhoneReviews = (phoneId: string) => {
  return useQuery({
    queryKey: ["phone-reviews", phoneId],
    queryFn: () => fetchPhoneReviews(phoneId),
  });
};

export const useAverageRating = (phoneId: string) => {
  return useQuery({
    queryKey: ["average-rating", phoneId],
    queryFn: () => getAverageRating(phoneId),
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      phoneId,
      userId,
      rating,
      title,
      content,
    }: {
      phoneId: string;
      userId: string;
      rating: number;
      title: string;
      content: string;
    }) => addReview(phoneId, userId, rating, title, content),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["phone-reviews", variables.phoneId],
      });
      queryClient.invalidateQueries({
        queryKey: ["average-rating", variables.phoneId],
      });
    },
  });
};
