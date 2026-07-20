export type Database = {
  public: {
    Tables: {
      user_recommendations: {
        Row: {
          id: string;
          user_id: string;
          quiz_answers: Record<string, any>;
          recommendations: Record<string, any>[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_answers: Record<string, any>;
          recommendations: Record<string, any>[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          quiz_answers?: Record<string, any>;
          recommendations?: Record<string, any>[];
          updated_at?: string;
        };
      };
      phone_reviews: {
        Row: {
          id: string;
          phone_id: string;
          user_id: string;
          rating: number;
          title: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone_id: string;
          user_id: string;
          rating: number;
          title: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          rating?: number;
          title?: string;
          content?: string;
          updated_at?: string;
        };
      };
      phone_pricing: {
        Row: {
          id: string;
          phone_id: string;
          retailer: string;
          price: number;
          url: string;
          last_updated: string;
        };
        Insert: {
          id?: string;
          phone_id: string;
          retailer: string;
          price: number;
          url: string;
          last_updated?: string;
        };
        Update: {
          price?: number;
          url?: string;
          last_updated?: string;
        };
      };
      user_saved_phones: {
        Row: {
          id: string;
          user_id: string;
          phone_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          phone_id: string;
          created_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          theme: string;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: string;
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          theme?: string;
          language?: string;
          updated_at?: string;
        };
      };
    };
  };
};
