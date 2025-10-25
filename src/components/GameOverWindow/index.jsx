import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import * as constants from "@constants/index";

export default observer(
  class GameOverWindow extends Component {
    constructor(props) {
      super(props);
    }

    //

    render() {
      const { show, gameStore } = this.props;

      return (
        <div className={`game-over-window${!show ? " h" : ""}`}>
          <div className="content-wrapper">
            <div className="title">Потрачено</div>
            <div className="tip">Бывает =(</div>
          </div>
        </div>
      );
    }
  }
);
