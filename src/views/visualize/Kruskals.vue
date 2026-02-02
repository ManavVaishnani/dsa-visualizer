<script setup lang="ts">
import GraphControls from '@/components/GraphControls.vue'
import GraphVisualizer from '@/components/GraphVisualizer.vue'
import { generateData, initKruskals } from '@/composables/graph'
import AppLayout from '@/layouts/AppLayout.vue'
import { useHead } from '@unhead/vue'
import { onMounted } from 'vue'

const breadcrumbs = [
  { title: 'Home', href: '/' },
  { title: 'Graphs', href: '/graphs' },
  { title: 'Kruskal\'s Algorithm' },
]

useHead({
  title: "Kruskal's Algorithm",
  meta: [
    {
      name: 'description',
      content:
        "Interactive Kruskal's algorithm visualization. Learn how finding the minimum spanning tree works by sorting edges and avoiding circuits.",
    },
  ],
})

onMounted(() => {
  generateData()
  initKruskals()
})
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <template #controls>
      <GraphControls :algorithm="'kruskals'" />
    </template>

    <div class="h-full w-full">
      <GraphVisualizer />
    </div>
  </AppLayout>
</template>
