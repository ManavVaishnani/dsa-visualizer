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
    visitedCount,
    visitedNodes,
} from '@/composables/useGraphController';

const getNodeColor = (nodeId: number) => {
    if (currentNode.value === nodeId) return '#f59e0b';
    if (visitedNodes.value.includes(nodeId)) return '#10b981';
    if (queue.value.includes(nodeId)) return '#6366f1';
    if (selectedStartNode.value === nodeId) return '#22c55e';
    return '#3b82f6';
};

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

// Calculate the edge endpoint position (shortened to stop at node radius)
const calculateEdgeEndpoint = (
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    nodeRadius = 30,
) => {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    return {
        x: toX - nodeRadius * Math.cos(angle),
        y: toY - nodeRadius * Math.sin(angle),
    };
};
</script>

<template>
    <div class="relative h-full w-full overflow-hidden bg-[#0f172a]">
        <svg
            class="h-full w-full"
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMin meet"
        >
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
            <g
                v-for="node in nodes"
                :key="node.id"
                class="transition-all duration-500"
            >
                <circle
                    :cx="node.x"
                    :cy="node.y"
                    :r="30"
                    :fill="getNodeColor(node.id)"
                    class="cursor-pointer opacity-80 transition-all duration-300"
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

                <!-- Label for Root node -->
                <text
                    v-if="node.id === 0"
                    :x="node.x"
                    :y="node.y - 45"
                    text-anchor="middle"
                    class="text-xs font-semibold tracking-wider uppercase"
                    fill="white"
                >
                    Root
                </text>
            </g>
        </svg>

        <!-- Queue/Stack and other UI components -->
        <!-- Queue Display -->
        <div
            v-if="queue.length > 0"
            class="absolute right-4 bottom-4 z-10 max-w-[50%] overflow-x-auto rounded-lg border border-white/5 bg-[#1e293b]/90 px-4 py-2 shadow-lg md:right-auto md:bottom-4 md:left-1/2 md:max-w-none md:-translate-x-1/2 md:px-6 md:py-3"
        >
            <div class="text-center text-xs text-[#94a3b8] md:text-sm">
                Queue (BFS)
            </div>
            <div class="mt-2 flex justify-center gap-2">
                <div
                    v-for="nodeId in queue"
                    :key="nodeId"
                    class="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#6366f1] text-xs font-bold text-white md:size-10 md:text-sm"
                >
                    {{ nodes[nodeId]?.label }}
                </div>
            </div>
        </div>

        <!-- DFS Call Stack -->
        <div
            v-if="dfsCallStack.length > 0"
            class="absolute right-4 bottom-4 z-20 w-32 rounded-lg border border-white/5 bg-[#1e293b]/90 p-3 shadow-lg md:bottom-4 md:w-48 md:p-4"
        >
            <div class="mb-2 text-xs font-semibold text-[#f1f5f9] md:text-sm">
                Recursion Stack (DFS)
            </div>

            <div class="flex flex-col-reverse gap-1 md:gap-2">
                <div
                    v-for="nodeId in dfsCallStack"
                    :key="nodeId"
                    class="flex items-center justify-center rounded bg-[#8b5cf6] px-2 py-1 text-xs font-bold text-white transition-all md:px-3 md:text-sm"
                    :class="{
                        'ring-1 ring-white md:ring-2':
                            nodeId === dfsCallStack[dfsCallStack.length - 1],
                    }"
                >
                    {{ nodes[nodeId]?.label }}
                </div>
            </div>

            <div class="mt-2 text-center text-[10px] text-[#94a3b8] md:text-xs">
                Top ↑
            </div>
        </div>
        <!-- Selected Start Node -->
        <div
            v-if="selectedStartNode === null"
            class="absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded bg-[#1e293b] px-4 py-2 text-sm text-[#94a3b8]"
        >
            Click a node to select the start node
        </div>

        <!-- Legend -->
        <div
            class="absolute top-4 right-4 z-10 hidden rounded-lg border border-white/5 bg-[#1e293b] p-4 text-sm shadow-lg lg:block"
        >
            <div class="mb-2 font-semibold text-[#f1f5f9]">Tree Legend</div>
            <div class="space-y-2">
                <div class="flex items-center gap-2">
                    <div class="size-4 rounded-full bg-[#3b82f6]"></div>
                    <span class="text-[#94a3b8]">Node</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="size-4 rounded-full bg-[#f59e0b]"></div>
                    <span class="text-[#94a3b8]">Current</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="size-4 rounded-full bg-[#10b981]"></div>
                    <span class="text-[#94a3b8]">Visited</span>
                </div>
            </div>
        </div>

        <!-- Time Complexity Panel -->
        <div
            v-if="visitedCount > 0"
            class="absolute bottom-4 left-4 z-20 w-48 rounded-lg border border-white/5 bg-[#1e293b] p-3 text-[10px] shadow-lg md:top-8 md:bottom-auto md:w-60 md:p-4 md:text-sm"
        >
            <div class="mb-2 font-semibold text-[#f1f5f9]">
                Complexity (Tree)
            </div>

            <div class="space-y-1.5 md:space-y-2">
                <div class="flex justify-between">
                    <span class="text-[#94a3b8]">Nodes Visited:</span>
                    <span class="font-bold text-white">
                        {{ visitedCount }}/{{ nodes.length }}
                    </span>
                </div>

                <div class="flex justify-between">
                    <span class="text-[#94a3b8]">Edges Explored:</span>
                    <span class="font-bold text-white">
                        {{ edgeExploredCount }}/{{ edges.length }}
                    </span>
                </div>

                <div
                    class="mt-1 flex justify-between border-t border-[#334155] pt-1 md:mt-2 md:pt-2"
                >
                    <span class="text-[#94a3b8]">Time:</span>
                    <span class="font-bold text-[#22c55e]">O(N)</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-[#94a3b8]">Space:</span>
                    <span class="font-bold text-[#3b82f6]">O(H)</span>
                </div>
            </div>
        </div>
    </div>
</template>
