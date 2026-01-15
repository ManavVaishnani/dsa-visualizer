<script setup lang="ts">
import {
  currentEdge,
  currentNode,
  dfsCallStack,
  edgeExploredCount,
  edges,
  isTraversing,
  nodes,
  queue,
  selectedStartNode,
  selectedTargetNode,
  targetFound,
  explanation,
  visitedCount,
  visitedNodes,
} from '@/composables/useGraphController'
import AlgorithmExplanation from './AlgorithmExplanation.vue'

const getNodeColor = (nodeId: number) => {
  if (currentNode.value === nodeId) return '#f59e0b' // Orange
  if (visitedNodes.value.includes(nodeId)) return '#10b981' // Green
  if (queue.value.includes(nodeId)) return '#6366f1' // Indigo
  if (selectedTargetNode.value === nodeId) return '#ef4444' // Red 500 for Target
  if (selectedStartNode.value === nodeId) return '#22c55e' // Green 400 for Start
  return '#ffffff' // White default
}

const isEdgeActive = (from: number, to: number) => {
  if (!currentEdge.value) return false
  return (
    (currentEdge.value.from === from && currentEdge.value.to === to) ||
    (currentEdge.value.from === to && currentEdge.value.to === from)
  )
}

const getEdgeColor = (from: number, to: number) => {
  if (isEdgeActive(from, to)) return '#f59e0b' // Orange - active
  if (visitedNodes.value.includes(from) && visitedNodes.value.includes(to)) {
    return '#10b981' // Green - both nodes visited
  }
  return '#000000' // Black - default
}

// Calculate the edge endpoint position (shortened to stop at node radius)
const calculateEdgeEndpoint = (
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  nodeRadius = 30,
) => {
  const dx = toX - fromX
  const dy = toY - fromY
  const angle = Math.atan2(dy, dx)
  return {
    x: toX - nodeRadius * Math.cos(angle),
    y: toY - nodeRadius * Math.sin(angle),
  }
}

// Node selection logic
const handleNodeClick = (nodeId: number) => {
  if (isTraversing.value) return

  if (selectedStartNode.value === null) {
    selectedStartNode.value = nodeId
  } else if (selectedTargetNode.value === null && selectedStartNode.value !== nodeId) {
    selectedTargetNode.value = nodeId
  } else if (selectedStartNode.value === nodeId) {
    // Deselect start (and target if set)
    selectedStartNode.value = null
    selectedTargetNode.value = null
  } else if (selectedTargetNode.value === nodeId) {
    // Deselect target
    selectedTargetNode.value = null
  }
}

// Auto-dismiss target found message
import { watch } from 'vue'
watch(targetFound, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      targetFound.value = false
    }, 5000)
  }
})
</script>

