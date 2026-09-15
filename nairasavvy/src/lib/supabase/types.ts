export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          category: string | null;
          published_at: string | null;
          updated_at: string | null;
          read_time: number | null;
          featured: boolean;
          keywords: string[] | null;
          view_count: number;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          category?: string | null;
          published_at?: string | null;
          updated_at?: string | null;
          read_time?: number | null;
          featured?: boolean;
          keywords?: string[] | null;
          view_count?: number;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          category?: string | null;
          published_at?: string | null;
          updated_at?: string | null;
          read_time?: number | null;
          featured?: boolean;
          keywords?: string[] | null;
          view_count?: number;
        };
        Relationships: [];
      };
      subscribers: {
        Row: {
          confirmation_hash: string | null;
          confirmation_expires_at: string | null;
          unsubscribe_hash: string | null;
          last_confirmation_at: string | null;
          id: string;
          email: string;
          source: string | null;
          subscribed_at: string;
          confirmed: boolean;
          active: boolean;
        };
        Insert: {
          confirmation_hash?: string | null;
          confirmation_expires_at?: string | null;
          unsubscribe_hash?: string | null;
          last_confirmation_at?: string | null;
          id?: string;
          email: string;
          source?: string | null;
          subscribed_at?: string;
          confirmed?: boolean;
          active?: boolean;
        };
        Update: {
          confirmation_hash?: string | null;
          confirmation_expires_at?: string | null;
          unsubscribe_hash?: string | null;
          last_confirmation_at?: string | null;
          id?: string;
          email?: string;
          source?: string | null;
          subscribed_at?: string;
          confirmed?: boolean;
          active?: boolean;
        };
        Relationships: [];
      };
      apy_rates: {
        Row: {
          currency: string | null;
          rate_type: string | null;
          access_terms: string | null;
          fees: string | null;
          risk_notes: string | null;
          id: string;
          institution: string;
          product_name: string;
          product_type: string | null;
          apy_percent: number;
          min_balance: number;
          verified_at: string;
          source_url: string | null;
          is_active: boolean;
        };
        Insert: {
          currency?: string | null;
          rate_type?: string | null;
          access_terms?: string | null;
          fees?: string | null;
          risk_notes?: string | null;
          id?: string;
          institution: string;
          product_name: string;
          product_type?: string | null;
          apy_percent: number;
          min_balance?: number;
          verified_at?: string;
          source_url?: string | null;
          is_active?: boolean;
        };
        Update: {
          currency?: string | null;
          rate_type?: string | null;
          access_terms?: string | null;
          fees?: string | null;
          risk_notes?: string | null;
          id?: string;
          institution?: string;
          product_name?: string;
          product_type?: string | null;
          apy_percent?: number;
          min_balance?: number;
          verified_at?: string;
          source_url?: string | null;
          is_active?: boolean;
        };
        Relationships: [];
      };
      inflation_data: {
        Row: {
          source_url: string | null;
          id: string;
          rate_percent: number;
          period: string;
          source: string;
          recorded_at: string;
        };
        Insert: {
          source_url?: string | null;
          id?: string;
          rate_percent: number;
          period: string;
          source?: string;
          recorded_at?: string;
        };
        Update: {
          source_url?: string | null;
          id?: string;
          rate_percent?: number;
          period?: string;
          source?: string;
          recorded_at?: string;
        };
        Relationships: [];
      };
      content_queue: {
        Row: {
          id: string;
          headline: string;
          brief: Json | null;
          full_article: string | null;
          status: string;
          quality_score: number | null;
          category: string | null;
          created_at: string;
          reviewed_at: string | null;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          headline: string;
          brief?: Json | null;
          full_article?: string | null;
          status?: string;
          quality_score?: number | null;
          category?: string | null;
          created_at?: string;
          reviewed_at?: string | null;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          headline?: string;
          brief?: Json | null;
          full_article?: string | null;
          status?: string;
          quality_score?: number | null;
          category?: string | null;
          created_at?: string;
          reviewed_at?: string | null;
          published_at?: string | null;
        };
        Relationships: [];
      };
      cbn_circulars: {
        Row: {
          id: string;
          reference_number: string | null;
          title: string;
          date_issued: string;
          category: string | null;
          summary: string | null;
          source_url: string | null;
          article_potential: boolean;
          affects_consumers: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          reference_number?: string | null;
          title: string;
          date_issued: string;
          category?: string | null;
          summary?: string | null;
          source_url?: string | null;
          article_potential?: boolean;
          affects_consumers?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          reference_number?: string | null;
          title?: string;
          date_issued?: string;
          category?: string | null;
          summary?: string | null;
          source_url?: string | null;
          article_potential?: boolean;
          affects_consumers?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      data_plans: {
        Row: {
          verified_at: string | null;
          bonus_restrictions: string | null;
          eligibility: string | null;
          id: string;
          network: string;
          plan_name: string;
          data_gb: number;
          price_naira: number;
          validity_days: number | null;
          night_bonus_gb: number;
          activation_code: string | null;
          value_score: number | null;
          is_hidden_deal: boolean;
          is_active: boolean;
          source_url: string | null;
          created_at: string;
        };
        Insert: {
          verified_at?: string | null;
          bonus_restrictions?: string | null;
          eligibility?: string | null;
          id?: string;
          network: string;
          plan_name: string;
          data_gb: number;
          price_naira: number;
          validity_days?: number | null;
          night_bonus_gb?: number;
          activation_code?: string | null;
          value_score?: number | null;
          is_hidden_deal?: boolean;
          is_active?: boolean;
          source_url?: string | null;
          created_at?: string;
        };
        Update: {
          verified_at?: string | null;
          bonus_restrictions?: string | null;
          eligibility?: string | null;
          id?: string;
          network?: string;
          plan_name?: string;
          data_gb?: number;
          price_naira?: number;
          validity_days?: number | null;
          night_bonus_gb?: number;
          activation_code?: string | null;
          value_score?: number | null;
          is_hidden_deal?: boolean;
          is_active?: boolean;
          source_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      newsletter_allow_request: {
        Args: {
          bucket_key: string;
          window_seconds: number;
          max_requests: number;
        };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
}

// Convenience types
export type Article = Database["public"]["Tables"]["articles"]["Row"];
export type Subscriber = Database["public"]["Tables"]["subscribers"]["Row"];
export type ApyRate = Database["public"]["Tables"]["apy_rates"]["Row"];
export type InflationData =
  Database["public"]["Tables"]["inflation_data"]["Row"];
export type ContentQueue = Database["public"]["Tables"]["content_queue"]["Row"];
export type CbnCircular = Database["public"]["Tables"]["cbn_circulars"]["Row"];
export type DataPlan = Database["public"]["Tables"]["data_plans"]["Row"];
