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
  helpMenuToggle: "control-helpMenuToggle",
};

export const controlGroup = {
  anywhere: "anywhere",
  gameplay: "gameplay",
  pauseMenu: "pauseMenu",
};

export const controlEventData = {
  [controlEvent.moveCurrentFigureRight]: {
    groupID: controlGroup.gameplay,
    getTriggerData: ({ options }) => {
      return {
        onJustPressed: true,
      };
    },
  },
  [controlEvent.moveCurrentFigureLeft]: {
    groupID: controlGroup.gameplay,
    getTriggerData: ({ options }) => {
      return {
        onJustPressed: true,
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

export const inputEventData = {
  [inputEvent.mouseLeftButton]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Mouse_Left_Key.png`,
  },
  [inputEvent.mouseRightButton]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Mouse_Right_Key.png`,
  },
  [inputEvent.mouseWheelUp]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Mouse_Wheel_Up.png`,
  },
  [inputEvent.mouseWheelDown]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Mouse_Wheel_Down.png`,
  },

  [inputEvent.arrowLeft]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Arrow_Left_Key.png`,
  },
  [inputEvent.arrowRight]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Arrow_Right_Key.png`,
  },
  [inputEvent.arrowUp]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Arrow_Up_Key.png`,
  },
  [inputEvent.arrowDown]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Arrow_Down_Key.png`,
  },

  [inputEvent.nDiv]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Divide_key.png`,
  },
  [inputEvent.nMult]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Asterisk_Key.png`,
  },
  [inputEvent.nSub]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Minus_Key.png`,
  },
  [inputEvent.nAdd]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Plus_Tall_Key.png`,
  },
  [inputEvent.nDec]: {},
  [inputEvent.nEnter]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Enter_Tall_Key.png`,
  },
  [inputEvent.n0]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_0_Key.png`,
  },
  [inputEvent.n1]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_1_Key.png`,
  },
  [inputEvent.n2]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_2_Key.png`,
  },
  [inputEvent.n3]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_3_Key.png`,
  },
  [inputEvent.n4]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_4_Key.png`,
  },
  [inputEvent.n5]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_5_Key.png`,
  },
  [inputEvent.n6]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_6_Key.png`,
  },
  [inputEvent.n7]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_7_Key.png`,
  },
  [inputEvent.n8]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_8_Key.png`,
  },
  [inputEvent.n9]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_9_Key.png`,
  },

  [inputEvent.space]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Space_Key.png`,
  },
  [inputEvent.ctrlL]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Ctrl_Key.png`,
  },
  [inputEvent.ctrlR]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Ctrl_Key.png`,
  },
  [inputEvent.metaL]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Win_Key.png`,
  },
  [inputEvent.metaR]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Win_Key.png`,
  },
  [inputEvent.altL]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Alt_Key.png`,
  },
  [inputEvent.altR]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Alt_Key.png`,
  },
  [inputEvent.ctxMenu]: {},
  [inputEvent.shiftL]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Shift_Key.png`,
  },
  [inputEvent.shiftR]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Shift_Key.png`,
  },
  [inputEvent.tab]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Tab_Key.png`,
  },
  [inputEvent.enter]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Enter_Key.png`,
  },

  [inputEvent.tilda]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Tilda_Key.png`,
  },
  [inputEvent.d0]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/0_Key.png`,
  },
  [inputEvent.d1]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/1_Key.png`,
  },
  [inputEvent.d2]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/2_Key.png`,
  },
  [inputEvent.d3]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/3_Key.png`,
  },
  [inputEvent.d4]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/4_Key.png`,
  },
  [inputEvent.d5]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/5_Key.png`,
  },
  [inputEvent.d6]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/6_Key.png`,
  },
  [inputEvent.d7]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/7_Key.png`,
  },
  [inputEvent.d8]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/8_Key.png`,
  },
  [inputEvent.d9]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/9_Key.png`,
  },
  [inputEvent.minus]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Minus_Key.png`,
  },
  [inputEvent.equal]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Plus_Key.png`,
  },
  [inputEvent.backspace]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Backspace_Key.png`,
  },

  [inputEvent.esc]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Esc_Key.png`,
  },
  [inputEvent.f1]: {
    preventDefault: true,
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F1_Key.png`,
  },
  [inputEvent.f2]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F2_Key.png`,
  },
  [inputEvent.f3]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F3_Key.png`,
  },
  [inputEvent.f4]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F4_Key.png`,
  },
  [inputEvent.f5]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F5_Key.png`,
  },
  [inputEvent.f6]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F6_Key.png`,
  },
  [inputEvent.f7]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F7_Key.png`,
  },
  [inputEvent.f8]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F8_Key.png`,
  },
  [inputEvent.f9]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F9_Key.png`,
  },
  [inputEvent.f10]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F10_Key.png`,
  },
  [inputEvent.f11]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F11_Key.png`,
  },
  [inputEvent.f12]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F12_Key.png`,
  },
  [inputEvent.backslash]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Slash_Key.png`,
  },

  [inputEvent.brLeft]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Bracket_Left_Key.png`,
  },
  [inputEvent.brRight]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Bracket_Right_Key.png`,
  },
  [inputEvent.semicolon]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Quote_Key.png`,
  },
  [inputEvent.quote]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Semicolon_Key.png`,
  },
  [inputEvent.comma]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Mark_Left_Key.png`,
  },
  [inputEvent.period]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Mark_Right_Key.png`,
  },
  [inputEvent.slash]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Question_Key.png`,
  },

  [inputEvent.kA]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/A_Key.png`,
  },
  [inputEvent.kB]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/B_Key.png`,
  },
  [inputEvent.kC]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/C_Key.png`,
  },
  [inputEvent.kD]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/D_Key.png`,
  },
  [inputEvent.kE]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/E_Key.png`,
  },
  [inputEvent.kF]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/F_Key.png`,
  },
  [inputEvent.kG]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/G_Key.png`,
  },
  [inputEvent.kH]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/H_Key.png`,
  },
  [inputEvent.kI]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/I_Key.png`,
  },
  [inputEvent.kJ]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/J_Key.png`,
  },
  [inputEvent.kK]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/K_Key.png`,
  },
  [inputEvent.kL]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/L_Key.png`,
  },
  [inputEvent.kM]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/M_Key.png`,
  },
  [inputEvent.kN]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/N_Key.png`,
  },
  [inputEvent.kO]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/O_Key.png`,
  },
  [inputEvent.kP]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/P_Key.png`,
  },
  [inputEvent.kQ]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Q_Key.png`,
  },
  [inputEvent.kR]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/R_Key.png`,
  },
  [inputEvent.kS]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/S_Key.png`,
  },
  [inputEvent.kT]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/T_Key.png`,
  },
  [inputEvent.kU]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/U_Key.png`,
  },
  [inputEvent.kV]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/V_Key.png`,
  },
  [inputEvent.kW]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/W_Key.png`,
  },
  [inputEvent.kX]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/X_Key.png`,
  },
  [inputEvent.kY]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Y_Key.png`,
  },
  [inputEvent.kZ]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Z_Key.png`,
  },

  [inputEvent.capsLock]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Caps_Lock_Key.png`,
  },
  [inputEvent.scrollLock]: {},
  [inputEvent.numLock]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_Lock_Key.png`,
  },

  [inputEvent.insert]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Insert_Key.png`,
  },
  [inputEvent.delete]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Del_Key.png`,
  },
  [inputEvent.home]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Home_Key.png`,
  },
  [inputEvent.end]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/End_Key.png`,
  },
  [inputEvent.pgUp]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Page_Up_Key.png`,
  },
  [inputEvent.pgDn]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Page_Down_Key.png`,
  },
  [inputEvent.pause]: {},
  [inputEvent.clear]: {
    icon: (root = "/input_icons", theme = "dark") => `${root}/kb_mouse/${theme}/Num_5_Key.png`,
  },
};
