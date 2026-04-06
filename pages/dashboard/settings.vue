<template>
  <div class="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
    <div class="animate-fade-up">
      <h1 class="text-2xl font-bold text-surface-50">Settings</h1>
      <p class="text-surface-400 mt-1 text-sm">Manage your account security and preferences.</p>
    </div>

    <!-- Alerts -->
    <Transition name="fade">
      <div v-if="alert.show" :class="`flex items-center gap-3 p-3.5 rounded-xl border ${alert.type === 'success' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`">
        <Icon :name="alert.type === 'success' ? 'heroicons:check-circle' : 'heroicons:exclamation-circle'" :class="`w-4.5 h-4.5 ${alert.type === 'success' ? 'text-green-400' : 'text-red-400'}`" />
        <p :class="`text-sm ${alert.type === 'success' ? 'text-green-400' : 'text-red-400'}`">{{ alert.message }}</p>
      </div>
    </Transition>

    <!-- Change email -->
    <div class="card p-6 space-y-5 animate-fade-up animate-delay-100">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
          <Icon name="heroicons:envelope" class="w-4.5 h-4.5 text-brand-400" />
        </div>
        <div>
          <h3 class="font-semibold text-surface-100">Email Address</h3>
          <p class="text-xs text-surface-500">Current: {{ user?.email }}</p>
        </div>
      </div>

      <div class="space-y-3">
        <div>
          <label class="label">New email address</label>
          <input v-model="emailForm.newEmail" type="email" class="input-field" placeholder="newemail@example.com" />
        </div>
        <button class="btn-secondary text-sm" :disabled="emailLoading || !emailForm.newEmail" @click="updateEmail">
          <Icon v-if="emailLoading" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
          <span>{{ emailLoading ? 'Sending...' : 'Update Email' }}</span>
        </button>
      </div>
    </div>

    <!-- Change password -->
    <div class="card p-6 space-y-5 animate-fade-up animate-delay-200">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
          <Icon name="heroicons:lock-closed" class="w-4.5 h-4.5 text-yellow-400" />
        </div>
        <div>
          <h3 class="font-semibold text-surface-100">Change Password</h3>
          <p class="text-xs text-surface-500">Use a strong unique password</p>
        </div>
      </div>

      <div class="space-y-3">
        <div>
          <label class="label">New password</label>
          <div class="relative">
            <input v-model="passwordForm.newPassword" :type="showNewPw ? 'text' : 'password'" class="input-field pr-10" placeholder="Min. 8 characters" />
            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300" @click="showNewPw = !showNewPw">
              <Icon :name="showNewPw ? 'heroicons:eye-slash' : 'heroicons:eye'" class="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
        <div>
          <label class="label">Confirm new password</label>
          <input v-model="passwordForm.confirmPassword" :type="showNewPw ? 'text' : 'password'" class="input-field" placeholder="Re-enter new password" />
        </div>
        <button class="btn-secondary text-sm" :disabled="pwLoading || !passwordForm.newPassword" @click="updatePassword">
          <Icon v-if="pwLoading" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
          <span>{{ pwLoading ? 'Updating...' : 'Update Password' }}</span>
        </button>
      </div>
    </div>

    <!-- Notifications -->
    <div class="card p-6 space-y-5 animate-fade-up animate-delay-300">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
          <Icon name="heroicons:bell" class="w-4.5 h-4.5 text-purple-400" />
        </div>
        <h3 class="font-semibold text-surface-100">Notification Preferences</h3>
      </div>

      <div class="space-y-1">
        <div v-for="pref in notifPrefs" :key="pref.key" class="flex items-center justify-between py-3 border-b border-surface-800 last:border-0">
          <div>
            <p class="text-sm font-medium text-surface-200">{{ pref.label }}</p>
            <p class="text-xs text-surface-500 mt-0.5">{{ pref.desc }}</p>
          </div>
          <button
            :class="`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${pref.enabled ? 'bg-brand-500' : 'bg-surface-700'}`"
            @click="pref.enabled = !pref.enabled"
          >
            <span :class="`inline-block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 mt-0.5 ${pref.enabled ? 'translate-x-5' : 'translate-x-0.5'}`" />
          </button>
        </div>
      </div>
    </div>

    <!-- Sessions -->
    <div class="card p-6 space-y-5 animate-fade-up animate-delay-400">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Icon name="heroicons:device-phone-mobile" class="w-4.5 h-4.5 text-blue-400" />
          </div>
          <h3 class="font-semibold text-surface-100">Active Sessions</h3>
        </div>
        <button class="btn-danger text-xs py-1.5 px-3" @click="signOutAll">
          Sign out all
        </button>
      </div>

      <div class="space-y-3">
        <div v-for="session in sessions" :key="session.id" class="flex items-center gap-4 p-3.5 rounded-xl bg-surface-800/50 border border-surface-800">
          <Icon :name="session.icon" class="w-5 h-5 text-surface-400 flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-surface-200">{{ session.device }}</p>
            <p class="text-xs text-surface-500">{{ session.location }} · {{ session.time }}</p>
          </div>
          <span v-if="session.current" class="badge-success">Current</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { updateEmail: submitEmailUpdate, updatePassword: submitPasswordUpdate } = useAuth()
