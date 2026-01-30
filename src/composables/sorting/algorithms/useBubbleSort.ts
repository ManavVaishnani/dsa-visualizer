/**
 * Bubble Sort Algorithm (Single Responsibility Principle)
 *
 * This module ONLY contains the Bubble Sort algorithm implementation.
 * It uses the shared state from useSortingState.
 */

import type { AlgorithmInfo, SortingAlgorithm } from '@/types/algorithm'
import {
  bars,
  active,
  swapping,
  sorted,
  sleep,
  waitWhilePaused,
  startSorting,
  finishSorting,
  appendExplanation,
  setAlgorithmInfo,
} from '../useSortingState'

// ============================================
// Algorithm Metadata
// ============================================

export const bubbleSortInfo: AlgorithmInfo = {
  name: 'Bubble Sort',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  description:
    'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
}

// ============================================
// Algorithm Implementation
// ============================================

export async function bubbleSort(): Promise<void> {
  if (!startSorting()) return

  appendExplanation('Starting Bubble Sort...')

  const arr = bars.value

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      await waitWhilePaused()

      active.value = [j, j + 1]
      appendExplanation(`Comparing ${arr[j]} and ${arr[j + 1]}`)
      await sleep(0)

      if (arr[j] > arr[j + 1]) {
        appendExplanation(`${arr[j]} > ${arr[j + 1]}, swapping them.`)
        swapping.value = [j, j + 1]
        await sleep(0)
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      } else {
        appendExplanation(`${arr[j]} <= ${arr[j + 1]}, no swap needed.`)
      }

      swapping.value = []
    }

    sorted.value.push(arr.length - i - 1)
    appendExplanation(
      `Element at index ${arr.length - i - 1} is now in its sorted position.`
    )
  }

  finishSorting()
  appendExplanation('Bubble Sort completed!')
}

// ============================================
// Algorithm Definition (for Registry)
// ============================================

export function useBubbleSort(): SortingAlgorithm {
  return {
    key: 'bubble-sort',
    info: bubbleSortInfo,
    execute: bubbleSort,
  }
}

/**
 * Initialize this algorithm (sets info in state)
 */
export function initBubbleSort(): void {
  setAlgorithmInfo(bubbleSortInfo)
}

export default useBubbleSort
