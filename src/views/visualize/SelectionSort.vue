<script setup lang="ts">
import BarsVisualizer from '@/components/BarsVisualizer.vue'
import SortingControls from '@/components/SortingControls.vue'
import { generateBars } from '@/composables/useSortingController'
import AppLayout from '@/layouts/AppLayout.vue'
import { useHead } from '@unhead/vue'
import { onMounted } from 'vue'

const breadcrumbs = [
  { title: 'Home', href: '/' },
  { title: 'Sorting', href: '/sorting' },
  { title: 'Selection Sort' },
]

useHead({
  title: 'Selection Sort',
  meta: [
    {
      name: 'description',
      content:
        'Learn Selection Sort algorithm through interactive visualization. See how it repeatedly selects the smallest element from the unsorted portion.',
    },
  ],
})

onMounted(() => generateBars())
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <template #controls>
      <SortingControls />
    </template>
    <div class="flex h-full items-center justify-center">
      <BarsVisualizer />
    </div>
  </AppLayout>
</template>
