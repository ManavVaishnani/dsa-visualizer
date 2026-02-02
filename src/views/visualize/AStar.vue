<script setup lang="ts">
import GraphControls from '@/components/GraphControls.vue'
import GraphVisualizer from '@/components/GraphVisualizer.vue'
import { generateData, initAStar } from '@/composables/graph'
import AppLayout from '@/layouts/AppLayout.vue'
import { useHead } from '@unhead/vue'
import { onMounted } from 'vue'

const breadcrumbs = [
  { title: 'Home', href: '/' },
  { title: 'Graphs', href: '/graphs' },
  { title: 'A* Search' },
]

useHead({
  title: 'A* Search Algorithm',
  meta: [
    {
      name: 'description',
      content:
        'Interactive A* Search algorithm visualization. See how heuristics guide the shortest path finding process.',
    },
  ],
})

onMounted(() => {
  generateData()
  initAStar()
})
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <template #controls>
      <GraphControls :algorithm="'astar'" />
    </template>

    <div class="h-full w-full">
      <GraphVisualizer />
    </div>
  </AppLayout>
</template>
