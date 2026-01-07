<script setup lang="ts">
import {
    generateGraph,
    graphType,
    isPaused,
    isTraversing,
    nextStep,
    nodes,
    prepareBFSSteps,
    prepareDFSSteps,
    previousStep,
    resetGraph,
    runBFS,
    runDFS,
    selectedStartNode,
    speed,
    stepIndex,
    steps,
} from '@/composables/useGraphController';

interface Props {
    algorithm: 'bfs' | 'dfs';
}

const props = defineProps<Props>();

const startTraversal = () => {
    if (props.algorithm === 'bfs') {
        runBFS();
    } else {
        runDFS();
    }
};

const prepareSteps = () => {
    if (props.algorithm === 'bfs') prepareBFSSteps();
    else prepareDFSSteps();
};

const pause = () => {
    isPaused.value = !isPaused.value;
};
</script>

<template>
    <header
        class="flex flex-col gap-4 border-b border-[#334155] bg-[#0f172a] px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-3"
    >
        <!-- Speed Control -->
        <div class="flex items-center justify-center gap-6 md:justify-start">
            <div class="flex flex-col">
                <label class="text-xs text-[#94a3b8]">Speed</label>
                <input
                    type="range"
                    min="1"
                    max="100"
                    v-model="speed"
                    class="w-32 accent-[#3b82f6]"
                />
            </div>
        </div>

        <!-- Controls -->
        <div class="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <select
                v-model="graphType"
                class="rounded bg-[#1e293b] px-2 py-1.5 text-xs text-white md:px-3 md:py-1 md:text-sm"
            >
                <option value="undirected">Undirected</option>
                <option value="directed">Directed</option>
            </select>
            <button
                class="rounded bg-[#3b82f6] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 md:px-4 md:py-2 md:text-sm"
                @click="generateGraph"
                :disabled="isTraversing"
            >
                Generate
            </button>
            <button
                class="rounded bg-[#10b981] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-50 md:px-4 md:py-2 md:text-sm"
                @click="startTraversal"
                :disabled="
                    isTraversing ||
                    nodes.length === 0 ||
                    selectedStartNode === null
                "
            >
                Start {{ props.algorithm.toUpperCase() }}
            </button>

            <button
                class="rounded bg-[#f59e0b] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#d97706] disabled:cursor-not-allowed disabled:opacity-50 md:px-4 md:py-2 md:text-sm"
                @click="pause"
                :disabled="!isTraversing"
            >
                {{ isPaused ? 'Resume' : 'Pause' }}
            </button>
            <button
                class="rounded bg-[#ef4444] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#dc2626] disabled:cursor-not-allowed disabled:opacity-50 md:px-4 md:py-2 md:text-sm"
                @click="resetGraph"
                :disabled="isTraversing"
            >
                Reset
            </button>

            <!-- Step controls -->
            <button
                class="cursor-pointer rounded bg-[#64748b] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#475569] disabled:cursor-not-allowed disabled:opacity-50 md:px-4 md:py-2 md:text-sm"
                @click="prepareSteps"
                :disabled="
                    isTraversing ||
                    nodes.length === 0 ||
                    selectedStartNode === null
                "
            >
                Prepare Steps
            </button>

            <div class="flex items-center gap-1 md:gap-2">
                <button
                    class="cursor-pointer rounded bg-[#0ea5e9] px-2 py-1 text-xs text-white disabled:opacity-50 md:px-3 md:text-sm"
                    @click="previousStep"
                    :disabled="steps.length === 0 || stepIndex <= 0"
                >
                    &laquo; Prev
                </button>
                <button
                    class="cursor-pointer rounded bg-[#0ea5e9] px-2 py-1 text-xs text-white disabled:opacity-50 md:px-3 md:text-sm"
                    @click="nextStep"
                    :disabled="
                        steps.length === 0 || stepIndex >= steps.length - 1
                    "
                >
                    Next &raquo;
                </button>
                <div class="text-[10px] text-[#94a3b8] md:text-xs">
                    {{ stepIndex + 1 }}/{{ steps.length }}
                </div>
            </div>
        </div>
    </header>
</template>
