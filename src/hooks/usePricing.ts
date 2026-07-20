import { useQuery } from "@tanstack/react-query";
import { fetchPricing } from "@/lib/phoneService";

export const usePricing = (phoneId: string) => {
  return useQuery({
    queryKey: ["phone-pricing", phoneId],
    queryFn: () => fetchPricing(phoneId),
  });
};
