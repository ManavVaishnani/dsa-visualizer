<script setup lang="ts">
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

const getNodeClass = (index: number) => {
    if (isFound(index)) return 'bg-[#10b981] border-[#10b981] scale-110';
    if (isActive(index)) return 'bg-[#3b82f6] border-[#3b82f6] scale-105';
    if (isOutOfRange(index)) return 'bg-[#1e293b] border-[#334155] opacity-40';
    return 'bg-[#1e293b] border-[#64748b]';
};

const getLabelClass = (index: number) => {
    if (isFound(index)) return 'text-[#10b981]';
    if (isActive(index)) return 'text-[#3b82f6]';
    if (isOutOfRange(index)) return 'text-[#64748b] opacity-40';
    return 'text-[#94a3b8]';
};
</script>

<template>
    <div class="flex w-full items-center justify-center overflow-x-auto p-8">
        <div
            class="flex items-center"
            :class="numbers.length > 15 ? 'gap-1' : 'gap-2'"
        >
            <div
                v-for="(num, index) in numbers"
                :key="index"
                class="flex items-center"
            >
                <!-- Node -->
                <div class="flex flex-col items-center">
                    <!-- Index Label -->
                    <div
                        :class="[
                            'mb-1 font-medium',
                            numbers.length > 15 ? 'text-[10px]' : 'text-xs',
                            getLabelClass(index),
                        ]"
                    >
                        {{ index }}
                    </div>

                    <!-- Node Container -->
                    <div
                        :class="[
                            'flex items-center justify-center rounded-lg border-2 font-semibold text-[#f1f5f9] shadow-lg transition-all duration-300',
                            numbers.length > 15
                                ? 'h-12 w-12 text-sm'
                                : 'h-16 w-16',
                            getNodeClass(index),
                        ]"
                    >
                        {{ num }}
                    </div>

                    <!-- Marker Labels (L, H, M) -->
                    <div
                        :class="[
                            'mt-1 flex gap-1 font-medium',
                            numbers.length > 15 ? 'text-[10px]' : 'text-xs',
                        ]"
                    >
                        <span v-if="index === low" class="text-[#a855f7]">
                            L
                        </span>
                        <span v-if="index === high" class="text-[#ef4444]">
                            H
                        </span>
                        <span v-if="index === mid" class="text-[#3b82f6]">
                            M
                        </span>
                    </div>
                </div>

                <!-- Arrow -->
                <div
                    v-if="index < numbers.length - 1"
                    :class="[
                        'flex flex-col items-center',
                        numbers.length > 15 ? 'mx-1' : 'mx-2',
                    ]"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        :class="[
                            numbers.length > 15 ? 'h-4 w-4' : 'h-6 w-6',
                            'text-[#64748b]',
                        ]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>
