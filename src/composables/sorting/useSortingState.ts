/**
 * Sorting State Management (Single Responsibility Principle)
 *
 * This module ONLY handles state management for sorting visualizations.
 * It doesn't contain any algorithm logic - that's handled by individual algorithm files.
 */

import { ref, computed } from 'vue'
import type { AlgorithmInfo } from '@/types/algorithm'

// ============================================
// Reactive State (shared across all sorting algorithms)
// ============================================

export const bars = ref<number[]>([])
export const active = ref<number[]>([])
export const swapping = ref<number[]>([])
export const sorted = ref<number[]>([])

export const barCount = ref(30)
export const speed = ref(50)

export const isSorting = ref(false)
export const isPaused = ref(false)
export const explanation = ref<string[]>([])

export const currentAlgorithmInfo = ref<AlgorithmInfo | null>(null)

// ============================================
// Computed Properties
// ============================================

export const canStart = computed(() => !isSorting.value && bars.value.length > 0)
export const canPause = computed(() => isSorting.value)
export const canReset = computed(() => !isSorting.value)

// ============================================
// State Utilities
// ============================================

/**
 * Reset visual state without regenerating bars
 */
export function resetVisualState(): void {
  active.value = []
  swapping.value = []
  sorted.value = []
}

/**
 * Clear all state
 */
export function clearState(): void {
  bars.value = []
  resetVisualState()
  explanation.value = []
  isSorting.value = false
  isPaused.value = false
  currentAlgorithmInfo.value = null
}

/**
 * Generate random bars for visualization
 */
export function generateBars(): void {
  if (isSorting.value) return

  bars.value = Array.from({ length: barCount.value }, () =>
    Math.floor(Math.random() * 90) + 10
  )

  resetVisualState()

  if (currentAlgorithmInfo.value) {
    setExplanation([
      `ALGO: ${currentAlgorithmInfo.value.name}`,
      `WHAT: ${currentAlgorithmInfo.value.description}`,
    ])
  } else {
    setExplanation(['Generated new random array.'])
  }
}

/**
 * Set explanation text
 */
export function setExplanation(lines: string[]): void {
  explanation.value = lines
}

/**
 * Append to explanation
 */
export function appendExplanation(line: string): void {
  explanation.value.push(line)
}

/**
 * Set algorithm info and initial explanation
 */
export function setAlgorithmInfo(info: AlgorithmInfo): void {
  currentAlgorithmInfo.value = info
  explanation.value = [
    `ALGO: ${info.name}`,
    `WHAT: ${info.description}`,
    `TIME: ${info.timeComplexity}`,
    `SPACE: ${info.spaceComplexity}`,
  ]
}

/**
 * Helper: Sleep function for animation delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 101 - speed.value + ms))
}

/**
 * Helper: Wait while paused
 */
export async function waitWhilePaused(): Promise<void> {
  while (isPaused.value && isSorting.value) {
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}

/**
 * Toggle pause state
 */
export function togglePause(): void {
  isPaused.value = !isPaused.value
}

/**
 * Mark sorting as started
 */
export function startSorting(): boolean {
  if (isSorting.value) return false
  isSorting.value = true
  isPaused.value = false
  return true
}

/**
 * Mark sorting as finished
 */
export function finishSorting(): void {
  active.value = []
  isSorting.value = false
}

/**
 * Mark an element as sorted
 */
export function markSorted(index: number): void {
  if (!sorted.value.includes(index)) {
    sorted.value.push(index)
  }
}

/**
 * Mark multiple elements as sorted
 */
export function markAllSorted(): void {
  for (let i = 0; i < bars.value.length; i++) {
    markSorted(i)
  }
}
