import { makeObservable, observable, computed, action, flow, autorun, runInAction, toJS, set, reaction } from "mobx";

import * as constants from "@constants/index";

import EventBus from "@utils/event-bus";
import * as objectHelpers from "@utils/object-helpers";
import * as eventHelpers from "@utils/event-helpers";

class Storage {
  constructor() {
    this.observables = {
      focusedMenu: constants.menu.main,
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
      setPause: action,
      generateNextFigure: action,
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
    this.observables.focusedMenu = constants.menu.gamePlay;
    this.observables.gameMode = constants.gameMode.classic;

    const { gameModeData, cellsMaxSize } = this;
    const { gameMode } = this.observables;

    if (gameMode == constants.gameMode.classic) {
      gameModeData.nextFigureType = this.generateFigureType();

      this.createGrid(gameModeData.currentFigure.cells.data, cellsMaxSize.width, cellsMaxSize.height);
      this.createGrid(gameModeData.cup.data, gameModeData.cup.width, gameModeData.cup.height);
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

  moveCurrentFigure = async (newX) => {
    const { gameModeData } = this;
    const { cup, currentFigure } = gameModeData;
    const { focusedMenu } = this.observables;
    const _prevX = currentFigure.prevX;

    if (focusedMenu == constants.menu.gamePlay && newX >= 0 && newX + currentFigure.cells.width <= cup.width - 1) {
      runInAction(() => {
        currentFigure.prevX = currentFigure.x;
        currentFigure.x = newX;
      });

      // if touchdown
      if (await this.handleFigure()) {
        runInAction(() => {
          currentFigure.x = currentFigure.prevX;
          currentFigure.prevX = _prevX;
        });
      }

      this.generateCupView();
    }
  };

  moveCurrentFigureByMouse = () => {
    const { gameModeData } = this;
    const { cup, currentFigure } = gameModeData;
    const { lastMouseX, cellSizePx } = this.nonObservables;
    if (!lastMouseX) return;

    let newX = Math.floor(lastMouseX / cellSizePx);
    newX =
      newX < 0
        ? 0
        : newX + currentFigure.cells.width > cup.width - 1
        ? cup.width - 1 - currentFigure.cells.width
        : newX;

    if (newX != currentFigure.x && currentFigure.type != constants.figureType.none) {
      this.moveCurrentFigure(newX);
    }
  };

  rotateCurrentFigure = async () => {
    const { gameModeData } = this;
    const { currentFigure } = gameModeData;
    const { focusedMenu } = this.observables;

    if (focusedMenu == constants.menu.gamePlay && currentFigure.type != constants.figureType.none) {
      const figureTypeData = constants.figureType.figureTypeData[currentFigure.type];

      let newRotation = currentFigure.rotation + 1;
      if (newRotation > figureTypeData.rotations.length - 1) {
        newRotation = 0;
      }

      let iteration = 0;
      while ((await this.handleFigure(false, newRotation)) && iteration < figureTypeData.rotations.length) {
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

      runInAction(() => {
        currentFigure.cells.width = cellsW;
        currentFigure.cells.height = cellsH;
        currentFigure.rotation = newRotation;
      });

      this.generateCupView();
    }
  };

  dropCurrentFigure = async () => {
    const { gameModeData } = this;
    const { addScoreTable, cup, currentFigure } = gameModeData;
    const { focusedMenu } = this.observables;

    if (focusedMenu == constants.menu.gamePlay) {
      let y = currentFigure.y;
      while (
        !(await this.handleFigure(false, currentFigure.rotation, currentFigure.x, y)) &&
        y < cup.height - currentFigure.cells.height
      ) {
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

  speedUpFalling = () => {
    const { focusedMenu } = this.observables;

    if (focusedMenu == constants.menu.gamePlay) {
      this.callNextGameLoopImmediately();
    }
  };

  setPause = (toggle, state) => {
    const { focusedMenu } = this.observables;

    if (focusedMenu == constants.menu.gamePlay || focusedMenu == constants.menu.pause) {
      if (toggle) {
        this.observables.focusedMenu =
          focusedMenu == constants.menu.gamePlay ? constants.menu.pause : constants.menu.gamePlay;
      } else {
        this.observables.focusedMenu = state ? constants.menu.pause : constants.menu.gamePlay;
      }
    }
  };

  generateNextFigure = () => {
    const { gameModeData, cellsMaxSize } = this;

    gameModeData.currentFigure.type = gameModeData.nextFigureType;
    gameModeData.nextFigureType = this.generateFigureType();

    const { currentFigure, nextFigureType } = gameModeData;

    const nextFigureTypeData = constants.figureType.figureTypeData[nextFigureType];
    const nextFigureData = nextFigureTypeData.rotations[0];
    const nextFigureCellData = nextFigureTypeData.cellData;

    const cellsData = [];
    this.createGrid(cellsData, cellsMaxSize.width, cellsMaxSize.height);
    for (let pIndex = 0; pIndex < nextFigureData.length; pIndex++) {
      const [pX, pY] = nextFigureData[pIndex];
      cellsData[pY][pX] = {
        ...cellsData[pY][pX],
        ...nextFigureCellData,
      };
    }

    const currentFigureTypeData = constants.figureType.figureTypeData[currentFigure.type];
    const currentFigureData = currentFigureTypeData.rotations[0];
    let cellsW = 0;
    let cellsH = 0;
    currentFigureData.forEach((point) => {
      cellsW = point[0] > cellsW ? point[0] : cellsW;
      cellsH = point[1] > cellsH ? point[1] : cellsH;
    });

    currentFigure.cells.width = cellsW;
    currentFigure.cells.height = cellsH;
    currentFigure.cells.data = cellsData;
    currentFigure.rotation = 0;
  };

  spawnFigure = async (figureType, rotation, x, y) => {
    const { gameModeData } = this;
    const { addScoreTable, cup, currentFigure } = gameModeData;
    const figureTypeData = constants.figureType.figureTypeData[figureType];
    const figureData = figureTypeData.rotations[rotation];
    const figureCellData = figureTypeData.cellData;

    runInAction(() => {
      for (let pIndex = 0; pIndex < figureData.length; pIndex++) {
        let pX = figureData[pIndex][0] + x;
        let pY = figureData[pIndex][1] + y;

        cup.data[pY][pX] = {
          ...cup.data[pY][pX],
          ...figureCellData,
        };
      }
    });

    // Ищем линии
    const fullRows = [];
    for (let _y = cup.height - 1; _y >= 0; _y--) {
      let cellRowCount = 0;
      for (let _x = 0; _x < cup.width; _x++) {
        if (cup.data[_y][_x].type > 0) {
          cellRowCount++;
        }
      }

      if (cellRowCount >= cup.width) {
        fullRows.push(_y);
      }
    }

    if (fullRows.length) {
      console.log({ fullRows });

      this.clearGameLoopTimeout();
      currentFigure.type = constants.figureType.none;
      this.generateCupView();

      await eventHelpers.sleep(300);

      runInAction(() => {
        for (let rIndex = 0; rIndex < fullRows.length; rIndex++) {
          for (let wIndex = 0; wIndex < cup.width; wIndex++) {
            cup.data[fullRows[rIndex]][wIndex].type = 0;
          }
        }
      });

      let addScore = addScoreTable.clearedRows[fullRows.length - 1];
      if (fullRows.length > addScoreTable.clearedRows.length) {
        addScore = addScoreTable.clearedRows[addScoreTable.clearedRows.length - 1];
      }
      this.addScore(addScore);

      this.generateCupView();

      await eventHelpers.sleep(300);

      runInAction(() => {
        for (let rIndex = 0; rIndex < fullRows.length; rIndex++) {
          cup.data.splice(fullRows[rIndex], 1);
        }
        for (let rIndex = 0; rIndex < fullRows.length; rIndex++) {
          cup.data.unshift(this.createRow(cup.width));
        }
      });

      this.setGameLoopTimeout();
    }
  };

  handleFigure = async (gameUpdate, rotation, x, y, firstStep) => {
    const { gameModeData } = this;
    const { addScoreTable, currentFigure, cup } = gameModeData;
    let _x = currentFigure.x;
    let _y = currentFigure.y;
    let _rotation = currentFigure.rotation;

    if (currentFigure.type != constants.figureType.none) {
      if (!isNaN(rotation)) {
        _rotation = rotation;
      }

      if (!isNaN(x)) {
        _x = x;
      }

      if (!isNaN(y)) {
        _y = y;
      }

      const figureTypeData = constants.figureType.figureTypeData[currentFigure.type];
      const figureData = figureTypeData.rotations[_rotation];
      let touchdown = false;

      for (let pIndex = 0; pIndex < figureData.length; pIndex++) {
        let pX = figureData[pIndex][0] + _x;
        let pY = figureData[pIndex][1] + _y;

        if (pX >= cup.width || pY >= cup.height || (cup.data[pY]?.[pX] && cup.data[pY][pX].type > 0)) {
          touchdown = true;
          break;
        }
      }
      // console.log("touchdown", touchdown);

      if (gameUpdate) {
        if (touchdown) {
          if (firstStep) {
            this.observables.focusedMenu = constants.menu.gameOver;
          } else {
            this.addScore(addScoreTable.figurePlacement);

            await this.spawnFigure(
              currentFigure.type,
              currentFigure.lastLoopRotation,
              currentFigure.prevX,
              currentFigure.prevY
            );

            gameModeData.currentFigure.type = constants.figureType.none;
            this.generateCupView();
            this.callNextGameLoopImmediately();
          }
        } else {
          this.generateCupView();
        }
      } else {
        return touchdown;
      }
    }
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
    const { cup, currentFigure } = gameModeData;
    const { focusedMenu } = this.observables;
    // console.log("game loop");

    this.clearGameLoopTimeout();

    if (focusedMenu == constants.menu.gamePlay) {
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

        if (currentFigure.type == constants.figureType.none) {
          this.generateNextFigure();
          await this.handleFigure(true, "a", "a", "a", true);
          this.moveCurrentFigureByMouse();
        } else {
          await this.handleFigure(true);
        }

        this.setGameLoopTimeout();
      });
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
