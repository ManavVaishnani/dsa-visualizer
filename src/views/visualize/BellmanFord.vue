<script setup lang="ts">
import GraphControls from '@/components/GraphControls.vue'
import GraphVisualizer from '@/components/GraphVisualizer.vue'
import { generateData, initBellmanFord } from '@/composables/graph'
import AppLayout from '@/layouts/AppLayout.vue'
import { useHead } from '@unhead/vue'
import { onMounted } from 'vue'

const breadcrumbs = [
  { title: 'Home', href: '/' },
  { title: 'Graphs', href: '/graphs' },
  { title: 'Bellman-Ford' },
]

useHead({
  title: 'Bellman-Ford Algorithm',
  meta: [
    {
      name: 'description',
      content:
        'Interactive Bellman-Ford algorithm visualization. Learn how to find shortest paths with negative edge weights and detect negative cycles.',
    },
  ],
})

onMounted(() => {
  generateData()
  initBellmanFord()
})
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <template #controls>
      <GraphControls :algorithm="'bellmanford'" />
    </template>

    <div class="h-full w-full">
      <GraphVisualizer />
    </div>
  </AppLayout>
</template>
