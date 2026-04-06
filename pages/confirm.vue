<template>
  <div class="min-h-screen bg-surface-950 flex items-center justify-center">
    <div class="text-center space-y-4 max-w-sm px-6">
      <div class="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto">
        <Icon name="heroicons:arrow-path" class="w-6 h-6 text-brand-400 animate-spin" />
      </div>
      <p class="text-surface-400 text-sm">{{ message }}</p>
      <p v-if="error" class="text-sm text-red-400">{{ error }}</p>
      <NuxtLink
        v-if="error"
        to="/login"
        class="inline-flex items-center justify-center text-sm text-brand-400 hover:text-brand-300 transition-colors"
      >
        Back to login
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const user = useSupabaseUser()
const router = useRouter()
const route = useRoute()

const message = ref('Completing sign in...')
const error = ref('')

watch(user, async (currentUser) => {
  if (currentUser) {
    await router.replace('/dashboard')
  }
}, { immediate: true })

onMounted(() => {
  const errorDescription = route.query.error_description
  const errorCode = route.query.error_code

  if (typeof errorDescription === 'string' && errorDescription.length > 0) {
    error.value = decodeURIComponent(errorDescription.replace(/\+/g, ' '))
    message.value = 'We could not complete your sign in.'
    return
  }

  if (typeof errorCode === 'string' && errorCode.length > 0) {
    error.value = `OAuth sign in failed (${errorCode}).`
    message.value = 'We could not complete your sign in.'
    return
  }

  window.setTimeout(() => {
    if (!user.value && !error.value) {
      error.value = 'The sign-in session did not finish. Please try Google or GitHub again.'
      message.value = 'We could not confirm your account.'
    }
  }, 5000)
})
</script>
