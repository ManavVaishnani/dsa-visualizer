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
  { title: 'Insertion Sort' },
]

useHead({
  title: 'Insertion Sort',
  meta: [
    {
      name: 'description',
      content:
        'Understand Insertion Sort with step-by-step visualization. Watch how it builds the final sorted array one item at a time.',
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
