<template>
  <div class="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
    <div class="flex items-start justify-between animate-fade-up">
      <div>
        <h1 class="text-2xl font-bold text-surface-50">Analytics</h1>
        <p class="text-surface-400 mt-1 text-sm">Track your usage and performance over time.</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-for="range in timeRanges"
          :key="range.value"
          :class="selectedRange === range.value ? 'btn-primary text-xs py-1.5 px-3' : 'btn-secondary text-xs py-1.5 px-3'"
          @click="selectedRange = range.value"
        >
          {{ range.label }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(stat, i) in summaryStats" :key="stat.label" class="stat-card animate-fade-up" :style="{ animationDelay: `${i * 80}ms` }">
        <span class="text-xs font-medium text-surface-500 uppercase tracking-wider">{{ stat.label }}</span>
        <div>
          <p class="text-2xl font-bold text-surface-50 font-mono">{{ stat.value }}</p>
          <p class="text-xs text-surface-500 mt-0.5">{{ stat.sub }}</p>
        </div>
      </div>
    </div>

    <div class="card p-6 space-y-4 animate-fade-up animate-delay-200">
      <div class="flex items-center justify-between">
        <h2 class="font-semibold text-surface-100">Activity Overview</h2>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-brand-500" />
            <span class="text-xs text-surface-400">Events</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span class="text-xs text-surface-400">Sessions</span>
          </div>
        </div>
      </div>

      <!-- Simple bar chart -->
      <div class="h-48 flex items-end gap-2 px-2">
        <div
          v-for="(bar, i) in chartBars"
          :key="i"
          class="flex-1 flex flex-col items-center gap-1.5 group"
        >
          <div class="w-full relative flex flex-col items-center justify-end gap-0.5" style="height: 160px">
            <div
              :style="{ height: `${bar.sessions}%` }"
              class="w-full rounded-t-md bg-blue-500/20 border-t border-blue-500/40 transition-all duration-500 group-hover:bg-blue-500/30"
            />
            <div
              :style="{ height: `${bar.events}%` }"
              class="w-full rounded-t-md bg-brand-500/30 border-t border-brand-500/50 transition-all duration-500 group-hover:bg-brand-500/40 absolute bottom-0"
            />
          </div>
          <span class="text-[10px] text-surface-600">{{ bar.label }}</span>
        </div>
      </div>
    </div>

    <!-- Usage breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card p-5 space-y-4 animate-fade-up animate-delay-300">
        <h2 class="font-semibold text-surface-100">Usage Breakdown</h2>
        <div class="space-y-3">
          <div v-for="item in usageBreakdown" :key="item.label">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-sm text-surface-300">{{ item.label }}</span>
              <span class="text-sm font-medium text-surface-200 font-mono">{{ item.pct }}%</span>
            </div>
            <div class="h-2 rounded-full bg-surface-800 overflow-hidden">
              <div
                :class="`h-full rounded-full ${item.color} transition-all duration-700`"
                :style="{ width: `${item.pct}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="card p-5 space-y-4 animate-fade-up animate-delay-400">
        <h2 class="font-semibold text-surface-100">Top Events</h2>
        <div class="space-y-1">
          <div v-for="(event, i) in topEvents" :key="event.name" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-800/50 transition-colors">
            <span class="w-6 h-6 rounded-lg bg-surface-800 flex items-center justify-center text-xs font-mono text-surface-400">{{ i + 1 }}</span>
            <Icon :name="event.icon" class="w-4 h-4 text-surface-400" />
            <span class="flex-1 text-sm text-surface-300">{{ event.name }}</span>
            <span class="text-sm font-medium text-surface-200 font-mono">{{ event.count }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const user = useSupabaseUser()
const { getProjects, getTeamMembers, getRecentActivity } = useDatabase()
const selectedRange = ref('7d')
const summaryStats = ref([
  { label: 'Total Sessions', value: '0', sub: 'Recent activity entries' },
  { label: 'Projects', value: '0', sub: 'Projects in your workspace' },
  { label: 'Team Members', value: '0', sub: 'Including pending invites' },
  { label: 'Error Rate', value: '0%', sub: 'Based on tracked events' },
])
const chartBars = ref([
  { label: 'Mon', events: 0, sessions: 0 },
  { label: 'Tue', events: 0, sessions: 0 },
  { label: 'Wed', events: 0, sessions: 0 },
  { label: 'Thu', events: 0, sessions: 0 },
  { label: 'Fri', events: 0, sessions: 0 },
  { label: 'Sat', events: 0, sessions: 0 },
  { label: 'Sun', events: 0, sessions: 0 },
])
const usageBreakdown = ref([
  { label: 'Authentication', pct: 0, color: 'bg-brand-500' },
  { label: 'Database reads', pct: 0, color: 'bg-blue-500' },
  { label: 'Database writes', pct: 0, color: 'bg-purple-500' },
  { label: 'File storage', pct: 0, color: 'bg-yellow-500' },
])
const topEvents = ref<Array<{ name: string, icon: string, count: string }>>([])

const timeRanges = [
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
]

const loadAnalytics = async () => {
  const [projects, teamMembers, activity] = await Promise.all([
    getProjects(),
    getTeamMembers(),
    getRecentActivity(100),
  ])

  const rangeDays = selectedRange.value === '90d' ? 90 : selectedRange.value === '30d' ? 30 : 7
  const rangeStart = new Date()
  rangeStart.setDate(rangeStart.getDate() - (rangeDays - 1))

  const recentActivity = activity.filter(item => new Date(item.created_at) >= rangeStart)
  const errorCount = recentActivity.filter(item => item.event.toLowerCase().includes('error')).length

  summaryStats.value = [
    { label: 'Total Sessions', value: String(recentActivity.length), sub: `${rangeDays} day activity window` },
    { label: 'Projects', value: String(projects.length), sub: 'Projects in your workspace' },
    { label: 'Team Members', value: String(teamMembers.length), sub: 'Including pending invites' },
    { label: 'Error Rate', value: recentActivity.length ? `${Math.round((errorCount / recentActivity.length) * 100)}%` : '0%', sub: 'Based on tracked events' },
  ]

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const activityByDay = new Map<number, number>()
  for (const item of recentActivity) {
    const day = new Date(item.created_at).getDay()
    activityByDay.set(day, (activityByDay.get(day) || 0) + 1)
  }

  const maxActivity = Math.max(1, ...activityByDay.values(), recentActivity.length)
  chartBars.value = dayLabels.map((label, day) => {
    const total = activityByDay.get(day) || 0
    return {
      label,
      events: Math.max(8, Math.round((total / maxActivity) * 100)),
      sessions: Math.max(5, Math.round((total / maxActivity) * 70)),
    }
  })

  const authEvents = recentActivity.filter(item => item.event.startsWith('auth.') || item.event.includes('login') || item.event.includes('signup')).length
  const projectEvents = recentActivity.filter(item => item.event.startsWith('project.')).length
  const teamEvents = recentActivity.filter(item => item.event.startsWith('team.')).length
  const otherEvents = Math.max(0, recentActivity.length - authEvents - projectEvents - teamEvents)
  const totalUsage = Math.max(1, recentActivity.length)

  usageBreakdown.value = [
    { label: 'Authentication', pct: Math.round((authEvents / totalUsage) * 100), color: 'bg-brand-500' },
    { label: 'Projects', pct: Math.round((projectEvents / totalUsage) * 100), color: 'bg-blue-500' },
    { label: 'Team', pct: Math.round((teamEvents / totalUsage) * 100), color: 'bg-purple-500' },
    { label: 'Other', pct: Math.round((otherEvents / totalUsage) * 100), color: 'bg-yellow-500' },
  ]

  const eventCounts = recentActivity.reduce<Record<string, number>>((acc, item) => {
    acc[item.event] = (acc[item.event] || 0) + 1
    return acc
  }, {})

  const iconForEvent = (event: string) => {
    if (event.includes('login')) return 'heroicons:arrow-right-on-rectangle'
    if (event.includes('signup')) return 'heroicons:user-plus'
    if (event.includes('project')) return 'heroicons:folder'
    if (event.includes('team')) return 'heroicons:users'
    return 'heroicons:bolt'
  }

  topEvents.value = Object.entries(eventCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, icon: iconForEvent(name), count: String(count) }))
}

watch(selectedRange, async () => {
  await loadAnalytics()
}, { immediate: true })

watch(() => user.value?.id, async (id) => {
  if (!id) return
  await loadAnalytics()
})
</script>
