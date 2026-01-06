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
        class="flex items-center justify-between border-b border-[#334155] bg-[#0f172a] px-6 py-3"
    >
        <!-- Speed Control -->
        <div class="flex items-center gap-6" >
            <div class="grid">
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
        <div class="flex gap-3">
            <select
                v-model="graphType"
                class="rounded bg-[#1e293b] px-3 py-1 text-sm text-white"
            >
                <option value="undirected">Undirected</option>
                <option value="directed">Directed</option>
            </select>
            <button
                class="rounded bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50"
                @click="generateGraph"
                :disabled="isTraversing"
            >
                Generate Graph
            </button>
            <button
                class="rounded bg-[#10b981] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-50"
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
                class="rounded bg-[#f59e0b] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#d97706] disabled:cursor-not-allowed disabled:opacity-50"
                @click="pause"
                :disabled="!isTraversing"
            >
                {{ isPaused ? 'Resume' : 'Pause' }}
            </button>
            <button
                class="rounded bg-[#ef4444] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#dc2626] disabled:cursor-not-allowed disabled:opacity-50"
                @click="resetGraph"
                :disabled="isTraversing"
            >
                Reset
            </button>

            <!-- Step controls -->
            <button
                class="rounded bg-[#64748b] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#475569] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                @click="prepareSteps"
                :disabled="
                    isTraversing ||
                    nodes.length === 0 ||
                    selectedStartNode === null
                "
            >
                Prepare Steps
            </button>

            <div class="flex items-center gap-2">
                <button
                    class="rounded bg-[#0ea5e9] px-3 py-1 text-sm text-white disabled:opacity-50 cursor-pointer"
                    @click="previousStep"
                    :disabled="steps.length === 0 || stepIndex <= 0"
                >
                    &laquo; Prev
                </button>
                <button
                    class="rounded bg-[#0ea5e9] px-3 py-1 text-sm text-white disabled:opacity-50 cursor-pointer"
                    @click="nextStep"
                    :disabled="
                        steps.length === 0 || stepIndex >= steps.length - 1
                    "
                >
                    Next &raquo;
                </button>
                <!-- Play button removed -->
                <div class="text-xs text-[#94a3b8]">
                    {{ stepIndex + 1 }} / {{ steps.length }}
                </div>
            </div>
        </div>
    </header>
</template>
