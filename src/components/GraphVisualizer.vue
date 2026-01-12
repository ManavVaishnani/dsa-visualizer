<script setup lang="ts">
import { ref, watch } from 'vue'
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

// Calculate edge path with optional curvature
const getEdgePath = (fromId: number, toId: number) => {
  const from = nodes.value[fromId]
  const to = nodes.value[toId]
  if (!from || !to) return ''

  if (fromId === toId) {
    // Self-loop
    const x = from.x
    const y = from.y - 30 // Start from top of node
    return `M ${x + 5} ${y + 2} A 15 15 0 1 0 ${x - 5} ${y + 2}`
  }

  const dx = to.x - from.x
  const dy = to.y - from.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  const nodeRadius = 30

  // Start and end points at the boundary of the nodes
  const startX = from.x + (dx / dist) * nodeRadius
  const startY = from.y + (dy / dist) * nodeRadius
  const endX = to.x - (dx / dist) * nodeRadius
  const endY = to.y - (dy / dist) * nodeRadius

  // Check for bi-directional edges (A->B and B->A) or for slight curvature to avoid straight line overlaps
  const isBiDirectional =
    graphType.value === 'directed' && edges.value.some((e) => e.from === toId && e.to === fromId)

  // Use curvature for bi-directional or a very slight nudge for directed to avoid overlap
  const midX = (startX + endX) / 2
  const midY = (startY + endY) / 2
  const invDist = 1 / dist
  const nx = -dy * invDist
  const ny = dx * invDist

  if (isBiDirectional) {
    const offset = 25
    const controlX = midX + nx * offset
    const controlY = midY + ny * offset
    return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`
  }

  // Still add a tiny curve for directed graphs to help differentiate overlapping routes
  if (graphType.value === 'directed') {
    const offset = 4
    const controlX = midX + nx * offset
    const controlY = midY + ny * offset
    return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`
  }

  return `M ${startX} ${startY} L ${endX} ${endY}`
}

// Node dragging logic
const draggedNodeId = ref<number | null>(null)
const svgRef = ref<SVGSVGElement | null>(null)

const handleMouseDown = (nodeId: number) => {
  if (isTraversing.value) return
  draggedNodeId.value = nodeId
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

const handleMouseMove = (e: MouseEvent) => {
  if (draggedNodeId.value === null || !svgRef.value) return

  const svg = svgRef.value
  const pt = svg.createSVGPoint()
  pt.x = e.clientX
  pt.y = e.clientY
  const cursorPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse())

  const node = nodes.value.find((n) => n.id === draggedNodeId.value)
  if (node) {
    node.x = cursorPoint.x
    node.y = cursorPoint.y
  }
}

const handleMouseUp = () => {
  draggedNodeId.value = null
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
}

// Auto-dismiss target found message after 3 seconds
watch(targetFound, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      targetFound.value = false
    }, 5000)
  }
})

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
</script>

<template>
  <div class="relative h-full w-full overflow-hidden border-2 border-black">
    <AlgorithmExplanation :explanation="explanation" />
    <svg
      ref="svgRef"
      class="h-full w-full"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid meet"
    >
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
      <path
        v-for="(edge, index) in edges"
        :key="'edge-' + index"
        :d="getEdgePath(edge.from, edge.to)"
        fill="none"
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
        class="duration-300"
        :class="{ 'transition-all': draggedNodeId === null }"
      />

      <!-- Draw nodes -->
      <g
        v-for="node in nodes"
        :key="node.id"
        class="duration-500"
        :class="{ 'transition-all': draggedNodeId === null }"
        :transform="`translate(${node.x}, ${node.y})`"
        @mousedown="handleMouseDown(node.id)"
      >
        <circle
          cx="0"
          cy="0"
          :r="30"
          :fill="getNodeColor(node.id)"
          stroke="black"
          stroke-width="2"
          class="cursor-grab opacity-100 duration-300"
          :class="{
            'transition-all': draggedNodeId === null,
            'ring-4 ring-[#22c55e] border-black': selectedStartNode === node.id,
            'ring-4 ring-[#ef4444] border-black': selectedTargetNode === node.id,
            'animate-pulse': currentNode === node.id,
            'cursor-grabbing': draggedNodeId === node.id,
          }"
          @click="handleNodeClick(node.id)"
        />

        <text
          x="0"
          y="0"
          text-anchor="middle"
          dominant-baseline="middle"
          class="pointer-events-none font-mono text-xl font-bold select-none"
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

    <!-- Bottom-Left Overlay (Legend) -->
    <div
      class="absolute bottom-4 left-4 z-20 hidden border-2 border-black bg-white p-4 font-mono text-sm shadow-[5px_5px_0px_0px_black] transition-all duration-300 md:bottom-6 md:left-6 lg:block"
    >
      <div class="mb-2 font-bold text-black uppercase">Map_Key</div>
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
