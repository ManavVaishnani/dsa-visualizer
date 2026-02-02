<script setup lang="ts">
import {
  currentTreeNode,
  currentTreeEdge,
  callStack,
  treeEdgeExploredCount,
  treeEdges,
  treeNodes,
  treeExplanation,
  treeVisitedCount,
  visitedTreeNodes,
  traversalResult,
} from '@/composables/tree'
import AlgorithmExplanation from './AlgorithmExplanation.vue'

const getNodeColor = (nodeId: number) => {
  if (currentTreeNode.value === nodeId) return '#f59e0b' // Orange - current
  if (visitedTreeNodes.value.includes(nodeId)) return '#10b981' // Green - visited
  if (callStack.value.includes(nodeId)) return '#8b5cf6' // Purple - in stack
  return '#ffffff' // White default
}

const isEdgeActive = (from: number, to: number) => {
  if (!currentTreeEdge.value) return false
  return (
    (currentTreeEdge.value.from === from && currentTreeEdge.value.to === to) ||
    (currentTreeEdge.value.from === to && currentTreeEdge.value.to === from)
  )
}

const getEdgeColor = (from: number, to: number) => {
  if (isEdgeActive(from, to)) return '#f59e0b' // Orange - active
  if (visitedTreeNodes.value.includes(from) && visitedTreeNodes.value.includes(to)) {
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
  nodeRadius = 28,
) => {
  const dx = toX - fromX
  const dy = toY - fromY
  const angle = Math.atan2(dy, dx)
  return {
    x: toX - nodeRadius * Math.cos(angle),
    y: toY - nodeRadius * Math.sin(angle),
  }
}

const calculateEdgeStart = (
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  nodeRadius = 28,
) => {
  const dx = toX - fromX
  const dy = toY - fromY
  const angle = Math.atan2(dy, dx)
  return {
    x: fromX + nodeRadius * Math.cos(angle),
    y: fromY + nodeRadius * Math.sin(angle),
  }
}
</script>

<template>
  <div class="relative h-full w-full overflow-hidden border-2 border-black">
    <AlgorithmExplanation :explanation="treeExplanation" />
    <svg class="h-full w-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
      <!-- Draw edges first (so they appear behind nodes) -->
      <line
        v-for="(edge, index) in treeEdges"
        :key="'edge-' + index"
        :x1="
          calculateEdgeStart(
            treeNodes[edge.from]?.x,
            treeNodes[edge.from]?.y,
            treeNodes[edge.to]?.x,
            treeNodes[edge.to]?.y,
          ).x
        "
        :y1="
          calculateEdgeStart(
            treeNodes[edge.from]?.x,
            treeNodes[edge.from]?.y,
            treeNodes[edge.to]?.x,
            treeNodes[edge.to]?.y,
          ).y
        "
        :x2="
          calculateEdgeEndpoint(
            treeNodes[edge.from]?.x,
            treeNodes[edge.from]?.y,
            treeNodes[edge.to]?.x,
            treeNodes[edge.to]?.y,
          ).x
        "
        :y2="
          calculateEdgeEndpoint(
            treeNodes[edge.from]?.x,
            treeNodes[edge.from]?.y,
            treeNodes[edge.to]?.x,
            treeNodes[edge.to]?.y,
          ).y
        "
        :stroke="getEdgeColor(edge.from, edge.to)"
        :stroke-width="isEdgeActive(edge.from, edge.to) ? 4 : 2"
        class="transition-all duration-300"
      />

      <!-- Draw nodes -->
      <g v-for="node in treeNodes" :key="node.id" class="transition-all duration-500">
        <circle
          :cx="node.x"
          :cy="node.y"
          :r="28"
          :fill="getNodeColor(node.id)"
          stroke="black"
          stroke-width="2"
          class="cursor-pointer opacity-100 transition-all duration-300"
          :class="{
            'animate-pulse': currentTreeNode === node.id,
          }"
        />

        <text
          :x="node.x"
          :y="node.y"
          text-anchor="middle"
          dominant-baseline="middle"
          class="font-mono text-lg font-bold select-none"
          fill="black"
        >
          {{ node.label }}
        </text>

        <!-- Label for Root node -->
        <text
          v-if="node.id === 0"
          :x="node.x"
          :y="node.y - 42"
          text-anchor="middle"
          class="font-mono text-xs font-bold tracking-wider uppercase"
          fill="black"
        >
          Root
        </text>

        <!-- Left/Right indicator for children -->
        <text
          v-if="node.parent !== null"
          :x="node.x"
          :y="node.y + 42"
          text-anchor="middle"
          class="font-mono text-[10px] text-gray-500"
        >
          {{ treeNodes[node.parent]?.left === node.id ? 'L' : 'R' }}
        </text>
      </g>
    </svg>

    <!-- Traversal Result Display - Pushed higher on mobile to avoid Log button -->
    <div
      v-if="traversalResult.length > 0"
      class="absolute bottom-20 left-1/2 z-10 w-auto max-w-[95%] -translate-x-1/2 overflow-x-auto border-2 border-black bg-white px-2 py-1 shadow-[4px_4px_0_0_black] transition-all md:bottom-4 md:px-6 md:py-3"
    >
      <div class="text-center font-mono text-[8px] font-bold text-gray-400 uppercase md:text-sm">
        Result
      </div>
      <div class="mt-1 flex justify-center gap-1 md:mt-2 md:gap-2">
        <div
          v-for="(value, index) in traversalResult"
          :key="index"
          class="flex size-6 shrink-0 items-center justify-center border border-black bg-[#10b981] text-[9px] font-bold text-white transition-all md:size-10 md:text-sm"
        >
          {{ value }}
        </div>
      </div>
    </div>

    <!-- Call Stack (Top-Right) -->
    <div
      v-if="callStack.length > 0"
      class="absolute top-4 right-4 z-20 w-16 border-2 border-black bg-white p-1.5 shadow-[3px_3px_0_0_black] md:top-20 md:w-48 md:p-4 md:shadow-[4px_4px_0_0_black]"
    >
      <div
        class="mb-1 hidden font-mono text-[9px] font-bold text-black uppercase md:block md:text-sm"
      >
        Call Stack
      </div>

      <div class="flex flex-col-reverse gap-0.5 md:gap-2">
        <div
          v-for="nodeId in callStack"
          :key="nodeId"
          class="flex items-center justify-center border border-black bg-[#8b5cf6] px-0.5 py-0.5 text-[8px] font-bold text-white transition-all md:px-3 md:py-1 md:text-sm"
          :class="{
            'ring-1 ring-black font-black scale-105 md:ring-2':
              nodeId === callStack[callStack.length - 1],
          }"
        >
          {{ treeNodes[nodeId]?.label }}
        </div>
      </div>
    </div>

    <!-- Top-Left Overlay (Metrics) -->
    <div
      v-if="treeVisitedCount > 0"
      class="absolute top-4 left-4 z-20 w-32 border-2 border-black bg-white p-1.5 font-mono text-[8px] shadow-[3px_3px_0px_0px_black] transition-all duration-300 md:top-6 md:left-6 md:w-60 md:p-4 md:text-sm md:shadow-[5px_5px_0px_0px_black]"
    >
      <div class="space-y-0.5 md:space-y-2">
        <div class="flex justify-between">
          <span class="text-gray-400">V:</span>
          <span class="font-bold text-black"> {{ treeVisitedCount }}/{{ treeNodes.length }} </span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-400">E:</span>
          <span class="font-bold text-black">
            {{ treeEdgeExploredCount }}/{{ treeEdges.length }}
          </span>
        </div>

        <div
          class="mt-0.5 flex justify-between border-t border-dashed border-gray-300 pt-0.5 md:mt-2 md:border-t-2 md:pt-2"
        >
          <span class="font-bold text-[#10b981]">O(N)</span>
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
          <div class="size-4 rounded-full border border-black bg-white"></div>
          <span class="text-xs text-gray-600 uppercase">Unvisited</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="size-4 rounded-full border border-black bg-[#8b5cf6]"></div>
          <span class="text-xs text-gray-600 uppercase">In Stack</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="size-4 rounded-full border border-black bg-[#f59e0b]"></div>
          <span class="text-xs text-gray-600 uppercase">Current</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="size-4 rounded-full border border-black bg-[#10b981]"></div>
          <span class="text-xs text-gray-600 uppercase">Visited</span>
        </div>
      </div>
    </div>
  </div>
</template>
