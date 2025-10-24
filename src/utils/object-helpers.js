export function deepCopy(obj) {
  if (obj == null || obj == undefined) {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
}