export default function checkAndCreateObject(objectToCheck, objectKey, keyValue) {
    /* if the object's key doesn't exist, create it and assign an array, else push the value in the array */
    objectToCheck[objectKey] ?  objectToCheck[objectKey].push(keyValue) : objectToCheck[objectKey] = [keyValue]
}