<template>
  <div class="relative h-full w-full overflow-hidden border-2 border-black">
    <AlgorithmExplanation :explanation="explanation" />
    <svg class="h-full w-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
      <!-- Draw edges first (so they appear behind nodes) -->
      <line
        v-for="(edge, index) in edges"
        :key="'edge-' + index"
        :x1="nodes[edge.from]?.x"
        :y1="nodes[edge.from]?.y"
        :x2="
          calculateEdgeEndpoint(
            nodes[edge.from]?.x,
            nodes[edge.from]?.y,
            nodes[edge.to]?.x,
            nodes[edge.to]?.y,
          ).x
        "
        :y2="
          calculateEdgeEndpoint(
            nodes[edge.from]?.x,
            nodes[edge.from]?.y,
            nodes[edge.to]?.x,
            nodes[edge.to]?.y,
          ).y
        "
        :stroke="getEdgeColor(edge.from, edge.to)"
        :stroke-width="isEdgeActive(edge.from, edge.to) ? 4 : 2"
        class="transition-all duration-300"
      />

      <!-- Draw nodes -->
      <g v-for="node in nodes" :key="node.id" class="transition-all duration-500">
        <circle
          :cx="node.x"
          :cy="node.y"
          :r="30"
          :fill="getNodeColor(node.id)"
          stroke="black"
          stroke-width="2"
          class="cursor-pointer opacity-100 transition-all duration-300"
          :class="{
            'ring-4 ring-[#22c55e] border-black': selectedStartNode === node.id,
            'ring-4 ring-[#ef4444] border-black': selectedTargetNode === node.id,
            'animate-pulse': currentNode === node.id,
          }"
          @click="handleNodeClick(node.id)"
        />

        <text
          :x="node.x"
          :y="node.y"
          text-anchor="middle"
          dominant-baseline="middle"
          class="font-mono text-xl font-bold select-none"
          fill="black"
        >
          {{ node.label }}
        </text>

        <!-- Label for Root node -->
        <text
          v-if="node.id === 0"
          :x="node.x"
          :y="node.y - 45"
          text-anchor="middle"
          class="font-mono text-xs font-bold tracking-wider uppercase"
          fill="black"
        >
          Root
        </text>
      </g>
    </svg>

    <!-- Queue/Stack and other UI components -->
    <!-- Queue Display -->
    <div
      v-if="queue.length > 0"
      class="absolute bottom-4 left-4 z-10 w-auto max-w-[calc(100%-150px)] overflow-x-auto border-2 border-black bg-white px-4 py-2 shadow-[4px_4px_0_0_black] md:left-1/2 md:-translate-x-1/2 md:px-6 md:py-3"
    >
      <div class="text-center font-mono text-[10px] font-bold text-gray-500 uppercase md:text-sm">
        Queue
      </div>
      <div class="mt-2 flex justify-center gap-2">
        <div
          v-for="nodeId in queue"
          :key="nodeId"
          class="flex size-7 shrink-0 items-center justify-center border border-black bg-[#6366f1] text-[10px] font-bold text-white md:size-10 md:text-sm"
        >
          {{ nodes[nodeId]?.label }}
        </div>
      </div>
    </div>

    <!-- DFS Call Stack -->
    <div
      v-if="dfsCallStack.length > 0"
      class="absolute bottom-4 left-4 z-20 w-24 border-2 border-black bg-white p-2 shadow-[4px_4px_0_0_black] md:left-auto md:right-4 md:w-48 md:p-4"
    >
      <div class="mb-2 font-mono text-[10px] font-bold text-black uppercase md:text-sm">
        DFS Stack
      </div>

      <div class="flex flex-col-reverse gap-1 md:gap-2">
        <div
          v-for="nodeId in dfsCallStack"
          :key="nodeId"
          class="flex items-center justify-center border border-black bg-[#8b5cf6] px-1 py-0.5 text-[10px] font-bold text-white transition-all md:px-3 md:py-1 md:text-sm"
          :class="{
            'ring-2 ring-black': nodeId === dfsCallStack[dfsCallStack.length - 1],
          }"
        >
          {{ nodes[nodeId]?.label }}
        </div>
      </div>

      <div class="mt-1 text-center font-mono text-[8px] text-gray-500 md:mt-2 md:text-xs">
        Top ↑
      </div>
    </div>
    <!-- Selection Overlay -->
    <div
      v-if="
        !isTraversing && !targetFound && (selectedStartNode === null || selectedTargetNode === null)
      "
      class="absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded-none border-2 border-black bg-white px-4 py-2 font-mono text-sm font-bold text-black shadow-[5px_5px_0px_0px_black]"
    >
      {{ selectedStartNode === null ? 'SELECT_START_NODE' : 'SELECT_TARGET_NODE' }}
    </div>

    <!-- Success Message Overlay -->
    <div
      v-if="targetFound"
      class="absolute top-4 left-1/2 z-50 -translate-x-1/2 animate-bounce rounded-none border-2 border-black bg-[#10b981] px-4 py-2 font-mono text-sm font-black text-white shadow-[4px_4px_0_0_black] md:px-6 md:py-3 md:text-lg md:shadow-[5px_5px_0_0_black]"
    >
      TARGET_REACHED: {{ nodes[selectedTargetNode!]?.label }}
    </div>

    <!-- Top-Left Overlay (Metrics) -->
    <div
      v-if="visitedCount > 0"
      class="absolute top-4 left-4 z-20 w-48 border-2 border-black bg-white p-3 font-mono text-[10px] shadow-[5px_5px_0px_0px_black] transition-all duration-300 md:top-6 md:left-6 md:w-60 md:p-4 md:text-sm"
    >
      <div class="mb-2 font-bold text-black uppercase">Metrics (Tree)</div>

      <div class="space-y-1.5 md:space-y-2">
        <div class="flex justify-between">
          <span class="text-gray-500">VISITED:</span>
          <span class="font-bold text-black"> {{ visitedCount }}/{{ nodes.length }} </span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-500">EDGES:</span>
          <span class="font-bold text-black"> {{ edgeExploredCount }}/{{ edges.length }} </span>
        </div>

        <div
          class="mt-1 flex justify-between border-t-2 border-dashed border-gray-300 pt-1 md:mt-2 md:pt-2"
        >
          <span class="text-gray-500">TIME:</span>
          <span class="font-bold text-[#10b981]">O(N)</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">SPACE:</span>
          <span class="font-bold text-[#3b82f6]">O(H)</span>
        </div>
      </div>
    </div>

    <!-- Bottom-Left Overlay (Legend) -->
    <div
      class="absolute bottom-4 left-4 z-20 hidden border-2 border-black bg-white p-4 font-mono text-sm shadow-[5px_5px_0px_0px_black] transition-all duration-300 md:bottom-6 md:left-6 lg:block"
    >
      <div class="mb-2 font-bold text-black uppercase">Tree Legend</div>
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <div class="size-4 border border-black bg-[#22c55e]"></div>
          <span class="text-xs text-gray-600 uppercase">Start</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="size-4 border border-black bg-[#ef4444]"></div>
          <span class="text-xs text-gray-600 uppercase">Target</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="size-4 border border-black bg-[#6366f1]"></div>
          <span class="text-xs text-gray-600 uppercase">Queued</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="size-4 border border-black bg-[#f59e0b]"></div>
          <span class="text-xs text-gray-600 uppercase">Active</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="size-4 border border-black bg-[#10b981]"></div>
          <span class="text-xs text-gray-600 uppercase">Done</span>
        </div>
      </div>
    </div>
  </div>
</template>
