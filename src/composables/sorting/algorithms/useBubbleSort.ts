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
  setPseudoCode,
  setPseudoState,
  clearPseudoState,
  type PseudoCodeLine,
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

export const bubbleSortPseudoCode: PseudoCodeLine[] = [
  { id: 'bubble.start', text: 'function bubbleSort(arr):' },
  { id: 'bubble.outer', text: 'for i from 0 to n - 1:', indent: 1 },
  { id: 'bubble.inner', text: 'for j from 0 to n - i - 2:', indent: 2 },
  { id: 'bubble.compare', text: 'if arr[j] > arr[j + 1]:', indent: 3 },
  { id: 'bubble.swap', text: 'swap(arr[j], arr[j + 1])', indent: 4 },
  { id: 'bubble.no-swap', text: 'else: continue', indent: 3 },
  { id: 'bubble.mark-sorted', text: 'mark arr[n - i - 1] as sorted', indent: 2 },
  { id: 'bubble.done', text: 'return arr', indent: 1 },
]

// ============================================
// Algorithm Implementation
// ============================================

export async function bubbleSort(): Promise<void> {
  if (!startSorting()) return

  appendExplanation('Starting Bubble Sort...')

  const arr = bars.value
  setPseudoState('bubble.start', { n: arr.length })

  for (let i = 0; i < arr.length; i++) {
    setPseudoState('bubble.outer', {
      i,
      n: arr.length,
      unsortedEnd: arr.length - i - 1,
    })

    for (let j = 0; j < arr.length - i - 1; j++) {
      await waitWhilePaused()

      setPseudoState('bubble.inner', {
        i,
        j,
        left: arr[j],
        right: arr[j + 1],
      })

      active.value = [j, j + 1]
      appendExplanation(`Comparing ${arr[j]} and ${arr[j + 1]}`)
      await sleep(0)

      setPseudoState('bubble.compare', {
        i,
        j,
        left: arr[j],
        right: arr[j + 1],
      })

      if (arr[j] > arr[j + 1]) {
        appendExplanation(`${arr[j]} > ${arr[j + 1]}, swapping them.`)
        setPseudoState('bubble.swap', {
          i,
          j,
          left: arr[j],
          right: arr[j + 1],
        })
        swapping.value = [j, j + 1]
        await sleep(0)
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      } else {
        setPseudoState('bubble.no-swap', {
          i,
          j,
          left: arr[j],
          right: arr[j + 1],
        })
        appendExplanation(`${arr[j]} <= ${arr[j + 1]}, no swap needed.`)
      }

      swapping.value = []
    }

    sorted.value.push(arr.length - i - 1)
    setPseudoState('bubble.mark-sorted', {
      i,
      sortedIndex: arr.length - i - 1,
      sortedValue: arr[arr.length - i - 1],
    })
    appendExplanation(
      `Element at index ${arr.length - i - 1} is now in its sorted position.`
    )
  }

  setPseudoState('bubble.done', { result: arr.join(', ') })
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
  setPseudoCode(bubbleSortPseudoCode)
  clearPseudoState()
}

export default useBubbleSort
