/**
 * Simple toast notification system
 * Usage: const { toast } = useToast()
 *        toast.success('Saved!') / toast.error('Failed') / toast.info('Note')
 */

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const add = (type: ToastType, message: string, duration = 4000) => {
    const id = Math.random().toString(36).slice(2)
    toasts.value.push({ id, type, message, duration })
    setTimeout(() => remove(id), duration)
  }

  const remove = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts: readonly(toasts),
    remove,
    toast: {
      success: (msg: string, d?: number) => add('success', msg, d),
      error:   (msg: string, d?: number) => add('error',   msg, d),
      info:    (msg: string, d?: number) => add('info',    msg, d),
      warning: (msg: string, d?: number) => add('warning', msg, d),
    },
  }
}
