/**
 * A* Algorithm (Single Responsibility Principle)
 *
 * This module ONLY contains the A* algorithm implementation.
 */

import type { AlgorithmInfo } from '@/types/algorithm'
import {
  nodes,
  edges,
  visitedNodes,
  currentNode,
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
  visualizationType,
  generateData,
} from '../useGraphState'

// ============================================
// Algorithm Metadata
// ============================================

export const astarInfo: AlgorithmInfo = {
  name: 'A* Search Algorithm',
  timeComplexity: 'O((V + E) log V)',
  spaceComplexity: 'O(V)',
  description: 'An informed search algorithm that uses both path cost and heuristics to find the shortest path efficiently.',
}

// ============================================
// Heuristic Function
// ============================================

export function getHeuristic(nodeId: number, targetId: number): number {
  const node = nodes.value[nodeId]
  const target = nodes.value[targetId]
  if (!node || !target) return 0
  // Euclidean distance
  return Math.sqrt(Math.pow(node.x - target.x, 2) + Math.pow(node.y - target.y, 2)) / 50
}

// ============================================
// Algorithm Implementation
// ============================================

export async function runAStar(start?: number): Promise<void> {
  visitedCount.value = 0
  edgeExploredCount.value = 0

  const startNode = start ?? selectedStartNode.value
  const targetNode = selectedTargetNode.value

  if (startNode === null || targetNode === null || isTraversing.value || nodes.value.length === 0)
    return

  isTraversing.value = true
  isPaused.value = false

  visitedNodes.value = []
  currentNode.value = null
  currentEdge.value = null
  targetFound.value = false
  distances.value = {}
  predecessors.value = {}

  nodes.value.forEach((node) => {
    distances.value[node.id] = Infinity
    predecessors.value[node.id] = null
  })
  distances.value[startNode] = 0

  explanation.value = [...algoInfo.value]
  explanation.value.push('Starting A* Search algorithm...')

  const adjList = buildAdjacencyList()
  const openSet = new Set([startNode])
  const closedSet = new Set<number>()

  while (openSet.size > 0) {
    while (isPaused.value) await sleep(100)

    // Find node in openSet with minimum fScore
    let current: number | null = null
    let minFScore = Infinity

    openSet.forEach((nodeId) => {
      const fScore = distances.value[nodeId] + getHeuristic(nodeId, targetNode)
      if (fScore < minFScore) {
        minFScore = fScore
        current = nodeId
      }
    })

    if (current === null) break

    currentNode.value = current
    explanation.value.push(
      `Selecting node ${nodes.value[current]?.label} with fScore = ${minFScore.toFixed(1)} (g: ${distances.value[current]}, h: ${getHeuristic(current, targetNode).toFixed(1)}).`,
    )
    await sleep(1000 - speed.value * 9)

    if (current === targetNode) {
      explanation.value.push(`Target node ${nodes.value[current]?.label} reached!`)
      targetFound.value = true
      visitedNodes.value.push(current)
      visitedCount.value++
      break
    }

    openSet.delete(current)
    closedSet.add(current)
    visitedNodes.value.push(current)
    visitedCount.value++

    for (const neighborId of adjList[current]) {
      if (closedSet.has(neighborId)) continue

      const edge = edges.value.find(
        (e) =>
          (e.from === current && e.to === neighborId) ||
          (e.from === neighborId && e.to === current),
      )
      const weight = edge?.weight || 1

      currentEdge.value = { from: current, to: neighborId }
      explanation.value.push(
        `Checking neighbor ${nodes.value[neighborId]?.label} (edge weight: ${weight}).`,
      )
      await sleep(500 - speed.value * 4)

      const tentativeGScore = distances.value[current] + weight
      if (!openSet.has(neighborId) || tentativeGScore < distances.value[neighborId]) {
        predecessors.value[neighborId] = current
        distances.value[neighborId] = tentativeGScore
        if (!openSet.has(neighborId)) {
          openSet.add(neighborId)
          explanation.value.push(`Added ${nodes.value[neighborId]?.label} to open set.`)
        } else {
          explanation.value.push(`Found better path to ${nodes.value[neighborId]?.label}.`)
        }
      }
      currentEdge.value = null
    }

    currentNode.value = null
  }

  isTraversing.value = false
  if (targetFound.value && selectedTargetNode.value !== null) {
    let curr = selectedTargetNode.value
    while (predecessors.value[curr] !== null) {
      const prev = predecessors.value[curr]!
      shortestPathEdges.value.push({ from: prev, to: curr })
      curr = prev
    }
    explanation.value.push('Shortest path highlighted!')
  }
  explanation.value.push('A* Search algorithm completed!')
}

// ============================================
// Step Generation
// ============================================

