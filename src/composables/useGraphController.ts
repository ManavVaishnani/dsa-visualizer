import { ref } from 'vue'

export interface Node {
  id: number
  x: number
  y: number
  label: string
}

export interface Edge {
  from: number
  to: number
  weight?: number
}

export type GraphType = 'directed' | 'undirected'
export type VisualizationType = 'graph' | 'tree'

export const nodes = ref<Node[]>([])
export const edges = ref<Edge[]>([])
export const visitedNodes = ref<number[]>([])
export const currentNode = ref<number | null>(null)
export const queue = ref<number[]>([])
export const currentEdge = ref<{ from: number; to: number } | null>(null)

export const speed = ref(50)
export const isTraversing = ref(false)
export const isPaused = ref(false)
export const explanation = ref<string[]>([])
export const shortestPathEdges = ref<{ from: number; to: number }[]>([])

export type GraphAlgo = 'bfs' | 'dfs' | 'dijkstra' | 'astar' | 'prims' | 'kruskals' | 'bellmanford'
export const currentGraphAlgo = ref<GraphAlgo | null>(null)
export const algoInfo = ref<string[]>([])

export const distances = ref<Record<number, number>>({})
export const predecessors = ref<Record<number, number | null>>({})

export const setInitialInfo = (algo: GraphAlgo) => {
  currentGraphAlgo.value = algo
  const info: Record<GraphAlgo, string[]> = {
    bfs: [
      'ALGO: Breadth First Search (BFS)',
      'WHAT: Level-by-level traversal of a graph using a queue.',
      'WHY: Finds the shortest path in unweighted graphs.',
      'WHERE: Peer-to-peer networks, GPS navigation, social networks.',
    ],
    dfs: [
      'ALGO: Depth First Search (DFS)',
      'WHAT: Explores as far as possible along each branch before backtracking.',
      'WHY: Very memory efficient; great for pathfinding and cycle detection.',
      'WHERE: Solving puzzles, topological sorting, scheduling.',
    ],
    dijkstra: [
      'ALGO: Dijkstra\'s Algorithm',
      'WHAT: Finds the shortest paths from a source node to all other nodes in a weighted graph.',
      'WHY: Guaranteed to find the absolute shortest path if all edge weights are non-negative.',
      'WHERE: Google Maps, OSPF routing protocol, network pathfinding.',
    ],
    astar: [
      'ALGO: A* Search Algorithm',
      'WHAT: An informed search algorithm that uses both path cost and heuristics to find the shortest path.',
      'WHY: More efficient than Dijkstra as it uses a heuristic to guide the search towards the target.',
      'WHERE: Game AI, pathfinding in complex maps, robotics.',
    ],
    prims: [
      'ALGO: Prim\'s Algorithm',
      'WHAT: Finds the Minimum Spanning Tree (MST) for a weighted undirected graph.',
      'WHY: Guaranteed to find a subset of edges that connects all vertices with the minimum total weight.',
      'WHERE: Network design, laying cables, building transportation networks.',
    ],
    kruskals: [
      'ALGO: Kruskal\'s Algorithm',
      'WHAT: Finds the Minimum Spanning Tree (MST) by sorting edges and adding them if they don\'t form a cycle.',
      'WHY: Efficient for sparse graphs; easy to implement with Union-Find.',
      'WHERE: LAN network design, clustering, image segmentation.',
    ],
    bellmanford: [
      'ALGO: Bellman-Ford Algorithm',
      'WHAT: Finds the shortest paths from a source node to all other nodes, even with negative edge weights.',
      'WHY: Can handle negative edge weights and detect negative cycles (unlike Dijkstra).',
      'WHERE: Currency arbitrage detection, routing protocols (RIP), network flow analysis.',
    ],
  }
  algoInfo.value = info[algo]
  explanation.value = [...algoInfo.value]
  if (algo === 'dijkstra' || algo === 'astar' || algo === 'prims' || algo === 'kruskals' || algo === 'bellmanford') {
    visualizationType.value = 'graph'
    generateData()
  }
}
export const selectedStartNode = ref<number | null>(null)
export const selectedTargetNode = ref<number | null>(null)
export const targetFound = ref(false)
export const dfsCallStack = ref<number[]>([])
export const visitedCount = ref(0)
export const edgeExploredCount = ref(0)

export interface Step {
  visitedNodes: number[]
  currentNode: number | null
  queue: number[]
  currentEdge: { from: number; to: number } | null
  dfsCallStack: number[]
  visitedCount: number
  edgeExploredCount: number
  targetFound: boolean
  distances?: Record<number, number>
  predecessors?: Record<number, number | null>
  shortestPathEdges?: { from: number; to: number }[]
  description?: string
}

