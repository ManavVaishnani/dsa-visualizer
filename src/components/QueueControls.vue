<script setup lang="ts">
import {
  enqueue,
  dequeue,
  peek,
  clearQueue,
  generateRandomQueue,
  speed,
  maxSize,
  isAnimating,
  isPaused,
  queue,
} from '@/composables/useQueueController'
import { ref } from 'vue'

const inputValue = ref<string>('')

const handleEnqueue = (): void => {
  const value = parseInt(inputValue.value)
  if (!isNaN(value)) {
    enqueue(value)
    inputValue.value = ''
  }
}

const handleDequeue = (): void => {
  dequeue()
}

const handlePeek = (): void => {
  peek()
}

const togglePause = (): void => {
  isPaused.value = !isPaused.value
}
</script>

<template>
  <header
    class="relative z-30 flex flex-col gap-4 border-b-2 border-black bg-white px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-3"
  >
    <!-- Left Controls: Enqueue Input -->
    <div class="flex flex-wrap items-center justify-center gap-3 md:justify-start">
      <!-- Enqueue Input -->
      <div class="flex items-center gap-2">
        <input
          v-model="inputValue"
          type="number"
          placeholder="Value"
          class="w-20 border-2 border-black px-2 py-1.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black"
          :disabled="isAnimating"
          @keyup.enter="handleEnqueue"
        />
        <button
          class="rounded-none border-2 border-black bg-green-400 px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
          @click="handleEnqueue"
          :disabled="isAnimating || !inputValue"
        >
          Enqueue
        </button>
      </div>

      <!-- Sliders -->
      <div class="flex flex-col font-mono">
        <label class="text-xs font-bold text-gray-500 uppercase">Max Size: {{ maxSize }}</label>
        <input
          type="range"
          min="5"
          max="12"
          v-model="maxSize"
          class="w-24 accent-black"
          :disabled="queue.length > 0"
        />
      </div>

      <div class="flex flex-col font-mono">
        <label class="text-xs font-bold text-gray-500 uppercase">Speed</label>
        <input type="range" min="1" max="100" v-model="speed" class="w-24 accent-black" />
      </div>
    </div>

    <!-- Right Controls: Operations -->
    <div class="flex flex-wrap items-center justify-center gap-2 md:gap-3">
      <button
        class="rounded-none border-2 border-black bg-red-400 px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="handleDequeue"
        :disabled="isAnimating || queue.length === 0"
      >
        Dequeue
      </button>
      <button
        class="rounded-none border-2 border-black bg-amber-400 px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="handlePeek"
        :disabled="isAnimating || queue.length === 0"
      >
        Peek
      </button>
      <button
        class="rounded-none border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="togglePause"
        :disabled="!isAnimating"
      >
        {{ isPaused ? 'Resume' : 'Pause' }}
      </button>
      <button
        class="rounded-none border-2 border-black bg-blue-400 px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="generateRandomQueue"
        :disabled="isAnimating"
      >
        Random
      </button>
      <button
        class="rounded-none border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-red-50 hover:text-red-600 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="clearQueue"
        :disabled="isAnimating"
      >
        Clear
      </button>
    </div>
  </header>
</template>
