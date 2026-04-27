import { ref } from 'vue'
import type { PseudoCodeLine } from '@/types/algorithm'


export type SearchAlgo = 'linear' | 'binary'
export type DataStructure = 'array' | 'linkedlist'

export const numbers = ref<number[]>([])
export const target = ref<number | null>(null)
export const dataStructure = ref<DataStructure>('array')

export const currentIndex = ref<number | null>(null) // linear
export const low = ref<number | null>(null) // binary
export const high = ref<number | null>(null)
export const mid = ref<number | null>(null)

export const foundIndex = ref<number | null>(null)
export const notFound = ref(false)

export const isSearching = ref(false)
export const isPaused = ref(false)
export const explanation = ref<string[]>([])

export const pseudoCodeLines = ref<PseudoCodeLine[]>([])
export const activePseudoLineId = ref<string | null>(null)

export const comparisonsCount = ref(0)
export const arraySize = ref(10)
export const speed = ref(50)

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const waitIfPaused = async () => {
  while (isPaused.value) {
    await sleep(100)
  }
}

export const currentAlgo = ref<SearchAlgo | null>(null)
export const searchInfo = ref<string[]>([])

export const linearSearchPseudoCode: PseudoCodeLine[] = [
  { id: 'linear.start', text: 'function linearSearch(arr, target):' },
  { id: 'linear.loop', text: 'for each element in arr:', indent: 1 },
  { id: 'linear.compare', text: 'if element == target:', indent: 2 },
  { id: 'linear.found', text: 'return current index', indent: 3 },
  { id: 'linear.not_found', text: 'return -1', indent: 1 },
]

export const binarySearchPseudoCode: PseudoCodeLine[] = [
  { id: 'binary.start', text: 'function binarySearch(arr, target):' },
  { id: 'binary.init', text: 'low = 0, high = arr.length - 1', indent: 1 },
  { id: 'binary.loop', text: 'while low <= high:', indent: 1 },
  { id: 'binary.mid', text: 'mid = floor((low + high) / 2)', indent: 2 },
  { id: 'binary.compare', text: 'if arr[mid] == target:', indent: 2 },
  { id: 'binary.found', text: 'return mid', indent: 3 },
  { id: 'binary.check_greater', text: 'else if arr[mid] < target:', indent: 2 },
  { id: 'binary.adjust_low', text: 'low = mid + 1', indent: 3 },
  { id: 'binary.adjust_high', text: 'else high = mid - 1', indent: 2 },
  { id: 'binary.not_found', text: 'return -1', indent: 1 },
]

export const setInitialInfo = (algo: SearchAlgo) => {
  currentAlgo.value = algo
  if (algo === 'linear') {
    searchInfo.value = [
      'ALGO: Linear Search',
      'WHAT: A simple algorithm that checks every element sequentially.',
      'WHY: Works on unsorted data and is easy to implement.',
      'WHERE: Small datasets or unsorted lists.',
    ]
    pseudoCodeLines.value = linearSearchPseudoCode
  } else {
    searchInfo.value = [
      'ALGO: Binary Search',
      'WHAT: A fast search that divides the search interval in half.',
      'WHY: Extremely efficient for large datasets (O(log n)).',
      'WHERE: Sorted arrays, database indexing.',
    ]
    pseudoCodeLines.value = binarySearchPseudoCode
  }
  explanation.value = [...searchInfo.value]
  activePseudoLineId.value = null
}

export const resetState = () => {
  currentIndex.value = null
  low.value = null
  high.value = null
  mid.value = null
  foundIndex.value = null
  notFound.value = false
  comparisonsCount.value = 0
  isSearching.value = false
  isPaused.value = false
  activePseudoLineId.value = null
  if (currentAlgo.value) {
    setInitialInfo(currentAlgo.value)
  } else {
    explanation.value = []
  }
}

export const generateRandomArray = (size = 10, min = 1, max = 99) => {
  resetState()
  numbers.value = Array.from(
    { length: size },
    () => Math.floor(Math.random() * (max - min + 1)) + min,
  )

  if (currentAlgo.value === 'binary') {
    numbers.value.sort((a, b) => a - b)
    explanation.value.push('Generated new random sorted array for Binary Search.')
  } else {
    explanation.value.push('Generated new random array.')
  }
}

