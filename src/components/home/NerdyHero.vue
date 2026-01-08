<script setup lang="ts">
import { Terminal } from 'lucide-vue-next'

const steps = [
  { label: 'Input', value: '[3, 1, 4, 1, 5]' },
  { label: 'Process', value: 'QuickSort(arr)' },
  { label: 'Output', value: '[1, 1, 3, 4, 5]' },
]
</script>

<template>
  <div class="flex h-full flex-col justify-between">
    <!-- Header / Terminal Bar -->
    <div class="mb-4 flex items-center justify-between border-b-2 border-black pb-4">
      <div class="flex items-center gap-2">
        <Terminal class="h-5 w-5" />
        <span class="font-mono font-bold">~/algoflow</span>
      </div>
      <div class="bg-black px-2 py-0.5 font-mono text-xs text-white">v2.0.0</div>
    </div>

    <!-- Content -->
    <div class="space-y-6">
      <div class="space-y-2">
        <h1 class="font-mono text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
          ALGORITHM<br />VISUALIZER
        </h1>
        <p
          class="border-l-4 border-gray-300 py-1 pl-3 font-mono text-gray-600 text-sm sm:text-base"
        >
          > Interactive visualizations for <br />
          > data structures and algorithms.
        </p>
      </div>

      <!-- Schematic Diagram -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-2 text-center font-mono text-xs">
        <div v-for="(step, i) in steps" :key="i" class="group relative">
          <div
            class="relative z-10 border-2 border-black bg-white p-2 transition-transform group-hover:-translate-y-1"
          >
            <div
              class="p-b-1 mb-1 border-b border-black text-[10px] font-bold text-gray-500 uppercase"
            >
              {{ step.label }}
            </div>
            <div>{{ step.value }}</div>
          </div>
          <!-- Connector Line (Pseudo) - Horizontal for Desktop, Vertical for Mobile -->
          <div
            v-if="i < steps.length - 1"
            class="absolute left-1/2 -bottom-4 z-0 h-4 w-0.5 bg-black md:top-1/2 md:-right-3 md:bottom-auto md:left-auto md:h-0.5 md:w-4"
          ></div>
        </div>
      </div>
    </div>

    <!-- Decoration -->
    <div
      class="mt-4 flex justify-between border-t-2 border-dashed border-gray-300 pt-4 font-mono text-xs text-gray-400"
    >
      <span>CPU: 12%</span>
      <span>MEM: 512MB</span>
      <span>UPTIME: 24h</span>
    </div>
  </div>
</template>
