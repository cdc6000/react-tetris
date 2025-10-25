import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import * as constants from "@constants/index";

export default observer(
  class PauseWindow extends Component {
    constructor(props) {
      super(props);
    }

    //

    render() {
      const { show, gameStore } = this.props;

      return (
        <div className={`pause-window${!show ? " h" : ""}`}>
          <div className="content-wrapper">
            <div className="title">Пауза</div>
            <div className="tip">
              Нажмите <div className="kb-key">P</div> или <div className="kb-key">&nbsp;Колесо&nbsp;&#8595;&nbsp;</div>{" "}
              для продолжения
            </div>
          </div>
        </div>
      );
    }
  }
);
