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
import * as timeHelpers from "@utils/time-helpers";

class Storage {
  constructor() {
    this.observables = {
      lang: Object.keys(constants.lang.strings)[0],

      gameState: constants.gameplay.gameState.pause,
      gameMode: constants.gameplay.gameMode.classic,
      gameOptions: {
        maxLevels: 0,
        continueAfterMaxLevel: true,

        timeLimit: 0,
        linesLimit: 0,

        enableHold: true,

        cellGroupType: constants.gameplay.cellGroupType.block,
        groupsFallOnClear: false,
        groupsConnectWhileFall: true,

        cellularAutomatonMode: false,
        cellularAutomatonIsMold: false,
        cellularAutomatonCellsNotDie: false,

        addJunkRowsMode: true,

        enableNonBlockingMoveDown: true,
        enableNonBlockingSoftDrop: true,
        enableNonBlockingHardDrop: false,

        figureLockDelay: 500,
        enableInfiniteRotation: false,
        enableInfiniteMove: false,
      },
      graphicsOptions: {
        interfaceScale: 1,
        maxCellSize: 30,
      },
      gameplayOptions: {
        hardDropDelay: 300,
      },
      gameData: {
        figureTypesAllowed: [],
        cellTypesAllowed: [],
        levelData: [],
        score: 0,
        time: 0,
        lines: 0,
        level: 0,
        gameLoopTimeoutMs: 1000,
        randomFigureTypePool: [],
        randomCellTypePool: [],

        cup: {
          width: 10,
          height: 20,
          cellSizePx: 30,
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

      cupElem: undefined,
      cupElemRect: undefined,
      windowWidth: 0,
      windowHeight: 0,
      layoutData: {
        gameView: {
          topContainerMinHeight: 50,
          bottomContainerMinHeight: 50,
          leftContainerMinWidth: 100,
          rightContainerMinWidth: 100,

          cupBorder: 1,
          cupPadding: 10,

          cellSizeMin: 6,
        },
      },

      gameLoopData: {
        timeout: 0,
        lastTimestamp: 0,
      },
      currentFigureLockTimeout: 0,
      lastDropTimestamp: 0,
      spawnFigureIndex: 0,
    };

    makeObservable(this, {
      // observable
      observables: observable,

      // action
      init: action,
      loadSettingsFromStorage: action,

      setupDefaultControlSchemes: action,
      viewStateInit: action,
      figureCupStartXUpdate: action,
      cellSizeUpdate: action,

      gameModeUpdate: action,
      gameStart: action,
      gameEnd: action,
      gameOver: action,
      gameWin: action,
      addScore: action,
      setPause: action,

      spawnNewCurrentFigure: action,
      generateCurrentFigure: action,
      moveCurrentFigureAlongX: action,
      rotateCurrentFigure: action,
      dropCurrentFigure: action,
      holdCurrentFigure: action,

      moveCurrentFigureDown: action,
      gameLoop: action,

      getNextRandomFigureType: action,
      getNextRandomCellType: action,

      spawnFigure: action,
      generateCupView: action,

      // computed
      cellsMaxSize: computed,
      cellsMaxSizeInitRotation: computed,
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
    this.inputStore.setDefaults();
    this.viewStore.setDefaults();
    this.navigationStore.setDefaults();

    this.loadSettingsFromStorage();
    autorun(() => {
      this.saveSettingsToStorage();
    });

    this.init();
  }

  init = async () => {
    const { inputStore, viewStore } = this;

    this.onWindowSizeUpdate();
    viewStore.viewLayerEnable({ layerID: constants.viewData.layer.mainMenu });
    // viewStore.viewLayerEnable({ layerID: constants.viewData.layer.optionsMenu, isAdditive: true });
    // viewStore.viewLayerEnable({ layerID: constants.viewData.layer.helpMenu, isAdditive: true });

    // await timeHelpers.sleep(1);
    // inputStore.updateMenuNavElem();
  };

  saveSettingsToStorage = () => {
    const { inputStore } = this;

    const key = "gameSettingsStorage";
    const data = JSON.stringify({
      gameStore: {
        observables: {
          gameOptions: this.observables.gameOptions,
          graphicsOptions: this.observables.graphicsOptions,
          gameplayOptions: this.observables.gameplayOptions,
        },
      },
      inputStore: {
        observables: {
          controlSchemes: inputStore.observables.controlSchemes.map((_) => ({ id: _.id, binds: _.binds })),
          inputOptions: inputStore.observables.inputOptions,
        },
      },
    });

    localStorage.setItem(key, data);
  };

  loadSettingsFromStorage = () => {
    const { inputStore } = this;

    const key = "gameSettingsStorage";
    let data = {};
    try {
      data = JSON.parse(localStorage.getItem(key));
    } catch {}
    if (data === null) data = {};

    const copyKeyContent = (dataFrom, dataTo, keys) => {
      keys.forEach((key) => {
        if (!dataFrom[key]) return;
        objectHelpers.copyOwnProperties(dataFrom[key], dataTo[key]);
      });
    };

    if (data.gameStore) {
      const observables = data.gameStore.observables;
      if (observables) {
        copyKeyContent(observables, this.observables, ["gameOptions", "graphicsOptions", "gameplayOptions"]);
      }
    }

    if (data.inputStore) {
      const observables = data.inputStore.observables;
      if (observables) {
        copyKeyContent(observables, inputStore.observables, ["inputOptions"]);

        if (observables.controlSchemes) {
          observables.controlSchemes.forEach((controlScheme) => {
            const _controlScheme = inputStore.observables.controlSchemes.find((_) => controlScheme.id == _.id);
            if (!_controlScheme) return;

            controlScheme.binds.forEach((bind) => {
              const _bind = _controlScheme.binds.find((_) => _.action == bind.action);
              if (!_bind) return;

              inputStore.removeControlSchemeBind({
                id: controlScheme.id,
                action: bind.action,
                triggers: _bind.triggers,
              });
              inputStore.addControlSchemeBind({ id: controlScheme.id, action: bind.action, triggers: bind.triggers });
            });
          });
        }
      }
    }
  };

  //

  eventBusBind = () => {
    const { eventBus, viewStore, inputStore, navigationStore } = this;
    const { gameOptions, gameData } = this.observables;
    const { evenBusID } = this.nonObservables;
    const { lastDeviceTypeUsed } = inputStore.observables;
    const { controlEvent } = constants.controls;
    const { eventType } = constants.eventsData;

    eventBus.addEventListener(evenBusID, eventType.viewLayerUpdate, ({ layerID }) => {
      if (layerID == constants.viewData.layer.mainMenu) {
        navigationStore.clearLastSelectedElemData();
      }

      if (lastDeviceTypeUsed != constants.controls.deviceType.mouse) {
        setTimeout(() => {
          navigationStore.updateMenuNavElem();
        }, 1);
      }
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
      if (this.moveCurrentFigureAlongX(gameData.currentFigure.x + 1)) {
        if (gameOptions.enableInfiniteMove) {
          if (this.clearCurrentFigureLockTimeout()) {
            this.callGameLoop();
          }
        }
      }
    });
    eventBus.addEventListener(evenBusID, controlEvent.moveCurrentFigureLeft, ({ deviceType, deviceTypeChanged }) => {
      if (viewStore.inputFocusViewLayerID != constants.viewData.layer.gamePlayView) return;
      if (this.moveCurrentFigureAlongX(gameData.currentFigure.x - 1)) {
        if (gameOptions.enableInfiniteMove) {
          if (this.clearCurrentFigureLockTimeout()) {
            this.callGameLoop();
          }
        }
      }
    });
    eventBus.addEventListener(evenBusID, controlEvent.moveCursorPointer, ({ x, deviceType, deviceTypeChanged }) => {
      this.nonObservables.lastCursorPointerX = x;

      if (viewStore.inputFocusViewLayerID == constants.viewData.layer.gamePlayView) {
        if (this.moveCurrentFigureCupPointX()) {
          if (gameOptions.enableInfiniteMove) {
            if (this.clearCurrentFigureLockTimeout()) {
              this.callGameLoop();
            }
          }
        }
      }
    });
    eventBus.addEventListener(
      evenBusID,
      controlEvent.rotateCurrentFigureClockwise,
      ({ deviceType, deviceTypeChanged }) => {
        if (viewStore.inputFocusViewLayerID != constants.viewData.layer.gamePlayView) return;
        if (this.rotateCurrentFigure(1)) {
          if (gameOptions.enableInfiniteRotation) {
            if (this.clearCurrentFigureLockTimeout()) {
              this.callGameLoop();
            }
          }
        }
      }
    );
    eventBus.addEventListener(
      evenBusID,
      controlEvent.rotateCurrentFigureCounterclockwise,
      ({ deviceType, deviceTypeChanged }) => {
        if (viewStore.inputFocusViewLayerID != constants.viewData.layer.gamePlayView) return;
        if (this.rotateCurrentFigure(-1)) {
          if (gameOptions.enableInfiniteRotation) {
            if (this.clearCurrentFigureLockTimeout()) {
              this.callGameLoop();
            }
          }
        }
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
        if (this.observables.gameState == constants.gameplay.gameState.play) {
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

    eventBus.addEventListener(evenBusID, constants.eventsData.eventType.windowResized, this.onWindowSizeUpdate);
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
      triggers: [getInputEvent(input.kX), getInputEvent(input.arrowUp)],
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
      triggers: [getInputEvent(input.GPB_LB), getInputEvent(input.GPB_RB)],
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
    viewData.viewState[constants.viewData.view.gameOptionsMenu] = {
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
    viewData.viewState[constants.viewData.view.gameWinMenu] = {
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
      layerID: constants.viewData.layer.gameOptionsMenu,
      data: {
        isEnabled: false,
        isBackAllowed: true,
        views: [
          {
            id: constants.viewData.view.gameOptionsMenu,
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
      layerID: constants.viewData.layer.gameWinMenu,
      data: {
        isEnabled: false,
        views: [
          {
            id: constants.viewData.view.gameWinMenu,
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
      // await timeHelpers.sleep(1000);
    }

    viewStore.shiftInputFocusToViewLayerID({ layerID, isPrevious: true });
    this.checkControlsOverlap({ silentIfOk: true });
    setTimeout(() => {
      inputStore.getInputDisable();
    }, 100);

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

  onWindowSizeUpdate = ({ width, height } = {}) => {
    if (!width) {
      width = window.innerWidth;
    }
    if (!height) {
      height = window.innerHeight;
    }

    this.nonObservables.windowWidth = width;
    this.nonObservables.windowHeight = height;

    this.gameViewDataUpdate();
  };

  gameViewDataUpdate = () => {
    this.figureCupStartXUpdate();
    this.cellSizeUpdate();

    setTimeout(() => {
      this.cupRectUpdate();
    }, 1);
  };

  figureCupStartXUpdate = () => {
    const { cellsMaxSize } = this;
    const { gameData } = this.observables;

    const cupW = gameData.cup.width;
    const freeCells = cupW - cellsMaxSize.width;
    // let startX = 0;
    // if (freeCells > 0) {
    //   startX = Math.ceil(freeCells / 2) + (freeCells % 2 > 0 ? 0 : 1);
    // }
    const startX = Math.floor(freeCells / 2);
    gameData.cup.figureStart.x = startX;
  };

  cupRectUpdate = () => {
    const { cupElem } = this.nonObservables;
    if (cupElem) {
      this.nonObservables.cupElemRect = cupElem.getBoundingClientRect();
    }
  };

  cellSizeUpdate = () => {
    const { gameData, graphicsOptions } = this.observables;
    const { cup } = gameData;
    const { windowWidth, windowHeight, layoutData } = this.nonObservables;
    const {
      topContainerMinHeight: tMinH,
      bottomContainerMinHeight: bMinH,
      leftContainerMinWidth: lMinW,
      rightContainerMinWidth: rMinW,
      cupBorder,
      cupPadding,
      cellSizeMin,
    } = layoutData.gameView;

    const cupW = windowWidth - lMinW - rMinW - cupBorder - cupPadding;
    const cupH = windowHeight - tMinH - bMinH - cupBorder - cupPadding;

    const cellSizeW = Math.floor(cupW / cup.width);
    const cellSizeH = Math.floor(cupH / cup.height);
    const cellSize = Math.min(Math.max(Math.min(cellSizeW, cellSizeH), cellSizeMin), graphicsOptions.maxCellSize);

    cup.cellSizePx = cellSize;
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

  get cellsMaxSizeInitRotation() {
    const { gameData } = this.observables;

    let width = 0;
    let height = 0;
    gameData.figureTypesAllowed?.forEach((type) => {
      const figureTypeData = constants.gameplay.figureTypeData[type];
      figureTypeData.rotations[0].forEach(([pX, pY]) => {
        if (pX > width) width = pX;
        if (pY > height) height = pY;
      });
    });
    width++;
    height++;

    return { width, height };
  }

  //

  gameModeUpdate = () => {
    const { gameMode, gameOptions, gameData } = this.observables;
    const { gameData: gameDataDefaults } = this.defaults.observables;

    if (gameMode == constants.gameplay.gameMode.classic) {
      gameData.figureTypesAllowed = objectHelpers.deepCopy(gameDataDefaults.figureTypesAllowed);
      gameData.figureTypesAllowed.push(
        constants.gameplay.figureType.I,
        constants.gameplay.figureType.J,
        constants.gameplay.figureType.L,
        constants.gameplay.figureType.S,
        constants.gameplay.figureType.Z,
        constants.gameplay.figureType.T,
        constants.gameplay.figureType.O
      );

      gameData.cellTypesAllowed = objectHelpers.deepCopy(gameDataDefaults.cellTypesAllowed);
      gameData.cellTypesAllowed.push(
        constants.gameplay.cellType.cyan,
        constants.gameplay.cellType.blue,
        constants.gameplay.cellType.orange,
        constants.gameplay.cellType.yellow,
        constants.gameplay.cellType.green,
        constants.gameplay.cellType.purple,
        constants.gameplay.cellType.red
      );
    }
  };

  gameStart = () => {
    const { cellsMaxSize } = this;
    const { gameMode, gameOptions, gameData } = this.observables;
    const { gameLoopData } = this.nonObservables;

    if (gameMode == constants.gameplay.gameMode.classic) {
      const { cup, currentFigure } = gameData;

      if (gameOptions.maxLevels > 0) {
        for (let lvl = 0; lvl < gameOptions.maxLevels; lvl++) {
          gameData.levelData.push({
            speed: constants.gameplay.maxLevelData[gameOptions.maxLevels]?.speed?.[lvl] || 1000,
            nextLevelLines: 5 * (lvl + 1),
            actionScore: {
              [constants.gameplay.actionType.clearLines]: 100 * (lvl + 1),
              [constants.gameplay.actionType.softDrop]: 1 * (lvl + 1),
              [constants.gameplay.actionType.hardDrop]: 2 * (lvl + 1),
            },
          });
        }
      }

      this.createGrid({ source: cup.data, width: cup.width, height: cup.height });

      this.createGrid({ source: currentFigure.cells.data, width: cellsMaxSize.width, height: cellsMaxSize.height });
      this.generateCurrentFigure();
      this.gameViewDataUpdate();
      currentFigure.x = cup.figureStart.x;
      currentFigure.y = cup.figureStart.y;
      this.calcShadowFigureY();

      this.generateCupView();
    }

    this.viewStore.viewLayerEnable({
      layerID: constants.viewData.layer.gamePlayView,
    });

    this.observables.gameState = constants.gameplay.gameState.play;
    this.startGameLoop();
    gameLoopData.lastTimestamp = Date.now();
  };

  gameEnd = () => {
    this.observables.gameState = constants.gameplay.gameState.pause;

    const { gameMode, gameData } = this.observables;
    const { cup, currentFigure } = gameData;
    const { gameData: gameDataDefaults } = this.defaults.observables;

    if (gameMode == constants.gameplay.gameMode.classic) {
      gameData.score = gameDataDefaults.score;
      gameData.time = gameDataDefaults.time;
      gameData.lines = gameDataDefaults.lines;
      gameData.level = gameDataDefaults.level;

      gameData.gameLoopTimeoutMs = gameDataDefaults.gameLoopTimeoutMs;

      gameData.figureTypesAllowed = objectHelpers.deepCopy(gameDataDefaults.figureTypesAllowed);
      gameData.cellTypesAllowed = objectHelpers.deepCopy(gameDataDefaults.cellTypesAllowed);
      gameData.levelData = objectHelpers.deepCopy(gameDataDefaults.levelData);
      gameData.randomFigureTypePool = objectHelpers.deepCopy(gameDataDefaults.randomFigureTypePool);
      gameData.randomCellTypePool = objectHelpers.deepCopy(gameDataDefaults.randomCellTypePool);

      gameData.cup = objectHelpers.deepCopy(gameDataDefaults.cup);
      gameData.currentFigure = objectHelpers.deepCopy(gameDataDefaults.currentFigure);
      gameData.holdFigure = objectHelpers.deepCopy(gameDataDefaults.holdFigure);
    }

    this.stopGameLoop();
  };

  gameRestart = () => {
    this.gameEnd();
    this.gameModeUpdate();
    this.gameStart();
  };

  gameOver = () => {
    this.stopGameLoop();
    this.observables.gameState = constants.gameplay.gameState.pause;
    this.viewStore.viewLayerEnable({ layerID: constants.viewData.layer.gameOverMenu, isAdditive: true });
  };

  gameWin = () => {
    this.stopGameLoop();
    this.observables.gameState = constants.gameplay.gameState.pause;
    this.viewStore.viewLayerEnable({ layerID: constants.viewData.layer.gameWinMenu, isAdditive: true });
  };

  checkWinConditions = () => {
    const { gameOptions, gameData } = this.observables;
    const { lines, levelData, currentFigure, holdFigure } = gameData;

    if (gameOptions.maxLevels > 1 && !gameOptions.continueAfterMaxLevel && gameData.level == levelData.length - 1) {
      const _levelData = levelData[gameData.level];
      if (lines >= _levelData.nextLevelLines) {
        this.gameWin();
        return true;
      }
    }

    if (gameOptions.timeLimit > 0 && gameData.time >= gameOptions.timeLimit) {
      this.gameWin();
      return true;
    }

    if (gameOptions.linesLimit > 0 && gameData.lines >= gameOptions.linesLimit) {
      this.gameWin();
      return true;
    }

    return false;
  };

  addScore = ({ action, scoreMult = 1 }) => {
    if (!action) return false;

    const { gameData } = this.observables;
    const { gameLoopData } = this.nonObservables;
    const { levelData, lines } = gameData;
    if (!levelData.length) return false;

    if (gameData.level >= levelData.length) gameData.level = levelData.length - 1;
    let _levelData = levelData[gameData.level];

    const _actionScore = (_levelData.actionScore[action] || 0) * scoreMult;
    gameData.score += _actionScore;

    while (gameData.level < levelData.length - 1 && lines >= _levelData.nextLevelLines) {
      gameData.level++;
      _levelData = levelData[gameData.level];
    }
    gameData.gameLoopTimeoutMs = _levelData.speed;
    gameLoopData.updateTime?.(gameData.gameLoopTimeoutMs, false);
  };

  setPause = ({ toggle, state }) => {
    const { gameMode, gameState } = this.observables;
    const { play, pause } = constants.gameplay.gameState;
    const { gameLoopData } = this.nonObservables;

    if (gameMode == constants.gameplay.gameMode.none) return false;

    if (gameState == play || gameState == pause) {
      let stateChanged = false;
      if (toggle) {
        this.observables.gameState = gameState == play ? pause : play;
        stateChanged = true;
      } else {
        const newState = state ? pause : play;
        if (gameState != newState) {
          this.observables.gameState = newState;
          stateChanged = true;
        }
      }

      if (stateChanged) {
        if (this.observables.gameState == play) {
          this.startGameLoop();
          gameLoopData.lastTimestamp = Date.now();
        } else {
          this.stopGameLoop();
        }
        return true;
      }
    }

    return false;
  };

  //

  spawnNewCurrentFigure = () => {
    const { cellsMaxSize } = this;
    const { gameData } = this.observables;
    const { cup, currentFigure } = gameData;

    this.generateCurrentFigure();

    const freeCells = cellsMaxSize.width - currentFigure.cells.width;
    let offsetX = Math.floor(freeCells / 2) - currentFigure.cells.x;
    if (offsetX < 0) offsetX = 0;

    currentFigure.x = cup.figureStart.x + offsetX;
    currentFigure.y = cup.figureStart.y;
    this.calcShadowFigureY();

    if (this.checkFigureOverlap()) {
      this.generateCupView();
      this.gameOver();
      return;
    }

    const cupViewGenerated = this.moveCurrentFigureCupPointX();
    if (!cupViewGenerated) {
      this.generateCupView();
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

  moveCurrentFigureAlongX = (targetX) => {
    const { cellsMaxSize } = this;
    const { gameState, gameData } = this.observables;
    const { cup, currentFigure } = gameData;

    if (currentFigure.type == constants.gameplay.figureType.none) return false;
    if (gameState == constants.gameplay.gameState.pause) return false;

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

    if (currentFigure.x == _x) return false;

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
    if (!cupElemRect) return false;

    const { gameData } = this.observables;
    const { currentFigure, cup } = gameData;
    const { lastCursorPointerX } = this.nonObservables;

    const targetX = Math.floor((lastCursorPointerX - cupElemRect.left) / cup.cellSizePx) - currentFigure.cells.x;
    return this.moveCurrentFigureAlongX(targetX);
  };

  rotateCurrentFigure = (step = 1) => {
    const { gameState, gameData } = this.observables;
    const { currentFigure } = gameData;

    if (currentFigure.type == constants.gameplay.figureType.none) return false;
    if (gameState == constants.gameplay.gameState.pause) return false;

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
    const { gameState, gameOptions, gameplayOptions, gameData } = this.observables;
    const { currentFigure, cup } = gameData;

    if (currentFigure.type == constants.gameplay.figureType.none) return false;
    if (gameState == constants.gameplay.gameState.pause) return false;

    const timestamp = Date.now();
    if (timestamp - this.nonObservables.lastDropTimestamp < gameplayOptions.hardDropDelay) return false;
    this.nonObservables.lastDropTimestamp = timestamp;

    let y = currentFigure.y;
    const maxY = cup.height - 1;
    while (!this.checkFigureOverlap({ y }) && y < maxY) {
      y++;
    }
    y--;

    const delta = y - currentFigure.y;
    if (delta > 0) {
      this.addScore({ action: constants.gameplay.actionType.hardDrop, scoreMult: delta });

      currentFigure.y = y;
      this.generateCupView();
    }

    this.stopGameLoop();
    if (gameOptions.enableNonBlockingHardDrop) {
      this.setCurrentFigureLockTimeout();
    } else {
      this.lockCurrentFigure();
    }

    return true;
  };

  speedUpFallingCurrentFigure = () => {
    const { gameState, gameOptions, gameData } = this.observables;
    const { currentFigure } = gameData;

    if (currentFigure.type == constants.gameplay.figureType.none) return false;
    if (gameState == constants.gameplay.gameState.pause) return false;

    if (this.moveCurrentFigureDown({ mandatoryMove: true })) {
      this.resetGameLoop();
      this.addScore({ action: constants.gameplay.actionType.softDrop });
    } else {
      this.stopGameLoop();
      if (gameOptions.enableNonBlockingSoftDrop) {
        this.setCurrentFigureLockTimeout();
      } else {
        this.lockCurrentFigure();
      }
    }

    return true;
  };

  holdCurrentFigure = () => {
    const { gameOptions, gameState, gameData } = this.observables;
    if (!gameOptions.enableHold) return false;

    const { cup, currentFigure, holdFigure } = gameData;

    if (currentFigure.type == constants.gameplay.figureType.none) return false;
    if (gameState == constants.gameplay.gameState.pause) return false;

    if (holdFigure.blocked) return false;
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
      this.spawnNewCurrentFigure();
    }

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

  setCurrentFigureLockTimeout = () => {
    const { gameOptions } = this.observables;

    if (!this.nonObservables.currentFigureLockTimeout) {
      this.nonObservables.currentFigureLockTimeout = setTimeout(() => {
        this.nonObservables.currentFigureLockTimeout = 0;
        if (this.moveCurrentFigureDown()) {
          this.startGameLoop();
        } else {
          this.lockCurrentFigure();
        }
      }, gameOptions.figureLockDelay);
    }
  };

  clearCurrentFigureLockTimeout = () => {
    if (this.nonObservables.currentFigureLockTimeout) {
      clearTimeout(this.nonObservables.currentFigureLockTimeout);
      this.nonObservables.currentFigureLockTimeout = 0;
      return true;
    }
    return false;
  };

  lockCurrentFigure = async () => {
    const { gameData } = this.observables;
    const { currentFigure, holdFigure } = gameData;
    const { gameState } = this.observables;

    if (currentFigure.type == constants.gameplay.figureType.none) return false;
    if (gameState == constants.gameplay.gameState.pause) return false;

    runInAction(() => {
      const { type, x, y, rotation } = currentFigure;
      currentFigure.type = constants.gameplay.figureType.none;
      this.spawnFigure(type, rotation, x, y);
    });

    await this.onLockFigureMechanics();

    await this.clearFullLines();

    if (this.checkWinConditions()) return false;

    runInAction(() => {
      this.spawnNewCurrentFigure();
      holdFigure.blocked = false;
      this.callGameLoop();
    });

    return true;
  };

  moveCurrentFigureDown = ({ mandatoryMove = false } = {}) => {
    const { gameOptions, gameData } = this.observables;
    const { currentFigure } = gameData;
    const { gameState } = this.observables;

    if (currentFigure.type == constants.gameplay.figureType.none) return false;
    if (gameState == constants.gameplay.gameState.pause) return false;

    const newY = currentFigure.y + 1;
    if (this.checkFigureOverlap({ y: newY })) return false;

    if (mandatoryMove || gameOptions.maxLevels > 0) {
      currentFigure.y = newY;
      this.generateCupView();
    }
    return true;
  };

  //

  startGameLoop = () => {
    const { gameData } = this.observables;
    const { gameLoopData } = this.nonObservables;
    const { gameLoopTimeoutMs } = gameData;

    if (gameLoopData.timeout) return false;

    const { callNextIn, updateTime } = timeHelpers.setIntervalAdjusting({
      onStep: this.gameLoop,
      time: gameLoopTimeoutMs,
      timeoutCallback: (timeout) => {
        gameLoopData.timeout = timeout;
      },
    });
    gameLoopData.callNextIn = callNextIn;
    gameLoopData.updateTime = updateTime;

    return true;
  };

  stopGameLoop = () => {
    const { gameLoopData } = this.nonObservables;
    if (!gameLoopData.timeout) return false;

    clearTimeout(gameLoopData.timeout);
    gameLoopData.timeout = 0;
    gameLoopData.callNextIn = undefined;
    gameLoopData.updateTime = undefined;

    return true;
  };

  callGameLoop = () => {
    const { gameLoopData } = this.nonObservables;
    this.startGameLoop();
    gameLoopData.callNextIn(1);
  };

  resetGameLoop = () => {
    const { gameData } = this.observables;
    const { gameLoopData } = this.nonObservables;
    const { gameLoopTimeoutMs } = gameData;
    this.startGameLoop();
    gameLoopData.callNextIn(gameLoopTimeoutMs);
  };

  gameLoop = () => {
    const { gameOptions, gameState, gameData } = this.observables;
    const { currentFigure } = gameData;
    const { gameLoopData } = this.nonObservables;
    // console.log("game loop");

    if (currentFigure.type == constants.gameplay.figureType.none) return false;
    if (gameState == constants.gameplay.gameState.pause) return false;

    const now = Date.now();
    gameData.time += now - gameLoopData.lastTimestamp;
    gameLoopData.lastTimestamp = now;
    if (this.checkWinConditions()) return false;

    let continueLoop = false;
    if (this.moveCurrentFigureDown()) {
      continueLoop = true;
    } else {
      if (gameOptions.enableNonBlockingMoveDown) {
        this.setCurrentFigureLockTimeout();
      } else {
        this.lockCurrentFigure();
      }
    }

    if (!continueLoop) {
      this.stopGameLoop();
    }

    return continueLoop;
  };

  //

  getNextRandomFigureType = () => {
    const { gameData } = this.observables;

    if (gameData.randomFigureTypePool.length < gameData.figureTypesAllowed.length) {
      const pool = objectHelpers.deepCopy(gameData.figureTypesAllowed);
      for (let i = 0; i < gameData.figureTypesAllowed.length; i++) {
        gameData.randomFigureTypePool.push(pool.splice(objectHelpers.getRandomArrayIndex(pool), 1)[0]);
      }
    }

    return gameData.randomFigureTypePool.shift();
  };

  getNextRandomCellType = () => {
    const { gameData } = this.observables;

    if (gameData.randomCellTypePool.length < gameData.cellTypesAllowed.length) {
      const pool = objectHelpers.deepCopy(gameData.cellTypesAllowed);
      for (let i = 0; i < gameData.cellTypesAllowed.length; i++) {
        gameData.randomCellTypePool.push(pool.splice(objectHelpers.getRandomArrayIndex(pool), 1)[0]);
      }
    }

    return gameData.randomCellTypePool.shift();
  };

  createCell = ({ preset } = {}) => {
    let _preset = preset || {};
    if (typeof preset == "function") {
      _preset = preset();
    }
    return {
      type: constants.gameplay.cellType.empty,
      ..._preset,
    };
  };

  createRow = ({ width, preset }) => {
    const row = [];
    for (let wIndex = 0; wIndex < width; wIndex++) {
      row.push(this.createCell({ preset }));
    }

    return row;
  };

  createGrid = ({ source, width, height, preset }) => {
    for (let y = 0; y < height; y++) {
      source.push(this.createRow({ width, preset }));
    }
  };

  //

  getNextFigureIndex = () => {
    this.nonObservables.spawnFigureIndex++;
    if (this.nonObservables.spawnFigureIndex > constants.gameplay.maxFigureIndex) {
      this.nonObservables.spawnFigureIndex = 1;
    }
    return this.nonObservables.spawnFigureIndex;
  };

  spawnFigure = (figureType, rotation, x, y) => {
    const { gameData } = this.observables;
    const { cup } = gameData;

    const figureDataResult = this.generateFigureData({ type: figureType, rotation });
    if (figureDataResult) {
      const { figureData, figureCellData } = figureDataResult;
      const figureIndex = this.getNextFigureIndex();

      for (let pIndex = 0; pIndex < figureData.length; pIndex++) {
        let [_pX, _pY] = figureData[pIndex];
        let pX = x + _pX;
        let pY = y + _pY;

        cup.data[pY][pX] = {
          ...cup.data[pY][pX],
          ...figureCellData,
          figureIndex,
        };
      }

      this.generateBlockGroups();
      this.generateCupView();
    }
  };

  clearFullLines = async ({ cascadeIndex = 1 } = {}) => {
    const { gameData } = this.observables;
    const { cup } = gameData;

    const fullLinesY = [];
    for (let y = cup.height - 1; y >= 0; y--) {
      if (cup.data[y].every((cell) => cell.type && cell.type != constants.gameplay.cellType.empty)) {
        fullLinesY.push(y);
      }
    }
    if (!fullLinesY.length) return false;

    // console.log({ fullLinesY });
    runInAction(() => {
      gameData.lines += fullLinesY.length;
      this.addScore({ action: constants.gameplay.actionType.clearLines, scoreMult: fullLinesY.length * cascadeIndex });

      fullLinesY.forEach((y) => {
        const figureIndexMap = {};
        cup.data[y].forEach((cellData) => {
          if (cellData.figureIndex > constants.gameplay.maxFigureIndex) return;
          if (!figureIndexMap[cellData.figureIndex]) {
            figureIndexMap[cellData.figureIndex] = this.getNextFigureIndex();
          }
        });

        for (let _y = y + 1; _y < cup.height; _y++) {
          cup.data[_y].forEach((cellData, x) => {
            if (cellData.type == constants.gameplay.cellType.empty) return;
            if (!figureIndexMap[cellData.figureIndex]) return;
            cellData.figureIndex = figureIndexMap[cellData.figureIndex];
          });
        }

        cup.data.splice(y, 1, this.createRow({ width: cup.width }));
      });

      this.generateBlockGroups();
      this.generateCupView();
    });

    await timeHelpers.sleep(300);

    runInAction(() => {
      fullLinesY.forEach((y, yIndex) => {
        cup.data.splice(y + yIndex, 1);
        cup.data.unshift(this.createRow({ width: cup.width }));
      });
      this.generateCupView();
    });

    await timeHelpers.sleep(300);

    await this.onLinesClearedMechanics({ cascadeIndex });

    return true;
  };

  onLinesClearedMechanics = async ({ cascadeIndex = 1 } = {}) => {
    const { gameOptions, gameData } = this.observables;
    const { cup } = gameData;

    if (gameOptions.addJunkRowsMode) {
      await this.addJunkRowsMechanics({ cascadeIndex });
    }

    if (gameOptions.groupsFallOnClear) {
      await this.groupsFallMechanics({ cascadeIndex });
    }
  };

  onLockFigureMechanics = async () => {
    const { gameOptions } = this.observables;

    if (gameOptions.cellularAutomatonMode) {
      await this.cellularAutomatonMechanics();
    }
  };

  groupsFallMechanics = async ({ cascadeIndex = 1 } = {}) => {
    const { gameOptions, gameData } = this.observables;
    const { cup } = gameData;

    if (gameOptions.cellGroupType == constants.gameplay.cellGroupType.block) {
      for (let iter = 0, blockMoved = true; iter < 100 && blockMoved; iter++) {
        blockMoved = false;
        runInAction(() => {
          for (let y = cup.height - 2; y >= 0; y--) {
            const currentRow = cup.data[y];
            const lowerRow = cup.data[y + 1];
            for (let x = 0; x < cup.width; x++) {
              if (currentRow[x].type == constants.gameplay.cellType.empty) continue;
              if (lowerRow[x].type != constants.gameplay.cellType.empty) continue;
              lowerRow[x].type = currentRow[x].type;
              currentRow[x].type = constants.gameplay.cellType.empty;
              blockMoved = true;
            }
          }
        });

        if (blockMoved) {
          this.generateCupView();
          await timeHelpers.sleep(300);
        }
      }

      await this.clearFullLines({ cascadeIndex: cascadeIndex + 1 });
    } else if (
      gameOptions.cellGroupType == constants.gameplay.cellGroupType.figure ||
      gameOptions.cellGroupType == constants.gameplay.cellGroupType.type
    ) {
      let blockGroupData = this.generateBlockGroups();

      for (let iter = 0, groupMoved = true; iter < 100 && groupMoved; iter++) {
        groupMoved = false;
        runInAction(() => {
          for (let _iter = 0, _groupMoved = true; _iter < 100 && _groupMoved; _iter++) {
            _groupMoved = false;
            blockGroupData.groupList.forEach((groupID) => {
              const { blocks, lowestBlocks } = blockGroupData.groupData[groupID];

              if (blockGroupData.movedGroups.some((_) => _ == groupID)) return;
              if (
                !lowestBlocks.every(
                  ({ x, y }) => cup.data[y + 1]?.[x] && cup.data[y + 1][x].type == constants.gameplay.cellType.empty
                )
              )
                return;

              blocks.forEach(({ x, y }) => {
                objectHelpers.clearOwnProperties(cup.data[y][x]);
                objectHelpers.copyOwnProperties(this.createCell(), cup.data[y][x]);
              });
              blocks.forEach((blockData) => {
                blockData.y++;
                objectHelpers.copyOwnProperties(blockData.cellData, cup.data[blockData.y][blockData.x]);
              });
              lowestBlocks.forEach((blockData) => {
                blockData.y++;
              });
              blockGroupData.movedGroups.push(groupID);
              _groupMoved = true;
              groupMoved = true;
            });
          }
        });

        if (groupMoved) {
          if (gameOptions.groupsConnectWhileFall) {
            blockGroupData = this.generateBlockGroups();
          } else {
            blockGroupData.movedGroups = [];
          }
          this.generateCupView();
          await timeHelpers.sleep(300);
        }
      }

      await this.clearFullLines({ cascadeIndex: cascadeIndex + 1 });
      this.generateBlockGroups();
    }
  };

  cellularAutomatonMechanics = async () => {
    const { gameOptions, gameData } = this.observables;
    const { cup } = gameData;

    await timeHelpers.sleep(300);

    const emptyRow = this.createRow({ width: cup.width });
    const emptyCell = this.createCell();
    const getNeighbours = ({ x, y, radius = 1 }) => {
      const neighbours = [];
      let aliveCount = 0;
      for (let _y = y - radius; _y <= y + radius; _y++) {
        let row = cup.data[_y];
        if (_y < 0 || _y >= cup.height) {
          row = emptyRow;
        }

        const _row = [];
        for (let _x = x - radius; _x <= x + radius; _x++) {
          let cell = row[_x];
          if (_x < 0 || _x >= cup.width) {
            cell = emptyCell;
          }

          if (_x == x && _y == y) {
            _row.push(emptyCell);
          } else {
            if (cell.type != constants.gameplay.cellType.empty) {
              aliveCount++;
            }
            _row.push(cell);
          }
        }

        neighbours.push(_row);
      }

      return { neighbours, aliveCount };
    };

    const radius = 1;
    const newCupData = objectHelpers.deepCopy(cup.data);
    let cellType = this.getNextRandomCellType();
    let figureIndex = this.getNextFigureIndex();
    for (let y = 0; y < cup.data.length; y++) {
      const row = cup.data[y];

      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        const { aliveCount } = getNeighbours({ x, y, radius });

        if (cell.type != constants.gameplay.cellType.empty && cell.type != constants.gameplay.cellType.junk) {
          if (!gameOptions.cellularAutomatonCellsNotDie && aliveCount < 2) {
            newCupData[y][x] = this.createCell();
          }
        } else if (cell.type == constants.gameplay.cellType.empty) {
          if (aliveCount == 3) {
            let preset = {};
            if (gameOptions.cellularAutomatonIsMold) {
              preset.type = constants.gameplay.cellType.mold;
              preset.figureIndex = constants.gameplay.moldFigureIndex;
            } else {
              preset.type = cellType;
              preset.figureIndex = figureIndex;
            }

            newCupData[y][x] = this.createCell({ preset });
          }
        }
      }
    }

    if (JSON.stringify(cup.data) != JSON.stringify(newCupData)) {
      runInAction(() => {
        cup.data = newCupData;
        this.generateBlockGroups();
        this.generateCupView();
      });

      await timeHelpers.sleep(300);
    }
  };

  addJunkRowsMechanics = async ({ cascadeIndex = 1 } = {}) => {
    const { gameOptions, gameData } = this.observables;
    const { cup } = gameData;

    if (cascadeIndex > 1) return;

    let preset;
    if (gameOptions.cellGroupType == constants.gameplay.cellGroupType.block) {
      preset = () => ({
        type: constants.gameplay.cellType.junk,
        figureIndex: this.getNextFigureIndex(),
      });
    } else if (
      gameOptions.cellGroupType == constants.gameplay.cellGroupType.figure ||
      gameOptions.cellGroupType == constants.gameplay.cellGroupType.type
    ) {
      preset = {
        type: constants.gameplay.cellType.junk,
        figureIndex: this.getNextFigureIndex(),
      };
    }
    const row = this.createRow({
      width: cup.width,
      preset,
    });
    row.splice(objectHelpers.getRandomArrayIndex(row), 1, this.createCell());

    runInAction(() => {
      cup.data.push(row);
      cup.data.splice(0, 1);

      this.generateBlockGroups();
      this.generateCupView();
    });

    await timeHelpers.sleep(300);
  };

  generateCupView = () => {
    const { gameOptions, gameData } = this.observables;
    const { cup, currentFigure, shadowFigureY } = gameData;

    cup.view = [];
    for (let y = 0; y < cup.height; y++) {
      const cupRow = [];
      for (let x = 0; x < cup.width; x++) {
        const cellData = {};
        if (
          x >= currentFigure.x + currentFigure.cells.x &&
          x <= currentFigure.x + currentFigure.cells.x + currentFigure.cells.width - 1
        ) {
          cellData.isCurrentFigureColumn = true;
        }

        const currCellData = cup.data[y][x];
        if (currCellData.type != constants.gameplay.cellType.empty) {
          if (currCellData.groupID) {
            const upCellData = cup.data[y - 1]?.[x];
            const downCellData = cup.data[y + 1]?.[x];
            const leftCellData = cup.data[y][x - 1];
            const rightCellData = cup.data[y][x + 1];

            if (upCellData && currCellData.groupID == upCellData.groupID) cellData.connectUp = true;
            if (downCellData && currCellData.groupID == downCellData.groupID) cellData.connectDown = true;
            if (leftCellData && currCellData.groupID == leftCellData.groupID) cellData.connectLeft = true;
            if (rightCellData && currCellData.groupID == rightCellData.groupID) cellData.connectRight = true;
          }
        }

        cupRow.push({ ...cellData, ...currCellData });
      }
      cup.view.push(cupRow);
    }

    if (currentFigure.type != constants.gameplay.figureType.none) {
      const figureDataResult = this.generateFigureData({ type: currentFigure.type, rotation: currentFigure.rotation });
      if (figureDataResult) {
        const { figureData, figureCellData } = figureDataResult;
        for (let pIndex = 0; pIndex < figureData.length; pIndex++) {
          let [_pX, _pY] = figureData[pIndex];
          let connectUp = false;
          let connectDown = false;
          let connectLeft = false;
          let connectRight = false;
          if (
            gameOptions.cellGroupType == constants.gameplay.cellGroupType.figure ||
            gameOptions.cellGroupType == constants.gameplay.cellGroupType.type
          ) {
            figureData.forEach(([x, y]) => {
              if (x == _pX && y == _pY - 1) connectUp = true;
              if (x == _pX && y == _pY + 1) connectDown = true;
              if (x == _pX - 1 && y == _pY) connectLeft = true;
              if (x == _pX + 1 && y == _pY) connectRight = true;
            });
          }

          let pX = currentFigure.x + _pX;
          let pY = currentFigure.y + _pY;
          if (cup.view[pY]?.[pX]) {
            cup.view[pY][pX] = {
              ...cup.view[pY][pX],
              ...figureCellData,
              isCurrentFigure: true,
              connectUp,
              connectDown,
              connectLeft,
              connectRight,
            };
          }

          pY = _pY + shadowFigureY;
          if (cup.view[pY]?.[pX]) {
            cup.view[pY][pX] = {
              ...cup.view[pY][pX],
              ...figureCellData,
              isShadowFigure: true,
              connectUp,
              connectDown,
              connectLeft,
              connectRight,
            };
          }
        }
      }
    }
  };

  //

  getBlockGroup = ({ x, y, checkCellsSameGroup }) => {
    const { gameData } = this.observables;
    const { cup } = gameData;

    const blocks = [];

    const cellData = cup.data[y][x];
    blocks.push({ x, y, cellData: objectHelpers.deepCopy(cellData) });
    cellData._processed = true;

    [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ].forEach(([_x, _y]) => {
      const _cellData = cup.data[_y]?.[_x];
      if (
        !_cellData ||
        _cellData.type == constants.gameplay.cellType.empty ||
        _cellData._processed ||
        !checkCellsSameGroup(cellData, _cellData)
      )
        return;

      blocks.push(...this.getBlockGroup({ x: _x, y: _y, checkCellsSameGroup }));
    });

    return blocks;
  };

  generateBlockGroups = () => {
    const { gameOptions, gameData } = this.observables;
    const { cup } = gameData;

    const blockGroupData = {
      groupData: {},
      groupList: [],
      movedGroups: [],
    };
    let groupIndex = 1;
    const cellGroupTypeData = constants.gameplay.cellGroupTypeData[gameOptions.cellGroupType];
    if (cellGroupTypeData) {
      const { checkCellsSameGroup } = cellGroupTypeData;
      if (checkCellsSameGroup) {
        cup.data.forEach((row) => {
          row.forEach((cellData) => {
            cellData._processed = false;
          });
        });

        for (let y = cup.height - 1; y >= 0; y--) {
          cup.data[y].forEach((cellData, x) => {
            if (cellData.type == constants.gameplay.cellType.empty) return;
            if (cellData._processed) return;
            const blocks = this.getBlockGroup({ x, y, checkCellsSameGroup });
            const groupID = groupIndex++;
            blockGroupData.groupData[groupID] = {
              blocks,
              lowestBlocks: [],
            };
            blockGroupData.groupList.push(groupID);
          });
        }

        blockGroupData.groupList.forEach((groupID) => {
          const groupData = blockGroupData.groupData[groupID];
          groupData.blocks.forEach(({ x, y }) => {
            const cellData = cup.data[y][x];
            cellData.groupID = groupID;

            const lowerCellData = cup.data[y + 1]?.[x];
            if (
              !lowerCellData ||
              lowerCellData.type == constants.gameplay.cellType.empty ||
              !checkCellsSameGroup(cellData, lowerCellData)
            ) {
              groupData.lowestBlocks.push({ x, y });
            }
          });
        });
      }
    }

    return blockGroupData;
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
        pX < 0 ||
        pX >= cup.width ||
        pY < 0 ||
        pY >= cup.height ||
        (cup.data[pY]?.[pX] && cup.data[pY][pX].type && cup.data[pY][pX].type != constants.gameplay.cellType.empty)
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
    this.createGrid({ source: cellsData, width: cellsMaxSize.width, height: cellsMaxSize.height });
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
