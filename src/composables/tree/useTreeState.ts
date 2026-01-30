/**
 * Tree State Management (Single Responsibility Principle)
 *
 * This module ONLY handles state management for tree visualizations.
 * It doesn't contain any algorithm logic - that's handled by individual algorithm files.
 */

import { ref } from 'vue'
import type { AlgorithmInfo } from '@/types/algorithm'

// ============================================
// Type Definitions
// ============================================

export interface TreeNode {
  id: number
  x: number
  y: number
  label: string
  value: number
  left: number | null
  right: number | null
  parent: number | null
}

export interface TreeEdge {
  from: number
  to: number
}

export interface TreeStep {
  visitedNodes: number[]
  currentNode: number | null
  currentEdge: { from: number; to: number } | null
  callStack: number[]
  traversalResult: number[]
  visitedCount: number
  edgeExploredCount: number
  description?: string
}

// ============================================
// Reactive State
// ============================================

export const treeNodes = ref<TreeNode[]>([])
export const treeEdges = ref<TreeEdge[]>([])
export const visitedTreeNodes = ref<number[]>([])
export const currentTreeNode = ref<number | null>(null)
export const currentTreeEdge = ref<{ from: number; to: number } | null>(null)
export const traversalResult = ref<number[]>([])
export const callStack = ref<number[]>([])

export const treeSpeed = ref(50)
export const isTreeTraversing = ref(false)
export const isTreePaused = ref(false)
export const treeExplanation = ref<string[]>([])

export const currentAlgorithmInfo = ref<AlgorithmInfo | null>(null)
export const treeInfo = ref<string[]>([])

export const treeVisitedCount = ref(0)
export const treeEdgeExploredCount = ref(0)

// Step-by-step playback state
export const treeSteps = ref<TreeStep[]>([])
export const treeStepIndex = ref(-1)
export const isTreePlaying = ref(false)
let playTimer: ReturnType<typeof setInterval> | null = null

// ============================================
// State Utilities
// ============================================

/**
 * Helper: Sleep function for animation delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Reset tree traversal state
 */
export function resetTreeState(): void {
  visitedTreeNodes.value = []
  currentTreeNode.value = null
  currentTreeEdge.value = null
  traversalResult.value = []
  callStack.value = []
  treeVisitedCount.value = 0
  treeEdgeExploredCount.value = 0
}

/**
 * Set algorithm info and initial explanation
 */
export function setAlgorithmInfo(info: AlgorithmInfo): void {
  currentAlgorithmInfo.value = info
  treeInfo.value = [
    `ALGO: ${info.name}`,
    info.description,
    `TIME: ${info.timeComplexity}`,
    `SPACE: ${info.spaceComplexity}`,
  ]
  treeExplanation.value = [...treeInfo.value]
}

/**
 * Append to explanation
 */
export function appendExplanation(line: string): void {
  treeExplanation.value.push(line)
}

/**
 * Mark traversal as started
 */
export function startTraversing(): boolean {
  if (isTreeTraversing.value || treeNodes.value.length === 0) return false
  isTreeTraversing.value = true
  isTreePaused.value = false
  resetTreeState()
  return true
}

/**
 * Mark traversal as finished
 */
export function finishTraversing(): void {
  currentTreeNode.value = null
  currentTreeEdge.value = null
  callStack.value = []
  isTreeTraversing.value = false
}

/**
 * Toggle pause state
 */
export function togglePause(): void {
  isTreePaused.value = !isTreePaused.value
}

/**
 * Wait while paused
 */
export async function waitWhilePaused(): Promise<void> {
  while (isTreePaused.value && isTreeTraversing.value) {
    await sleep(100)
  }
}

// ============================================
// Step-by-Step Playback Functions
// ============================================

export function applyTreeStep(index: number): void {
  const s = treeSteps.value[index]
  if (!s) return

  visitedTreeNodes.value = [...s.visitedNodes]
  currentTreeNode.value = s.currentNode
  currentTreeEdge.value = s.currentEdge ? { ...s.currentEdge } : null
  callStack.value = [...s.callStack]
  traversalResult.value = [...s.traversalResult]
  treeVisitedCount.value = s.visitedCount
  treeEdgeExploredCount.value = s.edgeExploredCount
  if (s.description) {
    treeExplanation.value.push(s.description)
  }
  treeStepIndex.value = index
}

