<script setup lang="ts">
import {
  generateBinaryTree,
  isTreePaused,
  isTreeTraversing,
  nextTreeStep,
  treeNodes,
  previousTreeStep,
  resetTree,
  runInOrderTraversal,
  runPreOrderTraversal,
  runPostOrderTraversal,
  prepareInOrderSteps,
  preparePreOrderSteps,
  preparePostOrderSteps,
  treeSpeed,
  treeStepIndex,
  treeSteps,
  pauseTreeTraversal,
} from '@/composables/useTreeController'

interface Props {
  algorithm: 'inorder' | 'preorder' | 'postorder'
}

const props = defineProps<Props>()

const startTraversal = () => {
  if (props.algorithm === 'inorder') {
    runInOrderTraversal()
  } else if (props.algorithm === 'preorder') {
    runPreOrderTraversal()
  } else {
    runPostOrderTraversal()
  }
}

const prepareSteps = () => {
  if (props.algorithm === 'inorder') {
    prepareInOrderSteps()
  } else if (props.algorithm === 'preorder') {
    preparePreOrderSteps()
  } else {
    preparePostOrderSteps()
  }
}

const getAlgorithmLabel = () => {
  switch (props.algorithm) {
    case 'inorder':
      return 'IN-ORDER'
    case 'preorder':
      return 'PRE-ORDER'
    case 'postorder':
      return 'POST-ORDER'
  }
}
</script>

<template>
  <header
    class="relative z-30 flex flex-col gap-4 border-b-2 border-black bg-white px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-3"
  >
    <!-- Speed Control -->
    <div class="flex items-center justify-center gap-6 md:justify-start">
      <div class="flex flex-col font-mono">
        <label class="text-xs font-bold text-gray-500 uppercase">Speed</label>
        <input type="range" min="1" max="100" v-model="treeSpeed" class="w-32 accent-black" />
      </div>
    </div>

    <!-- Controls -->
    <div class="flex flex-wrap items-center justify-center gap-2 md:gap-3">
      <button
        class="rounded-none border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="generateBinaryTree"
        :disabled="isTreeTraversing"
      >
        Generate Tree
      </button>
      <button
        class="rounded-none border-2 border-black bg-black px-3 py-1.5 font-mono text-xs font-bold text-white uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="startTraversal"
        :disabled="isTreeTraversing || treeNodes.length === 0"
      >
        Start {{ getAlgorithmLabel() }}
      </button>

      <button
        class="rounded-none border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="pauseTreeTraversal"
        :disabled="!isTreeTraversing"
      >
        {{ isTreePaused ? 'Resume' : 'Pause' }}
      </button>
      <button
        class="rounded-none border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-red-50 hover:text-red-600 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="resetTree"
        :disabled="isTreeTraversing"
      >
        Reset
      </button>

      <!-- Step controls -->
      <button
        class="rounded-none border-2 border-black bg-gray-100 px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[3px_3px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        @click="prepareSteps"
        :disabled="isTreeTraversing || treeNodes.length === 0"
      >
        Prepare Steps
      </button>

      <div class="flex items-center gap-1 font-mono md:gap-2">
        <button
          class="border border-black bg-white px-2 py-1 text-xs font-bold text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none disabled:opacity-50"
          @click="previousTreeStep"
          :disabled="treeSteps.length === 0 || treeStepIndex <= 0"
        >
          &laquo; Prev
        </button>
        <button
          class="border border-black bg-white px-2 py-1 text-xs font-bold text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none disabled:opacity-50"
          @click="nextTreeStep"
          :disabled="treeSteps.length === 0 || treeStepIndex >= treeSteps.length - 1"
        >
          Next &raquo;
        </button>
        <div class="text-[10px] font-bold text-gray-500 md:text-xs text-center min-w-10">
          {{ treeStepIndex + 1 }}/{{ treeSteps.length }}
        </div>
      </div>
    </div>
  </header>
</template>
