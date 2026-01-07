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
    <div class="h-full w-full overflow-hidden px-2 md:px-4">
        <div class="flex h-full items-end justify-center gap-px md:gap-1">
            <div
                v-for="(value, index) in bars"
                :key="index"
                class="min-w-px flex-1 rounded-t transition-all duration-150 md:min-w-0.5"
                :class="getColor(index)"
                :style="{
                    height: value + '%',
                }"
            />
        </div>
    </div>
</template>
