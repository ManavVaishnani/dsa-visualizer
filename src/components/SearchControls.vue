<script setup lang="ts">
import {
  arraySize,
  dataStructure,
  generateRandomArray,
  isPaused,
  isSearching,
  numbers,
  pause,
  resetState,
  resume,
  runBinarySearch,
  runLinearSearch,
  sortArray,
  speed,
  target,
} from '@/composables/useSearchController'
import { useRoute } from 'vue-router'

const route = useRoute()

const runSearch = () => {
  const path = route.path
  if (path.includes('binary-search')) {
    // Binary search requires sorted array
    if (dataStructure.value === 'array') {
      sortArray()
    }
    runBinarySearch()
  } else {
    runLinearSearch()
  }
}

const togglePause = () => {
  if (isPaused.value) {
    resume()
  } else {
    pause()
  }
}

const handleGenerate = () => {
  generateRandomArray(arraySize.value)
}
</script>

<template>
  <header
    class="relative z-30 flex flex-col gap-4 border-b-2 border-black bg-white px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-3"
  >
    <!-- Sliders and Inputs -->
    <div class="flex flex-wrap items-center justify-center gap-4 md:justify-start md:gap-6">
      <!-- Target Value -->
      <div class="flex flex-col font-mono">
        <label class="text-xs font-bold text-gray-500 uppercase">Target</label>
        <input
          type="number"
          v-model.number="target"
          class="mt-1 w-20 border-2 border-black bg-white px-2 py-1 font-mono text-sm text-black rounded-none shadow-[2px_2px_0_0_black] focus:outline-none md:w-24"
          :disabled="isSearching"
        />
      </div>

      <!-- Array Size -->
      <div class="flex flex-col font-mono">
        <label class="text-xs font-bold text-gray-500 uppercase">Size: {{ arraySize }}</label>
        <input
          type="range"
          min="5"
          max="20"
          v-model.number="arraySize"
          class="w-24 accent-black md:w-32"
          :disabled="isSearching"
        />
      </div>

      <!-- Speed -->
      <div class="flex flex-col font-mono">
        <label class="text-xs font-bold text-gray-500 uppercase">Speed</label>
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          v-model.number="speed"
          class="w-24 accent-black md:w-32"
        />
      </div>
    </div>

    <!-- Control Buttons -->
    <div class="flex flex-wrap items-center justify-center gap-2 md:gap-3">
      <button
        class="rounded-none border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="handleGenerate"
        :disabled="isSearching"
      >
        Generate
      </button>
      <button
        class="rounded-none border-2 border-black bg-black px-3 py-1.5 font-mono text-xs font-bold text-white uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="runSearch"
        :disabled="isSearching || target === null || numbers.length === 0"
      >
        Start
      </button>
      <button
        class="rounded-none border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="togglePause"
        :disabled="!isSearching"
      >
        {{ isPaused ? 'Resume' : 'Pause' }}
      </button>
      <button
        class="rounded-none border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-red-50 hover:text-red-600 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="resetState"
      >
        Reset
      </button>
    </div>
  </header>
</template>
