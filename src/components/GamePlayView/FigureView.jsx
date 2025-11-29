import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import FigureCell from "./FigureCell";

import * as constants from "@constants/index";

export default observer(
  class FigureView extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      const { gameStore, type } = this.props;
      const { cellsMaxSizeInitRotation } = gameStore;
      const { gameOptions } = gameStore.observables;

      const result = gameStore.generateFigureData({
        type,
        rotation: 0,
      });

      let cellsData;
      let cellsX = cellsMaxSizeInitRotation.width;
      let cellsY = cellsMaxSizeInitRotation.height;
      if (!result) {
        cellsData = [];
        gameStore.createGrid({ source: cellsData, width: cellsX, height: cellsY });
      } else {
        const { pXMin, pXMax, pYMin, pYMax, cellsW, cellsH } = result;
        cellsX = cellsW;
        cellsY = cellsH;
        cellsData = result.cellsData
          .map((row, y) => {
            if (y < pYMin || y > pYMax) return null;
            return row
              .map((cell, x) => {
                if (x < pXMin || x > pXMax) return null;
                let connectUp = false;
                let connectDown = false;
                let connectLeft = false;
                let connectRight = false;
                if (
                  gameOptions.cellGroupType == constants.gameplay.cellGroupType.figure ||
                  gameOptions.cellGroupType == constants.gameplay.cellGroupType.type
                ) {
                  result.figureData.forEach(([_x, _y]) => {
                    if (_x == x && _y == y - 1) connectUp = true;
                    if (_x == x && _y == y + 1) connectDown = true;
                    if (_x == x - 1 && _y == y) connectLeft = true;
                    if (_x == x + 1 && _y == y) connectRight = true;
                  });
                }
                return {
                  ...cell,
                  connectUp,
                  connectDown,
                  connectLeft,
                  connectRight,
                };
              })
              .filter(Boolean);
          })
          .filter(Boolean);
      }

      return (
        <div
          className="figure-view"
          style={{ "--cells-x": cellsX, "--cells-y": cellsY }}
        >
          {cellsData.map((rowData, rIndex) => {
            return rowData.map((cellData, cIndex) => {
              return (
                <FigureCell
                  key={rIndex + "-" + cIndex}
                  gameStore={gameStore}
                  cellData={cellData}
                />
              );
            });
          })}
        </div>
      );
    }
  }
);
