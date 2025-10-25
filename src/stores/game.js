import { makeObservable, observable, computed, action, flow, autorun, runInAction, toJS, set, reaction } from "mobx";

import * as constants from "@constants/index";

import EventBus from "@utils/event-bus";
import * as objectHelpers from "@utils/object-helpers";
import * as eventHelpers from "@utils/event-helpers";

class Storage {
  constructor() {
    this.observables = {
      currentMenu: constants.menu.main,
      menuData: {
        [constants.menu.main]: {
          show: false,
        },
        [constants.menu.game]: {
          show: false,
        },
      },
      gameState: constants.gameState.pause,
      gameMode: constants.gameMode.classic,
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
            prevX: 0,
            prevY: 0,
            rotation: 0,
            lastLoopRotation: 0,
            cells: {
              width: 0,
              height: 0,
              data: [],
            },
          },

          nextFigureType: constants.figureType.none,

          score: 0,
          level: 0,

          gameLoopTimeoutMs: 1000,
        },
      },
    };
    this.nonObservables = {
      cellSizePx: 30,
      lastMouseX: 0,
      gameLoopTimeout: undefined,
    };

    this.eventBus = new EventBus();

    makeObservable(this, {
      // observable
      observables: observable,

      // action
      gameStart: action,
      addScore: action,
      moveCurrentFigureAlongX: action,
      rotateCurrentFigure: action,
      dropCurrentFigure: action,
      setPause: action,
      generateCurrentFigure: action,
      spawnFigure: action,
      generateCupView: action,

      // computed
      gameModeData: computed,
    });
  }

  get gameModeData() {
    const { gameMode, gameData } = this.observables;
    return gameData[gameMode];
  }

  get cellsMaxSize() {
    const { gameModeData } = this;

    let width = 0;
    let height = 0;
    gameModeData.figureTypesAllowed.forEach((type) => {
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

  gameStart = () => {
    this.observables.currentMenu = constants.menu.game;
    this.observables.gameState = constants.gameState.play;
    this.observables.gameMode = constants.gameMode.classic;

    const { gameModeData, cellsMaxSize } = this;
    const { gameMode } = this.observables;

    if (gameMode == constants.gameMode.classic) {
      this.createGrid(gameModeData.currentFigure.cells.data, cellsMaxSize.width, cellsMaxSize.height);
      this.createGrid(gameModeData.cup.data, gameModeData.cup.width, gameModeData.cup.height);

      this.generateCurrentFigure();
      gameModeData.nextFigureType = this.generateFigureType();

      this.generateCupView();
    }
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

  moveCurrentFigureAlongX = (newX) => {
    const { gameModeData } = this;
    const { cup, currentFigure } = gameModeData;
    const { gameState } = this.observables;

    if (currentFigure.type == constants.figureType.none) return false;

    if (gameState == constants.gameState.play) {
      if (
        newX != currentFigure.x &&
        newX >= 0 &&
        newX + currentFigure.cells.width <= cup.width - 1 &&
        !this.checkCurrentFigureTouchdown({ customX: newX })
      ) {
        currentFigure.prevX = currentFigure.x;
        currentFigure.x = newX;
        this.generateCupView();
        return true;
      }
    }

    return false;
  };

  moveCurrentFigureByMouse = () => {
    const { lastMouseX, cellSizePx } = this.nonObservables;
    if (!lastMouseX) return false;

    const newX = Math.floor(lastMouseX / cellSizePx);
    return this.moveCurrentFigureAlongX(newX);
  };

  rotateCurrentFigure = () => {
    const { gameModeData } = this;
    const { currentFigure } = gameModeData;
    const { gameState } = this.observables;

    if (currentFigure.type == constants.figureType.none) return;

    if (gameState == constants.gameState.play) {
      const figureTypeData = constants.figureType.figureTypeData[currentFigure.type];

      let newRotation = currentFigure.rotation + 1;
      if (newRotation > figureTypeData.rotations.length - 1) {
        newRotation = 0;
      }

      let iteration = 0;
      while (
        iteration < figureTypeData.rotations.length &&
        this.checkCurrentFigureTouchdown({ customRotation: newRotation })
      ) {
        newRotation++;
        if (newRotation > figureTypeData.rotations.length - 1) {
          newRotation = 0;
        }
        iteration++;
      }
      if (iteration == figureTypeData.rotations.length) {
        newRotation = currentFigure.rotation;
      }

      // Считаем ширину и высоту фигуры в новом повороте
      const figureData = figureTypeData.rotations[newRotation];
      let cellsW = 0;
      let cellsH = 0;
      figureData.forEach((point) => {
        cellsW = point[0] > cellsW ? point[0] : cellsW;
        cellsH = point[1] > cellsH ? point[1] : cellsH;
      });

      currentFigure.cells.width = cellsW;
      currentFigure.cells.height = cellsH;
      currentFigure.rotation = newRotation;
      this.generateCupView();
    }
  };

  dropCurrentFigure = () => {
    const { gameModeData } = this;
    const { addScoreTable, cup, currentFigure } = gameModeData;
    const { gameState } = this.observables;

    if (currentFigure.type == constants.figureType.none) return;

    if (gameState == constants.gameState.play) {
      let y = currentFigure.y;
      while (y < cup.height - currentFigure.cells.height && !this.checkCurrentFigureTouchdown({ customY: y })) {
        y++;
      }
      y--;

      const delta = y - currentFigure.y;
      this.addScore(delta * addScoreTable.dropHeightMult);

      currentFigure.y = y;
      this.generateCupView();
      this.callNextGameLoopImmediately();
    }
  };

  speedUpFallingCurrentFigure = () => {
    const { gameModeData } = this;
    const { currentFigure } = gameModeData;
    const { gameState } = this.observables;

    if (currentFigure.type == constants.figureType.none) return;

    if (gameState == constants.gameState.play) {
      this.callNextGameLoopImmediately();
    }
  };

  setPause = ({ toggle, state }) => {
    const { gameState } = this.observables;

    if (gameState == constants.gameState.play || gameState == constants.gameState.pause) {
      if (toggle) {
        this.observables.gameState =
          gameState == constants.gameState.play ? constants.gameState.pause : constants.gameState.play;
      } else {
        this.observables.gameState = state ? constants.gameState.pause : constants.gameState.play;
      }

      this.callNextGameLoopImmediately();
    }
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

  generateCurrentFigure = (type) => {
    const { gameModeData } = this;
    const { currentFigure } = gameModeData;

    if (type == undefined) {
      type = this.generateFigureType();
    }

    currentFigure.rotation = 0;
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
  };

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

  spawnCurrentFigure = () => {
    const { gameModeData } = this;
    const { currentFigure } = gameModeData;

    const { type: figureType, lastLoopRotation: rotation, prevX: x, prevY: y } = currentFigure;
    currentFigure.type = constants.figureType.none;

    this.spawnFigure(figureType, rotation, x, y);
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

  checkCurrentFigureTouchdown = ({ customX, customY, customRotation } = {}) => {
    const { gameModeData } = this;
    const { currentFigure, cup } = gameModeData;

    if (currentFigure.type == constants.figureType.none) return false;

    const _x = customX == undefined ? currentFigure.x : customX;
    const _y = customY == undefined ? currentFigure.y : customY;
    const _rotation = customRotation == undefined ? currentFigure.rotation : customRotation;

    const figureTypeData = constants.figureType.figureTypeData[currentFigure.type];
    const figureData = figureTypeData.rotations[_rotation];

    const isTouchdown = figureData.some(([_pX, _pY]) => {
      const pX = _pX + _x;
      const pY = _pY + _y;
      return pX >= cup.width || pY >= cup.height || (cup.data[pY]?.[pX] && cup.data[pY][pX].type > 0);
    });
    // console.log({isTouchdown});

    return isTouchdown;
  };

  generateCupView = () => {
    const { gameModeData } = this;
    const { cup, currentFigure } = gameModeData;

    cup.view = [];
    for (let _y = 0; _y < cup.height; _y++) {
      const cupRow = [];
      for (let _x = 0; _x < cup.width; _x++) {
        cupRow.push({ ...cup.data[_y][_x] });
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
          };
        }
      }
    }
  };

  setGameLoopTimeout = () => {
    const { gameModeData } = this;
    const { gameLoopTimeoutMs } = gameModeData;

    // console.log(`${gameLoopTimeoutMs}ms - next game loop`);
    this.nonObservables.gameLoopTimeout = setTimeout(() => {
      this.gameLoop();
    }, gameLoopTimeoutMs);
  };

  clearGameLoopTimeout = () => {
    clearTimeout(this.nonObservables.gameLoopTimeout);
  };

  callNextGameLoopImmediately = async () => {
    await eventHelpers.sleep(1);
    this.clearGameLoopTimeout();
    this.nonObservables.gameLoopTimeout = setTimeout(() => {
      this.gameLoop();
    }, 1);
  };

  gameLoop = async () => {
    const { gameModeData } = this;
    const { addScoreTable, cup, currentFigure } = gameModeData;
    const { gameState } = this.observables;
    // console.log("game loop");

    if (gameState == constants.gameState.play) {
      let nextX = currentFigure.x;
      let nextY = currentFigure.y;

      if (currentFigure.type == constants.figureType.none) {
        nextX = cup.figureStart.x;
        nextY = cup.figureStart.y;
      } else {
        nextY = currentFigure.y + 1;
      }

      runInAction(async () => {
        currentFigure.lastLoopRotation = currentFigure.rotation;
        currentFigure.prevX = currentFigure.x;
        currentFigure.prevY = currentFigure.y;
        currentFigure.x = nextX;
        currentFigure.y = nextY;
        this.generateCupView();
      });

      if (currentFigure.type == constants.figureType.none) {
        runInAction(() => {
          console.log("before", {
            nextFigureType: Object.entries(constants.figureType).find((_) => _[1] == gameModeData.nextFigureType)[0],
          });
          this.generateCurrentFigure(gameModeData.nextFigureType);
          gameModeData.nextFigureType = this.generateFigureType();
          console.log("after", {
            nextFigureType: Object.entries(constants.figureType).find((_) => _[1] == gameModeData.nextFigureType)[0],
          });

          if (this.checkCurrentFigureTouchdown()) {
            this.generateCupView();
            this.observables.gameState = constants.gameState.over;
          } else {
            const cupViewGenerated = this.moveCurrentFigureByMouse();
            if (!cupViewGenerated) {
              this.generateCupView();
            }
          }
        });

        this.setGameLoopTimeout();
      } else {
        if (this.checkCurrentFigureTouchdown()) {
          this.addScore(addScoreTable.figurePlacement);
          this.spawnCurrentFigure();
          await eventHelpers.sleep(300);

          await this.clearFullLines();
          this.callNextGameLoopImmediately();
        } else {
          this.setGameLoopTimeout();
        }
      }
    } else {
      this.setGameLoopTimeout();
    }
  };

  //

  generateFigureType = () => {
    const { gameModeData } = this;
    const index = Math.round(Math.random() * (gameModeData.figureTypesAllowed.length - 1));
    return gameModeData.figureTypesAllowed[index];
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
}

export default Object.assign(Storage, {});
