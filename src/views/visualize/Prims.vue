<script setup lang="ts">
import GraphControls from '@/components/GraphControls.vue'
import GraphVisualizer from '@/components/GraphVisualizer.vue'
import { generateData, initPrims } from '@/composables/graph'
import AppLayout from '@/layouts/AppLayout.vue'
import { useHead } from '@unhead/vue'
import { onMounted } from 'vue'

const breadcrumbs = [
  { title: 'Home', href: '/' },
  { title: 'Graphs', href: '/graphs' },
  { title: 'Prim\'s Algorithm' },
]

useHead({
  title: "Prim's Algorithm",
  meta: [
    {
      name: 'description',
      content:
        "Interactive Prim's algorithm visualization. Learn how finding the minimum spanning tree works in weighted undirected graphs.",
    },
  ],
})

onMounted(() => {
  generateData()
  initPrims()
})
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <template #controls>
      <GraphControls :algorithm="'prims'" />
    </template>

    <div class="h-full w-full">
      <GraphVisualizer />
    </div>
  </AppLayout>
</template>
