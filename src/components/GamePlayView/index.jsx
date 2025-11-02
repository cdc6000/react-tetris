import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import KeyboardKey from "@components/common/KeyboardKey";
import NextFigureView from "./NextFigureView";

import * as constants from "@constants/index";

export default observer(
  class GamePlayView extends Component {
    constructor(props) {
      super(props);

      this.gameMode = constants.gameMode.classic;
      this.viewID = `${constants.viewData.view.gamePlayView}-${this.gameMode}`;
    }

    //

    cupRef = (elem) => {
      if (!elem) return;
      const { gameStore } = this.props;
      gameStore.nonObservables.cupElem = elem;
      gameStore.nonObservables.cupElemRect = elem.getBoundingClientRect();
    };

    render() {
      const { viewID } = this;
      const { gameStore } = this.props;
      const { viewStore, gameModeData, cellsMaxSize } = gameStore;
      const { viewData } = viewStore.observables;
      const { score, level, cup } = gameModeData;
      const { lang, gameMode } = gameStore.observables;
      const langStrings = constants.lang.strings[lang];
      const { cellSizePx } = gameStore.nonObservables;

      const { show } = viewData.viewState[viewID];

      if (gameMode != this.gameMode) return null;

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
                {"Перемещение блока:"}
                <KeyboardKey gameStore={gameStore}>&#8592;</KeyboardKey>
                <KeyboardKey gameStore={gameStore}>&#8594;</KeyboardKey>
                {"или"}
                <KeyboardKey gameStore={gameStore}>Мышь</KeyboardKey>
              </div>
              <div className="item">
                {"Поворот блока:"}
                <KeyboardKey gameStore={gameStore}>&#8593;</KeyboardKey>
                {"или"}
                <KeyboardKey gameStore={gameStore}>ПКМ</KeyboardKey>
              </div>
              <div className="item">
                {"Ускорить падение блока:"}
                <KeyboardKey gameStore={gameStore}>&#8595;</KeyboardKey>
                {"или"}
                <KeyboardKey gameStore={gameStore}>Колесо &#8595;</KeyboardKey>
              </div>
              <div className="item">
                {"Мгновенно опустить блок до препятствия:"}
                <KeyboardKey gameStore={gameStore}>Пробел</KeyboardKey>
                {"или"}
                <KeyboardKey gameStore={gameStore}>ЛКМ</KeyboardKey>
              </div>
              <div className="item">
                {"Пауза:"}
                <KeyboardKey gameStore={gameStore}>P</KeyboardKey>
                {"или"}
                <KeyboardKey gameStore={gameStore}>Колесо &#8593;</KeyboardKey>
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
