<script setup lang="ts">
import StackVisualizer from '@/components/StackVisualizer.vue'
import StackControls from '@/components/StackControls.vue'
import { generateRandomStack, setInitialInfo } from '@/composables/useStackController'
import AppLayout from '@/layouts/AppLayout.vue'
import { useHead } from '@unhead/vue'
import { onMounted } from 'vue'

const breadcrumbs = [
  { title: 'Home', href: '/' },
  { title: 'Data Structures', href: '/data-structures' },
  { title: 'Stack' },
]

useHead({
  title: 'Stack Visualization',
  meta: [
    {
      name: 'description',
      content:
        'Visualize Stack data structure with interactive push, pop, and peek operations. Understand LIFO (Last In First Out) principle.',
    },
  ],
})

onMounted(() => {
  generateRandomStack()
  setInitialInfo()
})
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <template #controls>
      <StackControls />
    </template>
    <div class="flex h-full items-center justify-center">
      <StackVisualizer />
    </div>
  </AppLayout>
</template>