export function generateAStarSteps(start?: number): Step[] {
  const startNode = start ?? selectedStartNode.value
  const targetNode = selectedTargetNode.value
  if (startNode === null || targetNode === null || nodes.value.length === 0) return []

  const adjList = buildAdjacencyList()
  const stepList: Step[] = []

  const localDistances: Record<number, number> = {}
  const localPredecessors: Record<number, number | null> = {}
  const localVisited: number[] = []
  const openSet = new Set([startNode])
  const closedSet = new Set<number>()

  nodes.value.forEach((node) => {
    localDistances[node.id] = Infinity
    localPredecessors[node.id] = null
  })
  localDistances[startNode] = 0

  stepList.push(
    snapshot({
      distances: { ...localDistances },
      predecessors: { ...localPredecessors },
      description: 'Initialize: source gScore = 0, others = ∞',
    }),
  )

  while (openSet.size > 0) {
    let current: number | null = null
    let minFScore = Infinity

    openSet.forEach((nodeId) => {
      const fScore = localDistances[nodeId] + getHeuristic(nodeId, targetNode)
      if (fScore < minFScore) {
        minFScore = fScore
        current = nodeId
      }
    })

    if (current === null) break

    stepList.push(
      snapshot({
        currentNode: current,
        distances: { ...localDistances },
        predecessors: { ...localPredecessors },
        visitedNodes: [...localVisited],
        description: `Pick node ${nodes.value[current]?.label} with smallest fScore (${minFScore.toFixed(1)})`,
      }),
    )

    if (current === targetNode) {
      localVisited.push(current)
      stepList.push(
        snapshot({
          currentNode: current,
          targetFound: true,
          visitedNodes: [...localVisited],
          description: `Target ${nodes.value[current]?.label} found!`,
        }),
      )
      break
    }

    openSet.delete(current)
    closedSet.add(current)
    localVisited.push(current)

    for (const neighborId of adjList[current]) {
      if (closedSet.has(neighborId)) continue

      const edge = edges.value.find(
        (e) =>
          (e.from === current && e.to === neighborId) ||
          (e.from === neighborId && e.to === current),
      )
      const weight = edge?.weight || 1

      stepList.push(
        snapshot({
          currentNode: current,
          currentEdge: { from: current, to: neighborId },
          distances: { ...localDistances },
          predecessors: { ...localPredecessors },
          visitedNodes: [...localVisited],
          description: `Checking neighbor ${nodes.value[neighborId]?.label}`,
        }),
      )

      const tentativeGScore = localDistances[current] + weight
      if (!openSet.has(neighborId) || tentativeGScore < localDistances[neighborId]) {
        localDistances[neighborId] = tentativeGScore
        localPredecessors[neighborId] = current
        if (!openSet.has(neighborId)) {
          openSet.add(neighborId)
        }
        stepList.push(
          snapshot({
            currentNode: current,
            currentEdge: { from: current, to: neighborId },
            distances: { ...localDistances },
            predecessors: { ...localPredecessors },
            visitedNodes: [...localVisited],
            description: `Updated gScore for ${nodes.value[neighborId]?.label} to ${tentativeGScore}`,
          }),
        )
      }
    }
  }

  const finalShortestPath: { from: number; to: number }[] = []
  if (selectedTargetNode.value !== null && localVisited.includes(selectedTargetNode.value)) {
    let curr = selectedTargetNode.value
    while (localPredecessors[curr] !== null) {
      const prev = localPredecessors[curr]!
      finalShortestPath.push({ from: prev, to: curr })
      curr = prev
    }
  }

  stepList.push(
    snapshot({
      currentNode: null,
      currentEdge: null,
      visitedNodes: [...localVisited],
      shortestPathEdges: finalShortestPath,
      distances: { ...localDistances },
      predecessors: { ...localPredecessors },
      description: 'A* Search completed. Shortest path found.',
    }),
  )

  return stepList
}

// ============================================
// Prepare Steps
// ============================================

export function prepareAStarSteps(start?: number, autoPlay = false): void {
  stopPlaying()
  explanation.value = [...algoInfo.value]
  explanation.value.push('Prepared A* steps.')
  steps.value = generateAStarSteps(start)
  stepIndex.value = -1
  if (autoPlay) playSteps()
}

// ============================================
// Initialize
// ============================================

export function initAStar(): void {
  currentGraphAlgo.value = 'astar'
  setAlgorithmInfo(astarInfo)
  visualizationType.value = 'graph'
  generateData()
}

export default {
  key: 'astar',
  info: astarInfo,
  run: runAStar,
  generateSteps: generateAStarSteps,
  prepareSteps: prepareAStarSteps,
  init: initAStar,
}
