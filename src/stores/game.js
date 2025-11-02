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

    this.viewStore.viewLayerEnable({ layerID: constants.viewData.layer.mainMenu });
  }

  //

  eventBusBind = () => {
    const { eventBus, viewStore } = this;
    const { evenBusID } = this.nonObservables;
    const { controlEvent } = constants.controls;

    // TODO
    const gamePlayLayerID = `${constants.viewData.layer.gamePlayView}-${constants.gameMode.classic}`;

    eventBus.addEventListener(evenBusID, controlEvent.moveCurrentFigureRight, () => {
      if (viewStore.inputFocusLayerID != gamePlayLayerID) return;
      this.nonObservables.lastCupPointX = 0;
      this.moveCurrentFigureAlongX(this.gameModeData.currentFigure.x + 1);
    });
    eventBus.addEventListener(evenBusID, controlEvent.moveCurrentFigureLeft, () => {
      if (viewStore.inputFocusLayerID != gamePlayLayerID) return;
      this.nonObservables.lastCupPointX = 0;
      this.moveCurrentFigureAlongX(this.gameModeData.currentFigure.x - 1);
    });
    eventBus.addEventListener(evenBusID, controlEvent.moveCurrentFigureCupPointX, ({ x }) => {
      if (viewStore.inputFocusLayerID != gamePlayLayerID) return;
      this.moveCurrentFigureCupPointX(x);
    });

    eventBus.addEventListener(evenBusID, controlEvent.rotateCurrentFigureClockwise, () => {
      if (viewStore.inputFocusLayerID != gamePlayLayerID) return;
      this.rotateCurrentFigure(1);
    });
    eventBus.addEventListener(evenBusID, controlEvent.rotateCurrentFigureCounterclockwise, () => {
      if (viewStore.inputFocusLayerID != gamePlayLayerID) return;
      this.rotateCurrentFigure(-1);
    });

    eventBus.addEventListener(evenBusID, controlEvent.speedUpFallingCurrentFigure, () => {
      if (viewStore.inputFocusLayerID != gamePlayLayerID) return;
      this.speedUpFallingCurrentFigure();
    });
    eventBus.addEventListener(evenBusID, controlEvent.dropCurrentFigure, () => {
      if (viewStore.inputFocusLayerID != gamePlayLayerID) return;
      this.dropCurrentFigure();
    });

    eventBus.addEventListener(evenBusID, controlEvent.gamePause, () => {
      if (viewStore.inputFocusLayerID != gamePlayLayerID) return;
      return this.setPause({ state: true });
    });
    eventBus.addEventListener(evenBusID, controlEvent.gameUnpause, () => {
      if (viewStore.inputFocusLayerID != constants.viewData.layer.pauseMenu) return;
      return this.setPause({ state: false });
    });
    eventBus.addEventListener(evenBusID, controlEvent.gamePauseToggle, () => {
      if (
        viewStore.inputFocusLayerID != gamePlayLayerID &&
        viewStore.inputFocusLayerID != constants.viewData.layer.pauseMenu
      )
        return;
      this.setPause({ toggle: true });
    });
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
    const { play, pause } = constants.gameState;
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
          this.viewStore.shiftInputFocusToLayerID({ layerID: constants.viewData.layer.pauseMenu, isPrevious: true });
        } else {
          this.clearGameLoopTimeout();
          this.viewStore.viewLayerEnable({ layerID: constants.viewData.layer.pauseMenu, isAdditive: true });
        }
        return true;
      }
    }

    return false;
  };

  //

  moveCurrentFigureAlongX = (targetX) => {
    const { gameModeData } = this;
    const { cup, currentFigure } = gameModeData;
    const { gameState } = this.observables;

    if (currentFigure.type == constants.figureType.none) return false;
    if (gameState == constants.gameState.pause) return false;

    let _x = currentFigure.x;
    if (targetX < _x) {
      if (targetX < 0) {
        targetX = 0;
      }

      while (!this.checkFigureOverlap({ x: _x }) && _x > targetX) {
        _x--;
      }
      if (this.checkFigureOverlap({ x: _x })) {
        _x++;
      }
    } else {
      if (targetX > cup.width - currentFigure.cells.width - 1) {
        targetX = cup.width - currentFigure.cells.width - 1;
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

    const targetX = Math.floor(lastCupPointX / cellSizePx);
    return this.moveCurrentFigureAlongX(targetX);
  };

  rotateCurrentFigure = (step = 1) => {
    const { gameModeData } = this;
    const { cup, currentFigure } = gameModeData;
    const { gameState } = this.observables;

    if (currentFigure.type == constants.figureType.none) return false;
    if (gameState == constants.gameState.pause) return false;

    const figureTypeData = constants.figureType.figureTypeData[currentFigure.type];
    if (figureTypeData.rotations.length <= 1) return false;

    const newRotation = (currentFigure.rotation + step) % figureTypeData.rotations.length;
    if (newRotation == currentFigure.rotation) return false;

    this.generateCurrentFigure({ type: currentFigure.type, rotation: newRotation });

    let cupViewGenerated = false;
    if (this.checkFigureOverlap()) {
      let newX = currentFigure.x;
      if (currentFigure.x <= cup.width / 2) {
        newX++;
        while (this.checkFigureOverlap({ x: newX }) && newX < cup.width - currentFigure.cells.width - 1) {
          newX++;
        }
      } else {
        newX--;
        while (this.checkFigureOverlap({ x: newX }) && newX > 0) {
          newX--;
        }
      }

      if (this.checkFigureOverlap({ x: newX })) {
        this.gameOver();
        return false;
      }

      currentFigure.x = newX;
      this.calcShadowFigureY();
      this.generateCupView();
    } else {
      cupViewGenerated = this.moveCurrentFigureCupPointX();
      this.calcShadowFigureY();
    }

    if (!cupViewGenerated) {
      this.generateCupView();
    }
    return true;
  };

  dropCurrentFigure = () => {
    const { gameModeData } = this;
    const { addScoreTable, currentFigure } = gameModeData;
    const { gameState } = this.observables;

    if (currentFigure.type == constants.figureType.none) return false;
    if (gameState == constants.gameState.pause) return false;

    let y = currentFigure.y;
    while (!this.checkFigureOverlap({ y })) {
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

    const { cellsData, cellsW, cellsH } = result;
    currentFigure.type = type;
    currentFigure.cells.data = cellsData;
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
    while (!this.checkFigureOverlap({ y })) {
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
    const { gameModeData } = this;
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
    const figureTypeData = constants.figureType.figureTypeData[figureType];
    const figureData = figureTypeData.rotations[rotation];
    const figureCellData = figureTypeData.cellData;

    for (let pIndex = 0; pIndex < figureData.length; pIndex++) {
      let pX = figureData[pIndex][0] + x;
      let pY = figureData[pIndex][1] + y;

      cup.data[pY][pX] = {
        ...cup.data[pY][pX],
        ...figureCellData,
      };
    }
    this.generateCupView();
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
        if (_x >= currentFigure.x && _x <= currentFigure.x + currentFigure.cells.width) {
          cellDataToAdd.isCurrentFigureColumn = true;
        }

        cupRow.push({ ...cup.data[_y][_x], ...cellDataToAdd });
      }
      cup.view.push(cupRow);
    }

    if (currentFigure.type != constants.figureType.none) {
      const figureTypeData = constants.figureType.figureTypeData[currentFigure.type];
      const figureData = figureTypeData.rotations[currentFigure.rotation];
      const figureCellData = figureTypeData.cellData;

      for (let pIndex = 0; pIndex < figureData.length; pIndex++) {
        let [_pX, _pY] = figureData[pIndex];
        let pX = _pX + currentFigure.x;
        let pY = _pY + currentFigure.y;
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

    const figureTypeData = constants.figureType.figureTypeData[_type];
    const figureData = figureTypeData.rotations[_rotation];

    const hasOverlap = figureData.some(([_pX, _pY]) => {
      const pX = _pX + _x;
      const pY = _pY + _y;
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
    let cellsW = 0;
    let cellsH = 0;
    for (let pIndex = 0; pIndex < figureData.length; pIndex++) {
      const [pX, pY] = figureData[pIndex];
      cellsData[pY][pX] = {
        ...cellsData[pY][pX],
        ...figureCellData,
      };
      cellsW = pX > cellsW ? pX : cellsW;
      cellsH = pY > cellsH ? pY : cellsH;
    }

    return { cellsData, cellsW, cellsH };
  };
}

export default Object.assign(Storage, {});