export const steps = ref<Step[]>([])
export const stepIndex = ref(-1)
export const isPlaying = ref(false)
const playTimer = ref<ReturnType<typeof setInterval> | null>(null)

export const graphType = ref<GraphType>('undirected')
export const visualizationType = ref<VisualizationType>('graph')

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Generate a sample tree (Binary Tree)
export const generateTree = () => {
  if (isTraversing.value) return

  const maxDepth = Math.floor(Math.random() * 2) + 3 // Depth 3 or 4
  const width = 800
  const height = 600
  const marginX = 80
  const marginYTop = 120
  const marginYBottom = 120

  // Calculate vertical space ensuring padding at top and bottom
  const availableHeight = height - marginYTop - marginYBottom
  const levelHeight = availableHeight / Math.max(1, maxDepth)

  const newNodes: Node[] = []
  const newEdges: Edge[] = []
  let nodeId = 0

  const createNode = (level: number, xPos: number, labelSuffix: string = '') => {
    const id = nodeId++
    return {
      id,
      x: xPos,
      y: marginYTop + level * levelHeight,
      label: String.fromCharCode(65 + id) + labelSuffix,
    }
  }

  // Root node
  const root = createNode(0, width / 2)
  newNodes.push(root)

  interface TreeNode {
    node: Node
    level: number
    xRange: [number, number]
  }

  const queue: TreeNode[] = [{ node: root, level: 0, xRange: [marginX, width - marginX] }]

  while (queue.length > 0 && newNodes.length < 15) {
    const { node, level, xRange } = queue.shift()!
    if (level >= maxDepth) continue

    // Randomly decide children
    const leftExists = node.id === 0 ? true : Math.random() > 0.3
    const rightExists = Math.random() > 0.3

    const mid = (xRange[0] + xRange[1]) / 2

    if (leftExists) {
      const leftChild = createNode(level + 1, (xRange[0] + mid) / 2)
      newNodes.push(leftChild)
      newEdges.push({ from: node.id, to: leftChild.id, weight: Math.floor(Math.random() * 9) + 1 })
      queue.push({ node: leftChild, level: level + 1, xRange: [xRange[0], mid] })
    }

    if (rightExists) {
      const rightChild = createNode(level + 1, (mid + xRange[1]) / 2)
      newNodes.push(rightChild)
      newEdges.push({ from: node.id, to: rightChild.id, weight: Math.floor(Math.random() * 9) + 1 })
      queue.push({ node: rightChild, level: level + 1, xRange: [mid, xRange[1]] })
    }
  }

  nodes.value = newNodes
  edges.value = newEdges

  // Reset traversal state
  resetGraphState()
}

const resetGraphState = () => {
  visitedNodes.value = []
  currentNode.value = null
  queue.value = []
  currentEdge.value = null
  selectedStartNode.value = null
  selectedTargetNode.value = null
  targetFound.value = false
  dfsCallStack.value = []
  visitedCount.value = 0
  edgeExploredCount.value = 0
  distances.value = {}
  predecessors.value = {}
  shortestPathEdges.value = []
}

// Generate a sample graph or tree based on visualizationType
export const generateData = () => {
  if (visualizationType.value === 'tree') {
    generateTree()
  } else {
    generateGraph()
  }
}

// Generate a sample graph
export const generateGraph = () => {
  if (isTraversing.value) return

  const nodeCount = Math.floor(Math.random() * 4) + 6 // 6–9 nodes
  const width = 800
  const height = 600
  const marginX = 80
  const marginTop = 120
  const marginBottom = 120

  // 1️⃣ Generate random nodes with minimum distance
  const newNodes: Node[] = []
  const minNodeDistance = 100 // Minimum distance between nodes

  for (let i = 0; i < nodeCount; i++) {
    let x, y, tooClose
    let attempts = 0
    do {
      tooClose = false
      x = Math.random() * (width - marginX * 2) + marginX
      y = Math.random() * (height - marginTop - marginBottom) + marginTop

      for (const node of newNodes) {
        const dx = x - node.x
        const dy = y - node.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < minNodeDistance) {
          tooClose = true
          break
        }
      }
      attempts++
    } while (tooClose && attempts < 100)

    newNodes.push({
      id: i,
      x,
      y,
      label: String.fromCharCode(65 + i),
    })
  }
  nodes.value = newNodes

  const newEdges: Edge[] = []

  // Helper to avoid duplicate edges
  const edgeExists = (a: number, b: number) =>
    newEdges.some((e) => (e.from === a && e.to === b) || (e.from === b && e.to === a))

  // 2️⃣ Create a spanning tree (ensures connectivity)
  for (let i = 1; i < nodeCount; i++) {
    const parent = Math.floor(Math.random() * i)
    newEdges.push({ from: parent, to: i, weight: Math.floor(Math.random() * 9) + 1 })
  }

  // 3️⃣ Add extra random edges
  const extraEdges = Math.floor(Math.random() * nodeCount)

  for (let i = 0; i < extraEdges; i++) {
    const from = Math.floor(Math.random() * nodeCount)
    const to = Math.floor(Math.random() * nodeCount)

    if (from !== to && !edgeExists(from, to)) {
      newEdges.push({ from, to, weight: Math.floor(Math.random() * 9) + 1 })
    }
  }

  edges.value = newEdges

  // 4️⃣ Reset traversal state
  resetGraphState()
}

