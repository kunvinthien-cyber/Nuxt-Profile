<template>
  <div class="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
    <div class="flex items-start justify-between animate-fade-up">
      <div>
        <h1 class="text-2xl font-bold text-surface-50">Team</h1>
        <p class="text-surface-400 mt-1 text-sm">Manage team members and invitations.</p>
      </div>
      <button class="btn-primary text-sm" @click="showInviteModal = true">
        <Icon name="heroicons:user-plus" class="w-4 h-4" />
        Invite Member
      </button>
    </div>

    <Transition name="modal">
      <div v-if="showInviteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="card-elevated w-full max-w-md p-6 space-y-5">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-surface-100">Invite Team Member</h3>
            <button class="text-surface-500 hover:text-surface-300" @click="showInviteModal = false">
              <Icon name="heroicons:x-mark" class="w-5 h-5" />
            </button>
          </div>

          <Transition name="fade">
            <div v-if="inviteError" class="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <Icon name="heroicons:exclamation-circle" class="w-4 h-4 text-red-400 flex-shrink-0" />
              <p class="text-xs text-red-400">{{ inviteError }}</p>
            </div>
          </Transition>

          <div class="space-y-4">
            <div>
              <label class="label">Email address</label>
              <input v-model="inviteForm.email" type="email" class="input-field" placeholder="colleague@example.com" />
            </div>
            <div>
              <label class="label">Role</label>
              <select v-model="inviteForm.role" class="input-field">
                <option value="viewer">Viewer - can view only</option>
                <option value="member">Member - can view and edit</option>
                <option value="admin">Admin - full access</option>
              </select>
            </div>
          </div>

          <div class="flex gap-3 justify-end">
            <button class="btn-secondary" @click="showInviteModal = false">Cancel</button>
            <button class="btn-primary" :disabled="inviteLoading" @click="sendInvite">
              <Icon v-if="inviteLoading" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
              <span>{{ inviteLoading ? 'Sending...' : 'Send Invite' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <div class="card overflow-hidden animate-fade-up animate-delay-100">
      <div class="p-5 border-b border-surface-800 flex items-center justify-between">
        <h2 class="font-semibold text-surface-100">Members <span class="text-surface-500 font-normal ml-1">{{ members.length }}</span></h2>
        <div class="relative">
          <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <input v-model="search" type="text" class="input-field pl-9 py-1.5 text-xs w-48" placeholder="Search members..." />
        </div>
      </div>

      <div v-if="membersLoading" class="px-5 py-8 text-sm text-surface-500">
        Loading team members...
      </div>

      <div v-else class="divide-y divide-surface-800">
        <div
          v-for="member in filteredMembers"
          :key="member.id"
          class="flex items-center gap-4 px-5 py-4 hover:bg-surface-800/30 transition-colors"
        >
          <div :class="`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 bg-gradient-to-br ${member.gradient}`">
            {{ member.initials }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="text-sm font-medium text-surface-200">{{ member.name }}</p>
              <span v-if="member.you" class="badge-info text-[10px]">You</span>
            </div>
            <p class="text-xs text-surface-500">{{ member.email }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span :class="`badge ${member.status === 'active' ? 'badge-success' : 'badge-warning'}`">
              {{ member.status === 'active' ? 'Active' : 'Invited' }}
            </span>
            <span :class="`badge ${member.role === 'admin' ? 'badge-danger' : member.role === 'member' ? 'badge-info' : 'bg-surface-800 text-surface-400 border border-surface-700'}`">
              {{ member.role }}
            </span>
            <button
              v-if="!member.you"
              class="p-1.5 text-surface-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              :disabled="removingId === member.id"
              @click="handleRemoveMember(member.id)"
            >
              <Icon name="heroicons:trash" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="pendingInvites.length" class="card overflow-hidden animate-fade-up animate-delay-200">
      <div class="p-5 border-b border-surface-800">
        <h2 class="font-semibold text-surface-100">Pending Invites <span class="text-surface-500 font-normal ml-1">{{ pendingInvites.length }}</span></h2>
      </div>
      <div class="divide-y divide-surface-800">
        <div v-for="invite in pendingInvites" :key="invite.id" class="flex items-center gap-4 px-5 py-4">
          <div class="w-10 h-10 rounded-xl bg-surface-800 border border-surface-700 border-dashed flex items-center justify-center flex-shrink-0">
            <Icon name="heroicons:envelope" class="w-4.5 h-4.5 text-surface-500" />
          </div>
          <div class="flex-1">
            <p class="text-sm text-surface-300">{{ invite.email }}</p>
            <p class="text-xs text-surface-500 mt-0.5">Invited {{ invite.sentAt }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="badge-warning">Pending</span>
            <button class="btn-secondary text-xs py-1 px-3" @click="handleResendInvite(invite.email)">Resend</button>
            <button
              class="p-1.5 text-surface-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              :disabled="removingId === invite.id"
              @click="handleCancelInvite(invite.id)"
            >
              <Icon name="heroicons:x-mark" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const user = useSupabaseUser()
const { toast } = useToast()
const { getTeamMembers, inviteTeamMember, removeTeamMember, logActivity } = useDatabase()

const showInviteModal = ref(false)
const inviteLoading = ref(false)
const inviteError = ref('')
const removingId = ref<string | null>(null)
const membersLoading = ref(true)
const search = ref('')

const inviteForm = reactive<{ email: string, role: 'admin' | 'member' | 'viewer' }>({
  email: '',
  role: 'member',
})

const teamMembers = ref<Array<{
  id: string
  email: string
  role: 'admin' | 'member' | 'viewer'
  status: 'active' | 'pending' | 'removed'
  invited_at: string
}>>([])

const gradients = [
  'from-brand-500 to-brand-700',
  'from-purple-500 to-purple-700',
  'from-blue-500 to-blue-700',
  'from-green-500 to-green-700',
  'from-yellow-500 to-orange-600',
]

const getInitials = (value: string) =>
  value
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase() || 'U'

const formatRelativeTime = (date: string) => {
  const diffMs = Date.now() - new Date(date).getTime()
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000))

  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
}

const loadTeamMembers = async () => {
  membersLoading.value = true
  teamMembers.value = await getTeamMembers()
  membersLoading.value = false
}

const members = computed(() => {
  const currentUserName = user.value?.user_metadata?.full_name || 'You'
  const currentUserEmail = user.value?.email || ''

  const activeMembers = teamMembers.value
    .filter(member => member.status === 'active')
    .map((member, index) => ({
      id: member.id,
      name: member.email.split('@')[0],
      email: member.email,
      initials: getInitials(member.email),
      gradient: gradients[(index + 1) % gradients.length],
      role: member.role,
      status: member.status,
      you: member.email === currentUserEmail,
    }))

  return [
    {
      id: 'current-user',
      name: `${currentUserName} (Account Owner)`,
      email: currentUserEmail,
      initials: getInitials(currentUserName),
      gradient: gradients[0],
      role: 'admin' as const,
      status: 'active' as const,
      you: true,
    },
    ...activeMembers.filter(member => !member.you),
  ]
})

const pendingInvites = computed(() =>
  teamMembers.value
    .filter(member => member.status === 'pending')
    .map(member => ({
      id: member.id,
      email: member.email,
      role: member.role,
      sentAt: formatRelativeTime(member.invited_at),
    }))
)

const filteredMembers = computed(() => {
  if (!search.value) return members.value
  const q = search.value.toLowerCase()
  return members.value.filter(member => member.name.toLowerCase().includes(q) || member.email.toLowerCase().includes(q))
})

watch(() => user.value?.id, async (id) => {
  if (!id) return
  await loadTeamMembers()
}, { immediate: true })

const sendInvite = async () => {
  if (!inviteForm.email) {
    inviteError.value = 'Please enter an email address'
    return
  }

  inviteLoading.value = true
  inviteError.value = ''

  const { data, error } = await inviteTeamMember(inviteForm.email, inviteForm.role)

  if (error) {
    inviteError.value = error.message
    inviteLoading.value = false
    return
  }

  if (data) {
    await loadTeamMembers()
  }

  await logActivity('team.invite', { email: inviteForm.email, role: inviteForm.role })
  inviteForm.email = ''
  inviteForm.role = 'member'
  inviteLoading.value = false
  showInviteModal.value = false
  toast.success('Team member invited successfully.')
}

const handleRemoveMember = async (id: string) => {
  removingId.value = id
  const { error } = await removeTeamMember(id)

  if (error) {
    toast.error(error.message)
    removingId.value = null
    return
  }

  await loadTeamMembers()
  await logActivity('team.remove', { memberId: id })
  removingId.value = null
  toast.success('Team member removed.')
}

const handleCancelInvite = async (id: string) => {
  removingId.value = id
  const { error } = await removeTeamMember(id)

  if (error) {
    toast.error(error.message)
    removingId.value = null
    return
  }

  await loadTeamMembers()
  await logActivity('team.cancel_invite', { memberId: id })
  removingId.value = null
  toast.info('Invite cancelled.')
}

const handleResendInvite = (email: string) => {
  inviteForm.email = email
  showInviteModal.value = true
  toast.info('Review the email and send the invite again.')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.modal-enter-active, .modal-leave-active { transition: all 0.25s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
