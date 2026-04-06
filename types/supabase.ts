/**
 * Supabase Database Types
 *
 * These types mirror your schema.sql tables.
 * For production, generate these automatically with:
 *   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          bio: string | null
          location: string | null
          website: string | null
          role: 'admin' | 'member' | 'viewer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          role?: 'admin' | 'member' | 'viewer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string | null
          full_name?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          role?: 'admin' | 'member' | 'viewer'
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          owner_id: string
          email: string
          role: 'admin' | 'member' | 'viewer'
          status: 'active' | 'pending' | 'removed'
          invited_at: string
          accepted_at: string | null
        }
        Insert: {
          id?: string
          owner_id: string
          email: string
          role?: 'admin' | 'member' | 'viewer'
          status?: 'active' | 'pending' | 'removed'
          invited_at?: string
          accepted_at?: string | null
        }
        Update: {
          role?: 'admin' | 'member' | 'viewer'
          status?: 'active' | 'pending' | 'removed'
          accepted_at?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          status: 'active' | 'archived' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          status?: 'active' | 'archived' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          status?: 'active' | 'archived' | 'completed'
          updated_at?: string
        }
      }
      activity_log: {
        Row: {
          id: string
          user_id: string
          event: string
          metadata: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event: string
          metadata?: Record<string, unknown> | null
          created_at?: string
        }
        Update: never
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: 'admin' | 'member' | 'viewer'
      member_status: 'active' | 'pending' | 'removed'
      project_status: 'active' | 'archived' | 'completed'
    }
  }
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row']
export type TeamMember = Database['public']['Tables']['team_members']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type ActivityLog = Database['public']['Tables']['activity_log']['Row']
export type UserRole = Database['public']['Enums']['user_role']
export type ProjectStatus = Database['public']['Enums']['project_status']
