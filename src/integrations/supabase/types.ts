export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      career_scores: {
        Row: {
          breakdown: Json
          coding: number
          communication: number
          created_at: string
          id: string
          interview: number
          job_fit: number
          overall: number
          project: number
          resume: number
          technical: number
          user_id: string
        }
        Insert: {
          breakdown?: Json
          coding?: number
          communication?: number
          created_at?: string
          id?: string
          interview?: number
          job_fit?: number
          overall?: number
          project?: number
          resume?: number
          technical?: number
          user_id?: string
        }
        Update: {
          breakdown?: Json
          coding?: number
          communication?: number
          created_at?: string
          id?: string
          interview?: number
          job_fit?: number
          overall?: number
          project?: number
          resume?: number
          technical?: number
          user_id?: string
        }
        Relationships: []
      }
      coding_submissions: {
        Row: {
          code: string | null
          created_at: string
          id: string
          language: string
          passed: number
          problem_slug: string
          problem_title: string | null
          result: Json
          score: number
          total: number
          user_id: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          language: string
          passed?: number
          problem_slug: string
          problem_title?: string | null
          result?: Json
          score?: number
          total?: number
          user_id?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          language?: string
          passed?: number
          problem_slug?: string
          problem_title?: string | null
          result?: Json
          score?: number
          total?: number
          user_id?: string
        }
        Relationships: []
      }
      github_analyses: {
        Row: {
          analysis: Json
          created_at: string
          id: string
          repo_name: string | null
          repo_url: string | null
          score: number
          user_id: string
        }
        Insert: {
          analysis?: Json
          created_at?: string
          id?: string
          repo_name?: string | null
          repo_url?: string | null
          score?: number
          user_id?: string
        }
        Update: {
          analysis?: Json
          created_at?: string
          id?: string
          repo_name?: string | null
          repo_url?: string | null
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      interview_answers: {
        Row: {
          answer: string | null
          category: string | null
          created_at: string
          difficulty: string | null
          evaluation: Json
          id: string
          interview_id: string
          question: string
          score: number | null
          user_id: string
        }
        Insert: {
          answer?: string | null
          category?: string | null
          created_at?: string
          difficulty?: string | null
          evaluation?: Json
          id?: string
          interview_id: string
          question: string
          score?: number | null
          user_id?: string
        }
        Update: {
          answer?: string | null
          category?: string | null
          created_at?: string
          difficulty?: string | null
          evaluation?: Json
          id?: string
          interview_id?: string
          question?: string
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      interviews: {
        Row: {
          context: Json
          created_at: string
          id: string
          mode: string
          overall_score: number | null
          scores: Json
          status: string
          summary: Json
          topic: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          id?: string
          mode?: string
          overall_score?: number | null
          scores?: Json
          status?: string
          summary?: Json
          topic?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          context?: Json
          created_at?: string
          id?: string
          mode?: string
          overall_score?: number | null
          scores?: Json
          status?: string
          summary?: Json
          topic?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      job_analyses: {
        Row: {
          analysis: Json
          company: string | null
          created_at: string
          description: string | null
          id: string
          match_score: number
          title: string | null
          user_id: string
        }
        Insert: {
          analysis?: Json
          company?: string | null
          created_at?: string
          description?: string | null
          id?: string
          match_score?: number
          title?: string | null
          user_id?: string
        }
        Update: {
          analysis?: Json
          company?: string | null
          created_at?: string
          description?: string | null
          id?: string
          match_score?: number
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title: string
          user_id?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          education: Json
          email: string | null
          experience_level: string | null
          github_username: string | null
          id: string
          linkedin_url: string | null
          location: string | null
          name: string | null
          phone: string | null
          portfolio_url: string | null
          skills: string[]
          streak: number
          target_role: string | null
          updated_at: string
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          education?: Json
          email?: string | null
          experience_level?: string | null
          github_username?: string | null
          id: string
          linkedin_url?: string | null
          location?: string | null
          name?: string | null
          phone?: string | null
          portfolio_url?: string | null
          skills?: string[]
          streak?: number
          target_role?: string | null
          updated_at?: string
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          education?: Json
          email?: string | null
          experience_level?: string | null
          github_username?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          name?: string | null
          phone?: string | null
          portfolio_url?: string | null
          skills?: string[]
          streak?: number
          target_role?: string | null
          updated_at?: string
          xp?: number
        }
        Relationships: []
      }
      reports: {
        Row: {
          content: Json
          created_at: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          title: string
          user_id?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      resume_analyses: {
        Row: {
          analysis: Json
          ats_score: number
          created_at: string
          id: string
          resume_id: string | null
          user_id: string
        }
        Insert: {
          analysis?: Json
          ats_score?: number
          created_at?: string
          id?: string
          resume_id?: string | null
          user_id?: string
        }
        Update: {
          analysis?: Json
          ats_score?: number
          created_at?: string
          id?: string
          resume_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      resumes: {
        Row: {
          created_at: string
          file_name: string | null
          id: string
          parsed: Json
          raw_text: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name?: string | null
          id?: string
          parsed?: Json
          raw_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          file_name?: string | null
          id?: string
          parsed?: Json
          raw_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      roadmaps: {
        Row: {
          created_at: string
          id: string
          plan: Json
          target_role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          plan?: Json
          target_role: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          plan?: Json
          target_role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          created_at: string
          id: string
          job: Json
          match: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          job?: Json
          match?: Json
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          job?: Json
          match?: Json
          user_id?: string
        }
        Relationships: []
      }
      skill_results: {
        Row: {
          claimed_level: string | null
          created_at: string
          details: Json
          id: string
          score: number
          skill: string
          user_id: string
          verified_level: string | null
        }
        Insert: {
          claimed_level?: string | null
          created_at?: string
          details?: Json
          id?: string
          score?: number
          skill: string
          user_id?: string
          verified_level?: string | null
        }
        Update: {
          claimed_level?: string | null
          created_at?: string
          details?: Json
          id?: string
          score?: number
          skill?: string
          user_id?: string
          verified_level?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          done: boolean
          due_date: string | null
          id: string
          source: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          done?: boolean
          due_date?: string | null
          id?: string
          source?: string | null
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          done?: boolean
          due_date?: string | null
          id?: string
          source?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      weakness_topics: {
        Row: {
          area: string | null
          created_at: string
          hits: number
          id: string
          misses: number
          topic: string
          updated_at: string
          user_id: string
          weight: number
        }
        Insert: {
          area?: string | null
          created_at?: string
          hits?: number
          id?: string
          misses?: number
          topic: string
          updated_at?: string
          user_id?: string
          weight?: number
        }
        Update: {
          area?: string | null
          created_at?: string
          hits?: number
          id?: string
          misses?: number
          topic?: string
          updated_at?: string
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
