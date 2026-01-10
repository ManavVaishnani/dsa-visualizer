<script setup lang="ts">
import TreeControls from '@/components/TreeControls.vue'
import TreeTraversalVisualizer from '@/components/TreeTraversalVisualizer.vue'
import { generateBinaryTree, setTreeInitialInfo } from '@/composables/useTreeController'
import AppLayout from '@/layouts/AppLayout.vue'
import { useHead } from '@unhead/vue'
import { onMounted } from 'vue'

const breadcrumbs = [
  { title: 'Home', href: '/' },
  { title: 'Trees', href: '/trees' },
  { title: 'Pre-Order Traversal' },
]

useHead({
  title: 'Pre-Order Tree Traversal',
  meta: [
    {
      name: 'description',
      content:
        'Interactive Pre-Order traversal visualization. Learn how Pre-Order traversal visits Node → Left → Right, useful for tree cloning and prefix expressions.',
    },
  ],
})

onMounted(() => {
  generateBinaryTree()
  setTreeInitialInfo('preorder')
})
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <template #controls>
      <TreeControls :algorithm="'preorder'" />
    </template>

    <div class="h-full w-full">
      <TreeTraversalVisualizer />
    </div>
  </AppLayout>
</template>
