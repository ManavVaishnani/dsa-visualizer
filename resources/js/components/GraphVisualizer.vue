<script setup lang="ts">
import {
    currentEdge,
    currentNode,
    edges,
    nodes,
    queue,
    visitedNodes,
    selectedStartNode,
    isTraversing,
} from '@/composables/useGraphController'


const getNodeColor = (nodeId: number) => {
    if (currentNode.value === nodeId) return '#f59e0b'
    if (visitedNodes.value.includes(nodeId)) return '#10b981'
    if (queue.value.includes(nodeId)) return '#6366f1'
    if (selectedStartNode.value === nodeId) return '#22c55e'
    return '#3b82f6'
}


const isEdgeActive = (from: number, to: number) => {
    if (!currentEdge.value) return false;
    return (
        (currentEdge.value.from === from && currentEdge.value.to === to) ||
        (currentEdge.value.from === to && currentEdge.value.to === from)
    );
};

const getEdgeColor = (from: number, to: number) => {
    if (isEdgeActive(from, to)) return '#f59e0b'; // Orange - active
    if (visitedNodes.value.includes(from) && visitedNodes.value.includes(to)) {
        return '#10b981'; // Green - both nodes visited
    }
    return '#475569'; // Gray - default
};
</script>

<template>
    <div class="relative h-full w-full bg-[#0f172a]">
        <svg class="h-full w-full" viewBox="0 0 800 600">
            <!-- Draw edges first (so they appear behind nodes) -->
            <line
                v-for="(edge, index) in edges"
                :key="'edge-' + index"
                :x1="nodes[edge.from]?.x"
                :y1="nodes[edge.from]?.y"
                :x2="nodes[edge.to]?.x"
                :y2="nodes[edge.to]?.y"
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
                    class="cursor-pointer transition-all duration-300"
                    :class="{
                        'ring-4 ring-[#22c55e]': selectedStartNode === node.id,
                        'animate-pulse': currentNode === node.id,
                    }"
                    @click="!isTraversing && (selectedStartNode = node.id)"
                />

                <text
                    :x="node.x"
                    :y="node.y"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    class="text-xl font-bold select-none"
                    fill="white"
                >
                    {{ node.label }}
                </text>
            </g>
        </svg>

        <!-- Queue Display -->
        <div
            v-if="queue.length > 0"
            class="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-[#1e293b] px-6 py-3 shadow-lg"
        >
            <div class="text-center text-sm text-[#94a3b8]">Queue</div>
            <div class="mt-2 flex gap-2">
                <div
                    v-for="nodeId in queue"
                    :key="nodeId"
                    class="flex size-10 items-center justify-center rounded-full bg-[#6366f1] text-sm font-bold text-white"
                >
                    {{ nodes[nodeId]?.label }}
                </div>
            </div>
        </div>

        <!-- Selected Start Node -->
        <div
            v-if="selectedStartNode === null"
            class="absolute top-4 left-1/2 -translate-x-1/2 rounded bg-[#1e293b] px-4 py-2 text-sm text-[#94a3b8]"
        >
            Click a node to select the BFS start node
        </div>

        <!-- Legend -->
        <div
            class="absolute top-4 right-4 rounded-lg bg-[#1e293b] p-4 text-sm shadow-lg"
        >
            <div class="mb-2 font-semibold text-[#f1f5f9]">Legend</div>
            <div class="space-y-2">
                <div class="flex items-center gap-2">
                    <div class="size-4 rounded-full bg-[#3b82f6]"></div>
                    <span class="text-[#94a3b8]">Unvisited</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="size-4 rounded-full bg-[#6366f1]"></div>
                    <span class="text-[#94a3b8]">In Queue</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="size-4 rounded-full bg-[#f59e0b]"></div>
                    <span class="text-[#94a3b8]">Processing</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="size-4 rounded-full bg-[#10b981]"></div>
                    <span class="text-[#94a3b8]">Visited</span>
                </div>
            </div>
        </div>
    </div>
</template>
