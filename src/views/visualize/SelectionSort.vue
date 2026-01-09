<script setup lang="ts">
import BarsVisualizer from '@/components/BarsVisualizer.vue'
import SortingControls from '@/components/SortingControls.vue'
import { generateBars, setInitialInfo } from '@/composables/useSortingController'
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
        'Watch Selection Sort in action. Visualize how the algorithm finds the minimum element and places it at the correct position.',
    },
  ],
})

onMounted(() => {
  generateBars()
  setInitialInfo('selection')
})
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
