// =====================================================================
// Hand-written stub types for the Supabase database schema.
// REPLACE THIS FILE by running:
//   npx supabase gen types typescript --project-id sgqhguvkjfqvlsmbdswi > types/database.ts
// Until then, these types let the rest of the codebase typecheck.
// =====================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string | null
          description: string | null
          current_stage: string
          status: string
          preferred_stack: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          slug?: string | null
          description?: string | null
          current_stage?: string
          status?: string
          preferred_stack?: Json
        }
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      artifacts: {
        Row: {
          id: string
          project_id: string
          type: string
          title: string
          content_markdown: string | null
          content_json: Json
          status: string
          version: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          type: string
          title: string
          content_markdown?: string | null
          content_json?: Json
          status?: string
          version?: number
        }
        Update: Partial<Database['public']['Tables']['artifacts']['Insert']>
      }
      decisions: {
        Row: {
          id: string
          project_id: string
          title: string
          decision: string
          rationale: string | null
          alternatives: Json
          category: string
          status: string
          source_artifact_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          decision: string
          rationale?: string | null
          alternatives?: Json
          category?: string
          status?: string
          source_artifact_id?: string | null
        }
        Update: Partial<Database['public']['Tables']['decisions']['Insert']>
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          phase: string | null
          priority: string
          complexity: string
          status: string
          recommended_tool: string | null
          acceptance_criteria: Json
          dependencies: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          phase?: string | null
          priority?: string
          complexity?: string
          status?: string
          recommended_tool?: string | null
          acceptance_criteria?: Json
          dependencies?: Json
        }
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>
      }
      missions: {
        Row: {
          id: string
          project_id: string
          task_id: string | null
          tool_name: string | null
          mission_brief: string | null
          return_prompt: string | null
          status: string
          sent_at: string | null
          returned_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          task_id?: string | null
          tool_name?: string | null
          mission_brief?: string | null
          return_prompt?: string | null
          status?: string
          sent_at?: string | null
          returned_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['missions']['Insert']>
      }
      tool_sessions: {
        Row: {
          id: string
          project_id: string
          mission_id: string | null
          tool_name: string | null
          raw_summary: string | null
          parsed_summary: Json
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          mission_id?: string | null
          tool_name?: string | null
          raw_summary?: string | null
          parsed_summary?: Json
          status?: string
        }
        Update: Partial<Database['public']['Tables']['tool_sessions']['Insert']>
      }
      risks: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          severity: string
          category: string
          source: string | null
          status: string
          recommended_action: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          severity?: string
          category?: string
          source?: string | null
          status?: string
          recommended_action?: string | null
        }
        Update: Partial<Database['public']['Tables']['risks']['Insert']>
      }
      open_questions: {
        Row: {
          id: string
          project_id: string
          question: string
          category: string
          status: string
          answer: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          question: string
          category?: string
          status?: string
          answer?: string | null
        }
        Update: Partial<Database['public']['Tables']['open_questions']['Insert']>
      }
      ai_logs: {
        Row: {
          id: string
          project_id: string | null
          task_type: string
          provider: string
          model: string | null
          input: Json
          output: Json
          raw_output: string | null
          status: string
          error: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          task_type: string
          provider?: string
          model?: string | null
          input?: Json
          output?: Json
          raw_output?: string | null
          status?: string
          error?: string | null
        }
        Update: Partial<Database['public']['Tables']['ai_logs']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
