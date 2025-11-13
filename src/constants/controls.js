export const controlEvent = {
  menuNavUp: "control-menuNavUp",
  menuNavDown: "control-menuNavDown",
  menuNavLeft: "control-menuNavLeft",
  menuNavRight: "control-menuNavRight",
  menuNavSelect: "control-menuNavSelect",
  menuNavBack: "control-menuNavBack",

  moveCursorPointer: "control-moveCursorPointer",

  moveCurrentFigureRight: "control-moveCurrentFigureRight",
  moveCurrentFigureLeft: "control-moveCurrentFigureLeft",
  rotateCurrentFigureClockwise: "control-rotateCurrentFigureClockwise",
  rotateCurrentFigureCounterclockwise: "control-rotateCurrentFigureCounterclockwise",
  speedUpFallingCurrentFigure: "control-speedUpFallingCurrentFigure",
  dropCurrentFigure: "control-dropCurrentFigure",
  holdCurrentFigure: "control-holdCurrentFigure",

  gamePause: "control-gamePause",
  gameUnpause: "control-gameUnpause",
  gamePauseToggle: "control-gamePauseToggle",

  helpMenuToggle: "control-helpMenuToggle",
};

export const controlGroup = {
  anywhere: "anywhere",
  anyMenu: "anyMenu",
  gameplay: "gameplay",
  pauseMenu: "pauseMenu",
};

export const controlEventData = {
  [controlEvent.moveCursorPointer]: {
    groupID: controlGroup.anywhere,
  },

  [controlEvent.menuNavUp]: {
    groupID: controlGroup.anyMenu,
    getTriggerData: ({ options }) => {
      return {
        onJustPressed: true,
        onIsPressed: true,
      };
    },
  },
  [controlEvent.menuNavDown]: {
    groupID: controlGroup.anyMenu,
    getTriggerData: ({ options }) => {
      return {
        onJustPressed: true,
        onIsPressed: true,
      };
    },
  },
  [controlEvent.menuNavLeft]: {
    groupID: controlGroup.anyMenu,
    getTriggerData: ({ options }) => {
      return {
        onJustPressed: true,
        onIsPressed: true,
      };
    },
  },
  [controlEvent.menuNavRight]: {
    groupID: controlGroup.anyMenu,
    getTriggerData: ({ options }) => {
      return {
        onJustPressed: true,
        onIsPressed: true,
      };
    },
  },
  [controlEvent.menuNavSelect]: {
    groupID: controlGroup.anyMenu,
    getTriggerData: ({ options }) => {
      return {
        onJustPressed: true,
      };
    },
  },
  [controlEvent.menuNavBack]: {
    groupID: controlGroup.anyMenu,
    getTriggerData: ({ options }) => {
      return {
        onJustPressed: true,
      };
    },
  },

  [controlEvent.moveCurrentFigureRight]: {
    groupID: controlGroup.gameplay,
    getTriggerData: ({ options }) => {
      return {
        onJustPressed: true,
        onIsPressed: true,
      };
    },
  },
  [controlEvent.moveCurrentFigureLeft]: {
    groupID: controlGroup.gameplay,
    getTriggerData: ({ options }) => {
      return {
        onJustPressed: true,
        onIsPressed: true,
      };
    },
  },
  [controlEvent.rotateCurrentFigureClockwise]: {
    groupID: controlGroup.gameplay,
    getTriggerData: ({ options }) => {
      return {
        onJustPressed: true,
      };
    },
  },
  [controlEvent.rotateCurrentFigureCounterclockwise]: {
    groupID: controlGroup.gameplay,
    getTriggerData: ({ options }) => {
      return {
        onJustPressed: true,
      };
    },
  },
  [controlEvent.speedUpFallingCurrentFigure]: {
    groupID: controlGroup.gameplay,
    getTriggerData: ({ options }) => {
      return {
        onJustPressed: true,
        onIsPressed: true,
      };
    },
  },
  [controlEvent.dropCurrentFigure]: {
    groupID: controlGroup.gameplay,
    getTriggerData: ({ options }) => {
      return {
        onJustPressed: true,
      };
    },
  },
  [controlEvent.holdCurrentFigure]: {
    groupID: controlGroup.gameplay,
    getTriggerData: ({ options }) => {
      return {
        onJustPressed: true,
      };
    },
  },

  [controlEvent.gamePause]: {
    groupID: controlGroup.gameplay,
    getTriggerData: ({ options }) => {
      return {
        onJustPressed: true,
      };
    },
  },
  [controlEvent.gameUnpause]: {
    groupID: controlGroup.pauseMenu,
    getTriggerData: ({ options }) => {
      return {
        onJustPressed: true,
      };
    },
  },
  [controlEvent.gamePauseToggle]: {
    groupID: controlGroup.gameplay,
    getTriggerData: ({ options }) => {
      return {
        onJustPressed: true,
      };
    },
  },

  [controlEvent.helpMenuToggle]: {
    groupID: controlGroup.anywhere,
    getTriggerData: ({ options }) => {
      return {
        onJustPressed: true,
      };
    },
  },
};

