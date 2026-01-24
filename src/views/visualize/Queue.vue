<script setup lang="ts">
import QueueVisualizer from '@/components/QueueVisualizer.vue'
import QueueControls from '@/components/QueueControls.vue'
import { generateRandomQueue, setInitialInfo } from '@/composables/useQueueController'
import AppLayout from '@/layouts/AppLayout.vue'
import { useHead } from '@unhead/vue'
import { onMounted } from 'vue'

const breadcrumbs = [
  { title: 'Home', href: '/' },
  { title: 'Data Structures', href: '/data-structures' },
  { title: 'Queue' },
]

useHead({
  title: 'Queue Visualization',
  meta: [
    {
      name: 'description',
      content:
        'Visualize Queue data structure with interactive enqueue, dequeue, and peek operations. Understand FIFO (First In First Out) principle.',
    },
  ],
})

onMounted(() => {
  generateRandomQueue()
  setInitialInfo()
})
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <template #controls>
      <QueueControls />
    </template>
    <div class="flex h-full items-center justify-center bg-gray-50">
      <QueueVisualizer />
    </div>
  </AppLayout>
</template>
