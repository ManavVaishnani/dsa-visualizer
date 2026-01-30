/**
 * BFS Algorithm (Single Responsibility Principle)
 *
 * This module ONLY contains the BFS algorithm implementation.
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
} from '../useGraphState'

// ============================================
// Algorithm Metadata
// ============================================

export const bfsInfo: AlgorithmInfo = {
  name: 'Breadth First Search (BFS)',
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  description: 'Level-by-level traversal of a graph using a queue. Finds shortest path in unweighted graphs.',
}

// ============================================
// Algorithm Implementation
// ============================================

export async function runBFS(start?: number): Promise<void> {
  visitedCount.value = 0
  edgeExploredCount.value = 0

  const startNode = start ?? selectedStartNode.value

  if (startNode === null || isTraversing.value || nodes.value.length === 0) return

  isTraversing.value = true
  isPaused.value = false

  // Reset visualization state
  visitedNodes.value = []
  currentNode.value = null
  queue.value = []
  currentEdge.value = null
  targetFound.value = false
  distances.value = {}
  predecessors.value = {}
  shortestPathEdges.value = []
  explanation.value = [...algoInfo.value]
  explanation.value.push('Starting BFS traversal...')

  // Build adjacency list
  const adjList = buildAdjacencyList()

  const visited = new Set<number>([startNode])
  const exploredEdges = new Set<string>()

  queue.value = [startNode]

  while (queue.value.length > 0) {
    while (isPaused.value) await sleep(100)

    const node = queue.value.shift()!
    currentNode.value = node
    explanation.value.push(`Visiting node ${nodes.value[node]?.label}.`)

    await sleep(1000 - speed.value * 9)

    visitedNodes.value.push(node)
    visitedCount.value++
    currentNode.value = null
    explanation.value.push(`Marked ${nodes.value[node]?.label} as visited.`)

    if (node === selectedTargetNode.value) {
      explanation.value.push(`Target node ${nodes.value[node]?.label} reached!`)
      targetFound.value = true
      break
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

        visited.add(neighbor)
        queue.value.push(neighbor)
        explanation.value.push(`Neighbor ${nodes.value[neighbor]?.label} added to queue.`)

        currentEdge.value = null
      }
    }
  }

  currentNode.value = null
  queue.value = []
  isTraversing.value = false
  explanation.value.push('BFS traversal completed!')
}

// ============================================
// Step Generation
// ============================================

export function generateBFSSteps(start?: number): Step[] {
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

  const visited = new Set<number>([startNode])
  const exploredEdges = new Set<string>()

  const stepList: Step[] = []

  // initial state
  localQueue.push(startNode)
  stepList.push({
    visitedNodes: [...localVisited],
    currentNode: localCurrent,
    queue: [...localQueue],
    currentEdge: localEdge,
    dfsCallStack: [...localDfsStack],
    visitedCount: localVisitedCount,
    edgeExploredCount: localEdgeCount,
    targetFound: false,
    description: 'start',
  })

  while (localQueue.length > 0) {
    const node = localQueue.shift()!
    localCurrent = node
    stepList.push(
      snapshot({
        visitedNodes: [...localVisited],
        currentNode: localCurrent,
        queue: [...localQueue],
        currentEdge: localEdge,
        dfsCallStack: [...localDfsStack],
        visitedCount: localVisitedCount,
        edgeExploredCount: localEdgeCount,
        description: `visiting ${node}`,
      }),
    )

    // mark visited
    localVisited.push(node)
    localVisitedCount++
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
      break
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

        visited.add(neighbor)
        localQueue.push(neighbor)

        stepList.push(
          snapshot({
            visitedNodes: [...localVisited],
            currentNode: localCurrent,
            queue: [...localQueue],
            currentEdge: null,
            dfsCallStack: [...localDfsStack],
            visitedCount: localVisitedCount,
            edgeExploredCount: localEdgeCount,
            description: `enqueue ${neighbor}`,
          }),
        )

        localEdge = null
      }
    }
  }

  stepList.push(snapshot({ targetFound: targetFound.value, description: 'finished' }))
  return stepList
}

// ============================================
// Prepare Steps (for step-by-step)
// ============================================

import { steps, stepIndex, playSteps, stopPlaying, setAlgorithmInfo, currentGraphAlgo } from '../useGraphState'

export function prepareBFSSteps(autoPlay = false): void {
  stopPlaying()
  explanation.value = [...algoInfo.value]
  steps.value = generateBFSSteps()
  stepIndex.value = -1
  if (autoPlay) playSteps()
}

// ============================================
// Initialize
// ============================================

export function initBFS(): void {
  currentGraphAlgo.value = 'bfs'
  setAlgorithmInfo(bfsInfo)
}

export default {
  key: 'bfs',
  info: bfsInfo,
  run: runBFS,
  generateSteps: generateBFSSteps,
  prepareSteps: prepareBFSSteps,
  init: initBFS,
}
