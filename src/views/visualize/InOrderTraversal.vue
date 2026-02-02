<script setup lang="ts">
import TreeControls from '@/components/TreeControls.vue'
import TreeTraversalVisualizer from '@/components/TreeTraversalVisualizer.vue'
import { generateBinaryTree, initInOrder } from '@/composables/tree'
import AppLayout from '@/layouts/AppLayout.vue'
import { useHead } from '@unhead/vue'
import { onMounted } from 'vue'

const breadcrumbs = [
  { title: 'Home', href: '/' },
  { title: 'Trees', href: '/trees' },
  { title: 'In-Order Traversal' },
]

useHead({
  title: 'In-Order Tree Traversal',
  meta: [
    {
      name: 'description',
      content:
        'Interactive In-Order traversal visualization. Learn how In-Order traversal visits Left → Node → Right to produce sorted output for BSTs.',
    },
  ],
})

onMounted(() => {
  generateBinaryTree()
  initInOrder()
})
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <template #controls>
      <TreeControls :algorithm="'inorder'" />
    </template>

    <div class="h-full w-full">
      <TreeTraversalVisualizer />
    </div>
  </AppLayout>
</template>
