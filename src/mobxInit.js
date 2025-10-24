import { configure } from "mobx";

export default function () {
  configure({
    useProxies: "always", // defa: always, other: ifavailable, never
    enforceActions: "never", // def: observed, other: always, never
    computedRequiresReaction: false, // def: false
    reactionRequiresObservable: false, // def: false
    observableRequiresReaction: false, // def: false
    disableErrorBoundaries: false, // def: false
    isolateGlobalState: false, // def: false
    reactionScheduler: (f) => f(), // def: (f) => f()
  });
}