export const sortArray = () => {
  numbers.value = [...numbers.value].sort((a, b) => a - b)
  explanation.value.push('Sorted the array for Binary Search.')
}

export const runLinearSearch = async () => {
  if (isSearching.value || target.value === null || numbers.value.length === 0) return

  resetState()
  isSearching.value = true
  explanation.value.push(`Starting Linear Search for target ${target.value}...`)
  activePseudoLineId.value = 'linear.start'
  await sleep((100 - speed.value) * 15 + 50)

  for (let i = 0; i < numbers.value.length; i++) {
    await waitIfPaused()

    activePseudoLineId.value = 'linear.loop'
    currentIndex.value = i
    comparisonsCount.value++
    explanation.value.push(`Checking index ${i}: Is ${numbers.value[i]} equal to ${target.value}?`)

    await sleep((100 - speed.value) * 15 + 50)

    activePseudoLineId.value = 'linear.compare'
    await sleep((100 - speed.value) * 10 + 25)

    if (numbers.value[i] === target.value) {
      activePseudoLineId.value = 'linear.found'
      explanation.value.push(`Target ${target.value} found at index ${i}!`)
      foundIndex.value = i
      isSearching.value = false
      return
    }
  }

  activePseudoLineId.value = 'linear.not_found'
  explanation.value.push(`Target ${target.value} not found in the array.`)
  notFound.value = true
  isSearching.value = false
}

export const runBinarySearch = async () => {
  if (isSearching.value || target.value === null || numbers.value.length === 0) return

  resetState()
  isSearching.value = true
  explanation.value.push(`Starting Binary Search for target ${target.value}...`)

  activePseudoLineId.value = 'binary.start'
  await sleep((100 - speed.value) * 15 + 50)

  activePseudoLineId.value = 'binary.init'
  low.value = 0
  high.value = numbers.value.length - 1
  await sleep((100 - speed.value) * 15 + 50)

  while (low.value !== null && high.value !== null && low.value <= high.value) {
    await waitIfPaused()

    activePseudoLineId.value = 'binary.loop'
    await sleep((100 - speed.value) * 5 + 25)

    activePseudoLineId.value = 'binary.mid'
    mid.value = Math.floor((low.value + high.value) / 2)
    comparisonsCount.value++
    explanation.value.push(
      `Current range: [${low.value}...${high.value}]. Midpoint at index ${mid.value} is ${numbers.value[mid.value]}.`,
    )

    await sleep((100 - speed.value) * 15 + 50)

    activePseudoLineId.value = 'binary.compare'
    await sleep((100 - speed.value) * 10 + 25)

    if (numbers.value[mid.value] === target.value) {
      activePseudoLineId.value = 'binary.found'
      explanation.value.push(`Target ${target.value} found at index ${mid.value}!`)
      foundIndex.value = mid.value
      isSearching.value = false
      return
    }

    activePseudoLineId.value = 'binary.check_greater'
    await sleep((100 - speed.value) * 10 + 25)

    if (numbers.value[mid.value] < target.value) {
      activePseudoLineId.value = 'binary.adjust_low'
      explanation.value.push(
        `${numbers.value[mid.value]} < ${target.value}, ignoring the left half. New low: ${mid.value + 1}.`,
      )
      low.value = mid.value + 1
    } else {
      activePseudoLineId.value = 'binary.adjust_high'
      explanation.value.push(
        `${numbers.value[mid.value]} > ${target.value}, ignoring the right half. New high: ${mid.value - 1}.`,
      )
      high.value = mid.value - 1
    }
    await sleep((100 - speed.value) * 15 + 50)
  }

  activePseudoLineId.value = 'binary.not_found'
  explanation.value.push(`Target ${target.value} not found in the array.`)
  notFound.value = true
  isSearching.value = false
}

export const pause = () => {
  if (isSearching.value) isPaused.value = true
}

export const resume = () => {
  isPaused.value = false
}