const user = useSupabaseUser()

const emailLoading = ref(false)
const pwLoading = ref(false)
const showNewPw = ref(false)

const alert = reactive({ show: false, type: 'success', message: '' })

const emailForm = reactive({ newEmail: '' })
const passwordForm = reactive({ newPassword: '', confirmPassword: '' })

const notifPrefs = reactive([
  { key: 'security', label: 'Security alerts', desc: 'Get notified about login attempts and security events', enabled: true },
  { key: 'updates', label: 'Product updates', desc: 'News and updates about NexusApp features', enabled: true },
  { key: 'team', label: 'Team activity', desc: 'When team members join or make changes', enabled: false },
  { key: 'weekly', label: 'Weekly digest', desc: 'A weekly summary of your account activity', enabled: false },
])

const sessions = [
  { id: 1, icon: 'heroicons:computer-desktop', device: 'Chrome on macOS', location: 'Phnom Penh, KH', time: 'Active now', current: true },
  { id: 2, icon: 'heroicons:device-phone-mobile', device: 'Safari on iPhone', location: 'Phnom Penh, KH', time: '2 hours ago', current: false },
]

const showAlert = (type: 'success' | 'error', message: string) => {
  alert.show = true
  alert.type = type
  alert.message = message
  setTimeout(() => { alert.show = false }, 4000)
}

watch(notifPrefs, (prefs) => {
  if (!import.meta.client) return
  localStorage.setItem('nexusapp.notification-preferences', JSON.stringify(prefs))
}, { deep: true })

onMounted(() => {
  if (!import.meta.client) return

  const savedPrefs = localStorage.getItem('nexusapp.notification-preferences')
  if (!savedPrefs) return

  try {
    const parsedPrefs = JSON.parse(savedPrefs) as Array<{ key: string, enabled: boolean }>
    for (const pref of notifPrefs) {
      const savedPref = parsedPrefs.find(item => item.key === pref.key)
      if (savedPref) pref.enabled = savedPref.enabled
    }
  } catch {
    localStorage.removeItem('nexusapp.notification-preferences')
  }
})

const updateEmail = async () => {
  emailLoading.value = true
  const { error } = await submitEmailUpdate(emailForm.newEmail)
  if (error) showAlert('error', error.message)
  else {
    showAlert('success', 'Confirmation email sent. Check your inbox.')
    emailForm.newEmail = ''
  }
  emailLoading.value = false
}

const updatePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    showAlert('error', 'Passwords do not match')
    return
  }
  pwLoading.value = true
  const { error } = await submitPasswordUpdate(passwordForm.newPassword)
  if (error) showAlert('error', error.message)
  else {
    showAlert('success', 'Password updated successfully!')
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  }
  pwLoading.value = false
}

const signOutAll = async () => {
  const supabase = useSupabaseClient()
  await supabase.auth.signOut({ scope: 'global' })
  navigateTo('/login')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
