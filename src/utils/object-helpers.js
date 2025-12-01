export function deepCopy(obj) {
  if (obj == null || obj == undefined) {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
}

export function clearOwnProperties(obj) {
  Object.getOwnPropertyNames(obj).forEach((key) => {
    obj[key] = undefined;
  });
}

export function copyOwnProperties(objFrom, objTo, checkExists = false) {
  Object.getOwnPropertyNames(objFrom).forEach((key) => {
    if (checkExists && !(key in objTo)) return;
    objTo[key] = objFrom[key];
  });
}

export async function forEachSync(array, callback) {
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    await callback(element, i, array);
  }
}

export function getRandomArrayIndex(array) {
  return Math.round(Math.random() * (array.length - 1));
}