export const deviceType = {
  keyboard: "keyboard",
  mouse: "mouse",
  gamepad: "gamepad",
};

export const deviceGroup = {
  keyboardMouse: "group_keyboardMouse",
  gamepad: "group_gamepad",
};

export const groupOfDeivce = {
  [deviceType.keyboard]: deviceGroup.keyboardMouse,
  [deviceType.mouse]: deviceGroup.keyboardMouse,
  [deviceType.gamepad]: deviceGroup.gamepad,
};

export const deviceGroupData = {
  [deviceGroup.keyboardMouse]: {
    deviceTypes: [deviceType.keyboard, deviceType.mouse],
  },
  [deviceGroup.gamepad]: {
    deviceTypes: [deviceType.gamepad],
  },
};

export const input = {
  mouse: "mouse",
  mouseLeftButton: "mouseLeftButton",
  mouseMiddleButton: "mouseMiddleButton",
  mouseRightButton: "mouseRightButton",
  mouseBackButton: "mouseBackButton",
  mouseForwardButton: "mouseForwardButton",
  mouseWheelUp: "mouseWheelUp",
  mouseWheelDown: "mouseWheelDown",
  mouseWheelLeft: "mouseWheelLeft",
  mouseWheelRight: "mouseWheelRight",

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

  GPB_A: "GPB_A",
  GPB_B: "GPB_B",
  GPB_X: "GPB_X",
  GPB_Y: "GPB_Y",
  GPB_LB: "GPB_LB",
  GPB_RB: "GPB_RB",
  GPB_LT: "GPB_LT",
  GPB_RT: "GPB_RT",
  GPB_LSB: "GPB_LSB",
  GPB_RSB: "GPB_RSB",
  GPB_Select: "GPB_Select",
  GPB_Start: "GPB_Start",
  GPB_Home: "GPB_Home",
  GPB_DPUp: "GPB_DPadUp",
  GPB_DPDown: "GPB_DPadDown",
  GPB_DPLeft: "GPB_DPadLeft",
  GPB_DPRight: "GPB_DPadRight",

  GPA_LSX: "GPA_LSX",
  GPA_LSY: "GPA_LSY",
  GPA_RSX: "GPA_RSX",
  GPA_RSY: "GPA_RSY",
};

export function getInputEvent(input) {
  return `input-${input}`;
}

export function getInput(inputEvent) {
  return inputEvent.split("input-")[1];
}

