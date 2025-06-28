<template>
  <div class="flex h-screen bg-gray-100 text-gray-900">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200">
      <AppSidebar />
    </aside>

    <!-- Main content -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 shadow-sm">
        <CommonHeader />
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-6">
        <UContainer class="max-w-7xl mx-auto">
          <NuxtPage />
        </UContainer>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 px-4 py-2 text-sm text-gray-500">
        <AppFooter />
      </footer>
    </div>
  </div>
</template>

<script setup>
// Import layout components (make sure paths are correct)
import AppSidebar from '~/components/Sidebar.vue'
import CommonHeader from '~/components/Header.vue'
import AppFooter from '~/components/Footer.vue'
</script>
