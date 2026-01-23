<script setup lang="ts">
import CodeBlock from '@/components/CodeBlock.vue'
import AsciiMV from '@/components/home/AsciiMV.vue'
import NerdyHero from '@/components/home/NerdyHero.vue'
import RetroCard from '@/components/RetroCard.vue'
import { useHead } from '@unhead/vue'
import { ArrowRight, Binary, GitGraph, Search, TreePine, LayoutGrid, Layers } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

useHead({
  title: 'Home',
  meta: [
    {
      name: 'description',
      content:
        'Master Data Structures and Algorithms with interactive visualizations. Explore sorting checking, searching, and graph algorithms in a retro-styled interface.',
    },
  ],
})

// Use a simple code snippet for the demo
const sortCode = `function bubbleSort(arr) {
  for(let i = 0; i < arr.length; i++) {
    for(let j = 0; j < arr.length - i - 1; j++) {
      if(arr[j] > arr[j+1]) {
        swap(arr, j, j+1);
      }
    }
  }
}`
</script>

<template>
  <div
    class="relative flex min-h-screen items-center justify-center overflow-hidden p-4 font-sans text-gray-900 sm:p-8"
  >
    <!-- Main Grid -->
    <div
      class="relative z-10 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-3"
    >
      <!-- Cell 1: Hero (Large 2x2) -->
      <RetroCard class="flex flex-col md:col-span-2 md:row-span-2">
        <NerdyHero />
      </RetroCard>

      <!-- Cell 2: Sorting (1x2) -->
      <RetroCard class="group overflow-hidden bg-white md:col-span-1 md:row-span-2 flex flex-col">
        <div class="absolute top-0 right-0 p-4 font-mono text-6xl font-bold opacity-10 select-none">
          O(n)
        </div>

        <h2
          class="mb-4 flex items-center gap-2 border-b-2 border-black pb-2 font-mono text-xl font-bold"
        >
          <Binary class="h-5 w-5" />
          SORTING
        </h2>

        <p class="mb-4 font-mono text-sm text-gray-600">
          Visualizing comparison and non-comparison based sorting algorithms.
        </p>

        <!-- Mini Code Block -->
        <div class="text-[10px] leading-3 opacity-75">
          <CodeBlock :code="sortCode" />
        </div>

        <div class="mt-auto pt-4">
          <span class="inline-flex items-center gap-2 font-mono text-sm font-bold hover:underline">
            OPEN_MODULE <ArrowRight class="h-4 w-4" />
          </span>
        </div>

        <RouterLink to="/sorting" class="absolute inset-0" aria-label="Go to sorting"></RouterLink>
      </RetroCard>

      <!-- Cell 3: Search (1x1) -->
      <RetroCard variant="orange" class="flex flex-col justify-between md:col-span-1 md:row-span-1">
        <div class="flex items-start justify-between">
          <Search class="h-8 w-8" />
          <span class="border border-black px-1 font-mono text-xs font-bold">IDX:01</span>
        </div>

        <div>
          <h3 class="font-mono text-lg font-bold">SEARCH</h3>
          <div class="mt-2 flex gap-1">
            <span class="h-3 w-3 border border-black bg-white"></span>
            <span class="h-3 w-3 border border-black bg-black"></span>
            <span class="h-3 w-3 border border-black bg-white"></span>
            <span class="h-3 w-3 border border-black bg-white"></span>
          </div>
        </div>

        <RouterLink to="/searching" class="absolute inset-0" aria-label="Go to search"></RouterLink>
      </RetroCard>

      <!-- Cell 4: Graphs (1x1) -->
      <RetroCard class="bg-gray-50 md:col-span-1 md:row-span-1">
        <div class="mb-2 flex items-center justify-between">
          <h3 class="font-mono font-bold">GRAPHS</h3>
          <GitGraph class="h-5 w-5" />
        </div>

        <!-- Simple Graph SVG -->
        <svg viewBox="0 0 100 50" class="h-auto w-full border border-gray-300 bg-white p-2">
          <circle cx="20" cy="25" r="5" fill="black" />
          <circle cx="50" cy="10" r="5" fill="black" />
          <circle cx="50" cy="40" r="5" fill="white" stroke="black" stroke-width="2" />
          <circle cx="80" cy="25" r="5" fill="white" stroke="black" stroke-width="2" />
          <line x1="20" y1="25" x2="50" y2="10" stroke="black" stroke-width="2" />
          <line x1="20" y1="25" x2="50" y2="40" stroke="black" stroke-width="2" />
          <line x1="50" y1="10" x2="80" y2="25" stroke="black" stroke-width="2" />
        </svg>

        <div class="mt-2 font-mono text-xs text-gray-500">DFS / BFS / Dijkstra</div>
        <RouterLink to="/graphs" class="absolute inset-0" aria-label="Go to graphs"></RouterLink>
      </RetroCard>

      <!-- Cell 5: Trees (1x1) -->
      <RetroCard class="bg-gray-50 md:col-span-1 md:row-span-1">
        <div class="mb-2 flex items-center justify-between">
          <h3 class="font-mono font-bold">TREES</h3>
          <TreePine class="h-5 w-5" />
        </div>

        <!-- Simple Tree SVG -->
        <svg viewBox="0 0 100 50" class="h-auto w-full border border-gray-300 bg-white p-2">
          <line x1="50" y1="10" x2="30" y2="25" stroke="black" stroke-width="2" />
          <line x1="50" y1="10" x2="70" y2="25" stroke="black" stroke-width="2" />
          <line x1="30" y1="25" x2="20" y2="40" stroke="black" stroke-width="2" />
          <line x1="30" y1="25" x2="40" y2="40" stroke="black" stroke-width="2" />
          <circle cx="50" cy="10" r="5" fill="black" />
          <circle cx="30" cy="25" r="5" fill="white" stroke="black" stroke-width="2" />
          <circle cx="70" cy="25" r="5" fill="white" stroke="black" stroke-width="2" />
          <circle cx="20" cy="40" r="5" fill="white" stroke="black" stroke-width="2" />
          <circle cx="40" cy="40" r="5" fill="white" stroke="black" stroke-width="2" />
        </svg>

        <div class="mt-2 font-mono text-xs text-gray-500">InOrder / PreOrder / PostOrder</div>
        <RouterLink to="/trees" class="absolute inset-0" aria-label="Go to trees"></RouterLink>
      </RetroCard>

      <!-- Cell: Data Structures (1x1) -->
      <RetroCard class="bg-gray-50 md:col-span-1 md:row-span-1">
        <div class="mb-2 flex items-center justify-between">
          <h3 class="font-mono font-bold">DATA_STRUCT</h3>
          <Layers class="h-5 w-5" />
        </div>

        <!-- Simple Stack SVG -->
        <svg viewBox="0 0 100 50" class="h-auto w-full border border-gray-300 bg-white p-2">
          <rect x="25" y="35" width="50" height="10" fill="#e5e7eb" stroke="black" stroke-width="2" />
          <rect x="25" y="22" width="50" height="10" fill="#e5e7eb" stroke="black" stroke-width="2" />
          <rect x="25" y="9" width="50" height="10" fill="#60a5fa" stroke="black" stroke-width="2" />
          <text x="82" y="16" font-family="monospace" font-size="6" fill="#3b82f6">TOP</text>
        </svg>

        <div class="mt-2 font-mono text-xs text-gray-500">Stack / Queue / More</div>
        <RouterLink to="/data-structures" class="absolute inset-0" aria-label="Go to data structures"></RouterLink>
      </RetroCard>

      <!-- Cell 6: CTA / Stats (1x1) -->
      <RetroCard
        variant="green"
        class="group relative flex flex-col justify-between md:col-span-1 md:row-span-1"
      >
        <div class="flex items-start justify-between">
          <LayoutGrid class="h-8 w-8" />
          <div class="h-3 w-3 rounded-full bg-black animate-pulse"></div>
        </div>

        <div>
          <h3 class="font-mono text-lg font-bold">ALL_ALGOS</h3>
          <p class="font-mono text-[10px] text-black opacity-70 uppercase tracking-tighter">
            System Status: Ready
          </p>
        </div>

        <div
          class="inline-flex items-center gap-1 font-mono text-xs font-bold group-hover:underline"
        >
          VIEW_ALL <ArrowRight class="h-3 w-3" />
        </div>

        <RouterLink
          to="/algorithms"
          class="absolute inset-0"
          aria-label="Go to all algorithms"
        ></RouterLink>
      </RetroCard>

      <!-- Cell 7: Extra Info (1x1) -->
      <RetroCard
        class="flex flex-col items-center justify-center text-center md:col-span-1 md:row-span-1"
      >
        <AsciiMV />
      </RetroCard>

      <!-- Cell 8: GitHub (1x1) -->
      <RetroCard
        class="group flex flex-col items-center justify-center text-center md:col-span-1 md:row-span-1"
      >
        <img
          src="/github.svg"
          class="mb-2 h-16 w-16 transition-all group-hover:scale-110"
          alt="GitHub"
        />
        <div class="font-mono text font-bold tracking-widest uppercase">SOURCE_CODE</div>
        <a
          href="https://github.com/ManavVaishnani/dsa-visualizer"
          target="_blank"
          class="absolute inset-0"
          aria-label="View on GitHub"
        ></a>
      </RetroCard>
    </div>
  </div>
</template>

<style scoped>
/* Grid is handled by Tailwind classes */
</style>
