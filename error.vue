<template>
  <div class="min-h-screen bg-surface-950 flex items-center justify-center p-6">
    <div class="text-center max-w-md space-y-6 animate-fade-up">
      <!-- Icon -->
      <div class="w-20 h-20 rounded-3xl bg-surface-900 border border-surface-800 flex items-center justify-center mx-auto">
        <span class="text-4xl font-bold font-mono text-surface-600">{{ error?.statusCode || '?' }}</span>
      </div>

      <div class="space-y-2">
        <h1 class="text-2xl font-bold text-surface-50">
          {{ errorTitle }}
        </h1>
        <p class="text-surface-400 text-sm leading-relaxed">
          {{ error?.message || 'Something went wrong. Please try again.' }}
        </p>
      </div>

      <div class="flex items-center justify-center gap-3">
        <button class="btn-secondary" @click="handleError">
          <Icon name="heroicons:arrow-left" class="w-4 h-4" />
          Go Back
        </button>
        <NuxtLink to="/dashboard" class="btn-primary">
          <Icon name="heroicons:home" class="w-4 h-4" />
          Dashboard
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ error: { statusCode?: number; message?: string } | null }>()

const errorTitle = computed(() => {
  switch (props.error?.statusCode) {
    case 404: return 'Page not found'
    case 403: return 'Access denied'
    case 500: return 'Server error'
    default:  return 'Something went wrong'
  }
})

const handleError = () => clearError({ redirect: '/' })
</script>
