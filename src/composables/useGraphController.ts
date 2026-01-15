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

export type GraphAlgo = 'bfs' | 'dfs'
export const currentGraphAlgo = ref<GraphAlgo | null>(null)
export const algoInfo = ref<string[]>([])

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
  }
  algoInfo.value = info[algo]
  explanation.value = [...algoInfo.value]
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
      newEdges.push({ from: node.id, to: leftChild.id })
      queue.push({ node: leftChild, level: level + 1, xRange: [xRange[0], mid] })
    }

    if (rightExists) {
      const rightChild = createNode(level + 1, (mid + xRange[1]) / 2)
      newNodes.push(rightChild)
      newEdges.push({ from: node.id, to: rightChild.id })
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
    newEdges.push({ from: parent, to: i })
  }

  // 3️⃣ Add extra random edges
  const extraEdges = Math.floor(Math.random() * nodeCount)

  for (let i = 0; i < extraEdges; i++) {
    const from = Math.floor(Math.random() * nodeCount)
    const to = Math.floor(Math.random() * nodeCount)

    if (from !== to && !edgeExists(from, to)) {
      newEdges.push({ from, to })
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

export const prepareBFSSteps = (start?: number, autoPlay = false) => {
  stopPlaying()
  explanation.value = [...algoInfo.value]
  explanation.value.push('Prepared BFS steps.')
  steps.value = generateBFSSteps(start)
  stepIndex.value = -1
  if (autoPlay) playSteps()
}

export const prepareDFSSteps = (start?: number, autoPlay = false) => {
  stopPlaying()
  explanation.value = [...algoInfo.value]
  explanation.value.push('Prepared DFS steps.')
  steps.value = generateDFSSteps(start)
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
}
