<template>
  <div class="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
    <div class="flex items-start justify-between animate-fade-up">
      <div>
        <h1 class="text-2xl font-bold text-surface-50">
          Good {{ timeOfDay }}, {{ firstName }}
        </h1>
        <p class="text-surface-400 mt-1 text-sm">
          Here's what's happening with your account today.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs text-surface-500 font-mono hidden sm:block">{{ currentDate }}</span>
        <button class="btn-primary text-sm py-2 px-4" @click="showProjectModal = true">
          <Icon name="heroicons:plus" class="w-4 h-4" />
          New Project
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="(stat, i) in stats" :key="stat.label"
        class="stat-card animate-fade-up"
        :style="{ animationDelay: `${i * 80}ms` }"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-surface-500 uppercase tracking-wider">{{ stat.label }}</span>
          <div :class="`w-8 h-8 rounded-lg flex items-center justify-center ${stat.iconBg}`">
            <Icon :name="stat.icon" :class="`w-4 h-4 ${stat.iconColor}`" />
          </div>
        </div>
        <div>
          <p class="text-2xl font-bold text-surface-50 font-mono">{{ stat.value }}</p>
          <div class="flex items-center gap-1.5 mt-1">
            <Icon
              :name="stat.trend > 0 ? 'heroicons:arrow-trending-up' : 'heroicons:arrow-trending-down'"
              :class="`w-3.5 h-3.5 ${stat.trend > 0 ? 'text-green-400' : 'text-red-400'}`"
            />
            <span :class="`text-xs font-medium ${stat.trend > 0 ? 'text-green-400' : 'text-red-400'}`">
              {{ Math.abs(stat.trend) }}%
            </span>
            <span class="text-xs text-surface-500">vs last month</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 card p-5 space-y-4 animate-fade-up animate-delay-200">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold text-surface-100">Recent Activity</h2>
          <button class="text-xs text-brand-400 hover:text-brand-300 transition-colors" @click="navigateTo('/dashboard/analytics')">View all</button>
        </div>

        <div class="space-y-1">
          <div
            v-for="(activity, i) in recentActivity"
            :key="i"
            class="flex items-start gap-3.5 p-3 rounded-xl hover:bg-surface-800/50 transition-colors group"
          >
            <div :class="`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.iconBg}`">
              <Icon :name="activity.icon" :class="`w-4 h-4 ${activity.iconColor}`" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-surface-200">{{ activity.message }}</p>
              <p class="text-xs text-surface-500 mt-0.5">{{ activity.time }}</p>
            </div>
            <span :class="`badge ${activity.badge}`">{{ activity.label }}</span>
          </div>
        </div>
      </div>

      <div class="card p-5 space-y-4 animate-fade-up animate-delay-300">
        <h2 class="font-semibold text-surface-100">Quick Actions</h2>

        <div class="space-y-2">
          <button
            v-for="action in quickActions"
            :key="action.label"
            class="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl bg-surface-800/50 hover:bg-surface-800 border border-surface-800 hover:border-surface-700 transition-all group text-left"
            @click="action.fn"
          >
            <div :class="`w-8 h-8 rounded-lg flex items-center justify-center ${action.iconBg}`">
              <Icon :name="action.icon" :class="`w-4 h-4 ${action.iconColor}`" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-surface-200 group-hover:text-surface-100 transition-colors">{{ action.label }}</p>
              <p class="text-xs text-surface-500">{{ action.desc }}</p>
            </div>
            <Icon name="heroicons:chevron-right" class="w-4 h-4 text-surface-600 group-hover:text-surface-400 transition-colors" />
          </button>
        </div>
      </div>
    </div>

    <div class="card p-5 space-y-4 animate-fade-up animate-delay-400">
      <div class="flex items-center justify-between">
        <h2 class="font-semibold text-surface-100">Account Information</h2>
        <NuxtLink to="/dashboard/settings" class="btn-secondary text-xs py-1.5 px-3">
          <Icon name="heroicons:pencil-square" class="w-3.5 h-3.5" />
          Edit
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="space-y-1">
          <p class="label">Email</p>
          <p class="text-sm text-surface-200">{{ user?.email }}</p>
        </div>
        <div class="space-y-1">
          <p class="label">Account ID</p>
          <p class="text-sm text-surface-200 font-mono text-xs">{{ user?.id?.slice(0, 16) }}...</p>
        </div>
        <div class="space-y-1">
          <p class="label">Email verified</p>
          <span :class="user?.email_confirmed_at ? 'badge-success' : 'badge-warning'">
            {{ user?.email_confirmed_at ? 'Verified' : 'Pending' }}
          </span>
        </div>
        <div class="space-y-1">
          <p class="label">Last sign in</p>
          <p class="text-sm text-surface-200">{{ formatDate(user?.last_sign_in_at) }}</p>
        </div>
        <div class="space-y-1">
          <p class="label">Created</p>
          <p class="text-sm text-surface-200">{{ formatDate(user?.created_at) }}</p>
        </div>
        <div class="space-y-1">
          <p class="label">Auth provider</p>
          <p class="text-sm text-surface-200 capitalize">{{ user?.app_metadata?.provider || 'email' }}</p>
        </div>
      </div>
    </div>

    <Transition name="modal">
      <div v-if="showProjectModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="card-elevated w-full max-w-md p-6 space-y-5">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-surface-100">New Project</h3>
            <button class="text-surface-500 hover:text-surface-300" @click="closeProjectModal">
              <Icon name="heroicons:x-mark" class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="label">Project name</label>
              <input v-model="projectForm.name" type="text" class="input-field" placeholder="Website redesign" />
            </div>
            <div>
              <label class="label">Description</label>
              <textarea
                v-model="projectForm.description"
                rows="3"
                class="input-field resize-none"
                placeholder="What is this project about?"
              />
            </div>
          </div>

          <div class="flex gap-3 justify-end">
            <button class="btn-secondary" @click="closeProjectModal">Cancel</button>
            <button class="btn-primary" :disabled="creatingProject" @click="handleCreateProject">
              <Icon v-if="creatingProject" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
              <span>{{ creatingProject ? 'Creating...' : 'Create Project' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const user = useSupabaseUser()
const { toast } = useToast()
const { createProject, getProjects, getRecentActivity, getTeamMembers, logActivity } = useDatabase()

const showProjectModal = ref(false)
const creatingProject = ref(false)
const projectCount = ref(0)
const teamCount = ref(0)
const recentActivity = ref([
  { icon: 'heroicons:user-plus', iconBg: 'bg-green-500/10', iconColor: 'text-green-400', message: 'No recent activity yet', time: 'Start by creating a project', label: 'Info', badge: 'badge-info' },
])
const projectForm = reactive({
  name: '',
  description: '',
})

const firstName = computed(() => {
  const name = user.value?.user_metadata?.full_name || user.value?.email?.split('@')[0] || 'there'
  return name.split(' ')[0]
})

const timeOfDay = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 18) return 'afternoon'
  return 'evening'
})

