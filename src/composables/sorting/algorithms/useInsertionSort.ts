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
  setPseudoCode,
  clearPseudoState,
} from '../useSortingState'
import type { PseudoCodeLine } from '@/types/algorithm'


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

export const insertionSortPseudoCode: PseudoCodeLine[] = [
  { id: 'insertion.start', text: 'function insertionSort(arr):' },
  { id: 'insertion.outer', text: 'for i from 1 to n - 1:', indent: 1 },
  { id: 'insertion.key', text: 'key = arr[i]', indent: 2 },
  { id: 'insertion.j', text: 'j = i - 1', indent: 2 },
  { id: 'insertion.while', text: 'while j >= 0 and arr[j] > key:', indent: 2 },
  { id: 'insertion.shift', text: 'arr[j + 1] = arr[j]', indent: 3 },
  { id: 'insertion.decrement', text: 'j = j - 1', indent: 3 },
  { id: 'insertion.insert', text: 'arr[j + 1] = key', indent: 2 },
  { id: 'insertion.done', text: 'return arr', indent: 1 },
]

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
  setPseudoCode(insertionSortPseudoCode)
  clearPseudoState()
}

export default useInsertionSort
