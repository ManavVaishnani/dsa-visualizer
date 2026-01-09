<script setup lang="ts">
import RetroCard from '@/components/RetroCard.vue'
import { useHead } from '@unhead/vue'
import { ArrowLeft, Search } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

useHead({
  title: 'Search Algorithms',
  meta: [
    {
      name: 'description',
      content:
        'Visualize and understand search algorithms including Linear Search and Binary Search.',
    },
  ],
})

const algorithms = [
  {
    title: 'Linear Search',
    href: '/visualize/linear-search',
    img: '/linear-search.svg',
    desc: 'Sequentially checks each element of the list.',
    complexity: 'O(N)',
  },
  {
    title: 'Binary Search',
    href: '/visualize/binary-search',
    img: '/binary-search.svg',
    desc: 'Efficient search algorithm that works on sorted arrays.',
    complexity: 'O(log N)',
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
          <Search class="h-8 w-8" />
          Search_Module
        </h1>
        <p class="mt-2 font-mono text-gray-600">
          > Initialize search algorithms and traversal visualizations.
        </p>
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
