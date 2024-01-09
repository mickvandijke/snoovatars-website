export function getMintClasses(totalQuantity: number) {
  if (totalQuantity <= 75) {
    return ["bg-sky-400"];
  } else if (totalQuantity <= 250) {
    return ["bg-yellow-300"];
  } else if (totalQuantity <= 777) {
    return ["bg-gray-300"];
  } else if (totalQuantity <= 5000) {
    return ["bg-orange-300"];
  } else {
    return ["bg-red-500"];
  }
}

export function getMintClassesText(totalQuantity: number) {
  if (totalQuantity <= 75) {
    return ["text-sky-400"];
  } else if (totalQuantity <= 250) {
    return ["text-yellow-300"];
  } else if (totalQuantity <= 777) {
    return ["text-gray-300"];
  } else if (totalQuantity <= 5000) {
    return ["text-orange-300"];
  } else {
    return ["text-red-500"];
  }
}
