export default function checkAndCreateObject(objectToCheck, objectKey, keyValue) {
    /* if the object's key doesn't exist, create it and assign an array, else push the value in the array */
    if(objectToCheck[objectKey]){
        !objectToCheck[objectKey].includes(keyValue) && objectToCheck[objectKey].push(keyValue)
    }
    else{
        objectToCheck[objectKey] = [keyValue]
    } 
}