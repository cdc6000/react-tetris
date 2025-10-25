import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import * as constants from "@constants/index";

export default observer(
  class NextFigureView extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      const { gameStore } = this.props;
      const { gameModeData } = gameStore;
      const { nextFigureType } = gameModeData;

      const result = gameStore.generateFigureData({
        type: nextFigureType,
        rotation: 0,
      });
      if (!result) return null;

      const { cellsData } = result;

      return (
        <div className="next-figure">
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
