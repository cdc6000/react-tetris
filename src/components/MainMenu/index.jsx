import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import * as reactHelpers from "@utils/react-helpers";

import * as constants from "@constants/index";

export default observer(
  class MainMenu extends Component {
    constructor(props) {
      super(props);

      this.forceUpdateAsync = reactHelpers.forceUpdateAsync.bind(this);
      this.setStateAsync = reactHelpers.setStateAsync.bind(this);
    }

    //

    gameStart = () => {
      const { gameStore } = this.props;

      gameStore.gameStart();
    };

    //

    render() {
      const { show, gameStore } = this.props;
      const { lang, viewData } = gameStore.observables;
      const langStrings = constants.lang.strings[lang];

      return (
        <div className={`main-menu${!show ? " h" : ""}`}>
          <div className="center-content-wrapper">
            <button
              className="play-btn"
              onClick={(ev) => {
                if (viewData.current != constants.view.mainMenu) return;
                this.gameStart();
              }}
            >
              {langStrings.mainMenu.playBtnTitle}
            </button>

            <button
              className="options-btn"
              onClick={(ev) => {
                if (viewData.current != constants.view.mainMenu) return;
                viewData.options.show = true;
              }}
            >
              {langStrings.mainMenu.optionsBtnTitle}
            </button>

            <button
              className="exit-btn"
              onClick={(ev) => {
                if (viewData.current != constants.view.mainMenu) return;
                window.appBridge?.quit();
              }}
            >
              {langStrings.mainMenu.exitBtnTitle}
            </button>
          </div>
        </div>
      );
    }
  }
);
