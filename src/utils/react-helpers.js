export function forceUpdateAsync() {
  return new Promise((resolve) => {
    this.forceUpdate(() => resolve());
  });
}

export function setStateAsync(newState) {
  return new Promise((resolve) => {
    this.setState(newState, () => resolve());
  });
}
