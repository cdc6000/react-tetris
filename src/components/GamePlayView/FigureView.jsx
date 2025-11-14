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
      const { cellsMaxSize } = gameStore;

      const result = gameStore.generateFigureData({
        type,
        rotation: 0,
      });

      let cellsData;
      let cellsX;
      let cellsY = cellsMaxSize.height;
      if (!result) {
        cellsData = [];
        gameStore.createGrid(cellsData, cellsMaxSize.width, cellsMaxSize.height);
        cellsX = cellsMaxSize.width;
        // cellsY = cellsMaxSize.height;
      } else {
        const { pXMin, pXMax, pYMin, pYMax, cellsW, cellsH } = result;
        cellsData = result.cellsData
          .map((row, rIndex) => {
            // if (rIndex < pYMin || rIndex > pYMax) return null;
            return row
              .map((cell, cIndex) => {
                if (cIndex < pXMin || cIndex > pXMax) return null;
                return cell;
              })
              .filter(Boolean);
          })
          .filter(Boolean);
        cellsX = cellsW;
        // cellsY = cellsH;
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