const buildAdjacencyList = () => {
  const adjList: Record<number, number[]> = {}

  nodes.value.forEach((node) => {
    adjList[node.id] = []
  })

  edges.value.forEach((edge) => {
    adjList[edge.from].push(edge.to)

    if (graphType.value === 'undirected') {
      adjList[edge.to].push(edge.from)
    }
  })

  return adjList
}

const snapshot = (opts: Partial<Step> = {}): Step => ({
  visitedNodes: [...visitedNodes.value],
  currentNode: currentNode.value,
  queue: [...queue.value],
  currentEdge: currentEdge.value ? { ...currentEdge.value } : null,
  dfsCallStack: [...dfsCallStack.value],
  visitedCount: visitedCount.value,
  edgeExploredCount: edgeExploredCount.value,
  targetFound: targetFound.value,
  distances: { ...distances.value },
  predecessors: { ...predecessors.value },
  shortestPathEdges: [...shortestPathEdges.value],
  ...opts,
})

const applyStep = (index: number) => {
  const s = steps.value[index]
  if (!s) return

  visitedNodes.value = [...s.visitedNodes]
  currentNode.value = s.currentNode
  queue.value = [...s.queue]
  currentEdge.value = s.currentEdge ? { ...s.currentEdge } : null
  dfsCallStack.value = [...s.dfsCallStack]
  visitedCount.value = s.visitedCount
  edgeExploredCount.value = s.edgeExploredCount
  targetFound.value = s.targetFound
  distances.value = s.distances ? { ...s.distances } : {}
  predecessors.value = s.predecessors ? { ...s.predecessors } : {}
  shortestPathEdges.value = s.shortestPathEdges ? [...s.shortestPathEdges] : []

  if (s.description) {
    explanation.value.push(s.description)
  }
  stepIndex.value = index
}

export const nextStep = () => {
  if (stepIndex.value < steps.value.length - 1) {
    applyStep(stepIndex.value + 1)
  }
}

export const previousStep = () => {
  if (stepIndex.value > 0) {
    applyStep(stepIndex.value - 1)
  }
}

export const gotoStep = (index: number) => {
  if (index >= 0 && index < steps.value.length) applyStep(index)
}

export const playSteps = () => {
  if (isPlaying.value || steps.value.length === 0) return
  isPlaying.value = true
  const delay = Math.max(50, 1000 - speed.value * 9)
  playTimer.value = setInterval(() => {
    if (stepIndex.value < steps.value.length - 1) nextStep()
    else stopPlaying()
  }, delay)
}

export const stopPlaying = () => {
  if (playTimer.value) clearInterval(playTimer.value)
  playTimer.value = null
  isPlaying.value = false
}

export const resetSteps = () => {
  stopPlaying()
  steps.value = []
  stepIndex.value = -1
  if (currentGraphAlgo.value) {
    setInitialInfo(currentGraphAlgo.value)
  } else {
    explanation.value = []
  }
  resetGraph()
}

