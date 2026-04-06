<template>
  <div class="min-h-screen bg-surface-950 flex">
    <!-- Left visual panel -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-surface-900 to-surface-950 border-r border-surface-800">
      <!-- Grid pattern -->
      <div class="absolute inset-0 opacity-10"
        style="background-image: linear-gradient(rgba(20,184,166,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.3) 1px, transparent 1px); background-size: 40px 40px;"
      />

      <!-- Glow orbs -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl" />
      <div class="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-brand-400/5 blur-3xl" />

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-between p-12 w-full">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <span class="text-white font-bold text-lg font-mono">N</span>
          </div>
          <span class="font-semibold text-xl text-surface-100 tracking-tight">NexusApp</span>
        </div>

        <!-- Central message -->
        <div class="space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-slow" />
            <span class="text-xs text-brand-400 font-medium">Full Stack Platform</span>
          </div>
          <h1 class="text-4xl font-bold text-surface-50 leading-tight">
            Your workspace,<br />
            <span class="text-gradient">supercharged.</span>
          </h1>
          <p class="text-surface-400 text-lg leading-relaxed max-w-sm">
            Built with Nuxt, Tailwind, and Supabase. Secure authentication, real-time data, ready to scale.
          </p>

          <!-- Feature list -->
          <div class="space-y-3 pt-2">
            <div v-for="feature in features" :key="feature" class="flex items-center gap-3">
              <div class="w-5 h-5 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
                <Icon name="heroicons:check" class="w-3 h-3 text-brand-400" />
              </div>
              <span class="text-sm text-surface-400">{{ feature }}</span>
            </div>
          </div>
        </div>

        <!-- Bottom stats -->
        <div class="flex gap-8">
          <div>
            <p class="text-2xl font-bold text-surface-100 font-mono">99.9%</p>
            <p class="text-xs text-surface-500 mt-0.5">Uptime SLA</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-100 font-mono">&lt;50ms</p>
            <p class="text-xs text-surface-500 mt-0.5">Response time</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-100 font-mono">E2E</p>
            <p class="text-xs text-surface-500 mt-0.5">Encryption</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right auth panel -->
    <div class="flex-1 flex items-center justify-center p-6 lg:p-12">
      <div class="w-full max-w-md">
        <!-- Mobile logo -->
        <div class="flex items-center gap-3 mb-8 lg:hidden">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <span class="text-white font-bold font-mono">N</span>
          </div>
          <span class="font-semibold text-lg text-surface-100">NexusApp</span>
        </div>

        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const features = [
  'Email & Social OAuth authentication',
  'Real-time database with Supabase',
  'Role-based access control',
  'Responsive dashboard & analytics',
]
</script>
