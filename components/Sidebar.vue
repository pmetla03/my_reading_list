<template>
  <aside class="w-64 min-h-screen bg-gray-900 text-white shadow-lg">
    <nav class="flex flex-col gap-2 p-6">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
        active-class="bg-gray-800 text-white"
      >
        <UIcon :name="item.icon" class="w-5 h-5" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup>
const navItems = [
  { label: 'Dashboard', to: '/', icon: 'i-heroicons-home' },
  { label: 'Books', to: '/books', icon: 'i-heroicons-book-open' },
  { label: 'Add Book', to: '/books/add', icon: 'i-heroicons-plus-circle' },
  { label: 'Settings', to: '/settings', icon: 'i-heroicons-cog-6-tooth' }
]
</script>
