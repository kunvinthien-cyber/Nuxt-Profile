<template>
  <NuxtLayout name="auth">
    <div class="animate-fade-up">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-surface-50">Welcome back</h2>
        <p class="text-surface-400 mt-1.5 text-sm">Sign in to your account to continue</p>
      </div>

      <!-- Alert -->
      <Transition name="fade">
        <div v-if="error" class="mb-5 flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
          <Icon name="heroicons:exclamation-circle" class="w-4.5 h-4.5 text-red-400 mt-0.5 flex-shrink-0" />
          <div class="space-y-2">
            <p class="text-sm text-red-400">{{ error }}</p>
            <button
              v-if="showResendConfirmation"
              type="button"
              class="text-xs text-brand-400 hover:text-brand-300 transition-colors"
              :disabled="resendingConfirmation"
              @click="handleResendConfirmation"
            >
              {{ resendingConfirmation ? 'Sending confirmation...' : 'Resend confirmation email' }}
            </button>
          </div>
        </div>
      </Transition>

      <Transition name="fade">
        <div v-if="success" class="mb-5 flex items-start gap-3 p-3.5 rounded-xl bg-green-500/10 border border-green-500/20">
          <Icon name="heroicons:check-circle" class="w-4.5 h-4.5 text-green-400 mt-0.5 flex-shrink-0" />
          <p class="text-sm text-green-400">{{ success }}</p>
        </div>
      </Transition>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <div>
          <label class="label">Email address</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
            class="input-field"
            required
            autocomplete="email"
          />
        </div>

        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="label !mb-0">Password</label>
            <button
              type="button"
              class="text-xs text-brand-400 hover:text-brand-300 transition-colors"
              @click="handleForgotPassword"
            >
              Forgot password?
            </button>
          </div>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="input-field pr-10"
              required
              autocomplete="current-password"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
              @click="showPassword = !showPassword"
            >
              <Icon :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        <div class="flex items-center gap-2.5 py-1">
          <input
            id="remember"
            v-model="form.remember"
            type="checkbox"
            class="w-4 h-4 rounded border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500/30 cursor-pointer"
          />
          <label for="remember" class="text-sm text-surface-400 cursor-pointer">Remember me for 30 days</label>
        </div>

        <button type="submit" class="btn-primary w-full" :disabled="loading">
          <Icon v-if="loading" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
          <span>{{ loading ? 'Signing in...' : 'Sign in' }}</span>
        </button>
      </form>

      <!-- Divider -->
      <div class="flex items-center gap-4 my-6">
        <div class="flex-1 divider" />
        <span class="text-xs text-surface-500 font-medium">or continue with</span>
        <div class="flex-1 divider" />
      </div>

      <!-- OAuth -->
      <div class="grid grid-cols-2 gap-3">
        <button class="btn-secondary justify-center" @click="signInWithGoogle">
          <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </button>
        <button class="btn-secondary justify-center" @click="signInWithGithub">
          <svg class="w-4 h-4 fill-surface-300" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub
        </button>
      </div>

      <p class="text-center text-sm text-surface-500 mt-6">
        Don't have an account?
        <NuxtLink to="/register" class="text-brand-400 hover:text-brand-300 font-medium ml-1 transition-colors">
          Create one free
        </NuxtLink>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const supabase = useSupabaseClient()
const router = useRouter()
const {
  signInWithOAuth,
  getAuthErrorMessage,
  getOAuthErrorMessage,
  resendSignupConfirmation,
} = useAuth()

const form = reactive({
  email: '',
  password: '',
  remember: false,
})

const loading = ref(false)
const showPassword = ref(false)
const error = ref('')
const success = ref('')
const showResendConfirmation = ref(false)
const resendingConfirmation = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  showResendConfirmation.value = false

  const { error: authError } = await supabase.auth.signInWithPassword({
    email: form.email,
    password: form.password,
  })

  if (authError) {
    error.value = getAuthErrorMessage(authError)
    showResendConfirmation.value = authError.message.toLowerCase().includes('email not confirmed')
  } else {
    await router.push('/dashboard')
  }

  loading.value = false
}

const handleForgotPassword = async () => {
  if (!form.email) {
    error.value = 'Please enter your email address first.'
    return
  }

  loading.value = true
  error.value = ''
  const { error: resetError } = await supabase.auth.resetPasswordForEmail(form.email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (resetError) {
    error.value = resetError.message
  } else {
    success.value = 'Password reset email sent! Check your inbox.'
  }
  loading.value = false
}

const handleResendConfirmation = async () => {
  if (!form.email) {
    error.value = 'Enter your email address first so we can resend the confirmation link.'
    return
  }

  resendingConfirmation.value = true
  success.value = ''

  const { error: resendError } = await resendSignupConfirmation(form.email)

  if (resendError) {
    error.value = resendError.message
  } else {
    error.value = ''
    success.value = 'Confirmation email sent again. Please check your inbox and spam folder.'
    showResendConfirmation.value = false
  }

  resendingConfirmation.value = false
}

const signInWithGoogle = async () => {
  loading.value = true
  error.value = ''
  showResendConfirmation.value = false

  const { error: oauthError } = await signInWithOAuth('google')
  if (oauthError) {
    error.value = getOAuthErrorMessage('google', oauthError)
    loading.value = false
  }
}

const signInWithGithub = async () => {
  loading.value = true
  error.value = ''
  showResendConfirmation.value = false

  const { error: oauthError } = await signInWithOAuth('github')
  if (oauthError) {
    error.value = getOAuthErrorMessage('github', oauthError)
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