const currentDate = computed(() =>
  new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
)

const formatDate = (d?: string) => {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const stats = computed(() => [
  { label: 'Projects', value: String(projectCount.value), trend: 8.2, icon: 'heroicons:folder', iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
  { label: 'Tasks Done', value: '248', trend: 12.5, icon: 'heroicons:check-circle', iconBg: 'bg-green-500/10', iconColor: 'text-green-400' },
  { label: 'Team Members', value: String(teamCount.value), trend: -2.0, icon: 'heroicons:users', iconBg: 'bg-purple-500/10', iconColor: 'text-purple-400' },
  { label: 'Storage', value: '4.2GB', trend: 5.1, icon: 'heroicons:server', iconBg: 'bg-brand-500/10', iconColor: 'text-brand-400' },
])

const quickActions = [
  { label: 'Invite Team Member', desc: 'Add someone to your workspace', icon: 'heroicons:user-plus', iconBg: 'bg-green-500/10', iconColor: 'text-green-400', fn: () => navigateTo('/dashboard/team') },
  { label: 'Update Profile', desc: 'Change your personal information', icon: 'heroicons:user-circle', iconBg: 'bg-brand-500/10', iconColor: 'text-brand-400', fn: () => navigateTo('/dashboard/profile') },
  { label: 'Security Settings', desc: 'Manage password & 2FA', icon: 'heroicons:shield-check', iconBg: 'bg-yellow-500/10', iconColor: 'text-yellow-400', fn: () => navigateTo('/dashboard/settings') },
  { label: 'View Analytics', desc: 'See your usage stats', icon: 'heroicons:chart-bar', iconBg: 'bg-purple-500/10', iconColor: 'text-purple-400', fn: () => navigateTo('/dashboard/analytics') },
]

const loadProjects = async () => {
  projectCount.value = (await getProjects()).length
}

const loadTeamCount = async () => {
  teamCount.value = (await getTeamMembers()).length + 1
}

const formatRelativeTime = (date: string) => {
  const diffMs = Date.now() - new Date(date).getTime()
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000))

  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
}

const activityPresentation = (event: string) => {
  if (event.startsWith('team.invite')) return { icon: 'heroicons:user-plus', iconBg: 'bg-green-500/10', iconColor: 'text-green-400', label: 'Team', badge: 'badge-success' }
  if (event.startsWith('project.create')) return { icon: 'heroicons:folder', iconBg: 'bg-brand-500/10', iconColor: 'text-brand-400', label: 'Project', badge: 'badge-info' }
  if (event.startsWith('auth.')) return { icon: 'heroicons:shield-check', iconBg: 'bg-yellow-500/10', iconColor: 'text-yellow-400', label: 'Auth', badge: 'badge-warning' }
  return { icon: 'heroicons:bolt', iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400', label: 'Activity', badge: 'badge-info' }
}

const loadRecentActivity = async () => {
  const items = await getRecentActivity(5)
  if (!items.length) {
    recentActivity.value = [
      { icon: 'heroicons:user-plus', iconBg: 'bg-green-500/10', iconColor: 'text-green-400', message: 'No recent activity yet', time: 'Start by creating a project', label: 'Info', badge: 'badge-info' },
    ]
    return
  }

  recentActivity.value = items.map(item => ({
    ...activityPresentation(item.event),
    message: item.event.replaceAll('.', ' '),
    time: formatRelativeTime(item.created_at),
  }))
}

watch(() => user.value?.id, async (id) => {
  if (!id) return
  await Promise.all([loadProjects(), loadTeamCount(), loadRecentActivity()])
}, { immediate: true })

const closeProjectModal = () => {
  showProjectModal.value = false
  projectForm.name = ''
  projectForm.description = ''
}

const handleCreateProject = async () => {
  if (!projectForm.name.trim()) {
    toast.error('Please enter a project name.')
    return
  }

  creatingProject.value = true
  const { error } = await createProject(projectForm.name.trim(), projectForm.description.trim() || undefined)

  if (error) {
    toast.error(error.message)
    creatingProject.value = false
    return
  }

  await logActivity('project.create', { name: projectForm.name.trim() })
  await Promise.all([loadProjects(), loadTeamCount(), loadRecentActivity()])
  creatingProject.value = false
  closeProjectModal()
  toast.success('Project created successfully.')
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
