import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

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
        gameStore.createGrid(cellsData, cellsX, cellsY);
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
          {cellsData.map((row, y) => {
            return row.map((cell, x) => {
              const cellTypeData = constants.gameplay.cellTypeData[cell.type] || {};
              const { connectUp, connectDown, connectLeft, connectRight } = cell;
              return (
                <div
                  key={y + "-" + x}
                  // prettier-ignore
                  className={`figure-cell${
                    cellTypeData.class ? " " + cellTypeData.class : ""}${
                    connectUp ? " connect-up" : ""}${
                    connectDown ? " connect-down" : ""}${
                    connectLeft ? " connect-left" : ""}${
                    connectRight ? " connect-right" : ""
                  }`}
                />
              );
            });
          })}
        </div>
      );
    }
  }
);
