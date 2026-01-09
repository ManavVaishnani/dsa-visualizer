import { ref } from 'vue'

export const bars = ref<number[]>([])
export const active = ref<number[]>([])
export const swapping = ref<number[]>([])
export const sorted = ref<number[]>([])

export const barCount = ref(30)
export const speed = ref(50)

export const isSorting = ref(false)
export const isPaused = ref(false)
export const explanation = ref<string[]>([])

export type SortAlgo = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick'

export const currentSortAlgo = ref<SortAlgo | null>(null)

export const setInitialInfo = (algo: SortAlgo) => {
  currentSortAlgo.value = algo
  const info: Record<SortAlgo, string[]> = {
    bubble: [
      'ALGO: Bubble Sort',
      'WHAT: Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
      'WHY: Simple to understand and implement.',
      'WHERE: Small datasets and educational purposes.',
    ],
    selection: [
      'ALGO: Selection Sort',
      'WHAT: Repeatedly finds the minimum element and puts it at the beginning.',
      'WHY: Performs few swaps, useful when memory write is expensive.',
      'WHERE: When swap operations are costly.',
    ],
    insertion: [
      'ALGO: Insertion Sort',
      'WHAT: Builds the final sorted array one item at a time.',
      'WHY: Very efficient for small or nearly sorted datasets.',
      'WHERE: Real-time data streams or small arrays.',
    ],
    merge: [
      'ALGO: Merge Sort',
      'WHAT: A divide-and-conquer algorithm that divides the array in half, sorts them, and merges them back.',
      'WHY: Guaranteed O(n log n) performance.',
      'WHERE: Large datasets and stable sorting requirements.',
    ],
    quick: [
      'ALGO: Quick Sort',
      'WHAT: Picks a pivot and partitions the array around it.',
      'WHY: Fastest average-case performance for general sorting.',
      'WHERE: Standard language libraries and large datasets.',
    ],
  }
  explanation.value = info[algo]
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const generateBars = () => {
  if (isSorting.value) return

  bars.value = Array.from({ length: barCount.value }, () => Math.floor(Math.random() * 90) + 10)

  active.value = []
  swapping.value = []
  sorted.value = []
  if (currentSortAlgo.value) {
    setInitialInfo(currentSortAlgo.value)
  } else {
    explanation.value = ['Generated new random array.']
  }
}

export const bubbleSort = async () => {
  if (isSorting.value) return

  isSorting.value = true
  isPaused.value = false
  explanation.value.push('Starting Bubble Sort...')

  const arr = bars.value

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      while (isPaused.value) {
        await sleep(100)
      }

      active.value = [j, j + 1]
      explanation.value.push(`Comparing ${arr[j]} and ${arr[j + 1]}`)
      await sleep(101 - speed.value)

      if (arr[j] > arr[j + 1]) {
        explanation.value.push(`${arr[j]} > ${arr[j + 1]}, swapping them.`)
        swapping.value = [j, j + 1]
        await sleep(101 - speed.value)
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      } else {
        explanation.value.push(`${arr[j]} <= ${arr[j + 1]}, no swap needed.`)
      }

      swapping.value = []
    }

    sorted.value.push(arr.length - i - 1)
    explanation.value.push(`Element at index ${arr.length - i - 1} is now in its sorted position.`)
  }

  active.value = []
  isSorting.value = false
  explanation.value.push('Bubble Sort completed!')
}

export const selectionSort = async () => {
  if (isSorting.value) return

  isSorting.value = true
  isPaused.value = false
  explanation.value.push('Starting Selection Sort...')

  const arr = bars.value

  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i
    explanation.value.push(`Finding minimum element in the unsorted portion starting from index ${i}.`)

    // Find the minimum element in the unsorted portion
    for (let j = i + 1; j < arr.length; j++) {
      while (isPaused.value) {
        await sleep(100)
      }

      // Show comparison
      active.value = [i, j]
      explanation.value.push(`Comparing ${arr[j]} with current minimum ${arr[minIndex]}.`)
      await sleep(101 - speed.value)

      if (arr[j] < arr[minIndex]) {
        explanation.value.push(`New minimum found: ${arr[j]} at index ${j}.`)
        minIndex = j
      }

      active.value = []
    }

    // Swap if minimum is not at current position
    if (minIndex !== i) {
      while (isPaused.value) {
        await sleep(100)
      }

      explanation.value.push(`Swapping ${arr[i]} with minimum element ${arr[minIndex]}.`)
      swapping.value = [i, minIndex]
      await sleep(101 - speed.value)
      ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
      swapping.value = []
    } else {
      explanation.value.push(`${arr[i]} is already the smallest element in the unsorted part.`)
    }

    // Mark current position as sorted
    sorted.value.push(i)
  }

  // Mark last element as sorted
  sorted.value.push(arr.length - 1)

  active.value = []
  isSorting.value = false
  explanation.value.push('Selection Sort completed!')
}