// BFS Algorithm
export const runBFS = async (start?: number) => {
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

export const generateBFSSteps = (start?: number): Step[] => {
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

// DFS Algorithm
export const runDFS = async (start?: number) => {
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

  const dfs = async (node: number) => {
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

export const generateDFSSteps = (start?: number): Step[] => {
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

  const dfs = (node: number) => {
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

// Dijkstra's Algorithm
export const runDijkstra = async (start?: number) => {
  visitedCount.value = 0
  edgeExploredCount.value = 0

  const startNode = start ?? selectedStartNode.value
  if (startNode === null || isTraversing.value || nodes.value.length === 0) return

  isTraversing.value = true
  isPaused.value = false

  visitedNodes.value = []
  currentNode.value = null
  queue.value = []
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

export const generateDijkstraSteps = (start?: number): Step[] => {
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

// A* Algorithm
const getHeuristic = (nodeId: number, targetId: number) => {
  const node = nodes.value[nodeId]
  const target = nodes.value[targetId]
  if (!node || !target) return 0
  // Euclidean distance
  return Math.sqrt(Math.pow(node.x - target.x, 2) + Math.pow(node.y - target.y, 2)) / 50
}

export const runAStar = async (start?: number) => {
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
  queue.value = []
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

export const generateAStarSteps = (start?: number): Step[] => {
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

export const prepareBFSSteps = (start?: number, autoPlay = false) => {
  stopPlaying()
  distances.value = {}
  predecessors.value = {}
  shortestPathEdges.value = []
  explanation.value = [...algoInfo.value]
  explanation.value.push('Prepared BFS steps.')
  steps.value = generateBFSSteps(start)
  stepIndex.value = -1
  if (autoPlay) playSteps()
}

export const prepareDFSSteps = (start?: number, autoPlay = false) => {
  stopPlaying()
  distances.value = {}
  predecessors.value = {}
  shortestPathEdges.value = []
  explanation.value = [...algoInfo.value]
  explanation.value.push('Prepared DFS steps.')
  steps.value = generateDFSSteps(start)
  stepIndex.value = -1
  if (autoPlay) playSteps()
}

export const prepareDijkstraSteps = (start?: number, autoPlay = false) => {
  stopPlaying()
  explanation.value = [...algoInfo.value]
  explanation.value.push('Prepared Dijkstra steps.')
  steps.value = generateDijkstraSteps(start)
  stepIndex.value = -1
  if (autoPlay) playSteps()
}

export const prepareAStarSteps = (start?: number, autoPlay = false) => {
  stopPlaying()
  explanation.value = [...algoInfo.value]
  explanation.value.push('Prepared A* steps.')
  steps.value = generateAStarSteps(start)
  stepIndex.value = -1
  if (autoPlay) playSteps()
}

// Prim's Algorithm
export const runPrims = async (start?: number) => {
  visitedCount.value = 0
  edgeExploredCount.value = 0

  const startNode = start ?? selectedStartNode.value
  if (startNode === null || isTraversing.value || nodes.value.length === 0) return

  isTraversing.value = true
  isPaused.value = false

  visitedNodes.value = []
  currentNode.value = null
  queue.value = []
  currentEdge.value = null
  targetFound.value = false
  distances.value = {}
  predecessors.value = {}
  shortestPathEdges.value = []

  nodes.value.forEach((node) => {
    distances.value[node.id] = Infinity
    predecessors.value[node.id] = null
  })
  distances.value[startNode] = 0

  explanation.value = [...algoInfo.value]
  explanation.value.push("Starting Prim's Algorithm...")

  const adjList = buildAdjacencyList()
  const unvisitedSet = new Set(nodes.value.map((n) => n.id))

  while (unvisitedSet.size > 0) {
    while (isPaused.value) await sleep(100)

    let current: number | null = null
    let minDistance = Infinity

    unvisitedSet.forEach((nodeId) => {
      if (distances.value[nodeId] < minDistance) {
        minDistance = distances.value[nodeId]
        current = nodeId
      }
    })

    if (current === null || minDistance === Infinity) {
      explanation.value.push('Remaining nodes are unreachable.')
      break
    }

    currentNode.value = current
    explanation.value.push(
      `Selecting node ${nodes.value[current]?.label} with minimum edge weight ${minDistance === 0 ? '0 (start)' : minDistance}.`,
    )
    await sleep(1000 - speed.value * 9)

    unvisitedSet.delete(current)
    visitedNodes.value.push(current)
    visitedCount.value++

    if (predecessors.value[current] !== null) {
      shortestPathEdges.value.push({ from: predecessors.value[current]!, to: current })
      explanation.value.push(`Added edge ${nodes.value[predecessors.value[current]!]?.label} - ${nodes.value[current]?.label} to MST.`)
    }

    for (const neighborId of adjList[current]) {
      if (!unvisitedSet.has(neighborId)) continue

      const edge = edges.value.find(
        (e) =>
          (e.from === current && e.to === neighborId) ||
          (e.from === neighborId && e.to === current),
      )
      const weight = edge?.weight || 1

      currentEdge.value = { from: current, to: neighborId }
      explanation.value.push(`Checking neighbor ${nodes.value[neighborId]?.label} (edge weight: ${weight}).`)
      await sleep(500 - speed.value * 4)

      if (weight < distances.value[neighborId]) {
        distances.value[neighborId] = weight
        predecessors.value[neighborId] = current
        explanation.value.push(`Updated minimum edge weight for ${nodes.value[neighborId]?.label} to ${weight}.`)
      }
      currentEdge.value = null
    }

    currentNode.value = null
  }

  isTraversing.value = false
  explanation.value.push("Prim's Algorithm completed! Minimum Spanning Tree found.")
}

export const generatePrimsSteps = (start?: number): Step[] => {
  const startNode = start ?? selectedStartNode.value
  if (startNode === null || nodes.value.length === 0) return []

  const adjList = buildAdjacencyList()
  const stepList: Step[] = []

  const localDistances: Record<number, number> = {}
  const localPredecessors: Record<number, number | null> = {}
  const localVisited: number[] = []
  const localMSTEdges: { from: number; to: number }[] = []
  const unvisitedSet = new Set(nodes.value.map((n) => n.id))

  nodes.value.forEach((node) => {
    localDistances[node.id] = Infinity
    localPredecessors[node.id] = null
  })
  localDistances[startNode] = 0

  stepList.push(
    snapshot({
      distances: { ...localDistances },
      predecessors: { ...localPredecessors },
      description: 'Initialize: start node weight = 0, others = ∞',
    }),
  )

  while (unvisitedSet.size > 0) {
    let current: number | null = null
    let minDistance = Infinity

    unvisitedSet.forEach((nodeId) => {
      if (localDistances[nodeId] < minDistance) {
        minDistance = localDistances[nodeId]
        current = nodeId
      }
    })

    if (current === null || minDistance === Infinity) break

    stepList.push(
      snapshot({
        currentNode: current,
        distances: { ...localDistances },
        predecessors: { ...localPredecessors },
        visitedNodes: [...localVisited],
        shortestPathEdges: [...localMSTEdges],
        description: `Pick node ${nodes.value[current]?.label} with smallest edge weight (${minDistance === 0 ? '0' : minDistance})`,
      }),
    )

    unvisitedSet.delete(current)
    localVisited.push(current)

    if (localPredecessors[current] !== null) {
      localMSTEdges.push({ from: localPredecessors[current]!, to: current })
      stepList.push(
        snapshot({
          currentNode: current,
          distances: { ...localDistances },
          predecessors: { ...localPredecessors },
          visitedNodes: [...localVisited],
          shortestPathEdges: [...localMSTEdges],
          description: `Added edge ${nodes.value[localPredecessors[current]!]?.label} - ${nodes.value[current]?.label} to MST`,
        }),
      )
    }

    for (const neighborId of adjList[current]) {
      if (!unvisitedSet.has(neighborId)) continue

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
          shortestPathEdges: [...localMSTEdges],
          description: `Checking neighbor ${nodes.value[neighborId]?.label}`,
        }),
      )

      if (weight < localDistances[neighborId]) {
        localDistances[neighborId] = weight
        localPredecessors[neighborId] = current
        stepList.push(
          snapshot({
            currentNode: current,
            currentEdge: { from: current, to: neighborId },
            distances: { ...localDistances },
            predecessors: { ...localPredecessors },
            visitedNodes: [...localVisited],
            shortestPathEdges: [...localMSTEdges],
            description: `Updated weight for ${nodes.value[neighborId]?.label} to ${weight}`,
          }),
        )
      }
    }
    stepList.push(
      snapshot({
        currentNode: null,
        currentEdge: null,
        distances: { ...localDistances },
        predecessors: { ...localPredecessors },
        visitedNodes: [...localVisited],
        shortestPathEdges: [...localMSTEdges],
        description: `Finished processing neighbors of ${nodes.value[current]?.label}`,
      }),
    )
  }

  stepList.push(
    snapshot({
      currentNode: null,
      currentEdge: null,
      visitedNodes: [...localVisited],
      shortestPathEdges: [...localMSTEdges],
      distances: { ...localDistances },
      predecessors: { ...localPredecessors },
      description: "Prim's Algorithm completed. MST found.",
    }),
  )

  return stepList
}

export const preparePrimsSteps = (start?: number, autoPlay = false) => {
  stopPlaying()
  explanation.value = [...algoInfo.value]
  explanation.value.push("Prepared Prim's steps.")
  steps.value = generatePrimsSteps(start)
  stepIndex.value = -1
  if (autoPlay) playSteps()
}


// Kruskal's Algorithm
export const runKruskals = async () => {
  if (isTraversing.value || nodes.value.length === 0) return

  isTraversing.value = true
  isPaused.value = false

  visitedNodes.value = []
  currentNode.value = null
  queue.value = []
  currentEdge.value = null
  targetFound.value = false
  distances.value = {}
  predecessors.value = {}
  shortestPathEdges.value = []

  explanation.value = [...algoInfo.value]
  explanation.value.push("Starting Kruskal's Algorithm...")

  const sortedEdges = [...edges.value].sort((a, b) => (a.weight || 0) - (b.weight || 0))
  const parent: Record<number, number> = {}
  nodes.value.forEach((node) => (parent[node.id] = node.id))

  const find = (i: number): number => {
    if (parent[i] === i) return i
    return find(parent[i])
  }

  const union = (i: number, j: number) => {
    const rootI = find(i)
    const rootJ = find(j)
    if (rootI !== rootJ) {
      parent[rootI] = rootJ
      return true
    }
    return false
  }

  for (const edge of sortedEdges) {
    while (isPaused.value) await sleep(100)

    currentEdge.value = { from: edge.from, to: edge.to }
    explanation.value.push(
      `Checking edge ${nodes.value[edge.from]?.label} - ${nodes.value[edge.to]?.label} (weight: ${edge.weight}).`,
    )
    await sleep(1000 - speed.value * 9)

    if (find(edge.from) !== find(edge.to)) {
      union(edge.from, edge.to)
      shortestPathEdges.value.push({ from: edge.from, to: edge.to })
      explanation.value.push(
        `Added edge ${nodes.value[edge.from]?.label} - ${nodes.value[edge.to]?.label} to MST.`,
      )

      if (!visitedNodes.value.includes(edge.from)) visitedNodes.value.push(edge.from)
      if (!visitedNodes.value.includes(edge.to)) visitedNodes.value.push(edge.to)
    } else {
      explanation.value.push(
        `Edge ${nodes.value[edge.from]?.label} - ${nodes.value[edge.to]?.label} forms a cycle. Skipping.`,
      )
    }

    currentEdge.value = null
  }

  isTraversing.value = false
  explanation.value.push("Kruskal's Algorithm completed! Minimum Spanning Tree found.")
}

export const generateKruskalsSteps = (): Step[] => {
  if (nodes.value.length === 0) return []

  const stepList: Step[] = []
  const localVisited: number[] = []
  const localMSTEdges: { from: number; to: number }[] = []
  const parent: Record<number, number> = {}
  nodes.value.forEach((node) => (parent[node.id] = node.id))

  const find = (i: number): number => {
    if (parent[i] === i) return i
    return find(parent[i])
  }

  const union = (i: number, j: number) => {
    const rootI = find(i)
    const rootJ = find(j)
    if (rootI !== rootJ) {
      parent[rootI] = rootJ
      return true
    }
    return false
  }

  const sortedEdges = [...edges.value].sort((a, b) => (a.weight || 0) - (b.weight || 0))

  stepList.push(
    snapshot({
      description: 'Initialize: sort all edges by weight.',
    }),
  )

  for (const edge of sortedEdges) {
    stepList.push(
      snapshot({
        currentEdge: { from: edge.from, to: edge.to },
        visitedNodes: [...localVisited],
        shortestPathEdges: [...localMSTEdges],
        description: `Checking edge ${nodes.value[edge.from]?.label} - ${nodes.value[edge.to]?.label} (weight: ${edge.weight})`,
      }),
    )

    if (find(edge.from) !== find(edge.to)) {
      union(edge.from, edge.to)
      localMSTEdges.push({ from: edge.from, to: edge.to })
      if (!localVisited.includes(edge.from)) localVisited.push(edge.from)
      if (!localVisited.includes(edge.to)) localVisited.push(edge.to)

      stepList.push(
        snapshot({
          currentEdge: { from: edge.from, to: edge.to },
          visitedNodes: [...localVisited],
          shortestPathEdges: [...localMSTEdges],
          description: `Added edge ${nodes.value[edge.from]?.label} - ${nodes.value[edge.to]?.label} to MST (no cycle formed)`,
        }),
      )
    } else {
      stepList.push(
        snapshot({
          currentEdge: { from: edge.from, to: edge.to },
          visitedNodes: [...localVisited],
          shortestPathEdges: [...localMSTEdges],
          description: `Skipped edge ${nodes.value[edge.from]?.label} - ${nodes.value[edge.to]?.label} (forms a cycle)`,
        }),
      )
    }
  }

  stepList.push(
    snapshot({
      currentEdge: null,
      visitedNodes: [...localVisited],
      shortestPathEdges: [...localMSTEdges],
      description: "Kruskal's Algorithm completed. MST found.",
    }),
  )

  return stepList
}

export const prepareKruskalsSteps = (autoPlay = false) => {
  stopPlaying()
  explanation.value = [...algoInfo.value]
  explanation.value.push("Prepared Kruskal's steps.")
  steps.value = generateKruskalsSteps()
  stepIndex.value = -1
  if (autoPlay) playSteps()
}

// Bellman-Ford Algorithm
export const negativeCycleDetected = ref(false)

export const runBellmanFord = async (start?: number) => {
  visitedCount.value = 0
  edgeExploredCount.value = 0

  const startNode = start ?? selectedStartNode.value
  if (startNode === null || isTraversing.value || nodes.value.length === 0) return

  isTraversing.value = true
  isPaused.value = false

  visitedNodes.value = []
  currentNode.value = null
  queue.value = []
  currentEdge.value = null
  targetFound.value = false
  distances.value = {}
  predecessors.value = {}
  shortestPathEdges.value = []
  negativeCycleDetected.value = false

  // Initialize distances
  nodes.value.forEach((node) => {
    distances.value[node.id] = Infinity
    predecessors.value[node.id] = null
  })
  distances.value[startNode] = 0

  explanation.value = [...algoInfo.value]
  explanation.value.push('Starting Bellman-Ford Algorithm...')
  explanation.value.push(`Initialized all distances to ∞, source node ${nodes.value[startNode]?.label} distance = 0`)

  const nodeCount = nodes.value.length

  // Relax all edges V-1 times
  for (let i = 0; i < nodeCount - 1; i++) {
    while (isPaused.value) await sleep(100)

    explanation.value.push(`--- Iteration ${i + 1} of ${nodeCount - 1} ---`)
    let updated = false

    for (const edge of edges.value) {
      while (isPaused.value) await sleep(100)

      // For undirected graphs, consider both directions
      const directions = graphType.value === 'undirected'
        ? [{ from: edge.from, to: edge.to }, { from: edge.to, to: edge.from }]
        : [{ from: edge.from, to: edge.to }]

      for (const dir of directions) {
        const { from, to } = dir
        const weight = edge.weight || 1

        if (distances.value[from] === Infinity) continue

        currentEdge.value = { from, to }
        edgeExploredCount.value++
        await sleep(Math.max(50, 300 - speed.value * 2))

        const newDist = distances.value[from] + weight

        if (newDist < distances.value[to]) {
          distances.value[to] = newDist
          predecessors.value[to] = from
          updated = true
          explanation.value.push(
            `Relaxed edge ${nodes.value[from]?.label} → ${nodes.value[to]?.label}: distance updated to ${newDist}`
          )

          // Mark node as visited when its distance is updated
          if (!visitedNodes.value.includes(to)) {
            visitedNodes.value.push(to)
            visitedCount.value++
          }
        }

        currentEdge.value = null
      }
    }

    // Mark start node as visited
    if (!visitedNodes.value.includes(startNode)) {
      visitedNodes.value.push(startNode)
      visitedCount.value++
    }

    if (!updated) {
      explanation.value.push('No updates in this iteration. Algorithm can terminate early.')
      break
    }
  }

  // Check for negative cycles (V-th iteration)
  explanation.value.push('--- Checking for negative cycles ---')
  for (const edge of edges.value) {
    while (isPaused.value) await sleep(100)

    const directions = graphType.value === 'undirected'
      ? [{ from: edge.from, to: edge.to }, { from: edge.to, to: edge.from }]
      : [{ from: edge.from, to: edge.to }]

    for (const dir of directions) {
      const { from, to } = dir
      const weight = edge.weight || 1

      if (distances.value[from] === Infinity) continue

      currentEdge.value = { from, to }
      await sleep(Math.max(50, 200 - speed.value * 2))

      if (distances.value[from] + weight < distances.value[to]) {
        negativeCycleDetected.value = true
        explanation.value.push(`⚠️ NEGATIVE CYCLE DETECTED! Edge ${nodes.value[from]?.label} → ${nodes.value[to]?.label} can still be relaxed.`)
        currentEdge.value = null
        break
      }

      currentEdge.value = null
    }

    if (negativeCycleDetected.value) break
  }

  // Reconstruct shortest path if target is selected and no negative cycle
  if (!negativeCycleDetected.value && selectedTargetNode.value !== null && distances.value[selectedTargetNode.value] !== Infinity) {
    let curr = selectedTargetNode.value
    while (predecessors.value[curr] !== null) {
      const prev = predecessors.value[curr]!
      shortestPathEdges.value.push({ from: prev, to: curr })
      curr = prev
    }
    targetFound.value = true
    explanation.value.push('Shortest path highlighted!')
  }

  isTraversing.value = false
  if (negativeCycleDetected.value) {
    explanation.value.push('Bellman-Ford Algorithm completed. Negative cycle detected - shortest paths may not be valid!')
  } else {
    explanation.value.push('Bellman-Ford Algorithm completed! Shortest paths found.')
  }
}

export const generateBellmanFordSteps = (start?: number): Step[] => {
  const startNode = start ?? selectedStartNode.value
  if (startNode === null || nodes.value.length === 0) return []

  const stepList: Step[] = []
  const localDistances: Record<number, number> = {}
  const localPredecessors: Record<number, number | null> = {}
  const localVisited: number[] = []

  // Initialize distances
  nodes.value.forEach((node) => {
    localDistances[node.id] = Infinity
    localPredecessors[node.id] = null
  })
  localDistances[startNode] = 0

  stepList.push(
    snapshot({
      distances: { ...localDistances },
      predecessors: { ...localPredecessors },
      description: 'Initialize: source = 0, others = ∞',
    })
  )

  const nodeCount = nodes.value.length
  let hasNegativeCycle = false

  // Relax all edges V-1 times
  for (let i = 0; i < nodeCount - 1; i++) {
    stepList.push(
      snapshot({
        distances: { ...localDistances },
        predecessors: { ...localPredecessors },
        visitedNodes: [...localVisited],
        description: `Iteration ${i + 1} of ${nodeCount - 1}`,
      })
    )

    for (const edge of edges.value) {
      const directions = graphType.value === 'undirected'
        ? [{ from: edge.from, to: edge.to }, { from: edge.to, to: edge.from }]
        : [{ from: edge.from, to: edge.to }]

      for (const dir of directions) {
        const { from, to } = dir
        const weight = edge.weight || 1

        if (localDistances[from] === Infinity) continue

        stepList.push(
          snapshot({
            currentEdge: { from, to },
            distances: { ...localDistances },
            predecessors: { ...localPredecessors },
            visitedNodes: [...localVisited],
            description: `Checking edge ${nodes.value[from]?.label} → ${nodes.value[to]?.label} (weight: ${weight})`,
          })
        )

        const newDist = localDistances[from] + weight

        if (newDist < localDistances[to]) {
          localDistances[to] = newDist
          localPredecessors[to] = from

          if (!localVisited.includes(to)) {
            localVisited.push(to)
          }

          stepList.push(
            snapshot({
              currentEdge: { from, to },
              distances: { ...localDistances },
              predecessors: { ...localPredecessors },
              visitedNodes: [...localVisited],
              description: `Relaxed: ${nodes.value[to]?.label} distance updated to ${newDist}`,
            })
          )
        }
      }
    }

    if (!localVisited.includes(startNode)) {
      localVisited.push(startNode)
    }
  }

  // Check for negative cycles
  stepList.push(
    snapshot({
      currentEdge: null,
      distances: { ...localDistances },
      predecessors: { ...localPredecessors },
      visitedNodes: [...localVisited],
      description: 'Checking for negative cycles...',
    })
  )

  for (const edge of edges.value) {
    const directions = graphType.value === 'undirected'
      ? [{ from: edge.from, to: edge.to }, { from: edge.to, to: edge.from }]
      : [{ from: edge.from, to: edge.to }]

    for (const dir of directions) {
      const { from, to } = dir
      const weight = edge.weight || 1

      if (localDistances[from] === Infinity) continue

      if (localDistances[from] + weight < localDistances[to]) {
        hasNegativeCycle = true
        stepList.push(
          snapshot({
            currentEdge: { from, to },
            distances: { ...localDistances },
            predecessors: { ...localPredecessors },
            visitedNodes: [...localVisited],
            description: `⚠️ NEGATIVE CYCLE: Edge ${nodes.value[from]?.label} → ${nodes.value[to]?.label} can still be relaxed!`,
          })
        )
        break
      }
    }

    if (hasNegativeCycle) break
  }

  // Final step with shortest path
  const finalShortestPath: { from: number; to: number }[] = []
  if (!hasNegativeCycle && selectedTargetNode.value !== null && localVisited.includes(selectedTargetNode.value)) {
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
      targetFound: !hasNegativeCycle && selectedTargetNode.value !== null && localVisited.includes(selectedTargetNode.value),
      description: hasNegativeCycle
        ? 'Bellman-Ford completed. Negative cycle detected!'
        : 'Bellman-Ford completed. Shortest paths found.',
    })
  )

  return stepList
}

export const prepareBellmanFordSteps = (start?: number, autoPlay = false) => {
  stopPlaying()
  negativeCycleDetected.value = false
  explanation.value = [...algoInfo.value]
  explanation.value.push('Prepared Bellman-Ford steps.')
  steps.value = generateBellmanFordSteps(start)
  stepIndex.value = -1
  if (autoPlay) playSteps()
}

export const resetGraph = () => {
  if (isTraversing.value) return

  visitedNodes.value = []
  currentNode.value = null
  queue.value = []
  currentEdge.value = null
  selectedStartNode.value = null
  selectedTargetNode.value = null
  targetFound.value = false
  dfsCallStack.value = []
  visitedCount.value = 0
  edgeExploredCount.value = 0
  distances.value = {}
  predecessors.value = {}
  shortestPathEdges.value = []
}
