<script setup lang="ts">
import GraphControls from '@/components/GraphControls.vue'
import GraphVisualizer from '@/components/GraphVisualizer.vue'
import TreeVisualizer from '@/components/TreeVisualizer.vue'
import { generateData, setInitialInfo, visualizationType } from '@/composables/useGraphController'
import AppLayout from '@/layouts/AppLayout.vue'
import { useHead } from '@unhead/vue'
import { onMounted } from 'vue'

const breadcrumbs = [
  { title: 'Home', href: '/' },
  { title: 'Graphs', href: '/graphs' },
  { title: 'BFS' },
]

useHead({
  title: 'Breadth First Search (BFS)',
  meta: [
    {
      name: 'description',
      content:
        'Interactive BFS visualization. Learn how Breadth First Search explores nodes layer by layer.',
    },
  ],
})

onMounted(() => {
  generateData()
  setInitialInfo('bfs')
})
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <template #controls>
      <GraphControls :algorithm="'bfs'" />
    </template>

    <div class="h-full w-full">
      <GraphVisualizer v-if="visualizationType === 'graph'" />
      <TreeVisualizer v-else />
    </div>
  </AppLayout>
</template>
