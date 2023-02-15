export default function checkAndCreateObject(objectToCheck, objectKey, keyValue) {
    objectToCheck[objectKey] ?  objectToCheck[objectKey].push(keyValue) : objectToCheck[objectKey] = [keyValue]
}