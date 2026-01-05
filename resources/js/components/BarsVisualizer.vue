<script setup lang="ts">
import {
    active,
    bars,
    sorted,
    swapping,
} from '@/composables/useSortingController';

const getColor = (index: number) => {
    if (sorted.value.includes(index)) return 'bg-[#10b981]';
    if (swapping.value.includes(index)) return 'bg-[#ef4444]';
    if (active.value.includes(index)) return 'bg-[#f59e0b]';
    return 'bg-[#3b82f6]';
};
</script>

<template>
    <div class="h-full w-full overflow-x-auto">
        <div class="flex h-full min-w-fit items-end justify-center gap-1 px-4">
            <div
                v-for="(value, index) in bars"
                :key="index"
                class="flex-shrink-0 rounded transition-all duration-150"
                :class="getColor(index)"
                :style="{
                    height: value + '%',
                    width:
                        Math.max(2, 12 - Math.floor(bars.length / 20)) + 'px',
                }"
            />
        </div>
    </div>
</template>
