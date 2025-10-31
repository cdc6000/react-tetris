export const controlEvent = {
  moveCurrentFigureRight: "control-moveCurrentFigureRight",
  moveCurrentFigureLeft: "control-moveCurrentFigureLeft",
  moveCurrentFigureCupPointX: "control-moveCurrentFigureCupPointX",
  rotateCurrentFigureClockwise: "control-rotateCurrentFigureClockwise",
  rotateCurrentFigureCounterclockwise: "control-rotateCurrentFigureCounterclockwise",
  speedUpFallingCurrentFigure: "control-speedUpFallingCurrentFigure",
  dropCurrentFigure: "control-dropCurrentFigure",
  gamePause: "control-gamePause",
  gameUnpause: "control-gameUnpause",
  gamePauseToggle: "control-gamePauseToggle",
};

export const controlEventTrigger = {
  [controlEvent.moveCurrentFigureRight]: ({ options }) => {
    return {
      onJustPressed: true,
    };
  },
  [controlEvent.moveCurrentFigureLeft]: ({ options }) => {
    return {
      onJustPressed: true,
    };
  },
  [controlEvent.rotateCurrentFigureClockwise]: ({ options }) => {
    return {
      onJustPressed: true,
    };
  },
  [controlEvent.rotateCurrentFigureCounterclockwise]: ({ options }) => {
    return {
      onJustPressed: true,
    };
  },
  [controlEvent.speedUpFallingCurrentFigure]: ({ options }) => {
    return {
      onJustPressed: true,
    };
  },
  [controlEvent.dropCurrentFigure]: ({ options }) => {
    return {
      onJustPressed: true,
    };
  },
  [controlEvent.gamePause]: ({ options }) => {
    return {
      onJustPressed: true,
    };
  },
  [controlEvent.gameUnpause]: ({ options }) => {
    return {
      onJustPressed: true,
    };
  },
  [controlEvent.gamePauseToggle]: ({ options }) => {
    return {
      onJustPressed: true,
    };
  },
};

export const controlGroup = {
  gameplay: "gameplay",
  pauseMenu: "pauseMenu",
};

export const controlEventData = {
  [controlEvent.moveCurrentFigureRight]: {
    group: controlGroup.gameplay,
  },
  [controlEvent.moveCurrentFigureLeft]: {
    group: controlGroup.gameplay,
  },
  [controlEvent.rotateCurrentFigureClockwise]: {
    group: controlGroup.gameplay,
  },
  [controlEvent.rotateCurrentFigureCounterclockwise]: {
    group: controlGroup.gameplay,
  },
  [controlEvent.speedUpFallingCurrentFigure]: {
    group: controlGroup.gameplay,
  },
  [controlEvent.dropCurrentFigure]: {
    group: controlGroup.gameplay,
  },
  [controlEvent.gamePause]: {
    group: controlGroup.gameplay,
  },
  [controlEvent.gameUnpause]: {
    group: controlGroup.pauseMenu,
  },
  [controlEvent.gamePauseToggle]: {
    group: controlGroup.gameplay,
  },
};

export const inputEvent = {
  mouseLeftButton: "mouseLeftButton",
  mouseRightButton: "mouseRightButton",
  mouseWheelUp: "mouseWheelUp",
  mouseWheelDown: "mouseWheelDown",

  arrowLeft: "ArrowLeft",
  arrowRight: "ArrowRight",
  arrowUp: "ArrowUp",
  arrowDown: "ArrowDown",

  nDiv: "NumpadDivide",
  nMult: "NumpadMultiply",
  nSub: "NumpadSubtract",
  nAdd: "NumpadAdd",
  nDec: "NumpadDecimal",
  nEnter: "NumpadEnter",
  n0: "Numpad0",
  n1: "Numpad1",
  n2: "Numpad2",
  n3: "Numpad3",
  n4: "Numpad4",
  n5: "Numpad5",
  n6: "Numpad6",
  n7: "Numpad7",
  n8: "Numpad8",
  n9: "Numpad9",

  space: "Space",
  ctrlL: "ControlLeft",
  ctrlR: "ControlRight",
  metaL: "MetaLeft", // ex: win
  metaR: "MetaRight", // ex: win
  altL: "AltLeft",
  altR: "AltRight",
  ctxMenu: "ContextMenu",
  shiftL: "ShiftLeft",
  shiftR: "ShiftRight",
  tab: "Tab",
  enter: "Enter",

  tilda: "Backquote",
  d0: "Digit0",
  d1: "Digit1",
  d2: "Digit2",
  d3: "Digit3",
  d4: "Digit4",
  d5: "Digit5",
  d6: "Digit6",
  d7: "Digit7",
  d8: "Digit8",
  d9: "Digit9",
  minus: "Minus",
  equal: "Equal",
  backspace: "Backspace",

  esc: "Escape",
  f1: "F1",
  f2: "F2",
  f3: "F3",
  f4: "F4",
  f5: "F5",
  f6: "F6",
  f7: "F7",
  f8: "F8",
  f9: "F9",
  f10: "F10",
  f11: "F11",
  f12: "F12",

  backslash: "Backslash",
  brLeft: "BracketLeft",
  brRight: "BracketRight",
  semicolon: "Semicolon",
  quote: "Quote",
  comma: "Comma",
  period: "Period",
  slash: "Slash",
  kA: "KeyA",
  kB: "KeyB",
  kC: "KeyC",
  kD: "KeyD",
  kE: "KeyE",
  kF: "KeyF",
  kG: "KeyG",
  kH: "KeyH",
  kI: "KeyI",
  kJ: "KeyJ",
  kK: "KeyK",
  kL: "KeyL",
  kM: "KeyM",
  kN: "KeyN",
  kO: "KeyO",
  kP: "KeyP",
  kQ: "KeyQ",
  kR: "KeyR",
  kS: "KeyS",
  kT: "KeyT",
  kU: "KeyU",
  kV: "KeyV",
  kW: "KeyW",
  kX: "KeyX",
  kY: "KeyY",
  kZ: "KeyZ",

  capsLock: "CapsLock",
  scrollLock: "ScrollLock",
  numLock: "NumLock",

  insert: "Insert",
  delete: "Delete",
  home: "Home",
  end: "End",
  pgUp: "PageUp",
  pgDn: "PageDown",
  pause: "Pause",
  clear: "Clear",
};