export const inputData = {
  [input.mouseLeftButton]: {
    deviceType: deviceType.mouse,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Mouse_Left_Key.png`,
  },
  [input.mouseMiddleButton]: {
    preventDefault: true,
    deviceType: deviceType.mouse,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Mouse_Middle_Key.png`,
  },
  [input.mouseRightButton]: {
    preventDefault: true,
    deviceType: deviceType.mouse,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Mouse_Right_Key.png`,
  },
  [input.mouseBackButton]: {
    preventDefault: true,
    deviceType: deviceType.mouse,
  },
  [input.mouseForwardButton]: {
    preventDefault: true,
    deviceType: deviceType.mouse,
  },
  [input.mouseWheelUp]: {
    deviceType: deviceType.mouse,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Mouse_Wheel_Up.png`,
  },
  [input.mouseWheelDown]: {
    deviceType: deviceType.mouse,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Mouse_Wheel_Down.png`,
  },
  [input.mouseWheelLeft]: {
    deviceType: deviceType.mouse,
  },
  [input.mouseWheelRight]: {
    deviceType: deviceType.mouse,
  },

  [input.arrowLeft]: {
    preventDefault: true,
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Arrow_Left_Key.png`,
  },
  [input.arrowRight]: {
    preventDefault: true,
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Arrow_Right_Key.png`,
  },
  [input.arrowUp]: {
    preventDefault: true,
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Arrow_Up_Key.png`,
  },
  [input.arrowDown]: {
    preventDefault: true,
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Arrow_Down_Key.png`,
  },

  [input.nDiv]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Divide_key.png`,
  },
  [input.nMult]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Asterisk_Key.png`,
  },
  [input.nSub]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Minus_Key.png`,
  },
  [input.nAdd]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Plus_Tall_Key.png`,
  },
  [input.nDec]: {},
  [input.nEnter]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Enter_Tall_Key.png`,
  },
  [input.n0]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_0_Key.png`,
  },
  [input.n1]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_1_Key.png`,
  },
  [input.n2]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_2_Key.png`,
  },
  [input.n3]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_3_Key.png`,
  },
  [input.n4]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_4_Key.png`,
  },
  [input.n5]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_5_Key.png`,
  },
  [input.n6]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_6_Key.png`,
  },
  [input.n7]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_7_Key.png`,
  },
  [input.n8]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_8_Key.png`,
  },
  [input.n9]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_9_Key.png`,
  },

  [input.space]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Space_Key.png`,
  },
  [input.ctrlL]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Ctrl_Key.png`,
  },
  [input.ctrlR]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Ctrl_Key.png`,
  },
  [input.metaL]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Win_Key.png`,
  },
  [input.metaR]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Win_Key.png`,
  },
  [input.altL]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Alt_Key.png`,
  },
  [input.altR]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Alt_Key.png`,
  },
  [input.ctxMenu]: {
    deviceType: deviceType.keyboard,
  },
  [input.shiftL]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Shift_Key.png`,
  },
  [input.shiftR]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Shift_Key.png`,
  },
  [input.tab]: {
    preventDefault: true,
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Tab_Key.png`,
  },
  [input.enter]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Enter_Key.png`,
  },

  [input.tilda]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Tilda_Key.png`,
  },
  [input.d0]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/0_Key.png`,
  },
  [input.d1]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/1_Key.png`,
  },
  [input.d2]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/2_Key.png`,
  },
  [input.d3]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/3_Key.png`,
  },
  [input.d4]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/4_Key.png`,
  },
  [input.d5]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/5_Key.png`,
  },
  [input.d6]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/6_Key.png`,
  },
  [input.d7]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/7_Key.png`,
  },
  [input.d8]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/8_Key.png`,
  },
  [input.d9]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/9_Key.png`,
  },
  [input.minus]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Minus_Key.png`,
  },
  [input.equal]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Plus_Key.png`,
  },
  [input.backspace]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Backspace_Key.png`,
  },

  [input.esc]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Esc_Key.png`,
  },
  [input.f1]: {
    preventDefault: true,
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F1_Key.png`,
  },
  [input.f2]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F2_Key.png`,
  },
  [input.f3]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F3_Key.png`,
  },
  [input.f4]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F4_Key.png`,
  },
  [input.f5]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F5_Key.png`,
  },
  [input.f6]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F6_Key.png`,
  },
  [input.f7]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F7_Key.png`,
  },
  [input.f8]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F8_Key.png`,
  },
  [input.f9]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F9_Key.png`,
  },
  [input.f10]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F10_Key.png`,
  },
  [input.f11]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F11_Key.png`,
  },
  [input.f12]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F12_Key.png`,
  },
  [input.backslash]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Slash_Key.png`,
  },

  [input.brLeft]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Bracket_Left_Key.png`,
  },
  [input.brRight]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Bracket_Right_Key.png`,
  },
  [input.semicolon]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Quote_Key.png`,
  },
  [input.quote]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Semicolon_Key.png`,
  },
  [input.comma]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Mark_Left_Key.png`,
  },
  [input.period]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Mark_Right_Key.png`,
  },
  [input.slash]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Question_Key.png`,
  },

  [input.kA]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/A_Key.png`,
  },
  [input.kB]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/B_Key.png`,
  },
  [input.kC]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/C_Key.png`,
  },
  [input.kD]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/D_Key.png`,
  },
  [input.kE]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/E_Key.png`,
  },
  [input.kF]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F_Key.png`,
  },
  [input.kG]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/G_Key.png`,
  },
  [input.kH]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/H_Key.png`,
  },
  [input.kI]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/I_Key.png`,
  },
  [input.kJ]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/J_Key.png`,
  },
  [input.kK]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/K_Key.png`,
  },
  [input.kL]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/L_Key.png`,
  },
  [input.kM]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/M_Key.png`,
  },
  [input.kN]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/N_Key.png`,
  },
  [input.kO]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/O_Key.png`,
  },
  [input.kP]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/P_Key.png`,
  },
  [input.kQ]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Q_Key.png`,
  },
  [input.kR]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/R_Key.png`,
  },
  [input.kS]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/S_Key.png`,
  },
  [input.kT]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/T_Key.png`,
  },
  [input.kU]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/U_Key.png`,
  },
  [input.kV]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/V_Key.png`,
  },
  [input.kW]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/W_Key.png`,
  },
  [input.kX]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/X_Key.png`,
  },
  [input.kY]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Y_Key.png`,
  },
  [input.kZ]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Z_Key.png`,
  },

  [input.capsLock]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Caps_Lock_Key.png`,
  },
  [input.scrollLock]: {
    deviceType: deviceType.keyboard,
  },
  [input.numLock]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_Lock_Key.png`,
  },

  [input.insert]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Insert_Key.png`,
  },
  [input.delete]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Del_Key.png`,
  },
  [input.home]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Home_Key.png`,
  },
  [input.end]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/End_Key.png`,
  },
  [input.pgUp]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Page_Up_Key.png`,
  },
  [input.pgDn]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Page_Down_Key.png`,
  },
  [input.pause]: {
    deviceType: deviceType.keyboard,
  },
  [input.clear]: {
    deviceType: deviceType.keyboard,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_5_Key.png`,
  },

  [input.GPB_A]: {
    deviceType: deviceType.gamepad,
    icon: (root = "/input_icons", theme = "dark") => `${root}/xbox/A.png`,
  },
  [input.GPB_B]: {
    deviceType: deviceType.gamepad,
    icon: (root = "/input_icons", theme = "dark") => `${root}/xbox/B.png`,
  },
  [input.GPB_X]: {
    deviceType: deviceType.gamepad,
    icon: (root = "/input_icons", theme = "dark") => `${root}/xbox/X.png`,
  },
  [input.GPB_Y]: {
    deviceType: deviceType.gamepad,
    icon: (root = "/input_icons", theme = "dark") => `${root}/xbox/Y.png`,
  },

  [input.GPB_LB]: {
    deviceType: deviceType.gamepad,
    icon: (root = "/input_icons", theme = "dark") => `${root}/xbox/LB.png`,
  },
  [input.GPB_RB]: {
    deviceType: deviceType.gamepad,
    icon: (root = "/input_icons", theme = "dark") => `${root}/xbox/RB.png`,
  },
  [input.GPB_LT]: {
    deviceType: deviceType.gamepad,
    icon: (root = "/input_icons", theme = "dark") => `${root}/xbox/LT.png`,
  },
  [input.GPB_RT]: {
    deviceType: deviceType.gamepad,
    icon: (root = "/input_icons", theme = "dark") => `${root}/xbox/RT.png`,
  },

  [input.GPB_LSB]: {
    deviceType: deviceType.gamepad,
    icon: (root = "/input_icons", theme = "dark") => `${root}/xbox/Left_Stick_Click.png`,
  },
  [input.GPB_RSB]: {
    deviceType: deviceType.gamepad,
    icon: (root = "/input_icons", theme = "dark") => `${root}/xbox/Right_Stick_Click.png`,
  },

  [input.GPB_Select]: {
    deviceType: deviceType.gamepad,
    icon: (root = "/input_icons", theme = "dark") => `${root}/xbox/Menu.png`,
  },
  [input.GPB_Start]: {
    deviceType: deviceType.gamepad,
    icon: (root = "/input_icons", theme = "dark") => `${root}/xbox/View.png`,
  },
  [input.GPB_Home]: {
    deviceType: deviceType.gamepad,
  },

  [input.GPB_DPUp]: {
    deviceType: deviceType.gamepad,
    icon: (root = "/input_icons", theme = "dark") => `${root}/xbox/Dpad_Up.png`,
  },
  [input.GPB_DPDown]: {
    deviceType: deviceType.gamepad,
    icon: (root = "/input_icons", theme = "dark") => `${root}/xbox/Dpad_Down.png`,
  },
  [input.GPB_DPLeft]: {
    deviceType: deviceType.gamepad,
    icon: (root = "/input_icons", theme = "dark") => `${root}/xbox/Dpad_Left.png`,
  },
  [input.GPB_DPRight]: {
    deviceType: deviceType.gamepad,
    icon: (root = "/input_icons", theme = "dark") => `${root}/xbox/Dpad_Right.png`,
  },
};

//prettier-ignore
export const gamepadStandartButtonMapping = [
  input.GPB_A, input.GPB_B, input.GPB_X, input.GPB_Y,
  input.GPB_LB, input.GPB_RB, input.GPB_LT, input.GPB_RT,
  input.GPB_Select, input.GPB_Start,
  input.GPB_LSB, input.GPB_RSB,
  input.GPB_DPUp, input.GPB_DPDown, input.GPB_DPLeft, input.GPB_DPRight,
  input.GPB_Home,
];

//prettier-ignore
export const gamepadStandartAxisMapping = [
  input.GPA_LSX, input.GPA_LSY,
  input.GPA_RSX, input.GPA_RSY,
];
