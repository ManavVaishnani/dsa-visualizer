<script setup lang="ts">
import {
    generateGraph,
    isPaused,
    isTraversing,
    nodes,
    resetGraph,
    runBFS,
    runDFS,
    selectedStartNode,
    speed,
} from '@/composables/useGraphController';

interface Props {
    algorithm: 'bfs' | 'dfs'
}

const props = defineProps<Props>()

const startTraversal = () => {
    if (props.algorithm === 'bfs') {
        runBFS()
    } else {
        runDFS()
    }
}

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
            <button
                class="rounded bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50"
                @click="generateGraph"
                :disabled="isTraversing"
            >
                Generate Graph
            </button>
            <button
                class="rounded bg-[#10b981] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#059669]
                    disabled:cursor-not-allowed disabled:opacity-50"
                @click="startTraversal"
                :disabled="isTraversing || nodes.length === 0 || selectedStartNode === null"
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
        </div>
    </header>
</template>
