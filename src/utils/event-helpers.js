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

export function setTimeoutAdjusting({ onStep, time, adjTime, timeoutCallback }) {
  if (!time || !adjTime) return false;

  const steps = Math.ceil(time / adjTime);
  let step = 0;
  const start = Date.now();

  const onTimeStep = async () => {
    if ((await onStep?.({ steps, step })) && step++ < steps) {
      const timeElapsed = Date.now() - start;
      const targetTimeElapsed = step * adjTime;
      const timeError = timeElapsed - targetTimeElapsed;
      const timeout = setTimeout(onTimeStep, adjTime - timeError);
      timeoutCallback?.(timeout);
    }
  };

  const timeout = setTimeout(onTimeStep, adjTime);
  timeoutCallback?.(timeout);
}

export function setIntervalAdjusting({ onStep, time, targetTimeElapsedReset = 24 * 60 * 60 * 1000, timeoutCallback }) {
  if (!time) return false;

  let start = Date.now();
  let targetTimeElapsed = time;
  let timeout = 0;

  const onTimeStep = async () => {
    if (await onStep?.()) {
      const timeElapsed = Date.now() - start;
      const timeError = timeElapsed - targetTimeElapsed;
      targetTimeElapsed += time;
      if (targetTimeElapsed > targetTimeElapsedReset) {
        start = Date.now();
        targetTimeElapsed = time;
      }
      timeout = setTimeout(onTimeStep, time - timeError);
      timeoutCallback?.(timeout);
    }
  };

  const updateTime = (newTime) => {
    clearTimeout(timeout);

    time = newTime;
    start = Date.now();
    targetTimeElapsed = time;

    timeout = setTimeout(onTimeStep, time);
    timeoutCallback?.(timeout);
  };

  const callNextIn = (ms) => {
    clearTimeout(timeout);

    start = Date.now();
    targetTimeElapsed = ms;

    timeout = setTimeout(onTimeStep, ms);
    timeoutCallback?.(timeout);
  };

  timeout = setTimeout(onTimeStep, time);
  timeoutCallback?.(timeout);

  return {
    updateTime,
    callNextIn,
  };
}
