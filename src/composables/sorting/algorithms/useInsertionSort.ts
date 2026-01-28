/**
 * Insertion Sort Algorithm (Single Responsibility Principle)
 *
 * This module ONLY contains the Insertion Sort algorithm implementation.
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

export const insertionSortInfo: AlgorithmInfo = {
  name: 'Insertion Sort',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  description:
    'Builds the final sorted array one item at a time. Very efficient for small or nearly sorted datasets.',
}

// ============================================
// Algorithm Implementation
// ============================================

export async function insertionSort(): Promise<void> {
  if (!startSorting()) return

  appendExplanation('Starting Insertion Sort...')

  const arr = bars.value

  // Mark first element as sorted (single element is always sorted)
  sorted.value.push(0)

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i]
    let j = i - 1
    appendExplanation(
      `Picking ${key} at index ${i} to insert into the sorted part.`
    )

    // Mark current element being inserted
    active.value = [i]
    await sleep(0)

    // Move elements greater than key one position ahead
    while (j >= 0 && arr[j] > key) {
      await waitWhilePaused()

      appendExplanation(
        `${arr[j]} > ${key}, shifting ${arr[j]} one position to the right.`
      )
      active.value = [i, j]
      await sleep(0)

      swapping.value = [j, j + 1]
      await sleep(0)

      arr[j + 1] = arr[j]
      j--

      swapping.value = []
    }

    // Insert key at correct position
    appendExplanation(`Inserting ${key} at index ${j + 1}.`)
    arr[j + 1] = key

    // Mark all positions from 0 to i as sorted (insertion sort maintains sorted prefix)
    for (let k = 0; k <= i; k++) {
      if (!sorted.value.includes(k)) {
        sorted.value.push(k)
      }
    }

    active.value = []
  }

  finishSorting()
  appendExplanation('Insertion Sort completed!')
}

// ============================================
// Algorithm Definition (for Registry)
// ============================================

export function useInsertionSort(): SortingAlgorithm {
  return {
    key: 'insertion-sort',
    info: insertionSortInfo,
    execute: insertionSort,
  }
}

/**
 * Initialize this algorithm (sets info in state)
 */
export function initInsertionSort(): void {
  setAlgorithmInfo(insertionSortInfo)
}

export default useInsertionSort
