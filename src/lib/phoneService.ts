import { supabase } from "@/integrations/supabase/client";

export interface Phone {
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
}

export interface Review {
  id: string;
  phone_id: string;
  user_id: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
}

export interface Pricing {
  id: string;
  phone_id: string;
  retailer: string;
  price: number;
  url: string;
  last_updated: string;
}

// Fetch reviews for a phone
export const fetchPhoneReviews = async (phoneId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from("phone_reviews")
    .select("*")
    .eq("phone_id", phoneId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
  return data || [];
};

// Add a review
export const addReview = async (
  phoneId: string,
  userId: string,
  rating: number,
  title: string,
  content: string
): Promise<Review | null> => {
  const { data, error } = await supabase
    .from("phone_reviews")
    .insert([
      {
        phone_id: phoneId,
        user_id: userId,
        rating,
        title,
        content,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error adding review:", error);
    return null;
  }
  return data;
};

// Get average rating for a phone
export const getAverageRating = async (phoneId: string): Promise<number> => {
  const { data, error } = await supabase
    .from("phone_reviews")
    .select("rating")
    .eq("phone_id", phoneId);

  if (error || !data || data.length === 0) return 0;
  const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
  return Math.round(avg * 10) / 10;
};

// Fetch pricing info
export const fetchPricing = async (phoneId: string): Promise<Pricing[]> => {
  const { data, error } = await supabase
    .from("phone_pricing")
    .select("*")
    .eq("phone_id", phoneId)
    .order("price", { ascending: true });

  if (error) {
    console.error("Error fetching pricing:", error);
    return [];
  }
  return data || [];
};

// Save phone recommendation
export const saveRecommendation = async (
  userId: string,
  quizAnswers: Record<string, any>,
  recommendations: any[]
): Promise<boolean> => {
  const { error } = await supabase.from("user_recommendations").insert([
    {
      user_id: userId,
      quiz_answers: quizAnswers,
      recommendations,
    },
  ]);

  if (error) {
    console.error("Error saving recommendation:", error);
    return false;
  }
  return true;
};

// Fetch user's saved recommendations
export const fetchSavedRecommendations = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_recommendations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching saved recommendations:", error);
    return [];
  }
  return data || [];
};

// Save phone to bookmarks
export const savePhone = async (userId: string, phoneId: string): Promise<boolean> => {
  const { error } = await supabase.from("user_saved_phones").insert([
    {
      user_id: userId,
      phone_id: phoneId,
    },
  ]);

  if (error) {
    console.error("Error saving phone:", error);
    return false;
  }
  return true;
};

// Check if phone is saved
export const isPhoneSaved = async (userId: string, phoneId: string): Promise<boolean> => {
  const { data } = await supabase
    .from("user_saved_phones")
    .select("id")
    .eq("user_id", userId)
    .eq("phone_id", phoneId)
    .single();

  return !!data;
};

// Remove saved phone
export const removePhone = async (userId: string, phoneId: string): Promise<boolean> => {
  const { error } = await supabase
    .from("user_saved_phones")
    .delete()
    .eq("user_id", userId)
    .eq("phone_id", phoneId);

  if (error) {
    console.error("Error removing phone:", error);
    return false;
  }
  return true;
};

// Fetch user's saved phones
export const fetchSavedPhones = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from("user_saved_phones")
    .select("phone_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching saved phones:", error);
    return [];
  }
  return (data || []).map((d) => d.phone_id);
};

// Update user preferences
export const updateUserPreferences = async (
  userId: string,
  theme: string,
  language: string
): Promise<boolean> => {
  const { error } = await supabase.from("user_preferences").upsert([
    {
      user_id: userId,
      theme,
      language,
    },
  ]);

  if (error) {
    console.error("Error updating preferences:", error);
    return false;
  }
  return true;
};

// Get user preferences
export const getUserPreferences = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return { theme: "dark", language: "en" };
  return data || { theme: "dark", language: "en" };
};
