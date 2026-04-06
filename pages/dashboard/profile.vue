<template>
  <div class="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="animate-fade-up">
      <h1 class="text-2xl font-bold text-surface-50">Profile</h1>
      <p class="text-surface-400 mt-1 text-sm">Manage your personal information and preferences.</p>
    </div>

    <!-- Alert -->
    <Transition name="fade">
      <div v-if="saveSuccess" class="flex items-center gap-3 p-3.5 rounded-xl bg-green-500/10 border border-green-500/20">
        <Icon name="heroicons:check-circle" class="w-4.5 h-4.5 text-green-400" />
        <p class="text-sm text-green-400">Profile updated successfully!</p>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="saveError" class="flex items-center gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
        <Icon name="heroicons:exclamation-circle" class="w-4.5 h-4.5 text-red-400" />
        <p class="text-sm text-red-400">{{ saveError }}</p>
      </div>
    </Transition>

    <!-- Avatar section -->
    <div class="card p-6 animate-fade-up animate-delay-100">
      <div class="flex items-center gap-6">
        <div class="relative">
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-2xl font-bold">
            {{ userInitials }}
          </div>
          <button class="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-surface-800 border border-surface-700 flex items-center justify-center hover:bg-surface-700 transition-colors">
            <Icon name="heroicons:camera" class="w-3.5 h-3.5 text-surface-400" />
          </button>
        </div>
        <div>
          <h2 class="font-semibold text-surface-100 text-lg">{{ form.fullName || 'Your Name' }}</h2>
          <p class="text-surface-400 text-sm">{{ user?.email }}</p>
          <div class="flex items-center gap-2 mt-2">
            <span class="badge-success">Active</span>
            <span class="text-xs text-surface-500 font-mono">ID: {{ user?.id?.slice(0, 8) }}...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Personal info form -->
    <div class="card p-6 space-y-5 animate-fade-up animate-delay-200">
      <h3 class="font-semibold text-surface-100">Personal Information</h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="label">First name</label>
          <input v-model="form.firstName" type="text" class="input-field" placeholder="John" />
        </div>
        <div>
          <label class="label">Last name</label>
          <input v-model="form.lastName" type="text" class="input-field" placeholder="Doe" />
        </div>
        <div class="sm:col-span-2">
          <label class="label">Display name</label>
          <input v-model="form.fullName" type="text" class="input-field" placeholder="How should we call you?" />
        </div>
        <div class="sm:col-span-2">
          <label class="label">Email address</label>
          <input :value="user?.email" type="email" class="input-field opacity-60 cursor-not-allowed" disabled />
          <p class="text-xs text-surface-500 mt-1.5">Email cannot be changed here. Go to Settings to update it.</p>
        </div>
        <div class="sm:col-span-2">
          <label class="label">Bio</label>
          <textarea
            v-model="form.bio"
            rows="3"
            class="input-field resize-none"
            placeholder="Tell us a little about yourself..."
          />
        </div>
        <div>
          <label class="label">Location</label>
          <input v-model="form.location" type="text" class="input-field" placeholder="City, Country" />
        </div>
        <div>
          <label class="label">Website</label>
          <input v-model="form.website" type="url" class="input-field" placeholder="https://yoursite.com" />
        </div>
      </div>

      <div class="flex justify-end pt-2">
        <button class="btn-primary" :disabled="saving" @click="saveProfile">
          <Icon v-if="saving" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
          <span>{{ saving ? 'Saving...' : 'Save Changes' }}</span>
        </button>
      </div>
    </div>

    <!-- Danger zone -->
    <div class="card border-red-500/20 p-6 space-y-4 animate-fade-up animate-delay-300">
      <h3 class="font-semibold text-red-400">Danger Zone</h3>
      <div class="flex items-center justify-between py-3 border-t border-surface-800">
        <div>
          <p class="text-sm font-medium text-surface-200">Delete account</p>
          <p class="text-xs text-surface-500 mt-0.5">Permanently delete your account and all data</p>
        </div>
        <button class="btn-danger" @click="showDeleteConfirm = true">
          <Icon name="heroicons:trash" class="w-4 h-4" />
          Delete Account
        </button>
      </div>
    </div>

    <!-- Delete confirm modal -->
    <Transition name="modal">
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="card-elevated w-full max-w-md p-6 space-y-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 class="font-semibold text-surface-100">Delete account?</h3>
              <p class="text-xs text-surface-500">This action cannot be undone</p>
            </div>
          </div>
          <p class="text-sm text-surface-400">
            Are you sure you want to permanently delete your account? All your data, projects, and settings will be permanently removed.
          </p>
          <div class="flex gap-3 justify-end">
            <button class="btn-secondary" @click="showDeleteConfirm = false">Cancel</button>
            <button class="btn-danger" @click="handleDeleteAccount">Delete Forever</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const supabase = useSupabaseClient()
const { toast } = useToast()
const user = useSupabaseUser()
const { getProfile, updateProfile } = useDatabase()

const saving = ref(false)
const saveSuccess = ref(false)
const saveError = ref('')
const showDeleteConfirm = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  fullName: '',
  bio: '',
  location: '',
  website: '',
})

const userInitials = computed(() => {
  const name = form.fullName || user.value?.email || 'U'
  return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
})

const syncFormFromUser = async () => {
  if (!user.value) {
    return
  }

  const metadata = user.value.user_metadata || {}
  form.firstName = metadata.first_name || ''
  form.lastName = metadata.last_name || ''
  form.fullName = metadata.full_name || ''
  form.bio = metadata.bio || ''
  form.location = metadata.location || ''
  form.website = metadata.website || ''

  const profile = await getProfile()
  if (profile) {
    form.firstName = profile.first_name || form.firstName
    form.lastName = profile.last_name || form.lastName
    form.fullName = profile.full_name || form.fullName
    form.bio = profile.bio || form.bio
    form.location = profile.location || form.location
    form.website = profile.website || form.website
  }

}

watch(() => user.value?.id, async (id) => {
  if (!id) return
  await syncFormFromUser()
}, { immediate: true })

const saveProfile = async () => {
  saving.value = true
  saveError.value = ''
  saveSuccess.value = false

  const fullName = form.fullName || `${form.firstName} ${form.lastName}`.trim()

  const { error: authError } = await supabase.auth.updateUser({
    data: {
      first_name: form.firstName,
      last_name: form.lastName,
      full_name: fullName,
      bio: form.bio,
      location: form.location,
      website: form.website,
    },
  })

  if (authError) {
    saveError.value = authError.message
    saving.value = false
    return
  }

  const { error: profileError } = await updateProfile({
    first_name: form.firstName,
    last_name: form.lastName,
    full_name: fullName,
    bio: form.bio,
    location: form.location,
    website: form.website,
  })

  if (profileError) {
    saveError.value = profileError.message
    saving.value = false
    return
  }

  form.fullName = fullName
  saveSuccess.value = true
  setTimeout(() => { saveSuccess.value = false }, 3000)

  saving.value = false
}

const handleDeleteAccount = () => {
  showDeleteConfirm.value = false
  toast.warning('Permanent account deletion requires a secure server-side admin endpoint. This starter currently supports sign-out and data management, but not self-delete from the browser.')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.modal-enter-active, .modal-leave-active { transition: all 0.3s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .card-elevated { transform: scale(0.95); }
</style>
