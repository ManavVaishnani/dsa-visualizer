<script setup lang="ts">
import RetroCard from '@/components/RetroCard.vue'
import { useHead } from '@unhead/vue'
import { ArrowLeft, TreePine } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

useHead({
  title: 'Tree Algorithms',
  meta: [
    {
      name: 'description',
      content:
        'Explore tree data structures with interactive visualizations for In-Order, Pre-Order, and Post-Order traversals.',
    },
  ],
})

const algorithms = [
  {
    title: 'In-Order Traversal',
    href: '/visualize/inorder-traversal',
    img: '/inorder-traversal.svg',
    desc: 'Visits nodes in Left → Node → Right order. Produces sorted output for BST.',
    complexity: 'O(N)',
    order: 'L-N-R',
  },
  {
    title: 'Pre-Order Traversal',
    href: '/visualize/preorder-traversal',
    img: '/preorder-traversal.svg',
    desc: 'Visits nodes in Node → Left → Right order. Used for tree cloning.',
    complexity: 'O(N)',
    order: 'N-L-R',
  },
  {
    title: 'Post-Order Traversal',
    href: '/visualize/postorder-traversal',
    img: '/postorder-traversal.svg',
    desc: 'Visits nodes in Left → Right → Node order. Used for tree deletion.',
    complexity: 'O(N)',
    order: 'L-R-N',
  },
]
</script>

<template>
  <div class="min-h-screen px-6 py-8 font-sans text-gray-900">
    <div class="mx-auto max-w-6xl">
      <RouterLink
        to="/"
        class="mb-4 inline-flex items-center gap-2 font-mono text-sm font-bold hover:underline"
      >
        <ArrowLeft class="h-4 w-4" /> BACK_TO_ROOT
      </RouterLink>

      <div class="mb-8 border-b-2 border-black pb-4">
        <h1 class="flex items-center gap-3 font-mono text-3xl font-black uppercase">
          <TreePine class="h-8 w-8" />
          Tree_Module
        </h1>
        <p class="mt-2 font-mono text-gray-600">
          > Initialize tree traversal and data structure visualizations.
        </p>
      </div>

      <!-- Tree Info Section -->
      <div class="mb-8 border-2 border-black bg-gray-50 p-6 shadow-[4px_4px_0_0_black]">
        <h2 class="mb-3 font-mono text-lg font-bold uppercase">About Tree Data Structures</h2>
        <p class="mb-4 font-mono text-sm text-gray-700 leading-relaxed">
          A <strong>Tree</strong> is a non-linear, hierarchical data structure consisting of nodes connected by edges.
          The top node is called the <strong>root</strong>. Each node can have child nodes, and nodes with the same
          parent are called <strong>siblings</strong>. Nodes without children are called <strong>leaves</strong>.
        </p>
        <div class="grid gap-4 md:grid-cols-3">
          <div class="border border-black bg-white p-3">
            <div class="font-mono text-xs font-bold text-gray-500 uppercase">Applications</div>
            <div class="mt-1 font-mono text-sm">Databases, File Systems, HTML DOM</div>
          </div>
          <div class="border border-black bg-white p-3">
            <div class="font-mono text-xs font-bold text-gray-500 uppercase">Time Complexity</div>
            <div class="mt-1 font-mono text-sm">Traversals: O(N)</div>
          </div>
          <div class="border border-black bg-white p-3">
            <div class="font-mono text-xs font-bold text-gray-500 uppercase">Space Complexity</div>
            <div class="mt-1 font-mono text-sm">O(H) where H = height</div>
          </div>
        </div>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="algo in algorithms" :key="algo.href">
          <RetroCard
            class="h-full overflow-hidden p-0 transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
          >
            <RouterLink :to="algo.href" class="group flex h-full flex-col">
              <div
                class="flex h-40 items-center justify-center border-b-2 border-black bg-gray-100 p-4 transition-colors group-hover:bg-gray-200"
              >
                <img
                  class="h-24 w-auto object-contain opacity-80 mix-blend-multiply transition-opacity group-hover:opacity-100"
                  :src="algo.img"
                  :alt="algo.title"
                />
              </div>
              <div class="flex flex-1 flex-col bg-white p-4">
                <h5 class="font-mono text-xl font-bold tracking-tight group-hover:underline">
                  {{ algo.title }}
                </h5>
                <p class="mt-1 line-clamp-2 font-mono text-xs text-gray-500">
                  {{ algo.desc }}
                </p>
                <div class="mt-auto flex gap-2 pt-4">
                  <span class="border border-black px-1 font-mono text-[10px] uppercase">{{
                    algo.complexity
                  }}</span>
                  <span class="border border-black bg-[#8b5cf6] px-1 font-mono text-[10px] text-white uppercase">{{
                    algo.order
                  }}</span>
                  <span
                    class="border border-black bg-black px-1 font-mono text-[10px] text-white uppercase"
                    >Visualizer</span
                  >
                </div>
              </div>
            </RouterLink>
          </RetroCard>
        </div>
      </div>
    </div>
  </div>
</template>
