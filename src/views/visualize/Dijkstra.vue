<script setup lang="ts">
import GraphControls from '@/components/GraphControls.vue'
import GraphVisualizer from '@/components/GraphVisualizer.vue'
import { generateData, initDijkstra } from '@/composables/graph'
import AppLayout from '@/layouts/AppLayout.vue'
import { useHead } from '@unhead/vue'
import { onMounted } from 'vue'

const breadcrumbs = [
  { title: 'Home', href: '/' },
  { title: 'Graphs', href: '/graphs' },
  { title: 'Dijkstra' },
]

useHead({
  title: "Dijkstra's Algorithm",
  meta: [
    {
      name: 'description',
      content:
        "Interactive Dijkstra's algorithm visualization. Learn how finding the shortest path works in weighted graphs.",
    },
  ],
})

onMounted(() => {
  generateData()
  initDijkstra()
})
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <template #controls>
      <GraphControls :algorithm="'dijkstra'" />
    </template>

    <div class="h-full w-full">
      <GraphVisualizer />
    </div>
  </AppLayout>
</template>
