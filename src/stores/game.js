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
      gameData: {
        [constants.gameMode.classic]: {
          figureTypesAllowed: [
            constants.figureType["I-shape"],
            constants.figureType["J-shape"],
            constants.figureType["L-shape"],
            constants.figureType["S-shape"],
            constants.figureType["Z-shape"],
            constants.figureType["T-shape"],
            constants.figureType["square-2x2"],
          ],
          // speedPerLevel: [1000, 800, 600, 500, 400, 300, 200, 150, 100, 50],
          // scoreForLevel: [500, 1000, 2000, 4000, 8000, 12000, 20000, 30000, 50000],
          speedPerLevel: [],
          scoreForLevel: [],
          addScoreTable: {
            clearedRows: [100, 300, 700, 1500],
            figurePlacement: 10,
            dropHeightMult: 1,
          },
          score: 0,
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
            type: constants.figureType.none,
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
          nextFigureType: constants.figureType.none,
          shadowFigureY: 0,
        },
      },
    };
    this.nonObservables = {
      evenBusID: "GameStore",

      cellSizePx: 30,
      lastCupPointX: 0,
      cupElem: undefined,
      cupElemRect: undefined,

      gameLoopTimeout: undefined,
    };

    this.eventBus = new EventBus();
    this.inputStore = new InputStore({
      eventBus: this.eventBus,
      observables: this.observables,
      nonObservables: this.nonObservables,
    });
    this.viewStore = new ViewStore({
      eventBus: this.eventBus,
      observables: this.observables,
      nonObservables: this.nonObservables,
    });
    this.navigationStore = new NavigationStore({
      eventBus: this.eventBus,
      observables: this.observables,
      nonObservables: this.nonObservables,
    });

    makeObservable(this, {
      // observable
      observables: observable,

      // action
      gameStartClassic: action,
      gameStart: action,
      gameEnd: action,
      gameOver: action,
      addScore: action,
      setPause: action,

      moveCurrentFigureAlongX: action,
      rotateCurrentFigure: action,
      dropCurrentFigure: action,
      generateCurrentFigure: action,
      generateNextFigureType: action,

      spawnFigure: action,
      generateCupView: action,

      // computed
      gameModeData: computed,
      cellsMaxSize: computed,
    });

    this.eventBusBind();

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
    const { evenBusID } = this.nonObservables;
    const { controlEvent } = constants.controls;

    // TODO
    const gamePlayLayerID = `${constants.viewData.layer.gamePlayView}-${constants.gameMode.classic}`;

    eventBus.addEventListener(evenBusID, "viewLayerUpdate", async ({ layerID }) => {
      if (layerID == constants.viewData.layer.mainMenu) {
        navigationStore.clearLastSelectedElemData();
      }
      await eventHelpers.sleep(1);
      navigationStore.updateMenuNavElem();
    });
    eventBus.addEventListener(evenBusID, controlEvent.menuNavUp, () => {
      navigationStore.menuNavVertical(-1);
    });
    eventBus.addEventListener(evenBusID, controlEvent.menuNavDown, () => {
      navigationStore.menuNavVertical(1);
    });
    eventBus.addEventListener(evenBusID, controlEvent.menuNavLeft, () => {
      navigationStore.menuNavHorizontal(-1);
    });
    eventBus.addEventListener(evenBusID, controlEvent.menuNavRight, () => {
      navigationStore.menuNavHorizontal(1);
    });
    eventBus.addEventListener(evenBusID, controlEvent.menuNavSelect, async () => {
      const elem = navigationStore.getCurrentNavElem();
      if (!elem) return;

      navigationStore.unfocusAnyElem();
      elem.click();

      await eventHelpers.sleep(1);
      navigationStore.updateMenuNavElem();
    });
    eventBus.addEventListener(evenBusID, controlEvent.menuNavBack, () => {
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

    eventBus.addEventListener(evenBusID, controlEvent.moveCurrentFigureRight, () => {
      if (viewStore.inputFocusViewLayerID != gamePlayLayerID) return;
      this.nonObservables.lastCupPointX = 0;
      this.moveCurrentFigureAlongX(this.gameModeData.currentFigure.x + 1);
    });
    eventBus.addEventListener(evenBusID, controlEvent.moveCurrentFigureLeft, () => {
      if (viewStore.inputFocusViewLayerID != gamePlayLayerID) return;
      this.nonObservables.lastCupPointX = 0;
      this.moveCurrentFigureAlongX(this.gameModeData.currentFigure.x - 1);
    });
    eventBus.addEventListener(evenBusID, controlEvent.moveCurrentFigureCupPointX, ({ x }) => {
      if (viewStore.inputFocusViewLayerID != gamePlayLayerID) return;
      this.moveCurrentFigureCupPointX(x);
    });
    eventBus.addEventListener(evenBusID, controlEvent.rotateCurrentFigureClockwise, () => {
      if (viewStore.inputFocusViewLayerID != gamePlayLayerID) return;
      this.rotateCurrentFigure(1);
    });
    eventBus.addEventListener(evenBusID, controlEvent.rotateCurrentFigureCounterclockwise, () => {
      if (viewStore.inputFocusViewLayerID != gamePlayLayerID) return;
      this.rotateCurrentFigure(-1);
    });
    eventBus.addEventListener(evenBusID, controlEvent.speedUpFallingCurrentFigure, () => {
      if (viewStore.inputFocusViewLayerID != gamePlayLayerID) return;
      this.speedUpFallingCurrentFigure();
    });
    eventBus.addEventListener(evenBusID, controlEvent.dropCurrentFigure, () => {
      if (viewStore.inputFocusViewLayerID != gamePlayLayerID) return;
      this.dropCurrentFigure();
    });

    eventBus.addEventListener(evenBusID, controlEvent.gamePause, () => {
      if (viewStore.inputFocusViewLayerID != gamePlayLayerID) return;

      if (this.setPause({ state: true })) {
        viewStore.viewLayerEnable({ layerID: constants.viewData.layer.pauseMenu, isAdditive: true });
      }
    });
    eventBus.addEventListener(evenBusID, controlEvent.gameUnpause, () => {
      if (viewStore.inputFocusViewLayerID != constants.viewData.layer.pauseMenu) return;

      if (this.setPause({ state: false })) {
        viewStore.shiftInputFocusToViewLayerID({ layerID: constants.viewData.layer.pauseMenu, isPrevious: true });
      }
    });
    eventBus.addEventListener(evenBusID, controlEvent.gamePauseToggle, () => {
      if (
        viewStore.inputFocusViewLayerID != gamePlayLayerID &&
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

    eventBus.addEventListener(evenBusID, controlEvent.helpMenuToggle, () => {
      this.helpMenuToggle();
    });
  };

  bindInput = async ({ controlScheme, action }) => {
    const { inputStore, viewStore } = this;

    const layerID = constants.viewData.layer.getInputMenu;

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
        inputStore.addControlSchemeBind({
          id: controlScheme.id,
          action,
          triggers: [constants.controls.getInputEvent(input)],
        });

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

    const isEnabled = viewStore.getViewLayerData(constants.viewData.layer.helpMenu)?.isEnabled;
    const isPauseMenuEnabled = viewStore.getViewLayerData(constants.viewData.layer.pauseMenu)?.isEnabled;
    const isGameOverMenuEnabled = viewStore.getViewLayerData(constants.viewData.layer.gameOverMenu)?.isEnabled;
    if (!isEnabled) {
      if (!isPauseMenuEnabled && !isGameOverMenuEnabled) this.setPause({ state: true });
      viewStore.viewLayerEnable({ layerID: constants.viewData.layer.helpMenu, isAdditive: true });
    } else {
      if (!isPauseMenuEnabled && !isGameOverMenuEnabled) this.setPause({ state: false });
      viewStore.shiftInputFocusToViewLayerID({ layerID: constants.viewData.layer.helpMenu, isPrevious: true });
    }
  };

  //

  get gameModeData() {
    const { gameMode, gameData } = this.observables;
    return gameData[gameMode] || {};
  }

  get cellsMaxSize() {
    const { gameModeData } = this;

    let width = 0;
    let height = 0;
    gameModeData.figureTypesAllowed?.forEach((type) => {
      const figureTypeData = constants.figureType.figureTypeData[type];
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
      layerID: `${constants.viewData.layer.gamePlayView}-${this.observables.gameMode}`,
    });
  };

  gameStart = () => {
    const { gameModeData, cellsMaxSize } = this;
    const { gameMode } = this.observables;

    if (gameMode == constants.gameMode.classic) {
      const { cup, currentFigure } = gameModeData;
      this.createGrid(cup.data, cup.width, cup.height);

      this.createGrid(currentFigure.cells.data, cellsMaxSize.width, cellsMaxSize.height);
      this.generateCurrentFigure();
      currentFigure.x = cup.figureStart.x;
      currentFigure.y = cup.figureStart.y;
      this.calcShadowFigureY();

      this.generateNextFigureType();

      this.generateCupView();
    }

    this.observables.gameState = constants.gameState.play;
    this.setGameLoopTimeout();
  };

  gameEnd = () => {
    this.observables.gameState = constants.gameState.pause;

    const { gameModeData } = this;
    const { gameMode } = this.observables;
    const gameDataDefaults = this.defaults.observables.gameData;

    if (gameMode == constants.gameMode.classic) {
      const gameModeDataDefaults = gameDataDefaults[gameMode];
      const { cup, currentFigure } = gameModeData;
      gameModeData.score = gameModeDataDefaults.score;
      gameModeData.level = gameModeDataDefaults.level;
      gameModeData.gameLoopTimeoutMs = gameModeDataDefaults.gameLoopTimeoutMs;

      cup.data = objectHelpers.deepCopy(gameModeDataDefaults.cup.data);
      cup.view = objectHelpers.deepCopy(gameModeDataDefaults.cup.view);

      currentFigure.type = gameModeDataDefaults.currentFigure.type;
      currentFigure.cells.data = objectHelpers.deepCopy(gameModeDataDefaults.currentFigure.cells.data);
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

  addScore = (scoreToAdd) => {
    const { gameModeData } = this;
    const { gameMode } = this.observables;

    if (gameMode == constants.gameMode.classic) {
      const { speedPerLevel, scoreForLevel, score } = gameModeData;
      let level = gameModeData.level;
      let gameLoopTimeoutMs = gameModeData.gameLoopTimeoutMs;

      const newScore = score + scoreToAdd * (level + 1);
      if (scoreForLevel[level] && newScore > scoreForLevel[level]) {
        level++;
        gameLoopTimeoutMs = speedPerLevel[level] || gameLoopTimeoutMs;
      }

      gameModeData.score = newScore;
      gameModeData.level = level;
      gameModeData.gameLoopTimeoutMs = gameLoopTimeoutMs;
    }
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
    const { gameModeData, cellsMaxSize } = this;
    const { cup, currentFigure } = gameModeData;
    const { gameState } = this.observables;

    if (currentFigure.type == constants.figureType.none) return false;
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

  moveCurrentFigureCupPointX = (x) => {
    if (x != undefined) {
      this.nonObservables.lastCupPointX = x;
    }
    const { lastCupPointX, cellSizePx } = this.nonObservables;
    if (!lastCupPointX) return false;

    const { gameModeData } = this;
    const { currentFigure } = gameModeData;

    const targetX = Math.floor(lastCupPointX / cellSizePx) - currentFigure.cells.x;
    return this.moveCurrentFigureAlongX(targetX);
  };

  rotateCurrentFigure = (step = 1) => {
    const { gameModeData } = this;
    const { currentFigure } = gameModeData;
    const { gameState } = this.observables;

    if (currentFigure.type == constants.figureType.none) return false;
    if (gameState == constants.gameState.pause) return false;

    const figureTypeData = constants.figureType.figureTypeData[currentFigure.type];
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
    console.log("rotation check");
    for (let oIndex = 0; oIndex < currentRotationOffsets.length; oIndex++) {
      const [currentOffsetX, currentOffsetY] = currentRotationOffsets[oIndex];
      const [newOffsetX, newOffsetY] = newRotationOffsets[oIndex];
      const offsetX = currentOffsetX - newOffsetX;
      const offsetY = newOffsetY - currentOffsetY; // Y-axis is upside-down from "classic"
      console.log([offsetX, offsetY]);
      const newX = currentFigure.x + offsetX;
      const newY = currentFigure.y + offsetY;

      if (!this.checkFigureOverlap({ x: newX, y: newY, rotation: newRotation })) {
        console.log("rotation success");
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
    const { gameModeData } = this;
    const { addScoreTable, currentFigure, cup } = gameModeData;
    const { gameState } = this.observables;

    if (currentFigure.type == constants.figureType.none) return false;
    if (gameState == constants.gameState.pause) return false;

    let y = currentFigure.y;
    const maxY = cup.height - 1;
    while (!this.checkFigureOverlap({ y }) && y < maxY) {
      y++;
    }
    y--;

    const delta = y - currentFigure.y;
    this.addScore(delta * addScoreTable.dropHeightMult);

    currentFigure.y = y;
    this.generateCupView();
    this.callNextGameLoopImmediately();
    return true;
  };

  speedUpFallingCurrentFigure = () => {
    const { gameModeData } = this;
    const { currentFigure } = gameModeData;
    const { gameState } = this.observables;

    if (currentFigure.type == constants.figureType.none) return false;
    if (gameState == constants.gameState.pause) return false;

    this.callNextGameLoopImmediately();
    return true;
  };

  generateCurrentFigure = ({ type, rotation = 0 } = {}) => {
    const { gameModeData } = this;
    const { currentFigure } = gameModeData;

    if (type == undefined) {
      type = this.generateFigureType();
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

  generateNextFigureType = () => {
    const { gameModeData } = this;
    gameModeData.nextFigureType = this.generateFigureType();
  };

  calcShadowFigureY = () => {
    const { gameModeData } = this;
    const { cup, currentFigure } = gameModeData;

    if (currentFigure.type == constants.figureType.none) return false;

    let y = currentFigure.y;
    const maxY = cup.height - 1;
    while (!this.checkFigureOverlap({ y }) && y < maxY) {
      y++;
    }
    y--;

    gameModeData.shadowFigureY = y;
    return true;
  };

  //

  setGameLoopTimeout = () => {
    const { gameModeData } = this;
    const { gameLoopTimeoutMs } = gameModeData;

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
    const { gameModeData, cellsMaxSize } = this;
    const { addScoreTable, cup, currentFigure } = gameModeData;
    const { gameState } = this.observables;
    // console.log("game loop");

    if (gameState == constants.gameState.pause) return;

    if (currentFigure.type == constants.figureType.none) {
      runInAction(() => {
        this.generateCurrentFigure({ type: gameModeData.nextFigureType });
        currentFigure.x = cup.figureStart.x;
        currentFigure.y = cup.figureStart.y;
        this.calcShadowFigureY();

        this.generateNextFigureType();

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
        this.addScore(addScoreTable.figurePlacement);

        const { type, x, y, rotation } = currentFigure;
        currentFigure.type = constants.figureType.none;
        this.spawnFigure(type, rotation, x, y);
        await eventHelpers.sleep(300);

        await this.clearFullLines();
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

  generateFigureType = () => {
    // return this.generateFigureTypeRandomPure();
    return this.generateFigureTypeRandomFromPool(3);
  };

  generateFigureTypeRandomPure = () => {
    const { gameModeData } = this;
    const index = Math.round(Math.random() * (gameModeData.figureTypesAllowed.length - 1));
    return gameModeData.figureTypesAllowed[index];
  };

  generateFigureTypeRandomFromPool = (figureTypeRepeats = 1) => {
    const { gameModeData } = this;
    if (!gameModeData.randomFigureTypePool.length) {
      gameModeData.figureTypesAllowed.forEach((type) => {
        for (let i = 0; i < figureTypeRepeats; i++) {
          gameModeData.randomFigureTypePool.push(type);
        }
      });
    }
    const index = Math.round(Math.random() * (gameModeData.randomFigureTypePool.length - 1));
    const type = gameModeData.randomFigureTypePool.splice(index, 1)[0];
    return type;
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
    const { gameModeData } = this;
    const { cup } = gameModeData;

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
    const { gameModeData } = this;
    const { addScoreTable, cup, currentFigure } = gameModeData;

    const fullLinesY = [];
    for (let _y = cup.height - 1; _y >= 0; _y--) {
      if (cup.data[_y].every((cell) => cell.type > 0)) {
        fullLinesY.push(_y);
      }
    }

    if (fullLinesY.length) {
      // console.log({ fullLinesY });
      let clearedLinesScoreIndex = fullLinesY.length - 1;
      if (clearedLinesScoreIndex > addScoreTable.clearedRows.length - 1) {
        clearedLinesScoreIndex = addScoreTable.clearedRows.length - 1;
      }
      const scoreToAdd = addScoreTable.clearedRows[clearedLinesScoreIndex] || 0;
      this.addScore(scoreToAdd);

      runInAction(() => {
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
    const { gameModeData } = this;
    const { cup, currentFigure, shadowFigureY } = gameModeData;

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

    if (currentFigure.type != constants.figureType.none) {
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
    const { gameModeData } = this;
    const { currentFigure, cup } = gameModeData;

    const _type = type == undefined ? currentFigure.type : type;
    if (_type == constants.figureType.none) return false;

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

    const figureTypeData = constants.figureType.figureTypeData[type];
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
          ...cellsData[pY][pX],
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
