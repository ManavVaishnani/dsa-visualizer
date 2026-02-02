<script setup lang="ts">
import TreeControls from '@/components/TreeControls.vue'
import TreeTraversalVisualizer from '@/components/TreeTraversalVisualizer.vue'
import { generateBinaryTree, initPostOrder } from '@/composables/tree'
import AppLayout from '@/layouts/AppLayout.vue'
import { useHead } from '@unhead/vue'
import { onMounted } from 'vue'

const breadcrumbs = [
  { title: 'Home', href: '/' },
  { title: 'Trees', href: '/trees' },
  { title: 'Post-Order Traversal' },
]

useHead({
  title: 'Post-Order Tree Traversal',
  meta: [
    {
      name: 'description',
      content:
        'Interactive Post-Order traversal visualization. Learn how Post-Order traversal visits Left → Right → Node, useful for tree deletion and postfix expressions.',
    },
  ],
})

onMounted(() => {
  generateBinaryTree()
  initPostOrder()
})
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <template #controls>
      <TreeControls :algorithm="'postorder'" />
    </template>

    <div class="h-full w-full">
      <TreeTraversalVisualizer />
    </div>
  </AppLayout>
</template>
