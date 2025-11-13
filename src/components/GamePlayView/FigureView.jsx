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
      if (!result) {
        cellsData = [];
        gameStore.createGrid(cellsData, cellsMaxSize.width, cellsMaxSize.height);
      } else {
        cellsData = result.cellsData;
      }

      return (
        <div className="figure-view">
          {cellsData.map((row, rIndex) => {
            return row.map((cell, cIndex) => {
              return (
                <div
                  key={rIndex + "-" + cIndex}
                  className={`figure-cell ${constants.cellTypes[cell.type].class}`}
                />
              );
            });
          })}
        </div>
      );
    }
  }
);
