import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import * as reactHelpers from "@utils/react-helpers";

import * as constants from "@constants/index";

export default observer(
  class MainMenu extends Component {
    constructor(props) {
      super(props);

      this.viewID = constants.viewData.view.mainMenu;

      this.forceUpdateAsync = reactHelpers.forceUpdateAsync.bind(this);
      this.setStateAsync = reactHelpers.setStateAsync.bind(this);
    }

    //

    render() {
      const { viewID } = this;
      const { gameStore } = this.props;
      const { viewStore } = gameStore;
      const { viewData } = viewStore.observables;
      const { lang } = gameStore.observables;
      const langStrings = constants.lang.strings[lang];

      const { show } = viewData.viewState[viewID];

      return (
        <div className={`main-menu${!show ? " h" : ""}`}>
          <div className="center-content-wrapper">
            <button
              className="play-btn"
              onClick={(ev) => {
                if (viewStore.inputFocusLayerID != constants.viewData.layer.mainMenu) return;
                gameStore.gameStartClassic();
              }}
            >
              {langStrings.mainMenu.playBtnTitle}
            </button>

            <button
              className="options-btn"
              onClick={(ev) => {
                if (viewStore.inputFocusLayerID != constants.viewData.layer.mainMenu) return;
                viewStore.viewLayerEnable({
                  layerID: constants.viewData.layer.optionsMenu,
                  isAdditive: true,
                });
              }}
            >
              {langStrings.mainMenu.optionsBtnTitle}
            </button>

            <button
              className="exit-btn"
              onClick={(ev) => {
                if (viewStore.inputFocusLayerID != constants.viewData.layer.mainMenu) return;
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
