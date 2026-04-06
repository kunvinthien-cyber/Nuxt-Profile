<template>
  <NuxtLayout name="auth">
    <div class="animate-fade-up">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-surface-50">Reset your password</h2>
        <p class="text-surface-400 mt-1.5 text-sm">Enter a new password for your account.</p>
      </div>

      <Transition name="fade">
        <div v-if="error" class="mb-5 flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
          <Icon name="heroicons:exclamation-circle" class="w-4.5 h-4.5 text-red-400 mt-0.5 flex-shrink-0" />
          <p class="text-sm text-red-400">{{ error }}</p>
        </div>
      </Transition>

      <Transition name="fade">
        <div v-if="success" class="mb-5 flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p class="text-sm font-medium text-green-400">Password updated!</p>
            <p class="text-xs text-green-500/80 mt-0.5">Redirecting you to login...</p>
          </div>
        </div>
      </Transition>

      <form v-if="!success" class="space-y-4" @submit.prevent="handleReset">
        <div>
          <label class="label">New password</label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Min. 8 characters"
              class="input-field pr-10"
              required
              minlength="8"
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

        <div>
          <label class="label">Confirm new password</label>
          <input
            v-model="form.confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Re-enter new password"
            class="input-field"
            required
          />
          <p v-if="form.confirmPassword && form.password !== form.confirmPassword" class="text-xs text-red-400 mt-1.5">
            Passwords do not match
          </p>
        </div>

        <button type="submit" class="btn-primary w-full" :disabled="loading || (!!form.confirmPassword && form.password !== form.confirmPassword)">
          <Icon v-if="loading" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
          <span>{{ loading ? 'Updating...' : 'Update Password' }}</span>
        </button>
      </form>

      <p class="text-center text-sm text-surface-500 mt-6">
        Remember your password?
        <NuxtLink to="/login" class="text-brand-400 hover:text-brand-300 font-medium ml-1 transition-colors">
          Sign in
        </NuxtLink>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const supabase = useSupabaseClient()
const router = useRouter()

const form = reactive({ password: '', confirmPassword: '' })
const loading = ref(false)
const showPassword = ref(false)
const error = ref('')
const success = ref(false)

const handleReset = async () => {
  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }
  loading.value = true
  error.value = ''

  const { error: updateError } = await supabase.auth.updateUser({ password: form.password })

  if (updateError) {
    error.value = updateError.message
  } else {
    success.value = true
    setTimeout(() => router.push('/login'), 2500)
  }
  loading.value = false
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
