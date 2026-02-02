<script setup lang="ts">
import RetroSelect from '@/components/ui/RetroSelect.vue'
import {
  generateData,
  graphType,
  isPaused,
  isTraversing,
  nextStep,
  nodes,
  prepareBFSSteps,
  prepareDFSSteps,
  prepareDijkstraSteps,
  prepareAStarSteps,
  preparePrimsSteps,
  prepareKruskalsSteps,
  prepareBellmanFordSteps,
  previousStep,
  resetGraph,
  runBFS,
  runDFS,
  runDijkstra,
  runAStar,
  runPrims,
  runKruskals,
  runBellmanFord,
  selectedStartNode,
  speed,
  stepIndex,
  steps,
  visualizationType,
} from '@/composables/graph'

interface Props {
  algorithm: 'bfs' | 'dfs' | 'dijkstra' | 'astar' | 'prims' | 'kruskals' | 'bellmanford'
}

const props = defineProps<Props>()

const startTraversal = () => {
  if (props.algorithm === 'bfs') {
    runBFS()
  } else if (props.algorithm === 'dfs') {
    runDFS()
  } else if (props.algorithm === 'dijkstra') {
    runDijkstra()
  } else if (props.algorithm === 'astar') {
    runAStar()
  } else if (props.algorithm === 'prims') {
    runPrims()
  } else if (props.algorithm === 'kruskals') {
    runKruskals()
  } else if (props.algorithm === 'bellmanford') {
    runBellmanFord()
  }
}

const prepareSteps = () => {
  if (props.algorithm === 'bfs') prepareBFSSteps()
  else if (props.algorithm === 'dfs') prepareDFSSteps()
  else if (props.algorithm === 'dijkstra') prepareDijkstraSteps()
  else if (props.algorithm === 'astar') prepareAStarSteps()
  else if (props.algorithm === 'prims') preparePrimsSteps()
  else if (props.algorithm === 'kruskals') prepareKruskalsSteps()
  else if (props.algorithm === 'bellmanford') prepareBellmanFordSteps()
}

const pause = () => {
  isPaused.value = !isPaused.value
}

import { computed } from 'vue'

const vizOptions = computed(() => {
  if (
    props.algorithm === 'dijkstra' ||
    props.algorithm === 'astar' ||
    props.algorithm === 'prims' ||
    props.algorithm === 'kruskals' ||
    props.algorithm === 'bellmanford'
  ) {
    return [{ label: 'Graph', value: 'graph' }]
  }
  return [
    { label: 'Graph', value: 'graph' },
    { label: 'Tree', value: 'tree' },
  ]
})

const graphOptions = [
  { label: 'Undirected', value: 'undirected' },
  { label: 'Directed', value: 'directed' },
]
</script>

<template>
  <header
    class="relative z-30 flex flex-col gap-4 border-b-2 border-black bg-white px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-3"
  >
    <!-- Speed Control -->
    <div class="flex items-center justify-center gap-6 md:justify-start">
      <div class="flex flex-col font-mono">
        <label class="text-xs font-bold text-gray-500 uppercase">Speed</label>
        <input type="range" min="1" max="100" v-model="speed" class="w-32 accent-black" />
      </div>
    </div>

    <!-- Controls -->
    <div class="flex flex-wrap items-center justify-center gap-2 md:gap-3">
      <RetroSelect
        v-model="visualizationType"
        :options="vizOptions"
        @change="generateData"
        class="w-auto min-w-25"
      />
      <RetroSelect
        v-if="visualizationType === 'graph'"
        v-model="graphType"
        :options="graphOptions"
        @change="generateData"
        class="w-auto min-w-30"
      />
      <button
        class="rounded-none border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="generateData"
        :disabled="isTraversing"
      >
        Generate
      </button>
      <button
        class="rounded-none border-2 border-black bg-black px-3 py-1.5 font-mono text-xs font-bold text-white uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="startTraversal"
        :disabled="isTraversing || nodes.length === 0 || (props.algorithm !== 'kruskals' && selectedStartNode === null)"
      >
        Start {{ props.algorithm.toUpperCase() }}
      </button>

      <button
        class="rounded-none border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="pause"
        :disabled="!isTraversing"
      >
        {{ isPaused ? 'Resume' : 'Pause' }}
      </button>
      <button
        class="rounded-none border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-red-50 hover:text-red-600 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="resetGraph"
        :disabled="isTraversing"
      >
        Reset
      </button>

      <!-- Step controls -->
      <button
        class="rounded-none border-2 border-black bg-gray-100 px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="prepareSteps"
        :disabled="isTraversing || nodes.length === 0 || (props.algorithm !== 'kruskals' && selectedStartNode === null)"
      >
        Prepare Steps
      </button>

      <div class="flex items-center gap-1 font-mono md:gap-2">
        <button
          class="border border-black bg-white px-2 py-1 text-xs font-bold text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none disabled:opacity-50"
          @click="previousStep"
          :disabled="steps.length === 0 || stepIndex <= 0"
        >
          &laquo; Prev
        </button>
        <button
          class="border border-black bg-white px-2 py-1 text-xs font-bold text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none disabled:opacity-50"
          @click="nextStep"
          :disabled="steps.length === 0 || stepIndex >= steps.length - 1"
        >
          Next &raquo;
        </button>
        <div class="text-[10px] font-bold text-gray-500 md:text-xs text-center min-w-10">
          {{ stepIndex + 1 }}/{{ steps.length }}
        </div>
      </div>
    </div>
  </header>
</template>
