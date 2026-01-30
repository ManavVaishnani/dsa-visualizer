/**
 * Sorting Module Index (Dependency Inversion Principle)
 *
 * This is the unified entry point for all sorting functionality.
 * Views and components should import from here, not from individual files.
 *
 * Benefits:
 * - Single import point for all sorting functionality
 * - Abstracts away implementation details
 * - Easy to refactor internal structure without breaking consumers
 */

// ============================================
// State Management
// ============================================

export {
  // Reactive state
  bars,
  active,
  swapping,
  sorted,
  barCount,
  speed,
  isSorting,
  isPaused,
  explanation,
  currentAlgorithmInfo,
  // Computed
  canStart,
  canPause,
  canReset,
  // State utilities
  generateBars,
  resetVisualState,
  clearState,
  togglePause,
  setExplanation,
  appendExplanation,
  markSorted,
  markAllSorted,
} from './useSortingState'

// ============================================
// Algorithm Registry (OCP Implementation)
// ============================================

export {
  registerSortingAlgorithm,
  getSortingAlgorithm,
  getAllSortingAlgorithms,
  getSortingAlgorithmInfo,
  runSortingAlgorithm,
  initializeSortingAlgorithm,
  hasSortingAlgorithm,
  // Backward compatibility
  getLegacyAlgorithmKey,
  runSortingAlgorithmByLegacyName,
  initializeSortingAlgorithmByLegacyName,
} from './algorithmRegistry'

// ============================================
// Individual Algorithms (for direct access if needed)
// ============================================

export { bubbleSort, bubbleSortInfo, useBubbleSort, initBubbleSort } from './algorithms/useBubbleSort'
export { selectionSort, selectionSortInfo, useSelectionSort, initSelectionSort } from './algorithms/useSelectionSort'
export { insertionSort, insertionSortInfo, useInsertionSort, initInsertionSort } from './algorithms/useInsertionSort'
export { mergeSort, mergeSortInfo, useMergeSort, initMergeSort } from './algorithms/useMergeSort'
export { quickSort, quickSortInfo, useQuickSort, initQuickSort } from './algorithms/useQuickSort'

// ============================================
// Backward Compatibility Exports
// ============================================

import { initializeSortingAlgorithmByLegacyName } from './algorithmRegistry'

// Legacy setInitialInfo function for backward compatibility
export type SortAlgo = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick'
export const currentSortAlgo = { value: null as SortAlgo | null }

export function setInitialInfo(algo: SortAlgo): void {
  currentSortAlgo.value = algo
  initializeSortingAlgorithmByLegacyName(algo)
}
