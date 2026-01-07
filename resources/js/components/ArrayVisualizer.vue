<script setup lang="ts">
// import { computed } from 'vue'

interface Props {
    numbers: number[];
    target: number | null;
    currentIndex: number | null;
    low: number | null;
    high: number | null;
    mid: number | null;
    foundIndex: number | null;
}

const props = defineProps<Props>();

const isOutOfRange = (index: number) => {
    if (props.low === null || props.high === null) return false;
    return index < props.low || index > props.high;
};

const isActive = (index: number) => {
    return index === props.currentIndex || index === props.mid;
};

const isFound = (index: number) => {
    return props.foundIndex === index;
};

const boxClass = (index: number) => {
    if (isFound(index)) return 'bg-green-500 text-white scale-110';

    if (isActive(index)) return 'bg-blue-500 text-white scale-105';

    if (isOutOfRange(index)) return 'bg-gray-200 text-gray-400 opacity-40';

    return 'bg-slate-100 text-slate-800';
};
</script>

<template>
    <div class="h-full w-full overflow-y-auto px-4 py-8">
        <div class="flex flex-wrap items-start justify-center gap-2 md:gap-3">
            <div
                v-for="(num, index) in numbers"
                :key="index"
                class="relative transition-all duration-300"
            >
                <!-- Index Label -->
                <div
                    class="mb-1 text-center text-[10px] text-gray-400 md:text-xs"
                >
                    {{ index }}
                </div>

                <!-- Box -->
                <div
                    :class="[
                        'flex h-10 w-10 items-center justify-center rounded-lg border-2 font-bold shadow-lg transition-all duration-300 md:h-14 md:w-14',
                        boxClass(index),
                    ]"
                >
                    <span class="text-sm md:text-base">{{ num }}</span>
                </div>

                <!-- Marker Labels (L, H, M) -->
                <div
                    class="mt-1 flex h-4 items-center justify-center gap-1 text-[10px] font-bold md:text-xs"
                >
                    <span v-if="index === low" class="text-purple-400">L</span>
                    <span v-if="index === high" class="text-red-400">H</span>
                    <span v-if="index === mid" class="text-blue-400">M</span>
                </div>
            </div>
        </div>
    </div>
</template>
