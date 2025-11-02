import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import KeyboardKey from "@components/common/KeyboardKey";
import NextFigureView from "./NextFigureView";

import * as customHelpers from "@utils/custom-helpers";

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
      const { inputStore, viewStore, gameModeData, cellsMaxSize } = gameStore;
      const { viewData } = viewStore.observables;
      const { score, level, cup } = gameModeData;
      const { lang, gameMode } = gameStore.observables;
      const { cellSizePx } = gameStore.nonObservables;
      const { getLangString, stringConverter } = constants.lang;

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
          <div className="single-cup-view">
            <div className="top-container">
              <div className="tip">
                {stringConverter(getLangString({ lang, pathArray: ["gameView", "tipHelp"] }).string, [
                  {
                    type: "function",
                    whatIsRegExp: true,
                    what: `\\$\\{btns\\|([^\\}]+)\\}`,
                    to: (key, matchData) => {
                      const triggers = inputStore.getAllActiveTriggersForActions({
                        actions: [constants.controls.controlEvent.helpMenuToggle],
                      });
                      return customHelpers.actionTriggersDrawer({ gameStore, triggers, concatWord: matchData[1], key });
                    },
                  },
                ])}
              </div>
              <div className="tip">
                {stringConverter(getLangString({ lang, pathArray: ["gameView", "tipPause"] }).string, [
                  {
                    type: "function",
                    whatIsRegExp: true,
                    what: `\\$\\{btns\\|([^\\}]+)\\}`,
                    to: (key, matchData) => {
                      const triggers = inputStore.getAllActiveTriggersForActions({
                        actions: [
                          constants.controls.controlEvent.gamePause,
                          constants.controls.controlEvent.gamePauseToggle,
                        ],
                      });
                      return customHelpers.actionTriggersDrawer({ gameStore, triggers, concatWord: matchData[1], key });
                    },
                  },
                ])}
              </div>
            </div>
            <div className="center-container">
              <div className="left-col-wrapper">
                <div className="content"></div>
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
                <div className="content">
                  <div className="game-state-wrapper">
                    <div className="score-header">
                      {getLangString({ lang, pathArray: ["gameView", "scoreTitle"] }).string}
                    </div>
                    <div className="score">{score}</div>
                    <br />

                    <div className="level-header">
                      {getLangString({ lang, pathArray: ["gameView", "levelTitle"] }).string}
                    </div>
                    <div className="level">{level + 1}</div>
                    <br />

                    <div className="next-figure-header">
                      {getLangString({ lang, pathArray: ["gameView", "nextFigureTitle"] }).string}
                    </div>
                    <NextFigureView gameStore={gameStore} />
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-container"></div>
          </div>
        </div>
      );
    }
  }
);
