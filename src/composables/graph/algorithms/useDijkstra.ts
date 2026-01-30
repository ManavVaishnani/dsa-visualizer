/**
 * Dijkstra's Algorithm (Single Responsibility Principle)
 *
 * This module ONLY contains Dijkstra's algorithm implementation.
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

export const dijkstraInfo: AlgorithmInfo = {
  name: "Dijkstra's Algorithm",
  timeComplexity: 'O((V + E) log V)',
  spaceComplexity: 'O(V)',
  description: 'Finds shortest paths from a source node to all other nodes in a weighted graph with non-negative weights.',
}

// ============================================
// Algorithm Implementation
// ============================================

export async function runDijkstra(start?: number): Promise<void> {
  visitedCount.value = 0
  edgeExploredCount.value = 0

  const startNode = start ?? selectedStartNode.value
  if (startNode === null || isTraversing.value || nodes.value.length === 0) return

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
  explanation.value.push("Starting Dijkstra's algorithm...")

  const adjList = buildAdjacencyList()
  const unvisited = new Set(nodes.value.map((n) => n.id))

  while (unvisited.size > 0) {
    while (isPaused.value) await sleep(100)

    // Find node with minimum distance
    let current: number | null = null
    let minDist = Infinity

    unvisited.forEach((nodeId) => {
      if (distances.value[nodeId] < minDist) {
        minDist = distances.value[nodeId]
        current = nodeId
      }
    })

    if (current === null || minDist === Infinity) break

    currentNode.value = current
    explanation.value.push(`Selecting node ${nodes.value[current]?.label} with distance ${minDist}.`)
    await sleep(1000 - speed.value * 9)

    if (current === selectedTargetNode.value) {
      explanation.value.push(`Target node ${nodes.value[current]?.label} reached!`)
      targetFound.value = true
      visitedNodes.value.push(current)
      visitedCount.value++
      break
    }

    unvisited.delete(current)
    visitedNodes.value.push(current)
    visitedCount.value++

    for (const neighborId of adjList[current]) {
      if (!unvisited.has(neighborId)) continue

      const edge = edges.value.find(
        (e) =>
          (e.from === current && e.to === neighborId) ||
          (e.from === neighborId && e.to === current),
      )
      const weight = edge?.weight || 1

      currentEdge.value = { from: current, to: neighborId }
      explanation.value.push(
        `Relaxing edge ${nodes.value[current]?.label} -> ${nodes.value[neighborId]?.label} (weight: ${weight}).`,
      )
      await sleep(500 - speed.value * 4)

      const newDist = distances.value[current] + weight
      if (newDist < distances.value[neighborId]) {
        distances.value[neighborId] = newDist
        predecessors.value[neighborId] = current
        explanation.value.push(`Updated distance for ${nodes.value[neighborId]?.label} to ${newDist}.`)
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
  explanation.value.push("Dijkstra's algorithm completed!")
}

// ============================================
// Step Generation
// ============================================

export function generateDijkstraSteps(start?: number): Step[] {
  const startNode = start ?? selectedStartNode.value
  if (startNode === null || nodes.value.length === 0) return []

  const adjList = buildAdjacencyList()
  const stepList: Step[] = []

  const localDistances: Record<number, number> = {}
  const localPredecessors: Record<number, number | null> = {}
  const localVisited: number[] = []
  const unvisited = new Set(nodes.value.map((n) => n.id))

  nodes.value.forEach((node) => {
    localDistances[node.id] = Infinity
    localPredecessors[node.id] = null
  })
  localDistances[startNode] = 0

  stepList.push(
    snapshot({
      distances: { ...localDistances },
      predecessors: { ...localPredecessors },
      description: 'Initialize distances: source = 0, others = ∞',
    }),
  )

  while (unvisited.size > 0) {
    let current: number | null = null
    let minDist = Infinity

    unvisited.forEach((nodeId) => {
      if (localDistances[nodeId] < minDist) {
        minDist = localDistances[nodeId]
        current = nodeId
      }
    })

    if (current === null || minDist === Infinity) break

    stepList.push(
      snapshot({
        currentNode: current,
        distances: { ...localDistances },
        predecessors: { ...localPredecessors },
        visitedNodes: [...localVisited],
        description: `Pick unvisited node ${nodes.value[current]?.label} with smallest distance (${minDist})`,
      }),
    )

    if (current === selectedTargetNode.value) {
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

    unvisited.delete(current)
    localVisited.push(current)

    for (const neighborId of adjList[current]) {
      if (!unvisited.has(neighborId)) continue

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
          description: `Relaxing edge ${nodes.value[current]?.label} -> ${nodes.value[neighborId]?.label}`,
        }),
      )

      const newDist = localDistances[current] + weight
      if (newDist < localDistances[neighborId]) {
        localDistances[neighborId] = newDist
        localPredecessors[neighborId] = current
        stepList.push(
          snapshot({
            currentNode: current,
            currentEdge: { from: current, to: neighborId },
            distances: { ...localDistances },
            predecessors: { ...localPredecessors },
            visitedNodes: [...localVisited],
            description: `Updated distance for ${nodes.value[neighborId]?.label} to ${newDist}`,
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
      description: 'Dijkstra completed. Shortest path found.',
    }),
  )

  return stepList
}

// ============================================
// Prepare Steps
// ============================================

export function prepareDijkstraSteps(autoPlay = false): void {
  stopPlaying()
  explanation.value = [...algoInfo.value]
  steps.value = generateDijkstraSteps()
  stepIndex.value = -1
  if (autoPlay) playSteps()
}

// ============================================
// Initialize
// ============================================

export function initDijkstra(): void {
  currentGraphAlgo.value = 'dijkstra'
  setAlgorithmInfo(dijkstraInfo)
  visualizationType.value = 'graph'
  generateData()
}

export default {
  key: 'dijkstra',
  info: dijkstraInfo,
  run: runDijkstra,
  generateSteps: generateDijkstraSteps,
  prepareSteps: prepareDijkstraSteps,
  init: initDijkstra,
}
