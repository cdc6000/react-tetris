import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import * as reactHelpers from "@utils/react-helpers";
import * as customHelpers from "@utils/custom-helpers";

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
      const { inputStore, viewStore } = gameStore;
      const { viewData } = viewStore.observables;
      const { lang } = gameStore.observables;
      const { getLangString, stringConverter } = constants.lang;

      const { show } = viewData.viewState[viewID];

      return (
        <div className={`main-menu${!show ? " h" : ""}`}>
          <div className="content-wrapper">
            <div className="title">{getLangString({ lang, pathArray: ["mainMenu", "menuTitle"] }).string}</div>
            <div className="tip">
              {stringConverter(getLangString({ lang, pathArray: ["mainMenu", "tip"] }).string, [
                {
                  type: "function",
                  whatIsRegExp: true,
                  what: `\\$\\{btns\\|([^\\}]+)\\}`,
                  to: (key, matchData) => {
                    const triggers = inputStore.getAllActiveTriggersForActions({
                      actions: [constants.controls.controlEvent.helpMenuToggle],
                    });
                    return customHelpers.actionTriggersDrawer({ gameStore, triggers, concatWord: matchData[1], key });
                  },
                },
              ])}
            </div>
            <div className="content">
              <div className="btns-container">
                <div className="btns-wrapper">
                  <button
                    className="play-btn"
                    onClick={(ev) => {
                      if (viewStore.inputFocusLayerID != constants.viewData.layer.mainMenu) return;
                      gameStore.gameStartClassic();
                    }}
                  >
                    {getLangString({ lang, pathArray: ["mainMenu", "playBtnTitle"] }).string}
                  </button>

                  <button
                    className="help-btn"
                    onClick={(ev) => {
                      if (viewStore.inputFocusLayerID != constants.viewData.layer.mainMenu) return;
                      gameStore.eventBus.fireEvent(constants.controls.controlEvent.helpMenuToggle);
                    }}
                  >
                    {getLangString({ lang, pathArray: ["mainMenu", "helpBtnTitle"] }).string}
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
                    {getLangString({ lang, pathArray: ["mainMenu", "optionsBtnTitle"] }).string}
                  </button>

                  <button
                    className="exit-btn"
                    onClick={(ev) => {
                      if (viewStore.inputFocusLayerID != constants.viewData.layer.mainMenu) return;
                      window.appBridge?.quit();
                    }}
                  >
                    {getLangString({ lang, pathArray: ["mainMenu", "exitBtnTitle"] }).string}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
);
