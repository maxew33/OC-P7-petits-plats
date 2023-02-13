export default function resetArray(arrayToReset, valuesArray) {
    arrayToReset.length = 0
    arrayToReset.push(...valuesArray)
}