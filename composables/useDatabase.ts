/**
 * useDatabase composable
 * Typed query helpers for all Supabase tables.
 * Usage: const { getProfile, updateProfile, getProjects } = useDatabase()
 */
import type { Database, Profile, TeamMember, Project } from '~/types/supabase'

export const useDatabase = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  // ─── PROFILES ───────────────────────────────────────────────

  const getProfile = async (): Promise<Profile | null> => {
    if (!user.value) return null
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()
    return data
  }

  const updateProfile = async (updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!user.value) return { error: new Error('Not authenticated') }
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.value.id,
        email: user.value.email ?? null,
        ...updates,
      })
    return { error }
  }

  // ─── TEAM MEMBERS ────────────────────────────────────────────

  const getTeamMembers = async (): Promise<TeamMember[]> => {
    if (!user.value) return []
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .eq('owner_id', user.value.id)
      .order('invited_at', { ascending: false })
    return data ?? []
  }

  const inviteTeamMember = async (email: string, role: TeamMember['role'] = 'member') => {
    if (!user.value) return { error: new Error('Not authenticated') }
    const { data, error } = await supabase
      .from('team_members')
      .insert({ owner_id: user.value.id, email, role })
      .select()
      .single()
    return { data, error }
  }

  const removeTeamMember = async (id: string) => {
    const { error } = await supabase
      .from('team_members')
      .update({ status: 'removed' })
      .eq('id', id)
    return { error }
  }

  // ─── PROJECTS ────────────────────────────────────────────────

  const getProjects = async (): Promise<Project[]> => {
    if (!user.value) return []
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })
    return data ?? []
  }

  const createProject = async (name: string, description?: string) => {
    if (!user.value) return { error: new Error('Not authenticated') }
    const { data, error } = await supabase
      .from('projects')
      .insert({ user_id: user.value.id, name, description })
      .select()
      .single()
    return { data, error }
  }

  const updateProject = async (id: string, updates: Partial<Pick<Project, 'name' | 'description' | 'status'>>) => {
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
    return { error }
  }

  const deleteProject = async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    return { error }
  }

  // ─── ACTIVITY LOG ────────────────────────────────────────────

  const logActivity = async (event: string, metadata?: Record<string, unknown>) => {
    if (!user.value) return
    await supabase
      .from('activity_log')
      .insert({ user_id: user.value.id, event, metadata })
  }

  const getRecentActivity = async (limit = 20) => {
    if (!user.value) return []
    const { data } = await supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })
      .limit(limit)
    return data ?? []
  }

  return {
    // Profiles
    getProfile,
    updateProfile,
    // Team
    getTeamMembers,
    inviteTeamMember,
    removeTeamMember,
    // Projects
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    // Activity
    logActivity,
    getRecentActivity,
  }
}
