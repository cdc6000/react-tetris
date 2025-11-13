import {
  makeObservable,
  observable,
  computed,
  action,
  flow,
  autorun,
  runInAction,
  toJS,
  set,
  reaction,
  isAction,
} from "mobx";

import InputStore from "./input";
import ViewStore from "./view";
import NavigationStore from "./navigation";

import * as constants from "@constants/index";

import EventBus from "@utils/event-bus";
import * as objectHelpers from "@utils/object-helpers";
import * as eventHelpers from "@utils/event-helpers";

class Storage {
  constructor() {
    this.observables = {
      lang: Object.keys(constants.lang.strings)[0],

      gameState: constants.gameState.pause,
      gameMode: constants.gameMode.none,
      gameOptions: {
        enableHold: true,
        enableLevels: true,
      },
      gameData: {
        figureTypesAllowed: [],
        levelData: [],
        score: 0,
        lines: 0,
        level: 0,
        gameLoopTimeoutMs: 1000,
        randomFigureTypePool: [],

        cup: {
          width: 10,
          height: 20,
          figureStart: {
            x: 4,
            y: 0,
          },
          data: [],
          view: [],
        },

        currentFigure: {
          type: constants.gameplay.figureType.none,
          x: 0,
          y: 0,
          rotation: 0,
          prevX: 0,
          prevY: 0,
          prevRotation: 0,
          cells: {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            data: [],
          },
        },
        shadowFigureY: 0,
        holdFigure: {
          type: constants.gameplay.figureType.none,
          blocked: false,
        },
      },
    };
    this.nonObservables = {
      evenBusID: "GameStore",

      lastCursorPointerX: 0,
      cellSizePx: 30,
      cupElem: undefined,
      cupElemRect: undefined,

      gameLoopTimeout: undefined,
    };

    makeObservable(this, {
      // observable
      observables: observable,

      // action
      setupDefaultControlSchemes: action,
      viewStateInit: action,

      gameStartClassic: action,
      gameStart: action,
      gameEnd: action,
      gameOver: action,
      addScore: action,
      setPause: action,

      moveCurrentFigureAlongX: action,
      rotateCurrentFigure: action,
      dropCurrentFigure: action,
      holdCurrentFigure: action,
      generateCurrentFigure: action,

      spawnFigure: action,
      generateCupView: action,

      // computed
      cellsMaxSize: computed,
    });

    this.eventBus = new EventBus();
    this.inputStore = new InputStore({
      mainStore: this,
    });
    this.viewStore = new ViewStore({
      mainStore: this,
    });
    this.navigationStore = new NavigationStore({
      mainStore: this,
    });

    this.eventBusBind();
    this.setupDefaultControlSchemes();
    this.viewStateInit();

    this.defaults = {
      observables: objectHelpers.deepCopy(this.observables),
      nonObservables: objectHelpers.deepCopy(this.nonObservables),
    };

    this.init();
  }

  init = async () => {
    const { inputStore, viewStore } = this;
    viewStore.viewLayerEnable({ layerID: constants.viewData.layer.mainMenu });
    // viewStore.viewLayerEnable({ layerID: constants.viewData.layer.optionsMenu, isAdditive: true });
    // viewStore.viewLayerEnable({ layerID: constants.viewData.layer.helpMenu, isAdditive: true });

    // await eventHelpers.sleep(1);
    // inputStore.updateMenuNavElem();
  };

  //

