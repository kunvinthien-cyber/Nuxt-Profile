/**
 * useAuth composable
 * Convenience wrapper around Supabase auth for common operations
 */
export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const router = useRouter()
  const redirectPath = '/confirm'
  const oauthProviderLabels = {
    google: 'Google',
    github: 'GitHub',
    discord: 'Discord',
  } as const

  const getRedirectUrl = () => {
    if (!import.meta.client) {
      return redirectPath
    }

    return new URL(redirectPath, window.location.origin).toString()
  }

  const getEmailRedirectUrl = () => {
    if (!import.meta.client) {
      return '/'
    }

    return window.location.origin
  }

  /** Computed display name */
  const displayName = computed(() =>
    user.value?.user_metadata?.full_name
    || user.value?.email?.split('@')[0]
    || 'User'
  )

  /** Computed initials (up to 2 chars) */
  const initials = computed(() =>
    displayName.value
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  )

  /** True when a user session exists */
  const isAuthenticated = computed(() => !!user.value)

  /**
   * Sign in with email + password
   */
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) await router.push('/dashboard')
    return { error }
  }

  /**
   * Register a new account
   */
  const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    })
    return { data, error }
  }

  /**
   * Sign out and redirect to login
   */
  const signOut = async () => {
    await supabase.auth.signOut()
    await router.push('/login')
  }

  /**
   * OAuth sign in (google, github, etc.)
   */
  const signInWithOAuth = async (provider: 'google' | 'github' | 'discord') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getRedirectUrl(),
      },
    })
    return { data, error }
  }

  const getOAuthErrorMessage = (
    provider: keyof typeof oauthProviderLabels,
    error: { message?: string; code?: number | string } | null,
  ) => {
    if (!error) return ''

    const providerName = oauthProviderLabels[provider]
    const message = error.message?.toLowerCase() || ''

    if (message.includes('unsupported provider')) {
      return `${providerName} sign-in is not enabled in Supabase yet. Enable ${providerName} under Auth > Providers, then try again.`
    }

    return error.message || `Unable to sign in with ${providerName}. Please try again.`
  }

  const getAuthErrorMessage = (error: { message?: string; code?: number | string } | null) => {
    if (!error) return ''

    const message = error.message?.toLowerCase() || ''

    if (message.includes('email not confirmed')) {
      return 'Your email is not confirmed yet. Please open the confirmation email from Supabase, then sign in again.'
    }

    return error.message || 'Unable to sign in. Please try again.'
  }

  const resendSignupConfirmation = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: getEmailRedirectUrl(),
      },
    })

    return { error }
  }

  /**
   * Send password reset email
   */
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: import.meta.client
        ? new URL('/reset-password', window.location.origin).toString()
        : '/reset-password',
    })
    return { error }
  }

  /**
   * Update user profile metadata
   */
  const updateProfile = async (data: Record<string, unknown>) => {
    const { error } = await supabase.auth.updateUser({ data })
    return { error }
  }

  /**
   * Update email address
   */
  const updateEmail = async (newEmail: string) => {
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    return { error }
  }

  /**
   * Update password
   */
  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    return { error }
  }

  return {
    user,
    displayName,
    initials,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    getAuthErrorMessage,
    getOAuthErrorMessage,
    resendSignupConfirmation,
    resetPassword,
    updateProfile,
    updateEmail,
    updatePassword,
  }
}
