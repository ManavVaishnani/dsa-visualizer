<script setup lang="ts">
import {
    bars,
    active,
    swapping,
    sorted
} from '@/composables/useSortingController'

const getColor = (index: number) => {
    if (sorted.value.includes(index)) return 'bg-green-500'
    if (swapping.value.includes(index)) return 'bg-red-500'
    if (active.value.includes(index)) return 'bg-yellow-400'
    return 'bg-blue-500'
}
</script>

<template>
<div class="h-full w-full overflow-x-auto">
    <div class="h-full flex items-end justify-center gap-1 min-w-fit px-4">
        <div
            v-for="(value, index) in bars"
            :key="index"
            class="rounded transition-all duration-150 flex-shrink-0"
            :class="getColor(index)"
            :style="{
                height: value + '%',
                width: Math.max(2, 12 - Math.floor(bars.length / 20)) + 'px'
            }"
        />
    </div>
</div>
</template>
