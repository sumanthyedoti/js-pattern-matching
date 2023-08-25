import { isObjectEmpty, lastElement } from "./utils"
import { FAIL_VALUE, PATTERNS } from "./config"

function isArraysMatch(arr1, arr2) {
  const pickedElements = []
  if (arr1.length < arr2.length) return [false, FAIL_VALUE]
  if (
    arr2.length < arr1.length &&
    lastElement(arr2) !== PATTERNS.SKIP_REMAINING &&
    lastElement(arr2) !== PATTERNS.PICK_REMAINING
  ) {
    return [false, FAIL_VALUE]
  }
  if (arr1.length > 0 && arr2.length === 0) return [false, FAIL_VALUE]
  for (let i = 0; i < arr2.length; i++) {
    if (arr2[i] === PATTERNS.SKIP_ELEMENT) continue
    if (arr2[i] === PATTERNS.SKIP_REMAINING) break
    if (arr2[i] === PATTERNS.PICK_ELEMENT) {
      pickedElements.push(arr1[i])
      continue
    }
    if (arr2[i] === PATTERNS.PICK_REMAINING) {
      for (let j = i; j < arr1.length; j++) {
        pickedElements.push(arr1[j])
      }
      break
    }
    const [isMatch, returnValue, isPicked] = isValuesMatch(arr1[i], arr2[i])
    if (isPicked) {
      pickedElements.push(returnValue)
    }
    if (!isMatch) return [false, FAIL_VALUE]
  }
  const isPicked = !isObjectEmpty(pickedElements)
  return isPicked ? [true, pickedElements, true] : [true, arr1, false]
}

function isObjectsMatch(obj1, obj2) {
  if (!isObjectEmpty(obj1) && isObjectEmpty(obj2)) return [false, FAIL_VALUE]
  const pickedFields = {}
  const keys = Object.keys(obj2)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const [isMatch, returnValue, isPicked] = isValuesMatch(obj1[key], obj2[key])
    if (isPicked) {
      pickedFields[key] = returnValue
    }
    if (!isMatch && obj2[key] !== PATTERNS.PICK_ELEMENT) {
      return [false, FAIL_VALUE]
    }
    if (obj2[key] === PATTERNS.PICK_ELEMENT) {
      pickedFields[key] = obj1[key]
      continue
    }
  }
  const isPicked = !isObjectEmpty(pickedFields)
  return isPicked ? [true, pickedFields, true] : [true, obj1, false]
}

function isValuesMatch(val1, val2) {
  if (typeof val1 !== typeof val2) return [false, FAIL_VALUE]
  if (Array.isArray(val1) && Array.isArray(val2)) {
    return isArraysMatch(val1, val2)
  }
  if (typeof val1 === "object" && val1 !== null) {
    // console.log(isObjectsMatch(val1, val2))
    return isObjectsMatch(val1, val2)
  }
  return val1 === val2 ? [true, val2] : [false, FAIL_VALUE]
}

function match(x) {
  const by = (valToMatch) => {
    const then = (valToReturn) => {
      const [isMatch, returnValue] = isValuesMatch(x, valToMatch)
      if (!isMatch) return returnValue
      if (typeof valToReturn === "function") {
        const callback = valToReturn
        return callback(returnValue)
      }
      return valToReturn
    }
    return {
      then,
    }
  }
  function booleanCallback(valueToReturn) {
    if (!x) return FAIL_VALUE
    if (typeof valueToReturn === "function") {
      const callback = valueToReturn
      return callback(x)
    }
    return valueToReturn
  }

  return {
    by,
    then: booleanCallback,
  }
}

export default match

