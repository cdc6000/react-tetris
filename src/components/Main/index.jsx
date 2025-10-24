import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import * as reactHelpers from "@utils/react-helpers";

import * as constants from "@constants/index";

import "./style.scss";

export default observer(
  class Main extends Component {
    constructor(props) {
      super(props);

      this.state = {};

      this.forceUpdateAsync = reactHelpers.forceUpdateAsync.bind(this);
      this.setStateAsync = reactHelpers.setStateAsync.bind(this);

      this.cupElem;
    }

    //

    componentDidMount() {
      const { gameStore } = this.props;

      document.addEventListener("keydown", this.onKeyPress);
      document.addEventListener("mousemove", this.onMouseMove);
      document.addEventListener("mousedown", this.onMouseDown);
      document.addEventListener("contextmenu", this.onContextMenu);
      document.addEventListener("wheel", this.onWheel);

      gameStore.gameStart();
      gameStore.generateCupView();
      gameStore.gameLoop();
    }

    //

    onKeyPress = (ev) => {
      const { gameStore } = this.props;
      const { gameModeData } = gameStore;
      const { currentFigure } = gameModeData;
      //console.log("KEY: ", ev.key || ev.code);

      switch (ev.key || ev.code) {
        case "ArrowLeft": {
          gameStore.moveCurrentFigure(currentFigure.x - 1);
          break;
        }

        case "ArrowRight": {
          gameStore.moveCurrentFigure(currentFigure.x + 1);
          break;
        }

        case "ArrowUp": {
          gameStore.rotateCurrentFigure();
          break;
        }

        case "ArrowDown": {
          gameStore.speedUpFalling();
          break;
        }

        case " ": {
          gameStore.dropCurrentFigure();
          break;
        }

        case "з":
        case "p": {
          gameStore.setPause(true);
          break;
        }
      }
    };

    onMouseMove = (ev) => {
      const { gameStore } = this.props;
      ev.preventDefault();

      const cupRect = this.cupElem.getBoundingClientRect();
      gameStore.nonObservables.lastMouseX = ev.pageX - cupRect.left;
      gameStore.moveCurrentFigureByMouse();
    };

    onMouseDown = (ev) => {
      const { gameStore } = this.props;
      ev.preventDefault();

      if (ev.button == 0) {
        gameStore.dropCurrentFigure();
      } else if (ev.button == 2) {
        gameStore.rotateCurrentFigure();
      }
    };

    onContextMenu = (ev) => {
      ev.preventDefault();
    };

    onWheel = (ev) => {
      const { gameStore } = this.props;

      // down
      if (ev.deltaY > 0) {
        gameStore.speedUpFalling();
        gameStore.setPause(false, false);
      }
      // up
      else if (ev.deltaY) {
        gameStore.setPause(false, true);
      }
    };

    //

    cupRef = (elem) => {
      if (!elem) return;
      this.cupElem = elem;
    };

    render() {
      const { gameStore } = this.props;
      const { gameModeData, cellsMaxSize } = gameStore;
      const { cup, currentFigure, score, level } = gameModeData;
      const { focusedMenu } = gameStore.observables;
      const { cellSizePx } = gameStore.nonObservables;

      //console.log("Main state", this.state)

      return focusedMenu == constants.menu.gamePlay ||
        focusedMenu == constants.menu.gameOver ||
        focusedMenu == constants.menu.pause ? (
        <div
          className="game-container"
          style={{
            "--cell-size": `${cellSizePx}px`,
            "--cup-cells-hor": `${cup.width}`,
            "--cup-cells-ver": `${cup.height}`,
            "--next-figure-cells-hor": `${cellsMaxSize.width}`,
            "--next-figure-cells-ver": `${cellsMaxSize.height}`,
          }}
        >
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
                    {cup.view.map((cupRow, rIndex) => {
                      return cupRow.map((cupCell, cIndex) => {
                        return (
                          <div
                            className={
                              "cell " +
                              constants.cellTypes[cupCell.type].class +
                              (cIndex >= currentFigure.x && cIndex <= currentFigure.x + currentFigure.cells.width
                                ? " hl"
                                : "")
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
                      {currentFigure.cells.data.map((figRow, rIndex) => {
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

          {focusedMenu == constants.menu.gameOver ? (
            <div className="info">
              <div className="title">Потрачено</div>
              <div className="tip">Бывает =(</div>
            </div>
          ) : focusedMenu == constants.menu.pause ? (
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
);
