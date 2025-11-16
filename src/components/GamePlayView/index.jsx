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

      this.viewID = constants.viewData.view.gamePlayView;
      this.layerID = constants.viewData.layer.gamePlayView;
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
      const { viewStore, cellsMaxSize } = gameStore;
      const { viewData } = viewStore.observables;
      const { lang, gameData, gameOptions } = gameStore.observables;
      const { randomFigureTypePool, score, lines, level, cup, holdFigure } = gameData;
      const { cellSizePx } = gameStore.nonObservables;
      const { getLangStringConverted } = constants.lang;

      const { show } = viewData.viewState[viewID];

      return (
        <div
          className={`game-play-view${!show ? " h" : ""}`}
          style={{
            "--cell-size": `${cellSizePx}px`,
            "--cup-cells-hor": `${cup.width}`,
            "--cup-cells-ver": `${cup.height}`,
          }}
        >
          <div className="single-cup-view">
            <div className="top-container">
              <div className="row">
                <div className="block">
                  <div className="header">
                    {getLangStringConverted({ lang, pathArray: ["gameView", "linesTitle"] })}
                  </div>
                  <div className="content left">{lines}</div>
                </div>

                <div className="block">
                  <div className="header">
                    {getLangStringConverted({ lang, pathArray: ["gameView", "scoreTitle"] })}
                  </div>
                  <div className="content center">{score}</div>
                </div>

                <div className="block">
                  <div className="header">
                    {getLangStringConverted({ lang, pathArray: ["gameView", "levelTitle"] })}
                  </div>
                  <div className="content right">{level + 1}</div>
                </div>
              </div>
            </div>
            <div className="center-container">
              <div className="left-col-wrapper">
                <div className="content">
                  {gameOptions.enableHold && (
                    <div className="block">
                      <div className="header right">
                        {getLangStringConverted({ lang, pathArray: ["gameView", "holdFigureTitle"] })}
                      </div>
                      <div className="content right">
                        <FigureView
                          gameStore={gameStore}
                          type={holdFigure.type}
                        />
                      </div>
                    </div>
                  )}
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
                      const cellTypeData = constants.gameplay.cellTypeData[type] || {};
                      return (
                        <div
                          key={rIndex + "-" + cIndex}
                          className={`figure-cell${cellTypeData.class ? " " + cellTypeData.class : ""}
                          ${isCurrentFigure ? " current-figure" : ""}
                          ${isCurrentFigureColumn ? " current-figure-column" : ""}
                          ${isShadowFigure ? " shadow-figure" : ""}`}
                        />
                      );
                    });
                  })}
                </div>
              </div>
              <div className="right-col-wrapper">
                <div className="content">
                  <div className="block">
                    <div className="header left">
                      {getLangStringConverted({ lang, pathArray: ["gameView", "nextFigureTitle"] })}
                    </div>
                    <div className="content column left">
                      {Array(7)
                        .fill(0)
                        .map((_, fIndex) => {
                          return (
                            <FigureView
                              gameStore={gameStore}
                              key={`${fIndex}-${randomFigureTypePool[fIndex]}`}
                              type={randomFigureTypePool[fIndex]}
                            />
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-container">
              <div className="row">
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
            </div>
          </div>
        </div>
      );
    }
  }
);
