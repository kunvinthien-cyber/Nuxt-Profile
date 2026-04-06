<template>
  <Teleport to="body">
    <div class="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-xl border max-w-sm w-full"
          :class="toastClass(t.type)"
        >
          <Icon :name="toastIcon(t.type)" class="w-4.5 h-4.5 mt-0.5 flex-shrink-0" :class="toastIconColor(t.type)" />
          <p class="text-sm text-surface-200 flex-1 leading-relaxed">{{ t.message }}</p>
          <button
            class="text-surface-500 hover:text-surface-300 transition-colors flex-shrink-0"
            @click="remove(t.id)"
          >
            <Icon name="heroicons:x-mark" class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { ToastType } from '~/composables/useToast'

const { toasts, remove } = useToast()

const toastClass = (type: ToastType) => ({
  success: 'bg-surface-900 border-green-500/25',
  error:   'bg-surface-900 border-red-500/25',
  info:    'bg-surface-900 border-brand-500/25',
  warning: 'bg-surface-900 border-yellow-500/25',
}[type])

const toastIcon = (type: ToastType) => ({
  success: 'heroicons:check-circle',
  error:   'heroicons:exclamation-circle',
  info:    'heroicons:information-circle',
  warning: 'heroicons:exclamation-triangle',
}[type])

const toastIconColor = (type: ToastType) => ({
  success: 'text-green-400',
  error:   'text-red-400',
  info:    'text-brand-400',
  warning: 'text-yellow-400',
}[type])
</script>

<style scoped>
.toast-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateX(24px) scale(0.95); }
.toast-leave-to   { opacity: 0; transform: translateX(24px) scale(0.95); }
.toast-move       { transition: transform 0.3s ease; }
</style>
