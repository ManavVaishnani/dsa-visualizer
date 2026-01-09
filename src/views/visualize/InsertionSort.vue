```
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
  { title: 'Insertion Sort' },
]

useHead({
  title: 'Insertion Sort',
  meta: [
    {
      name: 'description',
      content:
        'Visualize Insertion Sort. Understand how it builds a sorted array one element at a time and why it is efficient for small datasets.',
    },
  ],
})

onMounted(() => {
  generateBars()
  setInitialInfo('insertion')
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
