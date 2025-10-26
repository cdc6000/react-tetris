import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import PauseWindow from "@components/PauseWindow";
import GameOverWindow from "@components/GameOverWindow";

import NextFigureView from "./NextFigureView";

import * as constants from "@constants/index";

export default observer(
  class GamePlayWindow extends Component {
    constructor(props) {
      super(props);

      this.cupElem;
      this.cupElemRect;

      this.mouseMoveTimeoutMs = 30;
      this.lastMouseMoveTime = 0;
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
      gameStore.setGameLoopTimeout();
    }

    //

    onKeyPress = (ev) => {
      const { gameStore } = this.props;
      const { gameModeData } = gameStore;
      const { currentFigure } = gameModeData;
      //console.log("KEY: ", ev.key || ev.code);

      switch (ev.key || ev.code) {
        case "ArrowLeft": {
          gameStore.moveCurrentFigureAlongX(currentFigure.x - 1);
          break;
        }

        case "ArrowRight": {
          gameStore.moveCurrentFigureAlongX(currentFigure.x + 1);
          break;
        }

        case "ArrowUp": {
          gameStore.rotateCurrentFigure();
          break;
        }

        case "ArrowDown": {
          gameStore.speedUpFallingCurrentFigure();
          break;
        }

        case " ": {
          gameStore.dropCurrentFigure();
          break;
        }

        case "з":
        case "p": {
          gameStore.setPause({ toggle: true });
          break;
        }
      }
    };

    onMouseMove = (ev) => {
      const { gameStore } = this.props;
      ev.preventDefault();

      const callTime = Date.now();
      if (callTime - this.lastMouseMoveTime > this.mouseMoveTimeoutMs) {
        this.lastMouseMoveTime = callTime;
        gameStore.nonObservables.lastMouseX = ev.pageX - this.cupElemRect.left;
        gameStore.moveCurrentFigureByMouse();
      }
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
        if (!gameStore.setPause({ state: false })) {
          gameStore.speedUpFallingCurrentFigure();
        }
      }
      // up
      else if (ev.deltaY) {
        gameStore.setPause({ state: true });
      }
    };

    //

    cupRef = (elem) => {
      if (!elem) return;
      this.cupElem = elem;
      this.cupElemRect = this.cupElem.getBoundingClientRect();
    };

    render() {
      const { show, gameStore } = this.props;
      const { gameModeData, cellsMaxSize } = gameStore;
      const { cup, currentFigure, score, level } = gameModeData;
      const { gameState } = gameStore.observables;
      const { cellSizePx } = gameStore.nonObservables;

      return (
        <div
          className={`game-play-window${!show ? " h" : ""}`}
          style={{
            "--cell-size": `${cellSizePx}px`,
            "--cup-cells-hor": `${cup.width}`,
            "--cup-cells-ver": `${cup.height}`,
            "--next-figure-cells-hor": `${cellsMaxSize.width}`,
            "--next-figure-cells-ver": `${cellsMaxSize.height}`,
          }}
        >
          <div className="left-col-wrapper">
            <div className="control-tips-wrapper">
              <div className="header">Управление:</div>
              <div className="item">
                <div className="kb-key">&#8592;</div>
                <div className="kb-key">&#8594;</div> или <div className="kb-key">&nbsp;Мышь&nbsp;</div>: перемещение
                блока
              </div>
              <div className="item">
                <div className="kb-key">&#8593;</div> или <div className="kb-key">&nbsp;ПКМ&nbsp;</div>: поворот блока
              </div>
              <div className="item">
                <div className="kb-key">&#8595;</div> или <div className="kb-key">&nbsp;Колесо&nbsp;&#8595;&nbsp;</div>:
                ускорить падение блока
              </div>
              <div className="item">
                <div className="kb-key">&nbsp;&nbsp;&nbsp;Пробел&nbsp;&nbsp;&nbsp;</div> или{" "}
                <div className="kb-key">&nbsp;ЛКМ&nbsp;</div>: мгновенно опустить блок до препятствия
              </div>
              <div className="item">
                <div className="kb-key">P</div> или <div className="kb-key">&nbsp;Колесо&nbsp;&#8593;&nbsp;</div>: пауза
              </div>
            </div>
          </div>
          <div className="cup-wrapper">
            <div
              className="cup"
              ref={this.cupRef}
            >
              {cup.view.map((cupRow, rIndex) => {
                return cupRow.map((cupCell, cIndex) => {
                  return (
                    <div
                      key={rIndex + "-" + cIndex}
                      className={`figure-cell ${constants.cellTypes[cupCell.type].class}${
                        cIndex >= currentFigure.x && cIndex <= currentFigure.x + currentFigure.cells.width ? " hl" : ""
                      }`}
                    />
                  );
                });
              })}
            </div>

            <GameOverWindow
              show={gameState == constants.gameState.over}
              gameStore={gameStore}
            />
            <PauseWindow
              show={gameState == constants.gameState.pause}
              gameStore={gameStore}
            />
          </div>
          <div className="right-col-wrapper">
            <div className="game-state-wrapper">
              <div className="score-header">Очки:</div>
              <div className="score">{score}</div>
              <br />

              <div className="level-header">Уровень:</div>
              <div className="level">{level + 1}</div>
              <br />

              <div className="next-figure-header">Следующая фигура:</div>
              <NextFigureView gameStore={gameStore} />
            </div>
          </div>
        </div>
      );
    }
  }
);
