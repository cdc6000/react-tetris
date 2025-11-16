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
        // cellsY = cellsH;
        cellsData = result.cellsData
          .map((row, rIndex) => {
            if (rIndex < pYMin || rIndex > pYMax) return null;
            return row
              .map((cell, cIndex) => {
                if (cIndex < pXMin || cIndex > pXMax) return null;
                return cell;
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
          {cellsData.map((row, rIndex) => {
            return row.map((cell, cIndex) => {
              const cellTypeData = constants.gameplay.cellTypeData[cell.type] || {};
              return (
                <div
                  key={rIndex + "-" + cIndex}
                  className={`figure-cell${cellTypeData.class ? " " + cellTypeData.class : ""}`}
                />
              );
            });
          })}
        </div>
      );
    }
  }
);
