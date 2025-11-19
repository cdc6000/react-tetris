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

export function copyOwnProperties(objFrom, objTo) {
  Object.getOwnPropertyNames(objFrom).forEach((key) => {
    objTo[key] = objFrom[key];
  });
}

export async function forEachSync(array, callback) {
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    await callback(element, i, array);
  }
}