export function nextTreeStep(): void {
  if (treeStepIndex.value < treeSteps.value.length - 1) {
    applyTreeStep(treeStepIndex.value + 1)
  }
}

export function previousTreeStep(): void {
  if (treeStepIndex.value > 0) {
    applyTreeStep(treeStepIndex.value - 1)
  }
}

export function gotoTreeStep(index: number): void {
  if (index >= 0 && index < treeSteps.value.length) applyTreeStep(index)
}

export function playTreeSteps(): void {
  if (isTreePlaying.value || treeSteps.value.length === 0) return
  isTreePlaying.value = true
  const delay = Math.max(50, 1000 - treeSpeed.value * 9)
  playTimer = setInterval(() => {
    if (treeStepIndex.value < treeSteps.value.length - 1) nextTreeStep()
    else stopTreePlaying()
  }, delay)
}

export function stopTreePlaying(): void {
  if (playTimer) clearInterval(playTimer)
  playTimer = null
  isTreePlaying.value = false
}

export function resetTreeSteps(): void {
  stopTreePlaying()
  treeSteps.value = []
  treeStepIndex.value = -1
  if (currentAlgorithmInfo.value) {
    treeExplanation.value = [...treeInfo.value]
  } else {
    treeExplanation.value = []
  }
  resetTree()
}

export function resetTree(): void {
  if (isTreeTraversing.value) return

  visitedTreeNodes.value = []
  currentTreeNode.value = null
  currentTreeEdge.value = null
  traversalResult.value = []
  callStack.value = []
  treeVisitedCount.value = 0
  treeEdgeExploredCount.value = 0
}

// ============================================
// Tree Generation
// ============================================

export function generateBinaryTree(): void {
  if (isTreeTraversing.value) return

  const nodeCount = Math.floor(Math.random() * 5) + 7 // 7-11 nodes
  const values = Array.from({ length: nodeCount }, () => Math.floor(Math.random() * 99) + 1)

  // Remove duplicates
  const uniqueValues = [...new Set(values)]

  const width = 800
  const height = 600
  const marginX = 60
  const marginYTop = 80
  const marginYBottom = 60

  const newNodes: TreeNode[] = []
  const newEdges: TreeEdge[] = []
  let nodeId = 0

  const insertNode = (
    value: number,
    parentId: number | null,
    isLeft: boolean,
    level: number,
    xMin: number,
    xMax: number,
  ) => {
    const availableHeight = height - marginYTop - marginYBottom
    const levelHeight = availableHeight / 5 // Max 5 levels

    const id = nodeId++
    const x = (xMin + xMax) / 2
    const y = marginYTop + level * levelHeight

    const node: TreeNode = {
      id,
      x,
      y,
      label: String(value),
      value,
      left: null,
      right: null,
      parent: parentId,
    }
    newNodes.push(node)

    if (parentId !== null) {
      newEdges.push({ from: parentId, to: id })
      if (isLeft) {
        newNodes[parentId].left = id
      } else {
        newNodes[parentId].right = id
      }
    }

    return { id, xMin, xMax }
  }

  // Insert root
  const rootValue = uniqueValues[0]
  insertNode(rootValue, null, false, 0, marginX, width - marginX)

  // Insert remaining values into BST
  for (let i = 1; i < uniqueValues.length && newNodes.length < 15; i++) {
    const value = uniqueValues[i]
    let current = 0
    let level = 0
    let xMin = marginX
    let xMax = width - marginX

    while (true) {
      const currentNode = newNodes[current]
      const mid = (xMin + xMax) / 2

      if (value < currentNode.value) {
        xMax = mid
        if (currentNode.left === null) {
          insertNode(value, current, true, level + 1, xMin, xMax)
          break
        }
        current = currentNode.left
      } else {
        xMin = mid
        if (currentNode.right === null) {
          insertNode(value, current, false, level + 1, xMin, xMax)
          break
        }
        current = currentNode.right
      }
      level++

      // Prevent infinite loops and too deep trees
      if (level > 4) break
    }
  }

  treeNodes.value = newNodes
  treeEdges.value = newEdges

  // Reset traversal state
  resetTreeState()
}
