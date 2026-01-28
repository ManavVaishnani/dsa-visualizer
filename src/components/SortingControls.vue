<script setup lang="ts">
/**
 * SortingControls Component (SOLID Refactored)
 *
 * Open/Closed Principle: Uses algorithm registry instead of if/else chains.
 * Adding a new algorithm now requires NO changes to this component.
 */
import {
  barCount,
  generateBars,
  isPaused,
  isSorting,
  speed,
  togglePause,
  runSortingAlgorithm,
} from '@/composables/sorting'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

/**
 * Extract algorithm key from route path dynamically
 * This replaces the if/else chain with a simple path extraction
 */
const algorithmKey = computed(() => {
  const path = route.path
  // Extract the last segment of the path (e.g., '/visualize/bubble-sort' -> 'bubble-sort')
  const segments = path.split('/')
  return segments[segments.length - 1] || 'bubble-sort'
})

/**
 * Run the current algorithm using the registry
 * No if/else needed - the registry handles algorithm lookup
 */
const runSort = () => {
  runSortingAlgorithm(algorithmKey.value)
}

const pause = () => {
  togglePause()
}
</script>

<template>
  <header
    class="relative z-30 flex flex-col gap-4 border-b-2 border-black bg-white px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-3"
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
        class="rounded-none border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="generateBars"
      >
        Generate
      </button>
      <button
        class="rounded-none border-2 border-black bg-black px-3 py-1.5 font-mono text-xs font-bold text-white uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="runSort"
        :disabled="isSorting"
      >
        Start
      </button>
      <button
        class="rounded-none border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="pause"
      >
        {{ isPaused ? 'Resume' : 'Pause' }}
      </button>
      <button
        class="rounded-none border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-red-50 hover:text-red-600 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="generateBars"
      >
        Reset
      </button>
    </div>
  </header>
</template>
