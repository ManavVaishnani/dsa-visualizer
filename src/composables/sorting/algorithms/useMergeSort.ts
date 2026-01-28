/**
 * Merge Sort Algorithm (Single Responsibility Principle)
 *
 * This module ONLY contains the Merge Sort algorithm implementation.
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
  markAllSorted,
} from '../useSortingState'

// ============================================
// Algorithm Metadata
// ============================================

export const mergeSortInfo: AlgorithmInfo = {
  name: 'Merge Sort',
  timeComplexity: 'O(n log n)',
  spaceComplexity: 'O(n)',
  description:
    'A divide-and-conquer algorithm that divides the array in half, sorts them, and merges them back. Guaranteed O(n log n) performance.',
}

// ============================================
// Algorithm Implementation
// ============================================

async function merge(left: number, mid: number, right: number): Promise<void> {
  const arr = bars.value
  appendExplanation(
    `Merging subarrays [${left}...${mid}] and [${mid + 1}...${right}].`
  )
  const leftArr = arr.slice(left, mid + 1)
  const rightArr = arr.slice(mid + 1, right + 1)

  let i = 0,
    j = 0,
    k = left

  while (i < leftArr.length && j < rightArr.length) {
    await waitWhilePaused()

    active.value = [left + i, mid + 1 + j]
    appendExplanation(
      `Comparing ${leftArr[i]} and ${rightArr[j]} from both halves.`
    )
    await sleep(0)

    if (leftArr[i] <= rightArr[j]) {
      appendExplanation(
        `${leftArr[i]} <= ${rightArr[j]}, picking from the left half.`
      )
      swapping.value = [k]
      await sleep(0)

      arr[k] = leftArr[i]
      i++
    } else {
      appendExplanation(
        `${leftArr[i]} > ${rightArr[j]}, picking from the right half.`
      )
      swapping.value = [k]
      await sleep(0)

      arr[k] = rightArr[j]
      j++
    }

    swapping.value = []
    k++
  }

  while (i < leftArr.length) {
    await waitWhilePaused()

    appendExplanation('Copying remaining elements from the left half.')
    swapping.value = [k]
    await sleep(0)

    arr[k] = leftArr[i]
    swapping.value = []
    i++
    k++
  }

  while (j < rightArr.length) {
    await waitWhilePaused()

    appendExplanation('Copying remaining elements from the right half.')
    swapping.value = [k]
    await sleep(0)

    arr[k] = rightArr[j]
    swapping.value = []
    j++
    k++
  }
}

async function mergeSortHelper(left: number, right: number): Promise<void> {
  if (left < right) {
    const mid = Math.floor((left + right) / 2)
    appendExplanation(
      `Splitting array into [${left}...${mid}] and [${mid + 1}...${right}].`
    )

    await mergeSortHelper(left, mid)
    await mergeSortHelper(mid + 1, right)
    await merge(left, mid, right)
  }
}

export async function mergeSort(): Promise<void> {
  if (!startSorting()) return

  appendExplanation('Starting Merge Sort...')
  sorted.value = []

  await mergeSortHelper(0, bars.value.length - 1)

  // Mark all as sorted at the end
  markAllSorted()

  finishSorting()
  appendExplanation('Merge Sort completed!')
}

// ============================================
// Algorithm Definition (for Registry)
// ============================================

export function useMergeSort(): SortingAlgorithm {
  return {
    key: 'merge-sort',
    info: mergeSortInfo,
    execute: mergeSort,
  }
}

/**
 * Initialize this algorithm (sets info in state)
 */
export function initMergeSort(): void {
  setAlgorithmInfo(mergeSortInfo)
}

export default useMergeSort
