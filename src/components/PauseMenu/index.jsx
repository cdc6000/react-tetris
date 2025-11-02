import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import KeyboardKey from "@components/common/KeyboardKey";

import * as customHelpers from "@utils/custom-helpers";

import * as constants from "@constants/index";

export default observer(
  class PauseMenu extends Component {
    constructor(props) {
      super(props);

      this.viewID = constants.viewData.view.pauseMenu;
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
        <div className={`pause-menu${!show ? " h" : ""}`}>
          <div className="content-wrapper">
            <div className="title">{getLangString({ lang, pathArray: ["pauseMenu", "menuTitle"] }).string}</div>
            <div className="tip">
              {stringConverter(getLangString({ lang, pathArray: ["pauseMenu", "tipUnpause"] }).string, [
                {
                  type: "function",
                  whatIsRegExp: true,
                  what: `\\$\\{btns\\|([^\\}]+)\\}`,
                  to: (key, matchData) => {
                    const triggers = inputStore.getAllActiveTriggersForActions({
                      actions: [
                        constants.controls.controlEvent.gameUnpause,
                        constants.controls.controlEvent.gamePauseToggle,
                      ],
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
                    className="continue-btn"
                    onClick={(ev) => {
                      if (viewStore.inputFocusLayerID != constants.viewData.layer.pauseMenu) return;
                      gameStore.eventBus.fireEvent(constants.controls.controlEvent.gameUnpause);
                    }}
                  >
                    {getLangString({ lang, pathArray: ["pauseMenu", "continueBtnTitle"] }).string}
                  </button>

                  <button
                    className="help-btn"
                    onClick={(ev) => {
                      if (viewStore.inputFocusLayerID != constants.viewData.layer.pauseMenu) return;
                      gameStore.eventBus.fireEvent(constants.controls.controlEvent.helpMenuToggle);
                    }}
                  >
                    {getLangString({ lang, pathArray: ["pauseMenu", "helpBtnTitle"] }).string}
                  </button>

                  <button
                    className="options-btn"
                    onClick={(ev) => {
                      if (viewStore.inputFocusLayerID != constants.viewData.layer.pauseMenu) return;
                      viewStore.viewLayerEnable({
                        layerID: constants.viewData.layer.optionsMenu,
                        isAdditive: true,
                      });
                    }}
                  >
                    {getLangString({ lang, pathArray: ["pauseMenu", "optionsBtnTitle"] }).string}
                  </button>

                  <button
                    className="restart-btn"
                    onClick={(ev) => {
                      if (viewStore.inputFocusLayerID != constants.viewData.layer.pauseMenu) return;
                      gameStore.gameRestart();
                      viewStore.viewLayerDisable();
                    }}
                  >
                    {getLangString({ lang, pathArray: ["pauseMenu", "restartBtnTitle"] }).string}
                  </button>

                  <button
                    className="exit-btn"
                    onClick={(ev) => {
                      if (viewStore.inputFocusLayerID != constants.viewData.layer.pauseMenu) return;
                      gameStore.gameEnd();
                      viewStore.viewLayerEnable({ layerID: constants.viewData.layer.mainMenu });
                    }}
                  >
                    {getLangString({ lang, pathArray: ["pauseMenu", "exitBtnTitle"] }).string}
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
