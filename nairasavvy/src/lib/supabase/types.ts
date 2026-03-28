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
      };
      subscribers: {
        Row: {
          id: string;
          email: string;
          source: string | null;
          subscribed_at: string;
          confirmed: boolean;
          active: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          source?: string | null;
          subscribed_at?: string;
          confirmed?: boolean;
          active?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          source?: string | null;
          subscribed_at?: string;
          confirmed?: boolean;
          active?: boolean;
        };
      };
      apy_rates: {
        Row: {
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
      };
      inflation_data: {
        Row: {
          id: string;
          rate_percent: number;
          period: string;
          source: string;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          rate_percent: number;
          period: string;
          source?: string;
          recorded_at?: string;
        };
        Update: {
          id?: string;
          rate_percent?: number;
          period?: string;
          source?: string;
          recorded_at?: string;
        };
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
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience types
export type Article = Database["public"]["Tables"]["articles"]["Row"];
export type Subscriber = Database["public"]["Tables"]["subscribers"]["Row"];
export type ApyRate = Database["public"]["Tables"]["apy_rates"]["Row"];
export type InflationData = Database["public"]["Tables"]["inflation_data"]["Row"];
export type ContentQueue = Database["public"]["Tables"]["content_queue"]["Row"];
