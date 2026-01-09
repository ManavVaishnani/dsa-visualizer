<script setup lang="ts">
import RetroCard from '@/components/RetroCard.vue'
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'

useHead({
  title: 'All Algorithms',
  meta: [
    {
      name: 'description',
      content:
        'Browse our comprehensive collection of data structure and algorithm visualizations including sorting, searching, and graph algorithms.',
    },
  ],
})

const algorithms = [
  {
    title: 'Linear Search',
    href: '/visualize/linear-search',
    img: '/linear-search.svg',
  },
  {
    title: 'Binary Search',
    href: '/visualize/binary-search',
    img: '/binary-search.svg',
  },
  {
    title: 'Bubble Sort',
    href: '/visualize/bubble-sort',
    img: '/bubble-sort.svg',
  },
  {
    title: 'Selection Sort',
    href: '/visualize/selection-sort',
    img: '/selection-sort.svg',
  },
  {
    title: 'Insertion Sort',
    href: '/visualize/insertion-sort',
    img: '/insertion-sort.svg',
  },
  {
    title: 'Merge Sort',
    href: '/visualize/merge-sort',
    img: '/merge-sort.svg',
  },
  {
    title: 'Quick Sort',
    href: '/visualize/quick-sort',
    img: '/quick-sort.svg',
  },
  {
    title: 'BFS',
    href: '/visualize/bfs',
    img: '/bfs.svg',
  },
  {
    title: 'DFS',
    href: '/visualize/dfs',
    img: '/dfs.svg',
  },
]
</script>

<template>
  <div class="min-h-screen px-6 py-8 font-sans text-gray-900">
    <div class="mx-auto max-w-6xl">
      <h1 class="mb-6 border-b-2 border-black pb-4 text-center font-mono text-3xl font-bold">
        Available Algorithms
      </h1>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="algo in algorithms" :key="algo.href">
          <RetroCard
            class="h-full overflow-hidden p-0 transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
          >
            <RouterLink :to="algo.href" class="group flex h-full flex-col">
              <div
                class="flex h-44 items-center justify-center border-b-2 border-black bg-gray-100 p-4 transition-colors group-hover:bg-gray-200"
              >
                <!-- Using img as before, or we could replace with icons/code later -->
                <img
                  class="h-32 w-auto object-contain opacity-80 mix-blend-multiply transition-opacity group-hover:opacity-100"
                  :src="algo.img"
                  :alt="algo.title"
                />
              </div>
              <div class="flex flex-1 flex-col bg-white p-4">
                <h5 class="font-mono text-xl font-bold tracking-tight group-hover:underline">
                  {{ algo.title }}
                </h5>
                <div class="mt-auto flex gap-2 pt-4">
                  <span class="border border-black px-1 font-mono text-[10px] uppercase"
                    >Visualizer</span
                  >
                  <span
                    class="border border-black bg-black px-1 font-mono text-[10px] text-white uppercase"
                    >Live</span
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

<style scoped>
/* Use Abel font imported in Head */
.rounded-base {
  border-radius: 12px;
}
.shadow-xs {
  box-shadow: 0 1px 3px rgba(2, 6, 23, 0.2);
}
.border-default {
  border-color: #334155;
}
</style>
