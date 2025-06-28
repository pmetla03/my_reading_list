<script setup>
import { watch, onMounted } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'success', // 'success' | 'error' | 'info' | 'warning'
  },
  message: {
    type: String,
    required: true,
  },
  show: {
    type: Boolean,
    default: true,
  }
})

const emit = defineEmits(['update:show'])

const alertColors = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900',
    border: 'border-green-400',
    text: 'text-green-700 dark:text-green-300',
    icon: 'i-heroicons-check-circle',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900',
    border: 'border-red-400',
    text: 'text-red-700 dark:text-red-300',
    icon: 'i-heroicons-x-circle',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900',
    border: 'border-blue-400',
    text: 'text-blue-700 dark:text-blue-300',
    icon: 'i-heroicons-information-circle',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900',
    border: 'border-yellow-400',
    text: 'text-yellow-700 dark:text-yellow-300',
    icon: 'i-heroicons-exclamation-triangle',
  }
}

// Auto-hide after 2 seconds when shown
watch(
  () => props.show,
  (val) => {
    if (val) {
      setTimeout(() => {
        emit('update:show', false)
      }, 1000)
    }
  }
)
</script>

<template>
  <div
    v-if="show"
    :class="[
      'flex items-center p-4 rounded-md border',
      alertColors[type].bg,
      alertColors[type].border,
      alertColors[type].text,
    ]"
    role="alert"
  >
    <UIcon :name="alertColors[type].icon" class="w-6 h-6 mr-3" />
    <span class="flex-1 text-sm font-medium">{{ message }}</span>
  </div>
</template>
