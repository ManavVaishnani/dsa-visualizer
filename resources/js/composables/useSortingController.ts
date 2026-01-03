import { ref } from 'vue'

export const bars = ref<number[]>([])
export const active = ref<number[]>([])
export const swapping = ref<number[]>([])
export const sorted = ref<number[]>([])

export const barCount = ref(30)
export const speed = ref(50)

export const isSorting = ref(false)
export const isPaused = ref(false)

const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms))

export const generateBars = () => {
    if (isSorting.value) return

    bars.value = Array.from(
        { length: barCount.value },
        () => Math.floor(Math.random() * 90) + 10
    )

    active.value = []
    swapping.value = []
    sorted.value = []
}

export const bubbleSort = async () => {
    if (isSorting.value) return

    isSorting.value = true
    isPaused.value = false

    const arr = bars.value

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            while (isPaused.value) {
                await sleep(100)
            }

            active.value = [j, j + 1]
            await sleep(101 - speed.value)

            if (arr[j] > arr[j + 1]) {
                swapping.value = [j, j + 1]
                await sleep(101 - speed.value)

                ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
            }

            swapping.value = []
        }

        sorted.value.push(arr.length - i - 1)
    }

    active.value = []
    isSorting.value = false
}

export const selectionSort = async () => {
    if (isSorting.value) return

    isSorting.value = true
    isPaused.value = false

    const arr = bars.value

    for (let i = 0; i < arr.length - 1; i++) {
        let minIndex = i

        // Find the minimum element in the unsorted portion
        for (let j = i + 1; j < arr.length; j++) {
            while (isPaused.value) {
                await sleep(100)
            }

            // Show comparison
            active.value = [i, j]
            await sleep(101 - speed.value)

            if (arr[j] < arr[minIndex]) {
                minIndex = j
            }

            active.value = []
        }

        // Swap if minimum is not at current position
        if (minIndex !== i) {
            while (isPaused.value) {
                await sleep(100)
            }

            swapping.value = [i, minIndex]
            await sleep(101 - speed.value)

            ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
            swapping.value = []
        }

        // Mark current position as sorted
        sorted.value.push(i)
    }

    // Mark last element as sorted
    sorted.value.push(arr.length - 1)

    active.value = []
    isSorting.value = false
}

export const insertionSort = async () => {
    if (isSorting.value) return

    isSorting.value = true
    isPaused.value = false

    const arr = bars.value

    // Mark first element as sorted (single element is always sorted)
    sorted.value.push(0)

    for (let i = 1; i < arr.length; i++) {
        const key = arr[i]
        let j = i - 1

        // Mark current element being inserted
        active.value = [i]
        await sleep(101 - speed.value)

        // Move elements greater than key one position ahead
        while (j >= 0 && arr[j] > key) {
            while (isPaused.value) {
                await sleep(100)
            }

            active.value = [i, j]
            await sleep(101 - speed.value)

            swapping.value = [j, j + 1]
            await sleep(101 - speed.value)

            arr[j + 1] = arr[j]
            j--

            swapping.value = []
        }

        // Insert key at correct position
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
}

export const mergeSort = async () => {
    if (isSorting.value) return

    isSorting.value = true
    isPaused.value = false

    const arr = bars.value
    sorted.value = []

    const merge = async (left: number, mid: number, right: number) => {
        const leftArr = arr.slice(left, mid + 1)
        const rightArr = arr.slice(mid + 1, right + 1)

        let i = 0, j = 0, k = left

        while (i < leftArr.length && j < rightArr.length) {
            while (isPaused.value) {
                await sleep(100)
            }

            active.value = [left + i, mid + 1 + j]
            await sleep(101 - speed.value)

            if (leftArr[i] <= rightArr[j]) {
                swapping.value = [k]
                await sleep(101 - speed.value)

                arr[k] = leftArr[i]
                i++
            } else {
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
}

export const quickSort = async () => {
    if (isSorting.value) return

    isSorting.value = true
    isPaused.value = false

    const arr = bars.value
    sorted.value = []

    const partition = async (low: number, high: number): Promise<number> => {
        const pivot = arr[high]
        let i = low - 1

        // Highlight pivot
        active.value = [high]
        await sleep(101 - speed.value)

        for (let j = low; j < high; j++) {
            while (isPaused.value) {
                await sleep(100)
            }

            active.value = [j, high]
            await sleep(101 - speed.value)

            if (arr[j] < pivot) {
                i++
                if (i !== j) {
                    swapping.value = [i, j]
                    await sleep(101 - speed.value)

                    ;[arr[i], arr[j]] = [arr[j], arr[i]]
                    swapping.value = []
                }
            }
        }

        // Place pivot in correct position
        if (i + 1 !== high) {
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

            await quickSortHelper(low, pivotIndex - 1)
            await quickSortHelper(pivotIndex + 1, high)
        } else if (low === high) {
            // Mark single element as sorted
            sorted.value.push(low)
        }
    }

    await quickSortHelper(0, arr.length - 1)

    active.value = []
    isSorting.value = false
}
