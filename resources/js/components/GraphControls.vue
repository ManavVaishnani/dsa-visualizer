<script setup lang="ts">
import {
    generateData,
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
    visualizationType,
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
        class="flex flex-col gap-4 border-b-2 border-black bg-white px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-3"
    >
        <!-- Speed Control -->
        <div class="flex items-center justify-center gap-6 md:justify-start">
            <div class="flex flex-col font-mono">
                <label class="text-xs font-bold text-gray-500 uppercase"
                    >Speed</label
                >
                <input
                    type="range"
                    min="1"
                    max="100"
                    v-model="speed"
                    class="w-32 accent-black"
                />
            </div>
        </div>

        <!-- Controls -->
        <div class="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <select
                v-model="visualizationType"
                class="border-2 border-black bg-white px-2 py-1.5 font-mono text-xs font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none focus:outline-none md:px-3 md:py-1 md:text-sm"
                @change="generateData"
            >
                <option value="graph">Graph</option>
                <option value="tree">Tree</option>
            </select>
            <select
                v-if="visualizationType === 'graph'"
                v-model="graphType"
                class="border-2 border-black bg-white px-2 py-1.5 font-mono text-xs font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none focus:outline-none md:px-3 md:py-1 md:text-sm"
            >
                <option value="undirected">Undirected</option>
                <option value="directed">Directed</option>
            </select>
            <button
                class="border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                @click="generateData"
                :disabled="isTraversing"
            >
                Generate
            </button>
            <button
                class="border-2 border-black bg-black px-3 py-1.5 font-mono text-xs font-bold text-white uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
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
                class="border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                @click="pause"
                :disabled="!isTraversing"
            >
                {{ isPaused ? 'Resume' : 'Pause' }}
            </button>
            <button
                class="border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-px hover:translate-y-px hover:bg-red-50 hover:text-red-600 hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                @click="resetGraph"
                :disabled="isTraversing"
            >
                Reset
            </button>

            <!-- Step controls -->
            <button
                class="border-2 border-black bg-gray-100 px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                @click="prepareSteps"
                :disabled="
                    isTraversing ||
                    nodes.length === 0 ||
                    selectedStartNode === null
                "
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
                    :disabled="
                        steps.length === 0 || stepIndex >= steps.length - 1
                    "
                >
                    Next &raquo;
                </button>
                <div class="text-[10px] font-bold text-gray-500 md:text-xs">
                    {{ stepIndex + 1 }}/{{ steps.length }}
                </div>
            </div>
        </div>
    </header>
</template>
