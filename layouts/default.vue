<template>
  <div class="flex h-screen overflow-hidden bg-surface-950">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-surface-950 border-r border-surface-800 transition-transform duration-300 lg:relative lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-5 py-5 border-b border-surface-800">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0">
          <span class="text-white font-bold text-sm font-mono">N</span>
        </div>
        <span class="font-semibold text-surface-100 tracking-tight">NexusApp</span>
        <button
          class="ml-auto lg:hidden text-surface-400 hover:text-surface-200"
          @click="sidebarOpen = false"
        >
          <Icon name="heroicons:x-mark" class="w-5 h-5" />
        </button>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto p-3 space-y-1">
        <p class="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-surface-600">Main</p>
        <NuxtLink to="/dashboard" class="nav-item" active-class="nav-active">
          <Icon name="heroicons:squares-2x2" class="w-4.5 h-4.5" />
          Dashboard
        </NuxtLink>
        <NuxtLink to="/dashboard/analytics" class="nav-item" active-class="nav-active">
          <Icon name="heroicons:chart-bar" class="w-4.5 h-4.5" />
          Analytics
        </NuxtLink>

        <p class="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-surface-600">Account</p>
        <NuxtLink to="/dashboard/profile" class="nav-item" active-class="nav-active">
          <Icon name="heroicons:user-circle" class="w-4.5 h-4.5" />
          Profile
        </NuxtLink>
        <NuxtLink to="/dashboard/settings" class="nav-item" active-class="nav-active">
          <Icon name="heroicons:cog-6-tooth" class="w-4.5 h-4.5" />
          Settings
        </NuxtLink>
        <NuxtLink to="/dashboard/team" class="nav-item" active-class="nav-active">
          <Icon name="heroicons:users" class="w-4.5 h-4.5" />
          Team
        </NuxtLink>
      </nav>

      <!-- User bottom -->
      <div ref="menuRef" class="p-3 border-t border-surface-800">
        <div class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-800 cursor-pointer group transition-colors" @click="showUserMenu = !showUserMenu">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-surface-200 truncate">{{ userName }}</p>
            <p class="text-xs text-surface-500 truncate">{{ userEmail }}</p>
          </div>
          <Icon name="heroicons:ellipsis-horizontal" class="w-4 h-4 text-surface-500 group-hover:text-surface-300" />
        </div>

        <!-- User popup menu -->
        <Transition name="fade-up">
          <div v-if="showUserMenu" class="absolute bottom-16 left-3 right-3 card-elevated p-1.5 z-50">
            <NuxtLink to="/dashboard/profile" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-surface-300 hover:text-surface-100 hover:bg-surface-800 transition-colors" @click="showUserMenu = false">
              <Icon name="heroicons:user" class="w-4 h-4" />
              View Profile
            </NuxtLink>
            <NuxtLink to="/dashboard/settings" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-surface-300 hover:text-surface-100 hover:bg-surface-800 transition-colors" @click="showUserMenu = false">
              <Icon name="heroicons:cog-6-tooth" class="w-4 h-4" />
              Settings
            </NuxtLink>
            <div class="divider my-1.5" />
            <button class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors" @click="handleSignOut">
              <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </Transition>
      </div>
    </aside>

    <!-- Overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black/60 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top bar -->
      <header class="flex items-center gap-4 px-6 py-4 border-b border-surface-800 bg-surface-950/80 backdrop-blur-sm">
        <button
          class="lg:hidden text-surface-400 hover:text-surface-200"
          @click="sidebarOpen = true"
        >
          <Icon name="heroicons:bars-3" class="w-5 h-5" />
        </button>

        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm">
          <span class="text-surface-500">NexusApp</span>
          <Icon name="heroicons:chevron-right" class="w-3.5 h-3.5 text-surface-600" />
          <span class="text-surface-200 font-medium capitalize">{{ currentPage }}</span>
        </div>

        <div class="ml-auto flex items-center gap-3">
          <!-- Notifications -->
          <button class="relative p-2 rounded-xl text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors" @click="navigateTo('/dashboard/settings')">
            <Icon name="heroicons:bell" class="w-5 h-5" />
            <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-400" />
          </button>

          <!-- Avatar -->
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
            <NuxtLink to="/dashboard/profile">{{ userInitials }}</NuxtLink>
          </div>
        </div>
      </header>

      <!-- Page slot -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const sidebarOpen = ref(false)
const showUserMenu = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const currentPage = computed(() => {
  const path = route.path.split('/').filter(Boolean)
  return path[path.length - 1] || 'dashboard'
})

const userName = computed(() => {
  return user.value?.user_metadata?.full_name || user.value?.email?.split('@')[0] || 'User'
})

const userEmail = computed(() => user.value?.email || '')

const userInitials = computed(() => {
  const name = userName.value
  return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
})

const handleSignOut = async () => {
  showUserMenu.value = false
  await supabase.auth.signOut()
  navigateTo('/login')
}

const handleDocumentClick = (event: MouseEvent) => {
  if (!showUserMenu.value) return
  if (menuRef.value?.contains(event.target as Node)) return
  showUserMenu.value = false
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<style scoped>
.nav-item {
  @apply flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
         text-surface-400 hover:text-surface-100 hover:bg-surface-800
         transition-all duration-200 cursor-pointer;
}

.nav-active {
  @apply text-brand-400 bg-brand-500/10 !important;
}

.fade-up-enter-active, .fade-up-leave-active {
  transition: all 0.2s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
