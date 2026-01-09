<script setup lang="ts">
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { computed } from 'vue'

interface BreadcrumbItemType {
  title: string // Unified standard
  label?: string // Fallback
  href?: string
}

const props = defineProps<{
  breadcrumbs?: BreadcrumbItemType[]
}>()

// Transform to {title, href} format
const transformedBreadcrumbs = computed(() => {
  if (!props.breadcrumbs) return []
  return props.breadcrumbs.map((item) => ({
    title: item.title || item.label || '',
    href: item.href,
  }))
})
</script>

<template>
  <div class="flex h-screen font-sans text-gray-900">
    <!-- Main Area -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Top Controls -->
      <slot name="controls" />

      <!-- Breadcrumbs -->
      <div
        v-if="transformedBreadcrumbs.length > 0"
        class="relative z-20 border-b-2 border-black bg-white px-4 py-3 font-mono md:px-6"
      >
        <Breadcrumbs :breadcrumbs="transformedBreadcrumbs" />
      </div>

      <!-- Content -->
      <main class="flex-1 overflow-hidden p-4 md:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
