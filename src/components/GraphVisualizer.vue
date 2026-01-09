<script setup lang="ts">
import {
  currentEdge,
  currentNode,
  dfsCallStack,
  edgeExploredCount,
  edges,
  graphType,
  isTraversing,
  nodes,
  queue,
  selectedStartNode,
  visitedCount,
  visitedNodes,
} from '@/composables/useGraphController'

const getNodeColor = (nodeId: number) => {
  if (currentNode.value === nodeId) return '#f59e0b' // Orange
  if (visitedNodes.value.includes(nodeId)) return '#10b981' // Green
  if (queue.value.includes(nodeId)) return '#6366f1' // Indigo
  if (selectedStartNode.value === nodeId) return '#22c55e' // Green 400
  return '#ffffff' // White default (with border)
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
</script>

<template>
  <div class="relative h-full w-full overflow-hidden border-2 border-black">
    <svg class="h-full w-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
      <!-- Define arrow markers for directed edges -->
      <defs>
        <marker
          id="arrowhead-gray"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 10 3, 0 6" fill="#000000" />
        </marker>
        <marker
          id="arrowhead-green"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 10 3, 0 6" fill="#10b981" />
        </marker>
        <marker
          id="arrowhead-orange"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 10 3, 0 6" fill="#f59e0b" />
        </marker>
      </defs>

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
        :marker-end="
          graphType === 'directed'
            ? isEdgeActive(edge.from, edge.to)
              ? 'url(#arrowhead-orange)'
              : visitedNodes.includes(edge.from) && visitedNodes.includes(edge.to)
                ? 'url(#arrowhead-green)'
                : 'url(#arrowhead-gray)'
            : undefined
        "
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
            'border-0 ring-4 ring-[#22c55e]': selectedStartNode === node.id,
            'animate-pulse': currentNode === node.id,
          }"
          @click="!isTraversing && (selectedStartNode = node.id)"
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
      </g>
    </svg>

    <!-- Queue/Stack Components -->
    <!-- Queue Display -->
    <div
      v-if="queue.length > 0"
      class="absolute right-4 bottom-4 z-10 max-w-[50%] overflow-x-auto border-2 border-black bg-white px-4 py-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] md:right-auto md:bottom-4 md:left-1/2 md:max-w-none md:-translate-x-1/2 md:px-6 md:py-3"
    >
      <div class="text-center font-mono text-xs font-bold text-gray-500 uppercase md:text-sm">
        Queue
      </div>
      <div class="mt-2 flex justify-center gap-2">
        <div
          v-for="nodeId in queue"
          :key="nodeId"
          class="flex size-8 shrink-0 items-center justify-center border border-black bg-[#6366f1] text-xs font-bold text-white md:size-10 md:text-sm"
        >
          {{ nodes[nodeId]?.label }}
        </div>
      </div>
    </div>

    <!-- DFS Call Stack -->
    <div
      v-if="dfsCallStack.length > 0"
      class="absolute right-4 bottom-4 z-20 w-32 border-2 border-black bg-white p-3 shadow-[4px_4px_0_0_rgba(0,0,0,1)] md:bottom-4 md:w-48 md:p-4"
    >
      <div class="mb-2 font-mono text-xs font-bold text-black uppercase md:text-sm">DFS Stack</div>

      <div class="flex flex-col-reverse gap-1 md:gap-2">
        <div
          v-for="nodeId in dfsCallStack"
          :key="nodeId"
          class="flex items-center justify-center border border-black bg-[#8b5cf6] px-2 py-1 text-xs font-bold text-white transition-all md:px-3 md:text-sm"
          :class="{
            'ring-2 ring-black': nodeId === dfsCallStack[dfsCallStack.length - 1],
          }"
        >
          {{ nodes[nodeId]?.label }}
        </div>
      </div>

      <div class="mt-2 text-center font-mono text-[10px] text-gray-500 md:text-xs">Top ↑</div>
    </div>

    <!-- Selected Start Node -->
    <div
      v-if="selectedStartNode === null"
      class="absolute top-4 left-1/2 z-10 -translate-x-1/2 border-2 border-black bg-white px-4 py-2 font-mono text-sm font-bold text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
    >
      SELECT_START_NODE
    </div>

    <!-- Legend -->
    <div
      class="absolute top-4 right-4 z-10 hidden border-2 border-black bg-white p-4 font-mono text-sm shadow-[4px_4px_0_0_rgba(0,0,0,1)] lg:block"
    >
      <div class="mb-2 font-bold text-black uppercase">Map_Key</div>
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <div class="size-4 rounded-full border border-black bg-white"></div>
          <span class="text-xs text-gray-600 uppercase">Start</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="size-4 rounded-full border border-black bg-[#6366f1]"></div>
          <span class="text-xs text-gray-600 uppercase">Queued</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="size-4 rounded-full border border-black bg-[#f59e0b]"></div>
          <span class="text-xs text-gray-600 uppercase">Active</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="size-4 rounded-full border border-black bg-[#10b981]"></div>
          <span class="text-xs text-gray-600 uppercase">Done</span>
        </div>
      </div>
    </div>

    <!-- Time Complexity Panel -->
    <div
      v-if="visitedCount > 0"
      class="absolute bottom-4 left-4 z-20 w-48 border-2 border-black bg-white p-3 font-mono text-[10px] shadow-[4px_4px_0_0_rgba(0,0,0,1)] md:top-4 md:bottom-auto md:w-60 md:p-4 md:text-sm"
    >
      <div class="mb-2 font-bold text-black uppercase">Metrics</div>

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
          <span class="font-bold text-[#10b981]">O(V+E)</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">SPACE:</span>
          <span class="font-bold text-[#3b82f6]">O(V)</span>
        </div>
      </div>
    </div>
  </div>
</template>
