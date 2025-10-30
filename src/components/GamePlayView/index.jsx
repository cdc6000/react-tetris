import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import PauseMenu from "@components/PauseMenu";
import GameOverMenu from "@components/GameOverMenu";

import NextFigureView from "./NextFigureView";

import * as constants from "@constants/index";

export default observer(
  class GamePlayView extends Component {
    constructor(props) {
      super(props);
    }

    //

    cupRef = (elem) => {
      if (!elem) return;
      const { gameStore } = this.props;
      gameStore.nonObservables.cupElem = elem;
      gameStore.nonObservables.cupElemRect = elem.getBoundingClientRect();
    };

    render() {
      const { show, gameStore } = this.props;
      const { gameModeData, cellsMaxSize } = gameStore;
      const { score, level, cup, currentFigure } = gameModeData;
      const { lang, gameState } = gameStore.observables;
      const langStrings = constants.lang.strings[lang];
      const { cellSizePx } = gameStore.nonObservables;

      return (
        <div
          className={`game-play-view${!show ? " h" : ""}`}
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
                  const { type, isCurrentFigure, isCurrentFigureColumn, isShadowFigure } = cupCell;
                  const cellTypeClass = constants.cellTypes[type].class;
                  return (
                    <div
                      key={rIndex + "-" + cIndex}
                      className={`figure-cell ${cellTypeClass}${isCurrentFigure ? " current-figure" : ""}${
                        isCurrentFigureColumn ? " current-figure-column" : ""
                      }${isShadowFigure ? " shadow-figure" : ""}`}
                    />
                  );
                });
              })}
            </div>

            <GameOverMenu
              show={gameState == constants.gameState.over}
              gameStore={gameStore}
            />
            <PauseMenu
              show={gameState == constants.gameState.pause}
              gameStore={gameStore}
            />
          </div>
          <div className="right-col-wrapper">
            <div className="game-state-wrapper">
              <div className="score-header">{langStrings.gameView.scoreTitle}:</div>
              <div className="score">{score}</div>
              <br />

              <div className="level-header">{langStrings.gameView.levelTitle}:</div>
              <div className="level">{level + 1}</div>
              <br />

              <div className="next-figure-header">{langStrings.gameView.nextFigureTitle}:</div>
              <NextFigureView gameStore={gameStore} />
            </div>
          </div>
        </div>
      );
    }
  }
);
