<script setup lang="ts">
import GraphControls from '@/components/GraphControls.vue'
import GraphVisualizer from '@/components/GraphVisualizer.vue'
import TreeVisualizer from '@/components/TreeVisualizer.vue'
import { generateData, visualizationType } from '@/composables/useGraphController'
import AppLayout from '@/layouts/AppLayout.vue'
import { useHead } from '@unhead/vue'
import { onMounted } from 'vue'

const breadcrumbs = [
  { title: 'Home', href: '/' },
  { title: 'Graphs', href: '/graphs' },
  { title: 'DFS' },
]

useHead({
  title: 'Depth First Search (DFS)',
  meta: [
    {
      name: 'description',
      content:
        'Interactive DFS visualization. Learn how Depth First Search explores as far as possible along each branch.',
    },
  ],
})

onMounted(() => generateData())
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <template #controls>
      <GraphControls :algorithm="'dfs'" />
    </template>

    <div class="h-full w-full">
      <GraphVisualizer v-if="visualizationType === 'graph'" />
      <TreeVisualizer v-else />
    </div>
  </AppLayout>
</template>
