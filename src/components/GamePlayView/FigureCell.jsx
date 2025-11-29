import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import * as constants from "@constants/index";

export default observer(
  class FigureCell extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      const { gameStore, cellData } = this.props;

      const {
        type,
        figureIndex,

        isCurrentFigure,
        isCurrentFigureColumn,
        isShadowFigure,
        connectUp,
        connectDown,
        connectLeft,
        connectRight,
      } = cellData;
      const cellTypeData = constants.gameplay.cellTypeData[type] || {};

      return (
        <div
          // prettier-ignore
          className={`figure-cell${
            cellTypeData.class ? " " + cellTypeData.class : ""}${
            isCurrentFigure ? " current-figure" : ""}${
            isCurrentFigureColumn ? " current-figure-column" : ""}${
            connectUp ? " connect-up" : ""}${
            connectDown ? " connect-down" : ""}${
            connectLeft ? " connect-left" : ""}${
            connectRight ? " connect-right" : ""}${
            isShadowFigure ? " shadow-figure" : ""
          }`}
          data-type={type}
          data-figure-index={figureIndex}
        >
          <div className="back" />
          <div className="block" />
        </div>
      );
    }
  }
);
