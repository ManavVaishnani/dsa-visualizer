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

export const nodes = ref<Node[]>([])
export const edges = ref<Edge[]>([])
export const visitedNodes = ref<number[]>([])
export const currentNode = ref<number | null>(null)
export const queue = ref<number[]>([])
export const currentEdge = ref<{ from: number; to: number } | null>(null)

export const speed = ref(50)
export const isTraversing = ref(false)
export const isPaused = ref(false)
export const selectedStartNode = ref<number | null>(null)
export const dfsCallStack = ref<number[]>([])
export const visitedCount = ref(0)
export const edgeExploredCount = ref(0)


const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms))

// Generate a sample graph
export const generateGraph = () => {
    if (isTraversing.value) return

    const nodeCount = Math.floor(Math.random() * 4) + 6 // 6–9 nodes
    const width = 800
    const height = 600
    const margin = 80

    // 1️⃣ Generate random nodes
    nodes.value = Array.from({ length: nodeCount }, (_, i) => ({
        id: i,
        x: Math.random() * (width - margin * 2) + margin,
        y: Math.random() * (height - margin * 2) + margin,
        label: String.fromCharCode(65 + i), // A, B, C...
    }))

    const newEdges: Edge[] = []

    // Helper to avoid duplicate edges
    const edgeExists = (a: number, b: number) =>
        newEdges.some(
            e =>
                (e.from === a && e.to === b) ||
                (e.from === b && e.to === a)
        )

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
    visitedNodes.value = []
    currentNode.value = null
    queue.value = []
    currentEdge.value = null
    selectedStartNode.value = null
    dfsCallStack.value = []
    visitedCount.value = 0
    edgeExploredCount.value = 0

}


// BFS Algorithm
export const runBFS = async (start?: number) => {
    visitedCount.value = 0
    edgeExploredCount.value = 0

    const startNode = start ?? selectedStartNode.value

    if (
        startNode === null ||
        isTraversing.value ||
        nodes.value.length === 0
    ) return

    isTraversing.value = true
    isPaused.value = false

    // Reset visualization state
    visitedNodes.value = []
    currentNode.value = null
    queue.value = []
    currentEdge.value = null

    // Build adjacency list
    const adjList: Record<number, number[]> = {}
    nodes.value.forEach(node => {
        adjList[node.id] = []
    })
    edges.value.forEach(edge => {
        adjList[edge.from].push(edge.to)
        adjList[edge.to].push(edge.from) // Undirected graph
    })

    const visited = new Set<number>([startNode])
    const exploredEdges = new Set<string>()

    queue.value = [startNode]

    while (queue.value.length > 0) {
        while (isPaused.value) await sleep(100)

        const node = queue.value.shift()!
        currentNode.value = node

        await sleep(1000 - speed.value * 9)

        visitedNodes.value.push(node)
        visitedCount.value++
        currentNode.value = null

        for (const neighbor of adjList[node]) {
            while (isPaused.value) await sleep(100)

            const edgeKey = [node, neighbor].sort().join('-')

            if (!visited.has(neighbor)) {

                if (!exploredEdges.has(edgeKey)) {
                    exploredEdges.add(edgeKey)
                    edgeExploredCount.value++
                }

                currentEdge.value = { from: node, to: neighbor }
                await sleep(500 - speed.value * 4)

                visited.add(neighbor)
                queue.value.push(neighbor)

                currentEdge.value = null
            }
        }
    }

    currentNode.value = null
    queue.value = []
    isTraversing.value = false
}

// DFS Algorithm
export const runDFS = async (start?: number) => {
    visitedCount.value = 0
    edgeExploredCount.value = 0

    const startNode = start ?? selectedStartNode.value

    if (
        startNode === null ||
        isTraversing.value ||
        nodes.value.length === 0
    ) return

    isTraversing.value = true
    isPaused.value = false

    visitedNodes.value = []
    currentNode.value = null
    currentEdge.value = null
    queue.value = []
    dfsCallStack.value = []

    // Build adjacency list
    const adjList: Record<number, number[]> = {}
    nodes.value.forEach(node => {
        adjList[node.id] = []
    })
    edges.value.forEach(edge => {
        adjList[edge.from].push(edge.to)
        adjList[edge.to].push(edge.from)
    })

    const visited = new Set<number>()

    const exploredEdges = new Set<string>()

    const dfs = async (node: number) => {
        while (isPaused.value) await sleep(100)

        dfsCallStack.value.push(node)

        visited.add(node)
        visitedCount.value++
        currentNode.value = node

        await sleep(1000 - speed.value * 9)

        visitedNodes.value.push(node)
        currentNode.value = null

        for (const neighbor of adjList[node]) {
            while (isPaused.value) await sleep(100)

            const edgeKey = [node, neighbor].sort().join('-')

            if (!visited.has(neighbor)) {
                if (!exploredEdges.has(edgeKey)) {
                    exploredEdges.add(edgeKey)
                    edgeExploredCount.value++
                }

                currentEdge.value = { from: node, to: neighbor }
                await sleep(500 - speed.value * 4)
                currentEdge.value = null

                await dfs(neighbor)
            }
        }

        dfsCallStack.value.pop()
    }

    await dfs(startNode)

    dfsCallStack.value = []
    currentNode.value = null
    currentEdge.value = null
    isTraversing.value = false
}



export const resetGraph = () => {
    if (isTraversing.value) return

    visitedNodes.value = []
    currentNode.value = null
    queue.value = []
    currentEdge.value = null
    selectedStartNode.value = null
    dfsCallStack.value = []
    visitedCount.value = 0
    edgeExploredCount.value = 0
}