  eventBusBind = () => {
    const { eventBus, viewStore, inputStore, navigationStore } = this;
    const { gameData } = this.observables;
    const { evenBusID } = this.nonObservables;
    const { controlEvent } = constants.controls;
    const { eventType } = constants.eventsData;

    eventBus.addEventListener(evenBusID, eventType.viewLayerUpdate, async ({ layerID }) => {
      if (layerID == constants.viewData.layer.mainMenu) {
        navigationStore.clearLastSelectedElemData();
      }
      await eventHelpers.sleep(1);
      navigationStore.updateMenuNavElem();
    });
    eventBus.addEventListener(evenBusID, controlEvent.menuNavUp, ({ deviceType, deviceTypeChanged }) => {
      if (deviceTypeChanged) return;
      navigationStore.menuNavVertical(-1);
    });
    eventBus.addEventListener(evenBusID, controlEvent.menuNavDown, ({ deviceType, deviceTypeChanged }) => {
      if (deviceTypeChanged) return;
      navigationStore.menuNavVertical(1);
    });
    eventBus.addEventListener(evenBusID, controlEvent.menuNavLeft, ({ deviceType, deviceTypeChanged }) => {
      if (deviceTypeChanged) return;
      navigationStore.menuNavHorizontal(-1);
    });
    eventBus.addEventListener(evenBusID, controlEvent.menuNavRight, ({ deviceType, deviceTypeChanged }) => {
      if (deviceTypeChanged) return;
      navigationStore.menuNavHorizontal(1);
    });
    eventBus.addEventListener(evenBusID, controlEvent.menuNavSelect, ({ deviceType, deviceTypeChanged }) => {
      const elem = navigationStore.getCurrentNavElem();
      if (!elem) return;

      if (deviceTypeChanged) return;

      navigationStore.unfocusAnyElem();
      elem.click();

      setTimeout(() => {
        navigationStore.updateMenuNavElem();
      }, 1);

      return { stopInputListenersProcessing: true };
    });
    eventBus.addEventListener(evenBusID, controlEvent.menuNavBack, ({ deviceType, deviceTypeChanged }) => {
      const currentLayerID = viewStore.inputFocusViewLayerID;
      if (!currentLayerID) return;

      const currentLayerData = viewStore.getViewLayerData(currentLayerID) || {};
      if (!currentLayerData.isBackAllowed) return;

      switch (currentLayerID) {
        case constants.viewData.layer.getInputMenu: {
          inputStore.getInputDisable();
          break;
        }

        case constants.viewData.layer.helpMenu: {
          this.helpMenuToggle();
          break;
        }
      }
      viewStore.shiftInputFocusToViewLayerID({ layerID: currentLayerID, isPrevious: true });

      return { stopInputListenersProcessing: true };
    });

    eventBus.addEventListener(evenBusID, controlEvent.moveCurrentFigureRight, ({ deviceType, deviceTypeChanged }) => {
      if (viewStore.inputFocusViewLayerID != constants.viewData.layer.gamePlayView) return;
      this.moveCurrentFigureAlongX(gameData.currentFigure.x + 1);
    });
    eventBus.addEventListener(evenBusID, controlEvent.moveCurrentFigureLeft, ({ deviceType, deviceTypeChanged }) => {
      if (viewStore.inputFocusViewLayerID != constants.viewData.layer.gamePlayView) return;
      this.moveCurrentFigureAlongX(gameData.currentFigure.x - 1);
    });
    eventBus.addEventListener(evenBusID, controlEvent.moveCursorPointer, ({ x, deviceType, deviceTypeChanged }) => {
      this.nonObservables.lastCursorPointerX = x;

      if (viewStore.inputFocusViewLayerID == constants.viewData.layer.gamePlayView) {
        this.moveCurrentFigureCupPointX();
      }
    });
    eventBus.addEventListener(
      evenBusID,
      controlEvent.rotateCurrentFigureClockwise,
      ({ deviceType, deviceTypeChanged }) => {
        if (viewStore.inputFocusViewLayerID != constants.viewData.layer.gamePlayView) return;
        this.rotateCurrentFigure(1);
      }
    );
    eventBus.addEventListener(
      evenBusID,
      controlEvent.rotateCurrentFigureCounterclockwise,
      ({ deviceType, deviceTypeChanged }) => {
        if (viewStore.inputFocusViewLayerID != constants.viewData.layer.gamePlayView) return;
        this.rotateCurrentFigure(-1);
      }
    );
    eventBus.addEventListener(
      evenBusID,
      controlEvent.speedUpFallingCurrentFigure,
      ({ deviceType, deviceTypeChanged }) => {
        if (viewStore.inputFocusViewLayerID != constants.viewData.layer.gamePlayView) return;
        this.speedUpFallingCurrentFigure();
      }
    );
    eventBus.addEventListener(evenBusID, controlEvent.dropCurrentFigure, ({ deviceType, deviceTypeChanged }) => {
      if (viewStore.inputFocusViewLayerID != constants.viewData.layer.gamePlayView) return;
      this.dropCurrentFigure();
    });
    eventBus.addEventListener(evenBusID, controlEvent.holdCurrentFigure, ({ deviceType, deviceTypeChanged }) => {
      if (viewStore.inputFocusViewLayerID != constants.viewData.layer.gamePlayView) return;
      this.holdCurrentFigure();
    });

    eventBus.addEventListener(evenBusID, controlEvent.gamePause, ({ deviceType, deviceTypeChanged }) => {
      if (viewStore.inputFocusViewLayerID != constants.viewData.layer.gamePlayView) return;

      if (this.setPause({ state: true })) {
        viewStore.viewLayerEnable({ layerID: constants.viewData.layer.pauseMenu, isAdditive: true });
      }
    });
    eventBus.addEventListener(evenBusID, controlEvent.gameUnpause, ({ deviceType, deviceTypeChanged }) => {
      if (viewStore.inputFocusViewLayerID != constants.viewData.layer.pauseMenu) return;

      if (this.setPause({ state: false })) {
        viewStore.shiftInputFocusToViewLayerID({ layerID: constants.viewData.layer.pauseMenu, isPrevious: true });
      }
    });
    eventBus.addEventListener(evenBusID, controlEvent.gamePauseToggle, ({ deviceType, deviceTypeChanged }) => {
      if (
        viewStore.inputFocusViewLayerID != constants.viewData.layer.gamePlayView &&
        viewStore.inputFocusViewLayerID != constants.viewData.layer.pauseMenu
      )
        return;

      if (this.setPause({ toggle: true })) {
        if (this.observables.gameState == constants.gameState.play) {
          viewStore.shiftInputFocusToViewLayerID({
            layerID: constants.viewData.layer.pauseMenu,
            isPrevious: true,
          });
        } else {
          viewStore.viewLayerEnable({ layerID: constants.viewData.layer.pauseMenu, isAdditive: true });
        }
      }
    });

    eventBus.addEventListener(evenBusID, controlEvent.helpMenuToggle, ({ deviceType, deviceTypeChanged }) => {
      this.helpMenuToggle();
    });

    //

    eventBus.addEventListener(evenBusID, constants.eventsData.eventType.windowResized, ({ width, height }) => {
      const { cupElem } = this.nonObservables;
      if (cupElem) {
        this.nonObservables.cupElemRect = cupElem.getBoundingClientRect();
      }
    });
  };

