/**
 * Sorting Algorithm Registry (Open/Closed Principle)
 *
 * This registry allows adding new algorithms WITHOUT modifying existing code.
 * Simply call registerSortingAlgorithm() to add a new algorithm.
 *
 * Benefits:
 * - Components don't need if/else chains to select algorithms
 * - Adding new algorithms doesn't require modifying views or controls
 * - Algorithms can be dynamically registered at runtime
 */

import type { SortingAlgorithm, AlgorithmInfo } from '@/types/algorithm'
import { useBubbleSort, initBubbleSort } from './algorithms/useBubbleSort'
import { useSelectionSort, initSelectionSort } from './algorithms/useSelectionSort'
import { useInsertionSort, initInsertionSort } from './algorithms/useInsertionSort'
import { useMergeSort, initMergeSort } from './algorithms/useMergeSort'
import { useQuickSort, initQuickSort } from './algorithms/useQuickSort'

// ============================================
// Algorithm Registry
// ============================================

const algorithmRegistry = new Map<string, SortingAlgorithm>()
const initializerRegistry = new Map<string, () => void>()

/**
 * Register a sorting algorithm
 * Follow Open/Closed Principle: Open for extension, closed for modification
 */
export function registerSortingAlgorithm(
  algorithm: SortingAlgorithm,
  initializer?: () => void
): void {
  algorithmRegistry.set(algorithm.key, algorithm)
  if (initializer) {
    initializerRegistry.set(algorithm.key, initializer)
  }
}

/**
 * Get a sorting algorithm by key
 */
export function getSortingAlgorithm(key: string): SortingAlgorithm | undefined {
  return algorithmRegistry.get(key)
}

/**
 * Get all registered algorithms
 */
export function getAllSortingAlgorithms(): SortingAlgorithm[] {
  return Array.from(algorithmRegistry.values())
}

/**
 * Get algorithm info by key
 */
export function getSortingAlgorithmInfo(key: string): AlgorithmInfo | undefined {
  return algorithmRegistry.get(key)?.info
}

/**
 * Run a sorting algorithm by key
 */
export async function runSortingAlgorithm(key: string): Promise<void> {
  const algorithm = getSortingAlgorithm(key)
  if (algorithm) {
    await algorithm.execute()
  } else {
    console.warn(`Sorting algorithm "${key}" not found in registry`)
  }
}

/**
 * Initialize an algorithm (set its info in state)
 */
export function initializeSortingAlgorithm(key: string): void {
  const initializer = initializerRegistry.get(key)
  if (initializer) {
    initializer()
  }
}

/**
 * Check if an algorithm is registered
 */
export function hasSortingAlgorithm(key: string): boolean {
  return algorithmRegistry.has(key)
}

// ============================================
// Register Default Algorithms
// ============================================

// Register all default sorting algorithms
registerSortingAlgorithm(useBubbleSort(), initBubbleSort)
registerSortingAlgorithm(useSelectionSort(), initSelectionSort)
registerSortingAlgorithm(useInsertionSort(), initInsertionSort)
registerSortingAlgorithm(useMergeSort(), initMergeSort)
registerSortingAlgorithm(useQuickSort(), initQuickSort)

// ============================================
// Backward Compatibility Mapping
// ============================================

// Map old algorithm names to new keys for backward compatibility
const legacyKeyMap: Record<string, string> = {
  bubble: 'bubble-sort',
  selection: 'selection-sort',
  insertion: 'insertion-sort',
  merge: 'merge-sort',
  quick: 'quick-sort',
}

/**
 * Get algorithm key from legacy name
 */
export function getLegacyAlgorithmKey(legacyName: string): string {
  return legacyKeyMap[legacyName] || legacyName
}

/**
 * Run algorithm by legacy name or new key
 */
export async function runSortingAlgorithmByLegacyName(
  nameOrKey: string
): Promise<void> {
  const key = getLegacyAlgorithmKey(nameOrKey)
  await runSortingAlgorithm(key)
}

/**
 * Initialize algorithm by legacy name or new key
 */
export function initializeSortingAlgorithmByLegacyName(nameOrKey: string): void {
  const key = getLegacyAlgorithmKey(nameOrKey)
  initializeSortingAlgorithm(key)
}
