<script setup lang="ts">
import GraphControls from '@/components/GraphControls.vue'
import GraphVisualizer from '@/components/GraphVisualizer.vue'
import TreeVisualizer from '@/components/TreeVisualizer.vue'
import { generateData, visualizationType } from '@/composables/useGraphController'
import AppLayout from '@/layouts/AppLayout.vue'
import { useTitle } from '@vueuse/core'
import { onMounted } from 'vue'

const breadcrumbs = [
  { title: 'Home', href: '/' },
  { title: 'Graphs', href: '/graphs' },
  { title: 'BFS' },
]

useTitle('BFS Visualization')

onMounted(() => generateData())
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
