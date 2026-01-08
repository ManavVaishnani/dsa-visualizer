<script setup lang="ts">
import {
  barCount,
  bubbleSort,
  generateBars,
  insertionSort,
  isPaused,
  isSorting,
  mergeSort,
  quickSort,
  selectionSort,
  speed,
} from '@/composables/useSortingController'

const pause = () => {
  isPaused.value = !isPaused.value
}

import { useRoute } from 'vue-router'

const route = useRoute()

const runSort = () => {
  const path = route.path
  if (path.includes('selection-sort')) {
    selectionSort()
  } else if (path.includes('insertion-sort')) {
    insertionSort()
  } else if (path.includes('merge-sort')) {
    mergeSort()
  } else if (path.includes('quick-sort')) {
    quickSort()
  } else {
    bubbleSort()
  }
}
</script>

<template>
  <header
    class="flex flex-col gap-4 border-b-2 border-black bg-white px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-3"
  >
    <!-- Sliders -->
    <div class="flex flex-wrap items-center justify-center gap-4 md:justify-start md:gap-6">
      <div class="flex flex-col font-mono">
        <label class="text-xs font-bold text-gray-500 uppercase">Bars: {{ barCount }}</label>
        <input type="range" min="10" max="100" v-model="barCount" class="w-32 accent-black" />
      </div>

      <div class="flex flex-col font-mono">
        <label class="text-xs font-bold text-gray-500 uppercase">Speed</label>
        <input type="range" min="1" max="100" v-model="speed" class="w-32 accent-black" />
      </div>
    </div>

    <!-- Controls -->
    <div class="flex flex-wrap items-center justify-center gap-2 md:gap-3">
      <button
        class="border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none active:translate-x-0.5 active:translate-y-0.5"
        @click="generateBars"
      >
        Generate
      </button>
      <button
        class="border-2 border-black bg-black px-3 py-1.5 font-mono text-xs font-bold text-white uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        @click="runSort"
        :disabled="isSorting"
      >
        Start
      </button>
      <button
        class="border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none active:translate-x-0.5 active:translate-y-0.5"
        @click="pause"
      >
        {{ isPaused ? 'Resume' : 'Pause' }}
      </button>
      <button
        class="border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-px hover:translate-y-px hover:bg-red-50 hover:text-red-600 hover:shadow-none active:translate-x-0.5 active:translate-y-0.5"
        @click="generateBars"
      >
        Reset
      </button>
    </div>
  </header>
</template>
