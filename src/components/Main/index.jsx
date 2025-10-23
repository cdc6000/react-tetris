import React, { Component, Fragment } from "react";

import * as reactHelpers from "@utils/react-helpers";

import * as constants from "@constants/index";

import "./style.scss";

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameState: constants.gameState.game,
      currFig: 0,
      nextFig: 0,
      figRotation: 0,
      lastFigRotation: 0,
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      cup: [],
      cupView: [],
      figView: [],
      score: 0,
      level: 0,
      figW: 0,
      figH: 0,

      cupW: 10,
      cupH: 20,
      cellSize: 30,
      gameLoopTimeout: 1000,
      startX: 4,
      startY: 0,
      figMaxW: 4,
      figMaxH: 4,
    };

    // this.speedPerLevel = [1000, 800, 600, 500, 400, 300, 200, 150, 100, 50];
    // this.scoreForLevel = [500, 1000, 2000, 4000, 8000, 12000, 20000, 30000, 50000];
    this.speedPerLevel = [];
    this.scoreForLevel = [];
    this.addScoreTable = {
      clearedRows: [100, 300, 700, 1500],
      figurePlacement: 10,
      dropHeightMult: 1,
    };

    const { cupW, cupH, figMaxW, figMaxH, startX } = this.state;

    // Создаём структуру "стакана"
    for (let hIndex = 0; hIndex < cupH; hIndex++) {
      this.state.cup.push(this.getDefRow(cupW));
    }

    // Создаём структуру предпросмотра след. фигуры
    for (let hIndex = 0; hIndex < figMaxH; hIndex++) {
      this.state.figView.push(this.getDefRow(figMaxW));
    }

    this.state.nextFig = this.generateNewFigureIndex();

    this.forceUpdateAsync = reactHelpers.forceUpdateAsync.bind(this);
    this.setStateAsync = reactHelpers.setStateAsync.bind(this);

    this.cupElem;

    this.gameLoopPointer;
    this.lastMouseX = 0;
  }

  //

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyPress);
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mousedown", this.onMouseDown);
    document.addEventListener("contextmenu", this.onContextMenu);
    document.addEventListener("wheel", this.onWheel);

    this.generateCupView();

    this.gameLoop();
  }

  onKeyPress = (ev) => {
    //console.log("KEY: ", ev.key || ev.code);

    const { x } = this.state;

    switch (ev.key || ev.code) {
      case "ArrowLeft": {
        this.moveFigure(x - 1);
        break;
      }

      case "ArrowRight": {
        this.moveFigure(x + 1);
        break;
      }

      case "ArrowUp": {
        this.rotateFigure();
        break;
      }

      case "ArrowDown": {
        this.speedUpFalling();
        break;
      }

      case " ": {
        this.dropFigure();
        break;
      }

      case "з":
      case "p": {
        this.setPause(true);
        break;
      }
    }
  };

  onMouseMove = (ev) => {
    ev.preventDefault();

    const cupRect = this.cupElem.getBoundingClientRect();
    this.lastMouseX = ev.pageX - cupRect.left;
    this.moveFigureByMouse();
  };

  moveFigureByMouse = () => {
    if (!this.lastMouseX) return;

    const { cellSize, x, cupW, figW, currFig } = this.state;

    let newX = Math.floor(this.lastMouseX / cellSize);
    newX = newX < 0 ? 0 : newX + figW > cupW - 1 ? cupW - 1 - figW : newX;

    if (newX != x && currFig) {
      this.moveFigure(newX);
    }
  }

  onMouseDown = (ev) => {
    ev.preventDefault();

    if (ev.button == 0) {
      this.dropFigure();
    } else if (ev.button == 2) {
      this.rotateFigure();
    }
  };

  onContextMenu = (ev) => {
    ev.preventDefault();
  };

  onWheel = (ev) => {
    // out
    if (ev.deltaY > 0) {
      this.speedUpFalling();
      this.setPause(false, false);
    }
    // in
    else if (ev.deltaY) {
      this.setPause(false, true);
    }
  };

  //

  generateNewFigureIndex = () => {
    return Math.round(Math.random() * (constants.figureTypes.length - 1)) + 1;
  };

  getDefCell = () => {
    return {
      type: 0,
    };
  };

  getDefRow = (rowW) => {
    const defRow = [];

    for (let wIndex = 0; wIndex < rowW; wIndex++) {
      defRow.push(this.getDefCell());
    }

    return defRow;
  };

  addScore = (add) => {
    const { speedPerLevel, scoreForLevel } = this;
    let { level, gameLoopTimeout } = this.state;

    const newScore = this.state.score + add * (level + 1);

    if (scoreForLevel[level] && newScore > scoreForLevel[level]) {
      level++;
      gameLoopTimeout = speedPerLevel[level] || gameLoopTimeout;
    }

    this.setState({
      score: newScore,
      level,
      gameLoopTimeout,
    });
  };

  moveFigure = (newX) => {
    const { gameState, x, prevX, cupW, figW } = this.state;

    if (gameState == constants.gameState.game && newX >= 0 && newX + figW <= cupW - 1) {
      this.setState(
        {
          prevX: x,
          x: newX,
        },
        () => {
          // if touchdown
          if (this.handleFigure()) {
            this.setState(
              {
                x: this.state.prevX,
                prevX,
              },
              () => {
                this.generateCupView();
              }
            );
          } else {
            this.generateCupView();
          }
        }
      );
    }
  };

  rotateFigure = () => {
    const { gameState, figRotation, currFig } = this.state;

    if (gameState == constants.gameState.game && currFig) {
      const figObj = constants.figureTypes[currFig - 1];

      let newFigRotation = figRotation + 1;
      if (newFigRotation > figObj.rotations.length - 1) {
        newFigRotation = 0;
      }

      let iteration = 0;

      while (this.handleFigure(false, newFigRotation) && iteration < figObj.rotations.length) {
        newFigRotation++;
        iteration++;
        if (newFigRotation > figObj.rotations.length - 1) {
          newFigRotation = 0;
        }
      }

      if (iteration == figObj.rotations.length) {
        newFigRotation = figRotation;
      }

      // Считаем ширину и высоту фигуры в новом повороте
      let figW = 0;
      let figH = 0;

      const figData = constants.figureTypes[currFig - 1].rotations[newFigRotation];

      figData.forEach((point) => {
        figW = point[0] > figW ? point[0] : figW;
        figH = point[1] > figH ? point[1] : figH;
      });

      this.setState(
        {
          figRotation: newFigRotation,
          figW,
          figH,
        },
        () => {
          this.generateCupView();
        }
      );
    }
  };

  dropFigure = () => {
    const { addScoreTable } = this;
    const { gameState, x, y, figRotation, cupH, figH } = this.state;

    if (gameState == constants.gameState.game) {
      let tX = x;
      let tY = y;

      while (!this.handleFigure(false, figRotation, tX, tY) && tY < cupH - figH) {
        tY++;
      }

      tY--;
      let delta = tY - y;
      this.addScore(delta * addScoreTable.dropHeightMult);

      this.setState(
        {
          y: tY,
        },
        () => {
          this.generateCupView();

          clearTimeout(this.gameLoopPointer);
          this.gameLoop();
        }
      );
    }
  };

  speedUpFalling = () => {
    const { gameState } = this.state;

    if (gameState == constants.gameState.game) {
      clearTimeout(this.gameLoopPointer);
      this.gameLoop();
    }
  };

  setPause = (toggle, state) => {
    const { gameState } = this.state;

    if (gameState == constants.gameState.game || gameState == constants.gameState.gamePause) {
      this.setState({
        gameState: toggle
          ? gameState == constants.gameState.game
            ? constants.gameState.gamePause
            : constants.gameState.game
          : state
          ? constants.gameState.gamePause
          : constants.gameState.game,
      });
    }
  };

  generateNextFigure = (callback) => {
    const { figMaxW, figMaxH, figRotation } = this.state;

    const nextFig = this.generateNewFigureIndex();

    // Генерируем фигуру в подсказке "следующая фигура"
    const figView = [];

    for (let hIndex = 0; hIndex < figMaxH; hIndex++) {
      figView.push(this.getDefRow(figMaxW));
    }

    const nextFigData = constants.figureTypes[nextFig - 1].rotations[0];
    const figCell = constants.figureTypes[nextFig - 1].cellData;

    for (let pIndex = 0; pIndex < nextFigData.length; pIndex++) {
      let pX = nextFigData[pIndex][0];
      let pY = nextFigData[pIndex][1];

      figView[pY][pX] = {
        ...figView[pY][pX],
        ...figCell,
      };
    }

    // Считаем ширину и высоту новой фигуры
    let figW = 0;
    let figH = 0;

    const currFig = this.state.nextFig;
    const currFigData = constants.figureTypes[currFig - 1].rotations[0];

    currFigData.forEach((point) => {
      figW = point[0] > figW ? point[0] : figW;
      figH = point[1] > figH ? point[1] : figH;
    });

    this.setState(
      {
        currFig,
        nextFig,
        figRotation: 0,
        figView,
        figW,
        figH,
      },
      () => {
        if (typeof callback == "function") {
          callback();
        }
      }
    );
  };

  // Зафиксировать фигуру в "стакане"
  spawnFigure = (figIndex, rotation, x, y, callback) => {
    const { addScoreTable } = this;
    const figData = constants.figureTypes[figIndex].rotations[rotation];
    const figCell = constants.figureTypes[figIndex].cellData;

    const { cup, cupW, cupH } = this.state;

    for (let pIndex = 0; pIndex < figData.length; pIndex++) {
      let pX = figData[pIndex][0] + x;
      let pY = figData[pIndex][1] + y;

      cup[pY][pX] = {
        ...cup[pY][pX],
        ...figCell,
      };
    }

    // Ищем линии
    const fullRows = [];

    for (let hIndex = cupH - 1; hIndex >= 0; hIndex--) {
      let cellRowCount = 0;

      for (let wIndex = 0; wIndex < cupW; wIndex++) {
        if (cup[hIndex][wIndex].type > 0) {
          cellRowCount++;
        }
      }

      if (cellRowCount >= cupW) {
        fullRows.push(hIndex);
      }
    }

    if (fullRows.length) {
      console.log({ fullRows });
      this.setState(
        {
          cup,
          gameState: constants.gameState.gameAnimation,
          currFig: 0,
        },
        () => {
          this.generateCupView(() => {
            setTimeout(() => {
              for (let rIndex = 0; rIndex < fullRows.length; rIndex++) {
                for (let wIndex = 0; wIndex < cupW; wIndex++) {
                  cup[fullRows[rIndex]][wIndex].type = 0;
                }
              }

              let addScore = addScoreTable.clearedRows[fullRows.length - 1];
              if (fullRows.length > addScoreTable.clearedRows.length) {
                addScore = addScoreTable.clearedRows[addScoreTable.clearedRows.length - 1];
              }
              this.addScore(addScore);

              this.setState(
                {
                  cup,
                },
                () => {
                  this.generateCupView(() => {
                    setTimeout(() => {
                      for (let rIndex = 0; rIndex < fullRows.length; rIndex++) {
                        cup.splice(fullRows[rIndex], 1);
                      }
                      for (let rIndex = 0; rIndex < fullRows.length; rIndex++) {
                        cup.unshift(this.getDefRow(cupW));
                      }

                      this.setState(
                        {
                          cup,
                          gameState: constants.gameState.game,
                        },
                        () => {
                          if (typeof callback == "function") {
                            callback();
                          }
                        }
                      );
                    }, 300);
                  });
                }
              );
            }, 300);
          });
        }
      );
    } else {
      this.setState(
        {
          cup,
        },
        () => {
          if (typeof callback == "function") {
            callback();
          }
        }
      );
    }
  };

  handleFigure = (gameUpdate, rotation, tX, tY, firstStep) => {
    const { addScoreTable } = this;
    const { cup, currFig, lastFigRotation, prevX, prevY, cupW, cupH } = this.state;
    let { x, y, figRotation } = this.state;

    if (currFig) {
      if (!isNaN(rotation)) {
        figRotation = rotation;
      }

      if (!isNaN(tX)) {
        x = tX;
      }

      if (!isNaN(tY)) {
        y = tY;
      }

      const fig = constants.figureTypes[currFig - 1];
      const figData = fig.rotations[figRotation];
      let touchdown = false;

      for (let pIndex = 0; pIndex < figData.length; pIndex++) {
        let pX = figData[pIndex][0] + x;
        let pY = figData[pIndex][1] + y;

        if (pX >= cupW || pY >= cupH || (cup[pY] && cup[pY][pX] && cup[pY][pX].type > 0)) {
          touchdown = true;
          break;
        }
      }
      // console.log("touchdown", touchdown);

      if (gameUpdate) {
        if (touchdown) {
          if (firstStep) {
            this.setState({
              gameState: constants.gameState.gameOver,
            });
          } else {
            this.addScore(addScoreTable.figurePlacement);

            this.spawnFigure(currFig - 1, lastFigRotation, prevX, prevY, () => {
              this.setState(
                {
                  currFig: 0,
                },
                () => {
                  this.generateCupView();

                  clearTimeout(this.gameLoopPointer);
                  this.gameLoop();
                }
              );
            });
          }
        } else {
          this.generateCupView();
        }
      } else {
        return touchdown;
      }
    }
  };

  generateCupView = (callback) => {
    const { cup, currFig, figRotation, x, y, cupW, cupH } = this.state;

    const cupView = [];
    for (let hIndex = 0; hIndex < cupH; hIndex++) {
      let cupRow = [];
      for (let wIndex = 0; wIndex < cupW; wIndex++) {
        cupRow.push({ ...cup[hIndex][wIndex] });
      }

      cupView.push(cupRow);
    }

    if (currFig) {
      const figData = constants.figureTypes[currFig - 1].rotations[figRotation];
      const figCell = constants.figureTypes[currFig - 1].cellData;

      for (let pIndex = 0; pIndex < figData.length; pIndex++) {
        let pX = figData[pIndex][0] + x;
        let pY = figData[pIndex][1] + y;

        if (cupView[pY] && cupView[pY][pX]) {
          cupView[pY][pX] = {
            ...cupView[pY][pX],
            ...figCell,
          };
        }
      }
    }

    this.setState(
      {
        cupView,
      },
      () => {
        if (typeof callback == "function") {
          callback();
        }
      }
    );
  };

  gameLoop = () => {
    // console.log("Game Loop");

    const { gameState, currFig, x, y, startX, startY, figRotation } = this.state;

    if (gameState == constants.gameState.game) {
      let nextX = x;
      let nextY = y;

      if (!currFig) {
        nextX = startX;
        nextY = startY;
      } else {
        nextY = y + 1;
      }

      this.setState(
        {
          prevX: x,
          prevY: y,
          x: nextX,
          y: nextY,
          lastFigRotation: figRotation,
        },
        () => {
          if (!currFig) {
            this.generateNextFigure(() => {
              this.handleFigure(true, "a", "a", "a", true);
              this.moveFigureByMouse();
            });
          } else {
            this.handleFigure(true);
          }
        }
      );
    }

    this.gameLoopPointer = setTimeout(() => {
      this.gameLoop();
    }, this.state.gameLoopTimeout);
  };

  //

  cupRef = (elem) => {
    if (!elem) return;
    this.cupElem = elem;
  };

  render() {
    //console.log("Main state", this.state)

    const { gameState, cupView, figView, score, level, x, figW } = this.state;

    return gameState == constants.gameState.game ||
      gameState == constants.gameState.gameOver ||
      gameState == constants.gameState.gamePause ||
      gameState == constants.gameState.gameAnimation ? (
      <div className="game-container">
        <table>
          <tbody>
            <tr>
              <td className="left-col">
                <div className="container">
                  <div className="tip h">Управление:</div>
                  <div className="tip">
                    <div className="key">&#8592;</div>
                    <div className="key">&#8594;</div> или <div className="key">&nbsp;Мышь&nbsp;</div>: перемещение
                    блока
                  </div>
                  <div className="tip">
                    <div className="key">&#8593;</div> или <div className="key">&nbsp;ПКМ&nbsp;</div>: поворот блока
                  </div>
                  <div className="tip">
                    <div className="key">&#8595;</div> или <div className="key">&nbsp;Колесо&nbsp;&#8595;&nbsp;</div>:
                    ускорить падение блока
                  </div>
                  <div className="tip">
                    <div className="key">&nbsp;&nbsp;&nbsp;Пробел&nbsp;&nbsp;&nbsp;</div> или{" "}
                    <div className="key">&nbsp;ЛКМ&nbsp;</div>: мгновенно опустить блок до препятствия
                  </div>
                  <div className="tip">
                    <div className="key">P</div> или <div className="key">&nbsp;Колесо&nbsp;&#8593;&nbsp;</div>: пауза
                  </div>
                </div>
              </td>
              <td>
                <div
                  className="cup"
                  ref={this.cupRef}
                >
                  {cupView.map((cupRow, rIndex) => {
                    return cupRow.map((cupCell, cIndex) => {
                      return (
                        <div
                          className={
                            "cell " +
                            constants.cellTypes[cupCell.type].class +
                            (cIndex >= x && cIndex <= x + figW ? " hl" : "")
                          }
                          key={rIndex + "-" + cIndex}
                        />
                      );
                    });
                  })}
                </div>
              </td>
              <td className="right-col">
                <div className="container">
                  <div className="tip h">Очки:</div>
                  <div className="tip">{score}</div>
                  <br />

                  <div className="tip h">Уровень:</div>
                  <div className="tip">{level + 1}</div>
                  <br />

                  <div className="tip h">Следующая фигура:</div>
                  <div className="fig">
                    {figView.map((figRow, rIndex) => {
                      return figRow.map((figCell, cIndex) => {
                        return (
                          <div
                            className={"cell " + constants.cellTypes[figCell.type].class}
                            key={rIndex + "-" + cIndex}
                          />
                        );
                      });
                    })}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {gameState == constants.gameState.gameOver ? (
          <div className="info">
            <div className="title">Потрачено</div>
            <div className="tip">Бывает =(</div>
          </div>
        ) : gameState == constants.gameState.gamePause ? (
          <div className="info">
            <div className="title">Пауза</div>
            <div className="tip">
              Нажмите <div className="key">P</div> или <div className="key">&nbsp;Колесо&nbsp;&#8595;&nbsp;</div> для
              продолжения
            </div>
          </div>
        ) : null}
      </div>
    ) : null;
  }
}
