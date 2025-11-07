export const controlEvent = {
  menuNavUp: "control-menuNavUp",
  menuNavDown: "control-menuNavDown",
  menuNavLeft: "control-menuNavLeft",
  menuNavRight: "control-menuNavRight",
  menuNavSelect: "control-menuNavSelect",
  menuNavBack: "control-menuNavBack",

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

  helpMenuToggle: "control-helpMenuToggle",
};

export const controlGroup = {
  anywhere: "anywhere",
  anyMenu: "anyMenu",
  gameplay: "gameplay",
  pauseMenu: "pauseMenu",
};

export const controlEventData = {
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

export const input = {
  mouse: "mouse",
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

export function getInputEvent(input) {
  return `input-${input}`;
}

export function getInput(inputEvent) {
  return inputEvent.split("input-")[1];
}

export const inputData = {
  [input.mouseLeftButton]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Mouse_Left_Key.png`,
  },
  [input.mouseRightButton]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Mouse_Right_Key.png`,
  },
  [input.mouseWheelUp]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Mouse_Wheel_Up.png`,
  },
  [input.mouseWheelDown]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Mouse_Wheel_Down.png`,
  },

  [input.arrowLeft]: {
    preventDefault: true,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Arrow_Left_Key.png`,
  },
  [input.arrowRight]: {
    preventDefault: true,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Arrow_Right_Key.png`,
  },
  [input.arrowUp]: {
    preventDefault: true,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Arrow_Up_Key.png`,
  },
  [input.arrowDown]: {
    preventDefault: true,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Arrow_Down_Key.png`,
  },

  [input.nDiv]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Divide_key.png`,
  },
  [input.nMult]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Asterisk_Key.png`,
  },
  [input.nSub]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Minus_Key.png`,
  },
  [input.nAdd]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Plus_Tall_Key.png`,
  },
  [input.nDec]: {},
  [input.nEnter]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Enter_Tall_Key.png`,
  },
  [input.n0]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_0_Key.png`,
  },
  [input.n1]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_1_Key.png`,
  },
  [input.n2]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_2_Key.png`,
  },
  [input.n3]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_3_Key.png`,
  },
  [input.n4]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_4_Key.png`,
  },
  [input.n5]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_5_Key.png`,
  },
  [input.n6]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_6_Key.png`,
  },
  [input.n7]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_7_Key.png`,
  },
  [input.n8]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_8_Key.png`,
  },
  [input.n9]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_9_Key.png`,
  },

  [input.space]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Space_Key.png`,
  },
  [input.ctrlL]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Ctrl_Key.png`,
  },
  [input.ctrlR]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Ctrl_Key.png`,
  },
  [input.metaL]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Win_Key.png`,
  },
  [input.metaR]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Win_Key.png`,
  },
  [input.altL]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Alt_Key.png`,
  },
  [input.altR]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Alt_Key.png`,
  },
  [input.ctxMenu]: {},
  [input.shiftL]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Shift_Key.png`,
  },
  [input.shiftR]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Shift_Key.png`,
  },
  [input.tab]: {
    preventDefault: true,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Tab_Key.png`,
  },
  [input.enter]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Enter_Key.png`,
  },

  [input.tilda]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Tilda_Key.png`,
  },
  [input.d0]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/0_Key.png`,
  },
  [input.d1]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/1_Key.png`,
  },
  [input.d2]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/2_Key.png`,
  },
  [input.d3]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/3_Key.png`,
  },
  [input.d4]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/4_Key.png`,
  },
  [input.d5]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/5_Key.png`,
  },
  [input.d6]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/6_Key.png`,
  },
  [input.d7]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/7_Key.png`,
  },
  [input.d8]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/8_Key.png`,
  },
  [input.d9]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/9_Key.png`,
  },
  [input.minus]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Minus_Key.png`,
  },
  [input.equal]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Plus_Key.png`,
  },
  [input.backspace]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Backspace_Key.png`,
  },

  [input.esc]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Esc_Key.png`,
  },
  [input.f1]: {
    preventDefault: true,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F1_Key.png`,
  },
  [input.f2]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F2_Key.png`,
  },
  [input.f3]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F3_Key.png`,
  },
  [input.f4]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F4_Key.png`,
  },
  [input.f5]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F5_Key.png`,
  },
  [input.f6]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F6_Key.png`,
  },
  [input.f7]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F7_Key.png`,
  },
  [input.f8]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F8_Key.png`,
  },
  [input.f9]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F9_Key.png`,
  },
  [input.f10]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F10_Key.png`,
  },
  [input.f11]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F11_Key.png`,
  },
  [input.f12]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F12_Key.png`,
  },
  [input.backslash]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Slash_Key.png`,
  },

  [input.brLeft]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Bracket_Left_Key.png`,
  },
  [input.brRight]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Bracket_Right_Key.png`,
  },
  [input.semicolon]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Quote_Key.png`,
  },
  [input.quote]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Semicolon_Key.png`,
  },
  [input.comma]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Mark_Left_Key.png`,
  },
  [input.period]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Mark_Right_Key.png`,
  },
  [input.slash]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Question_Key.png`,
  },

  [input.kA]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/A_Key.png`,
  },
  [input.kB]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/B_Key.png`,
  },
  [input.kC]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/C_Key.png`,
  },
  [input.kD]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/D_Key.png`,
  },
  [input.kE]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/E_Key.png`,
  },
  [input.kF]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F_Key.png`,
  },
  [input.kG]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/G_Key.png`,
  },
  [input.kH]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/H_Key.png`,
  },
  [input.kI]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/I_Key.png`,
  },
  [input.kJ]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/J_Key.png`,
  },
  [input.kK]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/K_Key.png`,
  },
  [input.kL]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/L_Key.png`,
  },
  [input.kM]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/M_Key.png`,
  },
  [input.kN]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/N_Key.png`,
  },
  [input.kO]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/O_Key.png`,
  },
  [input.kP]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/P_Key.png`,
  },
  [input.kQ]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Q_Key.png`,
  },
  [input.kR]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/R_Key.png`,
  },
  [input.kS]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/S_Key.png`,
  },
  [input.kT]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/T_Key.png`,
  },
  [input.kU]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/U_Key.png`,
  },
  [input.kV]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/V_Key.png`,
  },
  [input.kW]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/W_Key.png`,
  },
  [input.kX]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/X_Key.png`,
  },
  [input.kY]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Y_Key.png`,
  },
  [input.kZ]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Z_Key.png`,
  },

  [input.capsLock]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Caps_Lock_Key.png`,
  },
  [input.scrollLock]: {},
  [input.numLock]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_Lock_Key.png`,
  },

  [input.insert]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Insert_Key.png`,
  },
  [input.delete]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Del_Key.png`,
  },
  [input.home]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Home_Key.png`,
  },
  [input.end]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/End_Key.png`,
  },
  [input.pgUp]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Page_Up_Key.png`,
  },
  [input.pgDn]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Page_Down_Key.png`,
  },
  [input.pause]: {},
  [input.clear]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_5_Key.png`,
  },
};