export const insertionSort = async () => {
  if (isSorting.value) return

  isSorting.value = true
  isPaused.value = false
  explanation.value.push('Starting Insertion Sort...')

  const arr = bars.value

  // Mark first element as sorted (single element is always sorted)
  sorted.value.push(0)

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i]
    let j = i - 1
    explanation.value.push(`Picking ${key} at index ${i} to insert into the sorted part.`)

    // Mark current element being inserted
    active.value = [i]
    await sleep(101 - speed.value)

    // Move elements greater than key one position ahead
    while (j >= 0 && arr[j] > key) {
      while (isPaused.value) {
        await sleep(100)
      }

      explanation.value.push(`${arr[j]} > ${key}, shifting ${arr[j]} one position to the right.`)
      active.value = [i, j]
      await sleep(101 - speed.value)

      swapping.value = [j, j + 1]
      await sleep(101 - speed.value)

      arr[j + 1] = arr[j]
      j--

      swapping.value = []
    }

    // Insert key at correct position
    explanation.value.push(`Inserting ${key} at index ${j + 1}.`)
    arr[j + 1] = key

    // Mark all positions from 0 to i as sorted (insertion sort maintains sorted prefix)
    for (let k = 0; k <= i; k++) {
      if (!sorted.value.includes(k)) {
        sorted.value.push(k)
      }
    }

    active.value = []
  }

  active.value = []
  isSorting.value = false
  explanation.value.push('Insertion Sort completed!')
}

export const mergeSort = async () => {
  if (isSorting.value) return

  isSorting.value = true
  isPaused.value = false
  explanation.value.push('Starting Merge Sort...')

  const arr = bars.value
  sorted.value = []

  const merge = async (left: number, mid: number, right: number) => {
    explanation.value.push(`Merging subarrays [${left}...${mid}] and [${mid + 1}...${right}].`)
    const leftArr = arr.slice(left, mid + 1)
    const rightArr = arr.slice(mid + 1, right + 1)

    let i = 0,
      j = 0,
      k = left

    while (i < leftArr.length && j < rightArr.length) {
      while (isPaused.value) {
        await sleep(100)
      }

      active.value = [left + i, mid + 1 + j]
      explanation.value.push(`Comparing ${leftArr[i]} and ${rightArr[j]} from both halves.`)
      await sleep(101 - speed.value)

      if (leftArr[i] <= rightArr[j]) {
        explanation.value.push(`${leftArr[i]} <= ${rightArr[j]}, picking from the left half.`)
        swapping.value = [k]
        await sleep(101 - speed.value)

        arr[k] = leftArr[i]
        i++
      } else {
        explanation.value.push(`${leftArr[i]} > ${rightArr[j]}, picking from the right half.`)
        swapping.value = [k]
        await sleep(101 - speed.value)

        arr[k] = rightArr[j]
        j++
      }

      swapping.value = []
      k++
    }

    while (i < leftArr.length) {
      while (isPaused.value) {
        await sleep(100)
      }

      explanation.value.push('Copying remaining elements from the left half.')
      swapping.value = [k]
      await sleep(101 - speed.value)

      arr[k] = leftArr[i]
      swapping.value = []
      i++
      k++
    }

    while (j < rightArr.length) {
      while (isPaused.value) {
        await sleep(100)
      }

      explanation.value.push('Copying remaining elements from the right half.')
      swapping.value = [k]
      await sleep(101 - speed.value)

      arr[k] = rightArr[j]
      swapping.value = []
      j++
      k++
    }
  }

  const mergeSortHelper = async (left: number, right: number) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2)
      explanation.value.push(`Splitting array into [${left}...${mid}] and [${mid + 1}...${right}].`)

      await mergeSortHelper(left, mid)
      await mergeSortHelper(mid + 1, right)
      await merge(left, mid, right)
    }
  }

  await mergeSortHelper(0, arr.length - 1)

  // Mark all as sorted at the end
  for (let i = 0; i < arr.length; i++) {
    sorted.value.push(i)
  }

  active.value = []
  isSorting.value = false
  explanation.value.push('Merge Sort completed!')
}

export const quickSort = async () => {
  if (isSorting.value) return

  isSorting.value = true
  isPaused.value = false
  explanation.value.push('Starting Quick Sort...')

  const arr = bars.value
  sorted.value = []

  const partition = async (low: number, high: number): Promise<number> => {
    const pivot = arr[high]
    explanation.value.push(`Choosing ${pivot} (at index ${high}) as the pivot.`)
    let i = low - 1

    // Highlight pivot
    active.value = [high]
    await sleep(101 - speed.value)

    for (let j = low; j < high; j++) {
      while (isPaused.value) {
        await sleep(100)
      }

      active.value = [j, high]
      explanation.value.push(`Comparing ${arr[j]} with pivot ${pivot}.`)
      await sleep(101 - speed.value)

      if (arr[j] < pivot) {
        i++
        if (i !== j) {
          explanation.value.push(`${arr[j]} < ${pivot}, swapping ${arr[j]} with element at index ${i}.`)
          swapping.value = [i, j]
          await sleep(101 - speed.value)
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
          swapping.value = []
        }
      }
    }

    // Place pivot in correct position
    if (i + 1 !== high) {
      explanation.value.push(`Placing pivot ${pivot} at its correct position index ${i + 1}.`)
      swapping.value = [i + 1, high]
      await sleep(101 - speed.value)
      ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
      swapping.value = []
    }

    active.value = []
    return i + 1
  }

  const quickSortHelper = async (low: number, high: number) => {
    if (low < high) {
      const pivotIndex = await partition(low, high)

      // Mark pivot as sorted
      sorted.value.push(pivotIndex)
      explanation.value.push(`Pivot at index ${pivotIndex} is now sorted.`)

      await quickSortHelper(low, pivotIndex - 1)
      await quickSortHelper(pivotIndex + 1, high)
    } else if (low === high) {
      // Mark single element as sorted
      sorted.value.push(low)
      explanation.value.push(`Single element at index ${low} is sorted.`)
    }
  }

  await quickSortHelper(0, arr.length - 1)

  active.value = []
  isSorting.value = false
  explanation.value.push('Quick Sort completed!')
}
