export function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

export async function forEachSync(array, callback) {
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    await callback(element, i, array);
  }
}
