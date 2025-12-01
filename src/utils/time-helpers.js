export function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

export function setTimeoutAdjusting({ onStep, time, adjTime, setTimeoutCallback }) {
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
      setTimeoutCallback?.(timeout);
    }
  };

  const timeout = setTimeout(onTimeStep, adjTime);
  setTimeoutCallback?.(timeout);
}

export function setIntervalAdjusting({ onStep, time, targetTimeElapsedReset = 24 * 60 * 60 * 1000, setTimeoutCallback }) {
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
      setTimeoutCallback?.(timeout);
    }
  };

  const updateTime = (newTime, restart = true) => {
    time = newTime;

    if (restart) {
      clearTimeout(timeout);

      start = Date.now();
      targetTimeElapsed = time;

      timeout = setTimeout(onTimeStep, time);
      setTimeoutCallback?.(timeout);
    }
  };

  const callNextIn = (ms) => {
    clearTimeout(timeout);

    start = Date.now();
    targetTimeElapsed = ms;

    timeout = setTimeout(onTimeStep, ms);
    setTimeoutCallback?.(timeout);
  };

  timeout = setTimeout(onTimeStep, time);
  setTimeoutCallback?.(timeout);

  return {
    updateTime,
    callNextIn,
  };
}

export function parseTime(milliseconds) {
  const fullSeconds = Math.floor(milliseconds / 1000);
  const leftoverMilliseconds = milliseconds - fullSeconds * 1000;

  const fullMinutes = Math.floor(fullSeconds / 60);
  const leftoverSeconds = fullSeconds - fullMinutes * 60;

  const fullHours = Math.floor(fullMinutes / 60);
  const leftoverMinutes = fullMinutes - fullHours * 60;

  return {
    fullSeconds,
    fullMinutes,
    fullHours,

    leftoverMilliseconds,
    leftoverSeconds,
    leftoverMinutes,
  };
}

export function pad(number, symbolCount = 2) {
  let length = number.toString().length;
  for (let index = length; index < symbolCount; index++) {
    number = `0${number}`;
  }
  return number;
}
