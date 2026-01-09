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
  { title: 'Bubble Sort' },
]

useHead({
  title: 'Bubble Sort',
  meta: [
    {
      name: 'description',
      content:
        'Visualize how Bubble Sort works step-by-step. Understand the swapping mechanism and time complexity of this fundamental sorting algorithm.',
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
