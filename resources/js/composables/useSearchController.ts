import { ref } from 'vue'

export type SearchAlgo = 'linear' | 'binary'
export type DataStructure = 'array' | 'linkedlist'

export const numbers = ref<number[]>([])
export const target = ref<number | null>(null)
export const dataStructure = ref<DataStructure>('array')

export const currentIndex = ref<number | null>(null) // linear
export const low = ref<number | null>(null)           // binary
export const high = ref<number | null>(null)
export const mid = ref<number | null>(null)

export const foundIndex = ref<number | null>(null)
export const notFound = ref(false)

export const isSearching = ref(false)
export const isPaused = ref(false)

export const comparisonsCount = ref(0)
export const arraySize = ref(10)
export const speed = ref(50)

const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms))

const waitIfPaused = async () => {
    while (isPaused.value) {
        await sleep(100)
    }
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
}

export const generateRandomArray = (
    size = 10,
    min = 1,
    max = 99
) => {
    resetState()
    numbers.value = Array.from({ length: size }, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
    )
}

export const sortArray = () => {
    numbers.value = [...numbers.value].sort((a, b) => a - b)
}

export const runLinearSearch = async () => {
    if (
        isSearching.value ||
        target.value === null ||
        numbers.value.length === 0
    )
        return

    resetState()
    isSearching.value = true

    for (let i = 0; i < numbers.value.length; i++) {
        await waitIfPaused()

        currentIndex.value = i
        comparisonsCount.value++

        await sleep((100 - speed.value) * 15 + 50)

        if (numbers.value[i] === target.value) {
            foundIndex.value = i
            isSearching.value = false
            return
        }
    }

    notFound.value = true
    isSearching.value = false
}

export const runBinarySearch = async () => {
    if (
        isSearching.value ||
        target.value === null ||
        numbers.value.length === 0
    )
        return

    resetState()
    isSearching.value = true

    low.value = 0
    high.value = numbers.value.length - 1

    while (
        low.value !== null &&
        high.value !== null &&
        low.value <= high.value
    ) {
        await waitIfPaused()

        mid.value = Math.floor((low.value + high.value) / 2)
        comparisonsCount.value++

        await sleep((100 - speed.value) * 15 + 50)

        if (numbers.value[mid.value] === target.value) {
            foundIndex.value = mid.value
            isSearching.value = false
            return
        }

        if (numbers.value[mid.value] < target.value) {
            low.value = mid.value + 1
        } else {
            high.value = mid.value - 1
        }
    }

    notFound.value = true
    isSearching.value = false
}

export const pause = () => {
    if (isSearching.value) isPaused.value = true
}

export const resume = () => {
    isPaused.value = false
}
