/**
 * Quick Sort Algorithm (Single Responsibility Principle)
 *
 * This module ONLY contains the Quick Sort algorithm implementation.
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
  type PseudoCodeLine,
} from '../useSortingState'

// ============================================
// Algorithm Metadata
// ============================================

export const quickSortInfo: AlgorithmInfo = {
  name: 'Quick Sort',
  timeComplexity: 'O(n log n) average, O(n²) worst',
  spaceComplexity: 'O(log n)',
  description:
    'Picks a pivot and partitions the array around it. Fastest average-case performance for general sorting.',
}

export const quickSortPseudoCode: PseudoCodeLine[] = [
  { id: 'quick.start', text: 'function quickSort(arr, low, high):' },
  { id: 'quick.base', text: 'if low >= high: return', indent: 1 },
  { id: 'quick.partition', text: 'pivotIndex = partition(arr, low, high)', indent: 1 },
  { id: 'quick.left', text: 'quickSort(arr, low, pivotIndex - 1)', indent: 1 },
  { id: 'quick.right', text: 'quickSort(arr, pivotIndex + 1, high)', indent: 1 },
  { id: 'quick.partition-start', text: 'function partition(arr, low, high):' },
  { id: 'quick.pivot', text: 'pivot = arr[high]', indent: 1 },
  { id: 'quick.loop', text: 'for j from low to high - 1:', indent: 1 },
  { id: 'quick.compare', text: 'if arr[j] < pivot:', indent: 2 },
  { id: 'quick.swap', text: 'swap(arr[i], arr[j])', indent: 3 },
  { id: 'quick.pivot-swap', text: 'swap(arr[i + 1], arr[high])', indent: 1 },
  { id: 'quick.return', text: 'return i + 1', indent: 1 },
]

// ============================================
// Algorithm Implementation
// ============================================

async function partition(low: number, high: number): Promise<number> {
  const arr = bars.value
  const pivot = arr[high]
  appendExplanation(`Choosing ${pivot} (at index ${high}) as the pivot.`)
  let i = low - 1

  // Highlight pivot
  active.value = [high]
  await sleep(0)

  for (let j = low; j < high; j++) {
    await waitWhilePaused()

    active.value = [j, high]
    appendExplanation(`Comparing ${arr[j]} with pivot ${pivot}.`)
    await sleep(0)

    if (arr[j] < pivot) {
      i++
      if (i !== j) {
        appendExplanation(
          `${arr[j]} < ${pivot}, swapping ${arr[j]} with element at index ${i}.`
        )
        swapping.value = [i, j]
        await sleep(0)
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        swapping.value = []
      }
    }
  }

  // Place pivot in correct position
  if (i + 1 !== high) {
    appendExplanation(
      `Placing pivot ${pivot} at its correct position index ${i + 1}.`
    )
    swapping.value = [i + 1, high]
    await sleep(0)
    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    swapping.value = []
  }

  active.value = []
  return i + 1
}

async function quickSortHelper(low: number, high: number): Promise<void> {
  if (low < high) {
    const pivotIndex = await partition(low, high)

    // Mark pivot as sorted
    sorted.value.push(pivotIndex)
    appendExplanation(`Pivot at index ${pivotIndex} is now sorted.`)

    await quickSortHelper(low, pivotIndex - 1)
    await quickSortHelper(pivotIndex + 1, high)
  } else if (low === high) {
    // Mark single element as sorted
    sorted.value.push(low)
    appendExplanation(`Single element at index ${low} is sorted.`)
  }
}

export async function quickSort(): Promise<void> {
  if (!startSorting()) return

  appendExplanation('Starting Quick Sort...')
  sorted.value = []

  await quickSortHelper(0, bars.value.length - 1)

  finishSorting()
  appendExplanation('Quick Sort completed!')
}

// ============================================
// Algorithm Definition (for Registry)
// ============================================

export function useQuickSort(): SortingAlgorithm {
  return {
    key: 'quick-sort',
    info: quickSortInfo,
    execute: quickSort,
  }
}

/**
 * Initialize this algorithm (sets info in state)
 */
export function initQuickSort(): void {
  setAlgorithmInfo(quickSortInfo)
  setPseudoCode(quickSortPseudoCode)
  clearPseudoState()
}

export default useQuickSort
