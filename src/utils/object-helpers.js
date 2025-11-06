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