  setupDefaultControlSchemes = () => {
    const { inputStore } = this;
    const { addControlScheme, addControlSchemeBind, setActiveControlScheme } = inputStore;
    const { controlEvent, input, getInputEvent } = constants.controls;

    let id = "DefaultKeyboard";
    addControlScheme({
      id,
      namePath: ["optionsMenu", "controlsTab", "controlScheme", "defaultKeyboard"],
      isActive: false,
      props: {
        isDefault: true,
      },
    });

    addControlSchemeBind({
      id,
      action: controlEvent.menuNavUp,
      triggers: [getInputEvent(input.arrowUp)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.menuNavDown,
      triggers: [getInputEvent(input.arrowDown)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.menuNavLeft,
      triggers: [getInputEvent(input.arrowLeft)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.menuNavRight,
      triggers: [getInputEvent(input.arrowRight)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.menuNavSelect,
      triggers: [getInputEvent(input.enter)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.menuNavBack,
      triggers: [getInputEvent(input.esc)],
    });

    addControlSchemeBind({
      id,
      action: controlEvent.moveCurrentFigureLeft,
      triggers: [getInputEvent(input.arrowLeft)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.moveCurrentFigureRight,
      triggers: [getInputEvent(input.arrowRight)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.rotateCurrentFigureClockwise,
      triggers: [getInputEvent(input.kX)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.rotateCurrentFigureCounterclockwise,
      triggers: [getInputEvent(input.kZ)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.speedUpFallingCurrentFigure,
      triggers: [getInputEvent(input.arrowDown)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.dropCurrentFigure,
      triggers: [getInputEvent(input.space)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.holdCurrentFigure,
      triggers: [getInputEvent(input.kC)],
    });

    addControlSchemeBind({
      id,
      action: controlEvent.gamePauseToggle,
      triggers: [getInputEvent(input.esc)],
    });

    addControlSchemeBind({
      id,
      action: controlEvent.helpMenuToggle,
      triggers: [getInputEvent(input.f1)],
    });

    setActiveControlScheme({ id, state: true });

    //

    id = "DefaultMouse";
    addControlScheme({
      id,
      namePath: ["optionsMenu", "controlsTab", "controlScheme", "defaultMouse"],
      isActive: false,
      props: {
        isDefault: true,
      },
    });

    addControlSchemeBind({
      id,
      action: controlEvent.rotateCurrentFigureClockwise,
      triggers: [getInputEvent(input.mouseWheelDown)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.rotateCurrentFigureCounterclockwise,
      triggers: [getInputEvent(input.mouseWheelUp)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.speedUpFallingCurrentFigure,
      triggers: [getInputEvent(input.mouseRightButton)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.dropCurrentFigure,
      triggers: [getInputEvent(input.mouseLeftButton)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.holdCurrentFigure,
      triggers: [getInputEvent(input.mouseMiddleButton)],
    });

    setActiveControlScheme({ id, state: true });

    //

    id = "DefaultGamepad";
    addControlScheme({
      id,
      namePath: ["optionsMenu", "controlsTab", "controlScheme", "defaultGamepad"],
      isActive: false,
      props: {
        isDefault: true,
      },
    });

    addControlSchemeBind({
      id,
      action: controlEvent.menuNavUp,
      triggers: [getInputEvent(input.GPB_DPUp)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.menuNavDown,
      triggers: [getInputEvent(input.GPB_DPDown)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.menuNavLeft,
      triggers: [getInputEvent(input.GPB_DPLeft)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.menuNavRight,
      triggers: [getInputEvent(input.GPB_DPRight)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.menuNavSelect,
      triggers: [getInputEvent(input.GPB_A)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.menuNavBack,
      triggers: [getInputEvent(input.GPB_B)],
    });

    addControlSchemeBind({
      id,
      action: controlEvent.moveCurrentFigureLeft,
      triggers: [getInputEvent(input.GPB_DPLeft)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.moveCurrentFigureRight,
      triggers: [getInputEvent(input.GPB_DPRight)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.rotateCurrentFigureClockwise,
      triggers: [getInputEvent(input.GPB_B)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.rotateCurrentFigureCounterclockwise,
      triggers: [getInputEvent(input.GPB_A)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.speedUpFallingCurrentFigure,
      triggers: [getInputEvent(input.GPB_DPDown)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.dropCurrentFigure,
      triggers: [getInputEvent(input.GPB_DPUp)],
    });
    addControlSchemeBind({
      id,
      action: controlEvent.holdCurrentFigure,
      triggers: [getInputEvent(input.GPB_RB)],
    });

    addControlSchemeBind({
      id,
      action: controlEvent.gamePauseToggle,
      triggers: [getInputEvent(input.GPB_Start)],
    });

    addControlSchemeBind({
      id,
      action: controlEvent.helpMenuToggle,
      triggers: [getInputEvent(input.GPB_Select)],
    });

    setActiveControlScheme({ id, state: true });

    //

    addControlScheme({
      id,
      isActive: true,
      props: {},
    });
    addControlScheme({
      id,
      isActive: true,
      props: {},
    });
  };

  viewStateInit = () => {
    const { viewStore } = this;
    const { setViewLayerData } = viewStore;
    const { viewData } = viewStore.observables;

    // views
    viewData.viewState[constants.viewData.view.mainMenu] = {
      canBeShown: true,
      show: false,
    };
    viewData.viewState[constants.viewData.view.optionsMenu] = {
      canBeShown: true,
      show: false,
    };
    viewData.viewState[constants.viewData.view.gamePlayView] = {
      canBeShown: true,
      show: false,
    };
    viewData.viewState[constants.viewData.view.pauseMenu] = {
      canBeShown: true,
      show: false,
    };
    viewData.viewState[constants.viewData.view.gameOverMenu] = {
      canBeShown: true,
      show: false,
    };
    viewData.viewState[constants.viewData.view.helpMenu] = {
      canBeShown: true,
      show: false,
    };
    viewData.viewState[constants.viewData.view.getInputMenu] = {
      canBeShown: true,
      show: false,
    };
    viewData.viewState[constants.viewData.view.controlsOverlapMenu] = {
      canBeShown: true,
      show: false,
    };
    viewData.viewState[constants.viewData.view.selectMenu] = {
      canBeShown: true,
      show: false,
    };

    // layers
    setViewLayerData({
      layerID: constants.viewData.layer.mainMenu,
      data: {
        isEnabled: false,
        views: [
          {
            id: constants.viewData.view.mainMenu,
            enableProps: {
              show: true,
            },
            disableProps: {
              show: false,
            },
          },
        ],
        data: {},
      },
    });
    setViewLayerData({
      layerID: constants.viewData.layer.optionsMenu,
      data: {
        isEnabled: false,
        isBackAllowed: true,
        views: [
          {
            id: constants.viewData.view.optionsMenu,
            enableProps: {
              show: true,
            },
            disableProps: {
              show: false,
            },
          },
        ],
        data: {},
      },
    });
    setViewLayerData({
      layerID: constants.viewData.layer.gamePlayView,
      data: {
        isEnabled: false,
        views: [
          {
            id: constants.viewData.view.gamePlayView,
            enableProps: {
              show: true,
            },
            disableProps: {
              show: false,
            },
          },
        ],
        data: {},
      },
    });
    setViewLayerData({
      layerID: constants.viewData.layer.pauseMenu,
      data: {
        isEnabled: false,
        views: [
          {
            id: constants.viewData.view.pauseMenu,
            enableProps: {
              show: true,
            },
            disableProps: {
              show: false,
            },
          },
        ],
        data: {},
      },
    });
    setViewLayerData({
      layerID: constants.viewData.layer.gameOverMenu,
      data: {
        isEnabled: false,
        views: [
          {
            id: constants.viewData.view.gameOverMenu,
            enableProps: {
              show: true,
            },
            disableProps: {
              show: false,
            },
          },
        ],
        data: {},
      },
    });
    setViewLayerData({
      layerID: constants.viewData.layer.helpMenu,
      data: {
        isEnabled: false,
        isBackAllowed: true,
        views: [
          {
            id: constants.viewData.view.helpMenu,
            enableProps: {
              show: true,
            },
            disableProps: {
              show: false,
            },
          },
        ],
        data: {},
      },
    });
    setViewLayerData({
      layerID: constants.viewData.layer.getInputMenu,
      data: {
        isEnabled: false,
        isBackAllowed: true,
        views: [
          {
            id: constants.viewData.view.getInputMenu,
            enableProps: {
              show: true,
            },
            disableProps: {
              show: false,
            },
          },
        ],
        data: {},
      },
    });
    setViewLayerData({
      layerID: constants.viewData.layer.controlsOverlapMenu,
      data: {
        isEnabled: false,
        isBackAllowed: true,
        views: [
          {
            id: constants.viewData.view.controlsOverlapMenu,
            enableProps: {
              show: true,
            },
            disableProps: {
              show: false,
            },
          },
        ],
        data: {},
      },
    });
    setViewLayerData({
      layerID: constants.viewData.layer.selectMenu,
      data: {
        isEnabled: false,
        isBackAllowed: true,
        views: [
          {
            id: constants.viewData.view.selectMenu,
            enableProps: {
              show: true,
            },
            disableProps: {
              show: false,
            },
          },
        ],
        data: {},
      },
    });
  };

  //

  bindInput = async ({ controlScheme, action, triggerReplace }) => {
    const { inputStore, viewStore } = this;

    const layerID = constants.viewData.layer.getInputMenu;

    if (viewStore.getViewLayerData(layerID).isEnabled) return false;

    runInAction(() => {
      viewStore.setViewLayerData({
        layerID,
        data: {
          data: {
            registeredInput: "",
          },
        },
        override: false,
      });
      viewStore.viewLayerEnable({ layerID, isAdditive: true });
    });

    const input = await inputStore.getInput();
    if (input) {
      runInAction(() => {
        if (triggerReplace) {
          inputStore.replaceControlSchemeBind({
            id: controlScheme.id,
            action,
            triggerOld: triggerReplace,
            triggerNew: constants.controls.getInputEvent(input),
          });
        } else {
          inputStore.addControlSchemeBind({
            id: controlScheme.id,
            action,
            triggers: [constants.controls.getInputEvent(input)],
          });
        }

        // viewStore.setViewLayerData({
        //   layerID,
        //   data: {
        //     data: {
        //       registeredInput: input,
        //     },
        //   },
        //   override: false,
        // });
      });
      // await eventHelpers.sleep(1000);
    }

    viewStore.shiftInputFocusToViewLayerID({ layerID, isPrevious: true });
    inputStore.getInputDisable();
    this.checkControlsOverlap({ silentIfOk: true });

    return input;
  };

  checkControlsOverlap = ({ silentIfOk = false } = {}) => {
    const { inputStore, viewStore } = this;

    const layerID = constants.viewData.layer.controlsOverlapMenu;

    const overlapControlSchemes = inputStore.getActiveTriggerOverlaps();
    if (silentIfOk && !overlapControlSchemes.length) return;

    viewStore.setViewLayerData({
      layerID,
      data: {
        data: {
          overlapControlSchemes,
        },
      },
      override: false,
    });
    viewStore.viewLayerEnable({ layerID, isAdditive: true });
  };

  helpMenuToggle = () => {
    const { viewStore } = this;

    const isEnabled = viewStore.getViewLayerData(constants.viewData.layer.helpMenu).isEnabled;
    const isPauseMenuEnabled = viewStore.getViewLayerData(constants.viewData.layer.pauseMenu).isEnabled;
    const isGameOverMenuEnabled = viewStore.getViewLayerData(constants.viewData.layer.gameOverMenu).isEnabled;
    if (!isEnabled) {
      if (!isPauseMenuEnabled && !isGameOverMenuEnabled) this.setPause({ state: true });
      viewStore.viewLayerEnable({ layerID: constants.viewData.layer.helpMenu, isAdditive: true });
    } else {
      if (!isPauseMenuEnabled && !isGameOverMenuEnabled) this.setPause({ state: false });
      viewStore.shiftInputFocusToViewLayerID({ layerID: constants.viewData.layer.helpMenu, isPrevious: true });
    }
  };

  selectMenuOpen = async ({ title, options, value, onChange }) => {
    const { viewStore } = this;

    const layerID = constants.viewData.layer.selectMenu;

    runInAction(() => {
      viewStore.setViewLayerData({
        layerID,
        data: {
          data: {
            title,
            options,
            value,
          },
        },
        override: false,
      });
      viewStore.viewLayerEnable({ layerID, isAdditive: true });
    });

    const selectedID = await viewStore.optionSelectSubscribe();

    if (selectedID !== false) {
      onChange?.(selectedID);
    }

    runInAction(() => {
      viewStore.setViewLayerData({
        layerID,
        data: {
          data: {
            title: "",
            options: [],
            value: "",
          },
        },
        override: false,
      });
      viewStore.shiftInputFocusToViewLayerID({ layerID, isPrevious: true });
    });
    viewStore.optionSelectUnsubscribe();
  };

  //

  get cellsMaxSize() {
    const { gameData } = this.observables;

    let width = 0;
    let height = 0;
    gameData.figureTypesAllowed?.forEach((type) => {
      const figureTypeData = constants.gameplay.figureTypeData[type];
      figureTypeData.rotations.forEach((rotationData) => {
        rotationData.forEach(([pX, pY]) => {
          if (pX > width) width = pX;
          if (pY > height) height = pY;
        });
      });
    });
    width++;
    height++;

    return { width, height };
  }

  //

  gameStartClassic = () => {
    this.observables.gameMode = constants.gameMode.classic;
    this.gameStart();
    this.viewStore.viewLayerEnable({
      layerID: constants.viewData.layer.gamePlayView,
    });
  };

  gameStart = () => {
    const { cellsMaxSize } = this;
    const { gameMode, gameOptions, gameData } = this.observables;

    if (gameMode == constants.gameMode.classic) {
      const { cup, currentFigure } = gameData;
      gameData.figureTypesAllowed.push(
        constants.gameplay.figureType["I-shape"],
        constants.gameplay.figureType["J-shape"],
        constants.gameplay.figureType["L-shape"],
        constants.gameplay.figureType["S-shape"],
        constants.gameplay.figureType["Z-shape"],
        constants.gameplay.figureType["T-shape"],
        constants.gameplay.figureType["square-2x2"]
      );

      if (gameOptions.enableLevels) {
        // const levels = 15;
        const levels = 10;
        for (let lvl = 0; lvl < levels; lvl++) {
          gameData.levelData.push({
            // speed: [1000, 793, 618, 473, 355, 262, 190, 135, 94, 64, 43, 28, 18, 15, 7][lvl],
            speed: [1000, 800, 600, 500, 400, 300, 200, 150, 100, 50][lvl],
            nextLevelLines: 5 * (lvl + 1),
            actionScore: {
              [constants.gameplay.actionType.clearLines]: 100 * (lvl + 1),
              [constants.gameplay.actionType.softDrop]: 1,
              [constants.gameplay.actionType.hardDrop]: 2,
            },
          });
        }
      }

      this.createGrid(cup.data, cup.width, cup.height);

      this.createGrid(currentFigure.cells.data, cellsMaxSize.width, cellsMaxSize.height);
      this.generateCurrentFigure();
      currentFigure.x = cup.figureStart.x;
      currentFigure.y = cup.figureStart.y;
      this.calcShadowFigureY();

      this.generateCupView();
    }

    this.observables.gameState = constants.gameState.play;
    this.setGameLoopTimeout();
  };

  gameEnd = () => {
    this.observables.gameState = constants.gameState.pause;

    const { gameMode, gameData } = this.observables;
    const { cup, currentFigure } = gameData;
    const gameDataDefaults = this.defaults.observables.gameData;

    if (gameMode == constants.gameMode.classic) {
      gameData.score = gameDataDefaults.score;
      gameData.lines = gameDataDefaults.lines;
      gameData.level = gameDataDefaults.level;

      gameData.gameLoopTimeoutMs = gameDataDefaults.gameLoopTimeoutMs;

      gameData.figureTypesAllowed = objectHelpers.deepCopy(gameDataDefaults.figureTypesAllowed);
      gameData.levelData = objectHelpers.deepCopy(gameDataDefaults.levelData);
      gameData.randomFigureTypePool = objectHelpers.deepCopy(gameDataDefaults.randomFigureTypePool);

      cup.data = objectHelpers.deepCopy(gameDataDefaults.cup.data);
      cup.view = objectHelpers.deepCopy(gameDataDefaults.cup.view);

      currentFigure.type = gameDataDefaults.currentFigure.type;
      currentFigure.cells.data = objectHelpers.deepCopy(gameDataDefaults.currentFigure.cells.data);
    }

    this.clearGameLoopTimeout();
  };

  gameRestart = () => {
    this.gameEnd();
    this.gameStart();
  };

  gameOver = () => {
    this.clearGameLoopTimeout();
    this.observables.gameState = constants.gameState.pause;
    this.viewStore.viewLayerEnable({ layerID: constants.viewData.layer.gameOverMenu, isAdditive: true });
  };

  addScore = ({ action, scoreMult = 1 }) => {
    if (!action) return;

    const { gameData } = this.observables;
    const { levelData, lines } = gameData;
    if (!levelData.length) return;

    if (gameData.level >= levelData.length) gameData.level = levelData.length - 1;
    let _levelData = levelData[gameData.level];

    const _actionScore = (_levelData.actionScore[action] || 0) * scoreMult;
    gameData.score += _actionScore;

    while (gameData.level < levelData.length - 1 && lines >= _levelData.nextLevelLines) {
      gameData.level++;
      _levelData = levelData[gameData.level];
    }
    gameData.gameLoopTimeoutMs = _levelData.speed;
  };

  setPause = ({ toggle, state }) => {
    const { gameMode } = this.observables;
    const { play, pause } = constants.gameState;

    if (gameMode == constants.gameMode.none) return false;

    if (this.observables.gameState == play || this.observables.gameState == pause) {
      let stateChanged = false;
      if (toggle) {
        this.observables.gameState = this.observables.gameState == play ? pause : play;
        stateChanged = true;
      } else {
        const newState = state ? pause : play;
        if (this.observables.gameState != newState) {
          this.observables.gameState = newState;
          stateChanged = true;
        }
      }

      if (stateChanged) {
        if (this.observables.gameState == play) {
          this.setGameLoopTimeout();
        } else {
          this.clearGameLoopTimeout();
        }
        return true;
      }
    }

    return false;
  };

  //

  moveCurrentFigureAlongX = (targetX) => {
    const { cellsMaxSize } = this;
    const { gameState, gameData } = this.observables;
    const { cup, currentFigure } = gameData;

    if (currentFigure.type == constants.gameplay.figureType.none) return false;
    if (gameState == constants.gameState.pause) return false;

    const xMin = -1 * (cellsMaxSize.width - 1);
    const xMax = cup.width - 1;
    let _x = currentFigure.x;
    if (targetX < _x) {
      if (targetX < xMin) {
        targetX = xMin;
      }

      while (!this.checkFigureOverlap({ x: _x }) && _x > targetX) {
        _x--;
      }
      if (this.checkFigureOverlap({ x: _x })) {
        _x++;
      }
    } else {
      if (targetX > xMax) {
        targetX = xMax;
      }

      while (!this.checkFigureOverlap({ x: _x }) && _x < targetX) {
        _x++;
      }
      if (this.checkFigureOverlap({ x: _x })) {
        _x--;
      }
    }

    currentFigure.x = _x;
    this.calcShadowFigureY();
    this.generateCupView();
    return true;
  };

  moveCurrentFigureCupPointX = () => {
    const { inputStore } = this;
    const { lastDeviceTypeUsed, inputOptions } = inputStore.observables;

    if (lastDeviceTypeUsed != constants.controls.deviceType.mouse) return;
    if (!inputOptions.allowFigureMoveByMouse) return false;

    const { cupElemRect } = this.nonObservables;
    if (!cupElemRect) return;

    const { gameData } = this.observables;
    const { currentFigure } = gameData;
    const { lastCursorPointerX, cellSizePx } = this.nonObservables;

    const targetX = Math.floor((lastCursorPointerX - cupElemRect.left) / cellSizePx) - currentFigure.cells.x;
    return this.moveCurrentFigureAlongX(targetX);
  };

  rotateCurrentFigure = (step = 1) => {
    const { gameState, gameData } = this.observables;
    const { currentFigure } = gameData;

    if (currentFigure.type == constants.gameplay.figureType.none) return false;
    if (gameState == constants.gameState.pause) return false;

    const figureTypeData = constants.gameplay.figureTypeData[currentFigure.type];
    if (figureTypeData.rotations.length <= 1) return false;

    const currentRotation = currentFigure.rotation;
    let newRotation = currentRotation + step;
    while (newRotation < 0) {
      newRotation += figureTypeData.rotations.length;
    }
    newRotation = newRotation % figureTypeData.rotations.length;
    if (newRotation == currentRotation) return false;

    const currentRotationOffsets = figureTypeData.rotationData[currentRotation].offsets;
    const newRotationOffsets = figureTypeData.rotationData[newRotation].offsets;
    for (let oIndex = 0; oIndex < currentRotationOffsets.length; oIndex++) {
      const [currentOffsetX, currentOffsetY] = currentRotationOffsets[oIndex];
      const [newOffsetX, newOffsetY] = newRotationOffsets[oIndex];
      const offsetX = currentOffsetX - newOffsetX;
      const offsetY = newOffsetY - currentOffsetY; // Y-axis is upside-down from "classic"
      const newX = currentFigure.x + offsetX;
      const newY = currentFigure.y + offsetY;

      if (!this.checkFigureOverlap({ x: newX, y: newY, rotation: newRotation })) {
        this.generateCurrentFigure({ type: currentFigure.type, rotation: newRotation });
        currentFigure.x = newX;
        currentFigure.y = newY;
        const moveResult = this.moveCurrentFigureCupPointX();
        if (!moveResult) {
          this.calcShadowFigureY();
          this.generateCupView();
        }
        return true;
      }
    }

    return false;
  };

  dropCurrentFigure = () => {
    const { gameState, gameData } = this.observables;
    const { currentFigure, cup } = gameData;

    if (currentFigure.type == constants.gameplay.figureType.none) return false;
    if (gameState == constants.gameState.pause) return false;

    let y = currentFigure.y;
    const maxY = cup.height - 1;
    while (!this.checkFigureOverlap({ y }) && y < maxY) {
      y++;
    }
    y--;

    const delta = y - currentFigure.y;
    this.addScore({ action: constants.gameplay.actionType.hardDrop, scoreMult: delta });

    currentFigure.y = y;
    this.generateCupView();
    this.callNextGameLoopImmediately();
    return true;
  };

  speedUpFallingCurrentFigure = () => {
    const { gameState, gameData } = this.observables;
    const { currentFigure } = gameData;

    if (currentFigure.type == constants.gameplay.figureType.none) return false;
    if (gameState == constants.gameState.pause) return false;

    this.addScore({ action: constants.gameplay.actionType.softDrop });

    this.callNextGameLoopImmediately();
    return true;
  };

  holdCurrentFigure = () => {
    const { gameOptions, gameData } = this.observables;
    if (!gameOptions.enableHold) return;

    const { cup, currentFigure, holdFigure } = gameData;

    if (currentFigure.type == constants.gameplay.figureType.none) return;

    if (holdFigure.blocked) return;
    holdFigure.blocked = true;

    const holdFigureType = holdFigure.type;
    holdFigure.type = currentFigure.type;
    if (holdFigureType != constants.gameplay.figureType.none) {
      this.generateCurrentFigure({ type: holdFigureType });
      currentFigure.x = cup.figureStart.x;
      currentFigure.y = cup.figureStart.y;
      this.calcShadowFigureY();

      const cupViewGenerated = this.moveCurrentFigureCupPointX();
      if (!cupViewGenerated) {
        this.generateCupView();
      }
    } else {
      currentFigure.type = constants.gameplay.figureType.none;
      this.callNextGameLoopImmediately();
    }
  };

  generateCurrentFigure = ({ type, rotation = 0 } = {}) => {
    const { gameData } = this.observables;
    const { currentFigure } = gameData;

    if (type == undefined) {
      type = this.getNextRandomFigureType();
    }

    currentFigure.rotation = rotation;
    const result = this.generateFigureData({
      type,
      rotation: currentFigure.rotation,
    });
    if (!result) return false;

    const { cellsData, pXMin, pYMin, cellsW, cellsH } = result;
    currentFigure.type = type;
    currentFigure.cells.data = cellsData;
    currentFigure.cells.x = pXMin;
    currentFigure.cells.y = pYMin;
    currentFigure.cells.width = cellsW;
    currentFigure.cells.height = cellsH;

    return true;
  };

  calcShadowFigureY = () => {
    const { gameData } = this.observables;
    const { cup, currentFigure } = gameData;

    if (currentFigure.type == constants.gameplay.figureType.none) return false;

    let y = currentFigure.y;
    const maxY = cup.height - 1;
    while (!this.checkFigureOverlap({ y }) && y < maxY) {
      y++;
    }
    y--;

    gameData.shadowFigureY = y;
    return true;
  };

  //

  setGameLoopTimeout = () => {
    const { gameData } = this.observables;
    const { gameLoopTimeoutMs } = gameData;

    // console.log(`${gameLoopTimeoutMs}ms - next game loop`);
    if (!this.nonObservables.gameLoopTimeout) {
      this.nonObservables.gameLoopTimeout = setTimeout(() => {
        this.nonObservables.gameLoopTimeout = undefined;
        this.gameLoop();
      }, gameLoopTimeoutMs);
    }
  };

  clearGameLoopTimeout = () => {
    if (this.nonObservables.gameLoopTimeout) {
      clearTimeout(this.nonObservables.gameLoopTimeout);
      this.nonObservables.gameLoopTimeout = undefined;
    }
  };

  callNextGameLoopImmediately = () => {
    this.clearGameLoopTimeout();
    this.nonObservables.gameLoopTimeout = setTimeout(() => {
      this.nonObservables.gameLoopTimeout = undefined;
      this.gameLoop();
    }, 1);
  };

  gameLoop = async () => {
    const { gameData } = this.observables;
    const { cup, currentFigure, holdFigure } = gameData;
    const { gameState } = this.observables;
    // console.log("game loop");

    if (gameState == constants.gameState.pause) return;

    if (currentFigure.type == constants.gameplay.figureType.none) {
      runInAction(() => {
        this.generateCurrentFigure();
        currentFigure.x = cup.figureStart.x;
        currentFigure.y = cup.figureStart.y;
        this.calcShadowFigureY();

        if (this.checkFigureOverlap()) {
          this.generateCupView();
          this.gameOver();
          return;
        } else {
          const cupViewGenerated = this.moveCurrentFigureCupPointX();
          if (!cupViewGenerated) {
            this.generateCupView();
          }
          this.setGameLoopTimeout();
        }
      });
    } else {
      const newY = currentFigure.y + 1;
      if (this.checkFigureOverlap({ y: newY })) {
        runInAction(() => {
          const { type, x, y, rotation } = currentFigure;
          currentFigure.type = constants.gameplay.figureType.none;
          this.spawnFigure(type, rotation, x, y);
        });

        await eventHelpers.sleep(300);
        await this.clearFullLines();

        holdFigure.blocked = false;
        this.callNextGameLoopImmediately();
      } else {
        runInAction(() => {
          currentFigure.y = newY;
          this.generateCupView();
        });
        this.setGameLoopTimeout();
      }
    }
  };

  //

  getNextRandomFigureType = () => {
    const { gameData } = this.observables;

    if (gameData.randomFigureTypePool.length < gameData.figureTypesAllowed.length) {
      const pool = objectHelpers.deepCopy(gameData.figureTypesAllowed);
      for (let i = 0; i < gameData.figureTypesAllowed.length; i++) {
        gameData.randomFigureTypePool.push(pool.splice(Math.round(Math.random() * (pool.length - 1)), 1)[0]);
      }
    }

    return gameData.randomFigureTypePool.shift();
  };

  createCell = () => {
    return {
      type: 0,
    };
  };

  createRow = (width) => {
    const row = [];
    for (let wIndex = 0; wIndex < width; wIndex++) {
      row.push(this.createCell());
    }

    return row;
  };

  createGrid = (source, width, height) => {
    for (let y = 0; y < height; y++) {
      source.push(this.createRow(width));
    }
  };

  //

  spawnFigure = (figureType, rotation, x, y) => {
    const { gameData } = this.observables;
    const { cup } = gameData;

    const figureDataResult = this.generateFigureData({ type: figureType, rotation });
    if (figureDataResult) {
      const { figureData, figureCellData } = figureDataResult;
      for (let pIndex = 0; pIndex < figureData.length; pIndex++) {
        let [_pX, _pY] = figureData[pIndex];
        let pX = x + _pX;
        let pY = y + _pY;

        cup.data[pY][pX] = {
          ...cup.data[pY][pX],
          ...figureCellData,
        };
      }
      this.generateCupView();
    }
  };

  clearFullLines = async () => {
    const { gameData } = this.observables;
    const { cup } = gameData;

    const fullLinesY = [];
    for (let _y = cup.height - 1; _y >= 0; _y--) {
      if (cup.data[_y].every((cell) => cell.type > 0)) {
        fullLinesY.push(_y);
      }
    }

    if (fullLinesY.length) {
      // console.log({ fullLinesY });
      runInAction(() => {
        gameData.lines += fullLinesY.length;
        this.addScore({ action: constants.gameplay.actionType.clearLines, scoreMult: fullLinesY.length });

        fullLinesY.forEach((_y) => {
          cup.data[_y].forEach((cell) => {
            cell.type = 0;
          });
        });
        this.generateCupView();
      });

      await eventHelpers.sleep(300);

      runInAction(() => {
        fullLinesY.forEach((_y, yIndex) => {
          cup.data.splice(_y + yIndex, 1);
          cup.data.unshift(this.createRow(cup.width));
        });
        this.generateCupView();
      });

      await eventHelpers.sleep(300);
    }
  };

  generateCupView = () => {
    const { gameData } = this.observables;
    const { cup, currentFigure, shadowFigureY } = gameData;

    cup.view = [];
    for (let _y = 0; _y < cup.height; _y++) {
      const cupRow = [];
      for (let _x = 0; _x < cup.width; _x++) {
        const cellDataToAdd = {};
        if (
          _x >= currentFigure.x + currentFigure.cells.x &&
          _x <= currentFigure.x + currentFigure.cells.x + currentFigure.cells.width - 1
        ) {
          cellDataToAdd.isCurrentFigureColumn = true;
        }

        cupRow.push({ ...cup.data[_y][_x], ...cellDataToAdd });
      }
      cup.view.push(cupRow);
    }

    if (currentFigure.type != constants.gameplay.figureType.none) {
      const figureDataResult = this.generateFigureData({ type: currentFigure.type, rotation: currentFigure.rotation });
      if (figureDataResult) {
        const { figureData, figureCellData } = figureDataResult;
        for (let pIndex = 0; pIndex < figureData.length; pIndex++) {
          let [_pX, _pY] = figureData[pIndex];
          let pX = currentFigure.x + _pX;
          let pY = currentFigure.y + _pY;
          if (cup.view[pY]?.[pX]) {
            cup.view[pY][pX] = {
              ...cup.view[pY][pX],
              ...figureCellData,
              isCurrentFigure: true,
            };
          }

          pY = _pY + shadowFigureY;
          if (cup.view[pY]?.[pX]) {
            cup.view[pY][pX] = {
              ...cup.view[pY][pX],
              ...figureCellData,
              isShadowFigure: true,
            };
          }
        }
      }
    }
  };

  //

  checkFigureOverlap = ({ type, x, y, rotation } = {}) => {
    const { gameData } = this.observables;
    const { currentFigure, cup } = gameData;

    const _type = type == undefined ? currentFigure.type : type;
    if (_type == constants.gameplay.figureType.none) return false;

    const _x = x == undefined ? currentFigure.x : x;
    const _y = y == undefined ? currentFigure.y : y;
    const _rotation = rotation == undefined ? currentFigure.rotation : rotation;

    const figureDataResult = this.generateFigureData({ type: _type, rotation: _rotation });
    if (!figureDataResult) return false;

    const { figureData } = figureDataResult;

    const hasOverlap = figureData.some(([_pX, _pY]) => {
      const pX = _x + _pX;
      const pY = _y + _pY;
      return (
        pX < 0 || pX >= cup.width || pY < 0 || pY >= cup.height || (cup.data[pY]?.[pX] && cup.data[pY][pX].type > 0)
      );
    });
    // console.log({hasOverlap});

    return hasOverlap;
  };

  generateFigureData = ({ type, rotation }) => {
    const { cellsMaxSize } = this;

    if (cellsMaxSize.width == 1 && cellsMaxSize.height == 1) return false;
    if (type == constants.gameplay.figureType.none) return false;

    const figureTypeData = constants.gameplay.figureTypeData[type];
    if (!figureTypeData) return false;

    const figureData = figureTypeData.rotations[rotation];
    const figureCellData = figureTypeData.cellData;

    const cellsData = [];
    this.createGrid(cellsData, cellsMaxSize.width, cellsMaxSize.height);
    let pXMin = 0;
    let pXMax = 0;
    let pYMin = 0;
    let pYMax = 0;
    if (figureData.length) {
      pXMin = cellsMaxSize.width;
      pYMin = cellsMaxSize.height;
      for (let pIndex = 0; pIndex < figureData.length; pIndex++) {
        const [pX, pY] = figureData[pIndex];
        cellsData[pY][pX] = {
          ...(cellsData[pY]?.[pX] || {}),
          ...figureCellData,
        };
        pXMin = pX < pXMin ? pX : pXMin;
        pXMax = pX > pXMax ? pX : pXMax;
        pYMin = pY < pYMin ? pY : pYMin;
        pYMax = pY > pYMax ? pY : pYMax;
      }
    }

    return {
      figureTypeData,
      figureData,
      figureCellData,
      cellsData,
      pXMin,
      pXMax,
      pYMin,
      pYMax,
      cellsW: pXMax - pXMin + 1,
      cellsH: pYMax - pYMin + 1,
    };
  };
}

export default Object.assign(Storage, {});
