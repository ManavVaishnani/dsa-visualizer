/**
 * Selection Sort Algorithm (Single Responsibility Principle)
 *
 * This module ONLY contains the Selection Sort algorithm implementation.
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

export const selectionSortInfo: AlgorithmInfo = {
  name: 'Selection Sort',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  description:
    'Repeatedly finds the minimum element and puts it at the beginning. Performs few swaps, useful when memory write is expensive.',
}

// ============================================
// Algorithm Implementation
// ============================================

export async function selectionSort(): Promise<void> {
  if (!startSorting()) return

  appendExplanation('Starting Selection Sort...')

  const arr = bars.value

  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i
    appendExplanation(
      `Finding minimum element in the unsorted portion starting from index ${i}.`
    )

    // Find the minimum element in the unsorted portion
    for (let j = i + 1; j < arr.length; j++) {
      await waitWhilePaused()

      // Show comparison
      active.value = [i, j]
      appendExplanation(
        `Comparing ${arr[j]} with current minimum ${arr[minIndex]}.`
      )
      await sleep(0)

      if (arr[j] < arr[minIndex]) {
        appendExplanation(`New minimum found: ${arr[j]} at index ${j}.`)
        minIndex = j
      }

      active.value = []
    }

    // Swap if minimum is not at current position
    if (minIndex !== i) {
      await waitWhilePaused()

      appendExplanation(
        `Swapping ${arr[i]} with minimum element ${arr[minIndex]}.`
      )
      swapping.value = [i, minIndex]
      await sleep(0)
      ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
      swapping.value = []
    } else {
      appendExplanation(
        `${arr[i]} is already the smallest element in the unsorted part.`
      )
    }

    // Mark current position as sorted
    sorted.value.push(i)
  }

  // Mark last element as sorted
  sorted.value.push(arr.length - 1)

  finishSorting()
  appendExplanation('Selection Sort completed!')
}

// ============================================
// Algorithm Definition (for Registry)
// ============================================

export function useSelectionSort(): SortingAlgorithm {
  return {
    key: 'selection-sort',
    info: selectionSortInfo,
    execute: selectionSort,
  }
}

/**
 * Initialize this algorithm (sets info in state)
 */
export function initSelectionSort(): void {
  setAlgorithmInfo(selectionSortInfo)
}

export default useSelectionSort
