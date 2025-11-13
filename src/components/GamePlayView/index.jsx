import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import FigureView from "./FigureView";

import * as customHelpers from "@utils/custom-helpers";

import * as constants from "@constants/index";

export default observer(
  class GamePlayView extends Component {
    constructor(props) {
      super(props);

      // TODO
      this.gameMode = constants.gameMode.classic;
      this.viewID = `${constants.viewData.view.gamePlayView}-${this.gameMode}`;
      this.layerID = `${constants.viewData.layer.gamePlayView}-${this.gameMode}`;
    }

    get canInteract() {
      const { gameStore } = this.props;
      const { viewStore } = gameStore;
      return viewStore.inputFocusViewLayerID == this.layerID;
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
      const { score, level, cup, nextFigureType, holdFigure } = gameModeData;
      const { lang, gameMode } = gameStore.observables;
      const { cellSizePx } = gameStore.nonObservables;
      const { getLangStringConverted } = constants.lang;

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
                {getLangStringConverted({
                  lang,
                  pathArray: ["gameView", "tipHelp"],
                  conversionList: [
                    customHelpers.insertBtnConversion({
                      gameStore,
                      actions: [constants.controls.controlEvent.helpMenuToggle],
                    }),
                  ],
                })}
              </div>
              <div className="tip">
                {getLangStringConverted({
                  lang,
                  pathArray: ["gameView", "tipPause"],
                  conversionList: [
                    customHelpers.insertBtnConversion({
                      gameStore,
                      actions: [
                        constants.controls.controlEvent.gamePause,
                        constants.controls.controlEvent.gamePauseToggle,
                      ],
                    }),
                  ],
                })}
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
                      {getLangStringConverted({ lang, pathArray: ["gameView", "scoreTitle"] })}
                    </div>
                    <div className="score">{score}</div>
                    <br />

                    <div className="level-header">
                      {getLangStringConverted({ lang, pathArray: ["gameView", "levelTitle"] })}
                    </div>
                    <div className="level">{level + 1}</div>
                    <br />

                    <div className="hold-figure-header">
                      {getLangStringConverted({ lang, pathArray: ["gameView", "holdFigureTitle"] })}
                    </div>
                    <FigureView
                      gameStore={gameStore}
                      type={holdFigure.type}
                    />

                    <div className="next-figure-header">
                      {getLangStringConverted({ lang, pathArray: ["gameView", "nextFigureTitle"] })}
                    </div>
                    <FigureView
                      gameStore={gameStore}
                      type={nextFigureType}
                    />
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
