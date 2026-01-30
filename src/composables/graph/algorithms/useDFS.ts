/**
 * DFS Algorithm (Single Responsibility Principle)
 *
 * This module ONLY contains the DFS algorithm implementation.
 */

import type { AlgorithmInfo } from '@/types/algorithm'
import {
  nodes,
  visitedNodes,
  currentNode,
  queue,
  currentEdge,
  speed,
  isTraversing,
  isPaused,
  explanation,
  algoInfo,
  selectedStartNode,
  selectedTargetNode,
  targetFound,
  dfsCallStack,
  visitedCount,
  edgeExploredCount,
  graphType,
  shortestPathEdges,
  distances,
  predecessors,
  sleep,
  buildAdjacencyList,
  snapshot,
  type Step,
  steps,
  stepIndex,
  playSteps,
  stopPlaying,
  setAlgorithmInfo,
  currentGraphAlgo,
} from '../useGraphState'

// ============================================
// Algorithm Metadata
// ============================================

export const dfsInfo: AlgorithmInfo = {
  name: 'Depth First Search (DFS)',
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  description: 'Explores as far as possible along each branch before backtracking. Great for pathfinding and cycle detection.',
}

// ============================================
// Algorithm Implementation
// ============================================

export async function runDFS(start?: number): Promise<void> {
  visitedCount.value = 0
  edgeExploredCount.value = 0

  const startNode = start ?? selectedStartNode.value

  if (startNode === null || isTraversing.value || nodes.value.length === 0) return

  isTraversing.value = true
  isPaused.value = false

  visitedNodes.value = []
  currentNode.value = null
  currentEdge.value = null
  queue.value = []
  targetFound.value = false
  dfsCallStack.value = []
  distances.value = {}
  predecessors.value = {}
  shortestPathEdges.value = []
  explanation.value = [...algoInfo.value]
  explanation.value.push('Starting DFS traversal...')

  // Build adjacency list
  const adjList = buildAdjacencyList()

  const visited = new Set<number>()
  const exploredEdges = new Set<string>()

  const dfs = async (node: number): Promise<boolean> => {
    while (isPaused.value) await sleep(100)

    dfsCallStack.value.push(node)

    visited.add(node)
    visitedCount.value++
    currentNode.value = node
    explanation.value.push(`Visiting node ${nodes.value[node]?.label}.`)

    await sleep(1000 - speed.value * 9)

    visitedNodes.value.push(node)
    currentNode.value = null
    explanation.value.push(`Marked ${nodes.value[node]?.label} as visited.`)

    if (node === selectedTargetNode.value) {
      explanation.value.push(`Target node ${nodes.value[node]?.label} reached!`)
      targetFound.value = true
      return true // Found target
    }

    for (const neighbor of adjList[node]) {
      while (isPaused.value) await sleep(100)

      const edgeKey =
        graphType.value === 'directed' ? `${node}->${neighbor}` : [node, neighbor].sort().join('-')

      if (!visited.has(neighbor)) {
        if (!exploredEdges.has(edgeKey)) {
          exploredEdges.add(edgeKey)
          edgeExploredCount.value++
        }

        currentEdge.value = { from: node, to: neighbor }
        explanation.value.push(
          `Exploring edge ${nodes.value[node]?.label} -> ${nodes.value[neighbor]?.label}.`,
        )
        await sleep(500 - speed.value * 4)
        currentEdge.value = null

        if (await dfs(neighbor)) return true // Found target in subtree
      }
    }

    dfsCallStack.value.pop()
    return false
  }

  await dfs(startNode)

  dfsCallStack.value = []
  currentNode.value = null
  currentEdge.value = null
  isTraversing.value = false
  explanation.value.push('DFS traversal completed!')
}

// ============================================
// Step Generation
// ============================================

export function generateDFSSteps(start?: number): Step[] {
  const startNode = start ?? selectedStartNode.value
  if (startNode === null || nodes.value.length === 0) return []

  const adjList = buildAdjacencyList()

  const localVisited: number[] = []
  let localCurrent: number | null = null
  const localQueue: number[] = []
  let localEdge: { from: number; to: number } | null = null
  const localDfsStack: number[] = []
  let localVisitedCount = 0
  let localEdgeCount = 0

  const visited = new Set<number>()
  const exploredEdges = new Set<string>()

  const stepList: Step[] = []

  const dfs = (node: number): boolean => {
    localDfsStack.push(node)
    localCurrent = node
    visited.add(node)
    localVisitedCount++
    stepList.push(
      snapshot({
        visitedNodes: [...localVisited],
        currentNode: localCurrent,
        queue: [...localQueue],
        currentEdge: localEdge,
        dfsCallStack: [...localDfsStack],
        visitedCount: localVisitedCount,
        edgeExploredCount: localEdgeCount,
        description: `enter ${node}`,
      }),
    )

    localVisited.push(node)
    stepList.push(
      snapshot({
        visitedNodes: [...localVisited],
        currentNode: null,
        queue: [...localQueue],
        currentEdge: localEdge,
        dfsCallStack: [...localDfsStack],
        visitedCount: localVisitedCount,
        edgeExploredCount: localEdgeCount,
        description: `visited ${node}`,
      }),
    )

    if (node === selectedTargetNode.value) {
      stepList.push(
        snapshot({
          targetFound: true,
          description: `Target ${nodes.value[node]?.label} found!`,
        }),
      )
      return true
    }

    for (const neighbor of adjList[node]) {
      const edgeKey =
        graphType.value === 'directed' ? `${node}->${neighbor}` : [node, neighbor].sort().join('-')

      if (!visited.has(neighbor)) {
        if (!exploredEdges.has(edgeKey)) {
          exploredEdges.add(edgeKey)
          localEdgeCount++
        }

        localEdge = { from: node, to: neighbor }
        stepList.push(
          snapshot({
            visitedNodes: [...localVisited],
            currentNode: localCurrent,
            queue: [...localQueue],
            currentEdge: localEdge,
            dfsCallStack: [...localDfsStack],
            visitedCount: localVisitedCount,
            edgeExploredCount: localEdgeCount,
            description: `explore ${node}->${neighbor}`,
          }),
        )

        localEdge = null
        if (dfs(neighbor)) return true
      }
    }

    localDfsStack.pop()
    stepList.push(
      snapshot({
        visitedNodes: [...localVisited],
        currentNode: null,
        queue: [...localQueue],
        currentEdge: null,
        dfsCallStack: [...localDfsStack],
        visitedCount: localVisitedCount,
        edgeExploredCount: localEdgeCount,
        description: `backtrack ${node}`,
      }),
    )
    return false
  }

  // initial
  stepList.push(snapshot({ targetFound: false, description: 'start' }))
  dfs(startNode)
  stepList.push(snapshot({ targetFound: targetFound.value, description: 'finished' }))

  return stepList
}

// ============================================
// Prepare Steps
// ============================================

export function prepareDFSSteps(autoPlay = false): void {
  stopPlaying()
  explanation.value = [...algoInfo.value]
  steps.value = generateDFSSteps()
  stepIndex.value = -1
  if (autoPlay) playSteps()
}

// ============================================
// Initialize
// ============================================

export function initDFS(): void {
  currentGraphAlgo.value = 'dfs'
  setAlgorithmInfo(dfsInfo)
}

export default {
  key: 'dfs',
  info: dfsInfo,
  run: runDFS,
  generateSteps: generateDFSSteps,
  prepareSteps: prepareDFSSteps,
  init: initDFS,
}
