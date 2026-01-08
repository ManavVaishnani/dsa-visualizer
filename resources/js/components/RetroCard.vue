<script setup lang="ts">
import { cn } from '@/lib/utils';
import { computed } from 'vue';

const props = defineProps<{
    class?: string;
    variant?: 'default' | 'dark' | 'orange' | 'green';
}>();

const variantClasses = computed(() => {
    switch (props.variant) {
        case 'dark':
            return 'bg-black text-white border-black';
        case 'orange':
            return 'bg-orange-400 border-black';
        case 'green':
            return 'bg-green-400 text-black border-black';
        default:
            return 'bg-white text-gray-900 border-black';
    }
});
</script>

<template>
    <div
        :class="
            cn(
                'relative border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px',
                variantClasses,
                props.class,
            )
        "
    >
        <slot />
    </div>
</template>
