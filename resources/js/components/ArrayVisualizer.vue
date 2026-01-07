<script setup lang="ts">
// import { computed } from 'vue'

interface Props {
    numbers: number[]
    target: number | null
    currentIndex: number | null
    low: number | null
    high: number | null
    mid: number | null
    foundIndex: number | null
}

const props = defineProps<Props>()

const isOutOfRange = (index: number) => {
    if (props.low === null || props.high === null) return false
    return index < props.low || index > props.high
}

const isActive = (index: number) => {
    return (
        index === props.currentIndex ||
        index === props.mid
    )
}

const isFound = (index: number) => {
    return props.foundIndex === index
}

const boxClass = (index: number) => {
    if (isFound(index))
        return 'bg-green-500 text-white scale-110'

    if (isActive(index))
        return 'bg-blue-500 text-white scale-105'

    if (isOutOfRange(index))
        return 'bg-gray-200 text-gray-400 opacity-40'

    return 'bg-slate-100 text-slate-800'
}
</script>

<template>
    <div class="w-full flex justify-center">
        <div class="flex gap-3 items-end">
            <div
                v-for="(num, index) in numbers"
                :key="index"
                class="relative transition-all duration-300"
            >
                <div class="text-xs text-center text-gray-500 mb-1">
                    {{ index }}
                </div>

                <div
                    :class="[
                        'w-14 h-14 flex items-center justify-center rounded-lg font-semibold shadow-md',
                        boxClass(index)
                    ]"
                >
                    {{ num }}
                </div>

                <div class="mt-1 text-xs text-center h-4">
                    <span v-if="index === low" class="text-purple-600">
                        L
                    </span>
                    <span v-if="index === high" class="text-red-600 ml-1">
                        H
                    </span>
                    <span v-if="index === mid" class="text-blue-600 ml-1">
                        M
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
