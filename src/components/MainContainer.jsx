import React from 'react'

import { gameStateEnum, cellTypes, figTypes, scoreTable, levelSpeed, levelScore } from '../constants'

var gameLoopPointer;

export default class MapEditor extends React.Component {
  //#region Component Events

  state = {
    gameState: gameStateEnum.game,
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
    figMaxH: 4
  }

  constructor(props) {
    super(props);

    var {
      cupW,
      cupH,
      figMaxW,
      figMaxH
    } = this.state;

    // Создаём структуру "стакана"
    for (var hIndex = 0; hIndex < cupH; hIndex++)
    {
      this.state.cup.push(this.getDefRow(cupW));
    }

    // Создаём структуру предпросмотра след. фигуры
    for (var hIndex = 0; hIndex < figMaxH; hIndex++)
    {
      this.state.figView.push(this.getDefRow(figMaxW));
    }

    this.state.nextFig = this.generateNewFigureIndex();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyPress);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('contextmenu', this.onContextMenu);
    document.addEventListener('wheel', this.onWheel);

    this.generateCupView();

    gameLoopPointer = setTimeout(() => {
      this.gameLoop();
    }, this.state.gameLoopTimeout);
  }

  onKeyPress = (ev) => {
    //console.log("KEY: ", ev.key || ev.code);

    var {
      x
    } = this.state;

    switch (ev.key || ev.code)
    {
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
        this.setPause(true)
        break;
      }
    }
  }

  onMouseMove = (ev) => {
    ev.preventDefault();

    var {
      cellSize,
      x,
      cupW,
      figW,
      currFig
    } = this.state;

    var cupOffset = $(".cup").offset();

    var newX = Math.floor((ev.pageX - cupOffset.left) / cellSize);
    newX = newX < 0 ? 0 : (newX + figW > cupW - 1 ? cupW - 1 - figW : newX);

    if (newX != x && currFig)
    {
      this.moveFigure(newX);
    }
  }

  onMouseDown = (ev) => {
    ev.preventDefault();

    if (ev.button == 0)
    {
      this.dropFigure();
    }
    else if (ev.button == 2)
    {
      this.rotateFigure();
    }

  }

  onContextMenu = (ev) => {
    ev.preventDefault();
  }

  onWheel = (ev) => {
    // out
    if (ev.deltaY > 0)
    {
      this.speedUpFalling();
      this.setPause(false, false);
    }
    // in
    else if (ev.deltaY)
    {
      this.setPause(false, true);
    }
  };

  //#endregion



  //#region Methods

  generateNewFigureIndex = () => {
    return Math.round(Math.random() * (figTypes.length - 1)) + 1;
  }

  getDefCell = () => {
    return {
      type: 0
    }
  }

  getDefRow = (rowW) => {
    var defRow = [];

    for (var wIndex = 0; wIndex < rowW; wIndex++)
    {
      defRow.push(this.getDefCell());
    }

    return defRow;
  }

  addScore = (add) => {
    var {
      level,
      gameLoopTimeout
    } = this.state;

    var newScore = this.state.score + add * (level + 1);

    if (levelScore[level] && newScore > levelScore[level])
    {
      level++;
      gameLoopTimeout = levelSpeed[level] || gameLoopTimeout;
    }

    this.setState({
      score: newScore,
      level,
      gameLoopTimeout
    })
  }

  moveFigure = (newX) => {
    var {
      gameState,
      x,
      prevX,
      cupW,
      figW
    } = this.state;

    if (gameState == gameStateEnum.game && newX >= 0 && newX + figW <= cupW - 1)
    {
      this.setState({
        prevX: x,
        x: newX
      }, () => {
        // if touchdown
        if (this.handleFigure())
        {
          this.setState({
            x: this.state.prevX,
            prevX
          }, () => {
            this.generateCupView();
          })
        }
        else
        {
          this.generateCupView();
        }
      });
    }
  }

  rotateFigure = () => {
    var {
      gameState,
      figRotation,
      currFig
    } = this.state;

    if (gameState == gameStateEnum.game && currFig)
    {
      var figObj = figTypes[currFig - 1];

      let newFigRotation = figRotation + 1;
      if (newFigRotation > figObj.rotations.length - 1)
      {
        newFigRotation = 0;
      }

      let iteration = 0;

      while (this.handleFigure(false, newFigRotation) && iteration < figObj.rotations.length)
      {
        newFigRotation++;
        iteration++;
        if (newFigRotation > figObj.rotations.length - 1)
        {
          newFigRotation = 0;
        }
      }

      if (iteration == figObj.rotations.length)
      {
        newFigRotation = figRotation;
      }

      // Считаем ширину и высоту фигуры в новом повороте
      var figW = 0;
      var figH = 0;

      var figData = figTypes[currFig - 1].rotations[newFigRotation];

      figData.map(point => {
        figW = point[0] > figW ? point[0] : figW;
        figH = point[1] > figH ? point[1] : figH;
      });

      this.setState({
        figRotation: newFigRotation,
        figW,
        figH
      }, () => {
        this.generateCupView();
      });
    }
  }

  dropFigure = () => {
    var {
      gameState,
      x,
      y,
      figRotation,
      cupH,
      figH
    } = this.state;

    if (gameState == gameStateEnum.game)
    {
      let tX = x;
      let tY = y;

      while (!this.handleFigure(false, figRotation, tX, tY) && tY < cupH - figH)
      {
        tY++;
      }

      tY--;
      let delta = tY - y;

      this.addScore(delta * scoreTable.perHeight);

      this.setState({
        y: tY
      }, () => {
        this.generateCupView();
        clearTimeout(gameLoopPointer);
        this.gameLoop();
      });
    }
  }

  speedUpFalling = () => {
    var {
      gameState
    } = this.state;

    if (gameState == gameStateEnum.game)
    {
      clearTimeout(gameLoopPointer);
      this.gameLoop();
    }
  }

  setPause = (toggle, state) => {
    var {
      gameState
    } = this.state;

    if (gameState == gameStateEnum.game || gameState == gameStateEnum.gamePause)
    {
      this.setState({
        gameState: toggle ? (gameState == gameStateEnum.game ? gameStateEnum.gamePause : gameStateEnum.game) : (state ? gameStateEnum.gamePause : gameStateEnum.game)
      });
    }
  }

  generateNextFigure = (callback) => {
    var {
      figMaxW,
      figMaxH,
      figRotation
    } = this.state;

    var nextFig = this.generateNewFigureIndex();

    // Генерируем фигуру в подсказке "следующая фигура"
    var figView = [];

    for (var hIndex = 0; hIndex < figMaxH; hIndex++)
    {
      figView.push(this.getDefRow(figMaxW));
    }

    var figData = figTypes[nextFig - 1].rotations[0];
    var figCell = figTypes[nextFig - 1].cellData;

    for (var pIndex = 0; pIndex < figData.length; pIndex++)
    {
      let pX = figData[pIndex][0];
      let pY = figData[pIndex][1];

      figView[pY][pX] = {
        ...figView[pY][pX],
        ...figCell
      }
    }

    // Считаем ширину и высоту новой фигуры
    var figW = 0;
    var figH = 0;

    var currFig = this.state.nextFig;
    var figData = figTypes[currFig - 1].rotations[0];

    figData.map(point => {
      figW = point[0] > figW ? point[0] : figW;
      figH = point[1] > figH ? point[1] : figH;
    });

    this.setState({
      currFig,
      nextFig,
      figRotation: 0,
      figView,
      figW,
      figH
    }, () => {
      if (typeof callback == "function")
      {
        callback();
      }
    });
  }

  // Зафиксировать фигуру в "стакане"
  spawnFigure = (figIndex, rotation, x, y, callback) => {
    var figData = figTypes[figIndex].rotations[rotation];
    var figCell = figTypes[figIndex].cellData;

    var {
      cup,
      cupW,
      cupH
    } = this.state;

    for (var pIndex = 0; pIndex < figData.length; pIndex++)
    {
      let pX = figData[pIndex][0] + x;
      let pY = figData[pIndex][1] + y;

      cup[pY][pX] = {
        ...cup[pY][pX],
        ...figCell
      }
    }

    // Ищем линии
    var fullRows = [];

    for (var hIndex = cupH - 1; hIndex >= 0; hIndex--)
    {
      let cellRowCount = 0;

      for (var wIndex = 0; wIndex < cupW; wIndex++)
      {
        if (cup[hIndex][wIndex].type > 0)
        {
          cellRowCount++;
        }
      }

      if (cellRowCount >= cupW)
      {
        fullRows.push(hIndex);
      }
    }

    if (fullRows.length)
    {
      console.log({ fullRows })
      this.setState({
        cup,
        gameState: gameStateEnum.gameAnimation,
        currFig: 0
      }, () => {
        this.generateCupView(() => {
          setTimeout(() => {
            for (var rIndex = 0; rIndex < fullRows.length; rIndex++)
            {
              for (var wIndex = 0; wIndex < cupW; wIndex++)
              {
                cup[fullRows[rIndex]][wIndex].type = 0;
              }
            }

            this.addScore(scoreTable.rows[fullRows.length - 1]);

            this.setState({
              cup
            }, () => {
              this.generateCupView(() => {
                setTimeout(() => {
                  for (var rIndex = 0; rIndex < fullRows.length; rIndex++)
                  {
                    cup.splice(fullRows[rIndex], 1);
                  }
                  for (var rIndex = 0; rIndex < fullRows.length; rIndex++)
                  {
                    cup.unshift(this.getDefRow(cupW));
                  }

                  this.setState({
                    cup,
                    gameState: gameStateEnum.game
                  }, () => {
                    if (typeof callback == "function")
                    {
                      callback();
                    }
                  });
                }, 300);
              })
            });
          }, 300);
        })
      });
    }
    else
    {
      this.setState({
        cup
      }, () => {
        if (typeof callback == "function")
        {
          callback();
        }
      });
    }
  }

  handleFigure = (gameUpdate, rotation, tX, tY, firstStep) => {
    var {
      cup,
      currFig,
      lastFigRotation,
      figRotation,
      x,
      y,
      prevX,
      prevY,
      cupW,
      cupH
    } = this.state;

    if (currFig)
    {
      if (!isNaN(rotation))
      {
        figRotation = rotation;
      }

      if (!isNaN(tX))
      {
        x = tX;
      }

      if (!isNaN(tY))
      {
        y = tY;
      }

      var fig = figTypes[currFig - 1];
      var figData = fig.rotations[figRotation];
      var touchdown = false;

      for (var pIndex = 0; pIndex < figData.length; pIndex++)
      {
        let pX = figData[pIndex][0] + x;
        let pY = figData[pIndex][1] + y;

        if (pX >= cupW || pY >= cupH || (cup[pY] && cup[pY][pX] && cup[pY][pX].type > 0))
        {
          touchdown = true;
          break;
        }
      }

      if (gameUpdate)
      {
        if (touchdown)
        {
          if (firstStep)
          {
            this.setState({
              gameState: gameStateEnum.gameOver
            });
          }
          else
          {
            this.addScore(scoreTable.place);

            this.spawnFigure(currFig - 1, lastFigRotation, prevX, prevY, () => {
              this.setState({
                currFig: 0
              }, () => {
                this.generateCupView();
              })
            });
          }
        }
        else
        {
          this.generateCupView();
        }
      }
      else
      {
        return touchdown;
      }
    }
  }

  generateCupView = (callback) => {
    var {
      cup,
      currFig,
      figRotation,
      x,
      y,
      cupW,
      cupH
    } = this.state;

    var cupView = [];

    for (var hIndex = 0; hIndex < cupH; hIndex++)
    {
      let cupRow = [];

      for (var wIndex = 0; wIndex < cupW; wIndex++)
      {
        cupRow.push({ ...cup[hIndex][wIndex] });
      }

      cupView.push(cupRow);
    }

    if (currFig)
    {
      var figData = figTypes[currFig - 1].rotations[figRotation];
      var figCell = figTypes[currFig - 1].cellData;

      var {
        cup
      } = this.state;

      for (var pIndex = 0; pIndex < figData.length; pIndex++)
      {
        let pX = figData[pIndex][0] + x;
        let pY = figData[pIndex][1] + y;

        if (cupView[pY] && cupView[pY][pX])
        {
          cupView[pY][pX] = {
            ...cupView[pY][pX],
            ...figCell
          }
        }
      }
    }

    this.setState({
      cupView
    }, () => {
      if (typeof callback == "function")
      {
        callback();
      }
    })
  }

  gameLoop = () => {
    //console.log("Game Loop");

    var {
      gameState,
      currFig,
      x,
      y,
      startX,
      startY,
      figRotation
    } = this.state;

    if (gameState == gameStateEnum.game)
    {
      let nextX = x;
      let nextY = y;

      if (!currFig)
      {
        nextX = startX;
        nextY = startY;
      }
      else
      {
        nextY = y + 1;
      }

      this.setState({
        prevX: x,
        prevY: y,
        x: nextX,
        y: nextY,
        lastFigRotation: figRotation
      }, () => {
        if (!currFig)
        {
          this.generateNextFigure(() => {
            this.handleFigure(true, "a", "a", "a", true);
          });
        }
        else
        {
          this.handleFigure(true);
        }
      });

    }

    gameLoopPointer = setTimeout(() => {
      this.gameLoop();
    }, this.state.gameLoopTimeout);
  }

  //#endregion



  //#region Public Methods



  //#endregion



  //#region Render

  render() {
    //console.log("Main state", this.state)

    var {
      gameState,
      cupView,
      figView,
      score,
      level,
      x,
      figW
    } = this.state;

    return (
      gameState == gameStateEnum.game || gameState == gameStateEnum.gameOver || gameState == gameStateEnum.gamePause || gameState == gameStateEnum.gameAnimation
        ?
        <div className="game-container">

          <table>
            <tbody>
              <tr>
                <td className="left-col">

                  <div className="container">
                    <div className="tip h">Управление:</div>
                    <div className="tip"><div className="key">&#8592;</div><div className="key">&#8594;</div> или <div className="key">&nbsp;Мышь&nbsp;</div>: перемещение блока</div>
                    <div className="tip"><div className="key">&#8593;</div> или <div className="key">&nbsp;ПКМ&nbsp;</div>: поворот блока</div>
                    <div className="tip"><div className="key">&#8595;</div> или <div className="key">&nbsp;Колесо&nbsp;&#8595;&nbsp;</div>: ускорить падение блока</div>
                    <div className="tip"><div className="key">&nbsp;&nbsp;&nbsp;Пробел&nbsp;&nbsp;&nbsp;</div> или <div className="key">&nbsp;ЛКМ&nbsp;</div>: мгновенно опустить блок до препятствия</div>
                    <div className="tip"><div className="key">P</div> или <div className="key">&nbsp;Колесо&nbsp;&#8593;&nbsp;</div>: пауза</div>
                  </div>

                </td>
                <td>

                  <div className="cup">
                    {
                      cupView.map((cupRow, rIndex) => {
                        return cupRow.map((cupCell, cIndex) => {
                          return (
                            <div
                              className={"cell " + cellTypes[cupCell.type].class + (cIndex >= x && cIndex <= x + figW ? " hl" : "")}
                              key={rIndex + "-" + cIndex}
                            />
                          )
                        })
                      })
                    }
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
                      {
                        figView.map((figRow, rIndex) => {
                          return figRow.map((figCell, cIndex) => {
                            return (
                              <div
                                className={"cell " + (cellTypes[figCell.type].class)}
                                key={rIndex + "-" + cIndex}
                              />
                            )
                          })
                        })
                      }
                    </div>

                  </div>

                </td>
              </tr>
            </tbody>
          </table>

          {
            gameState == gameStateEnum.gameOver ?
              <div className="info">
                <div className="title">Потрачено</div>
                <div className="tip">Бывает =(</div>
              </div>

              : gameState == gameStateEnum.gamePause ?
                <div className="info">
                  <div className="title">Пауза</div>
                  <div className="tip">Нажмите <div className="key">P</div> или <div className="key">&nbsp;Колесо&nbsp;&#8595;&nbsp;</div> для продолжения</div>
                </div>

                : null
          }

        </div>
        :
        null
    );
  }

  //#endregion
}