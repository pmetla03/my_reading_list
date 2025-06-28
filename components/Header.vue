<script setup>
const items = [
  {
    label: 'Docs',
    to: '/docs',
    icon: 'i-heroicons-document-text'
  },
  {
    label: 'Components',
    to: '/components',
    icon: 'i-heroicons-cube'
  }
]
</script>
<template>
  <header class="custom-header">
    <!-- Left-aligned items -->
    <div class="header-left">
      <Logo />
      
    </div>

    <!-- Right-aligned items -->
    <div class="header-right">
      <button class="dark-mode-btn">
       <UChip inset>
    <UAvatar
      src="https://github.com/benjamincanac.png"
      alt="Benjamin Canac"
    />
  </UChip>
      </button>
      <UButton
        icon="i-heroicons-arrow-top-right-on-square"
        aria-label="GitHub"
        class="github-btn"
      />
    </div>
  </header>
</template>