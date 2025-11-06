import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import Button from "@components/common/Button";

import * as reactHelpers from "@utils/react-helpers";
import * as customHelpers from "@utils/custom-helpers";

import * as constants from "@constants/index";

export default observer(
  class MainMenu extends Component {
    constructor(props) {
      super(props);

      this.viewID = constants.viewData.view.mainMenu;
      this.layerID = constants.viewData.layer.mainMenu;

      this.forceUpdateAsync = reactHelpers.forceUpdateAsync.bind(this);
      this.setStateAsync = reactHelpers.setStateAsync.bind(this);
    }

    get canInteract() {
      const { gameStore } = this.props;
      const { viewStore } = gameStore;
      return viewStore.inputFocusViewLayerID == this.layerID;
    }

    //

    render() {
      const { viewID, layerID, canInteract } = this;
      const { gameStore } = this.props;
      const { inputStore, viewStore } = gameStore;
      const { viewData } = viewStore.observables;
      const { lang } = gameStore.observables;
      const { getLangStringConverted } = constants.lang;

      const { show } = viewData.viewState[viewID];

      return (
        <div className={`main-menu${!show ? " h" : ""}`}>
          <div className="content-wrapper">
            <div className="title">{getLangStringConverted({ lang, pathArray: ["mainMenu", "menuTitle"] })}</div>
            <div className="tip">
              {getLangStringConverted({
                lang,
                pathArray: ["mainMenu", "tip"],
                conversionList: [
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
                ],
              })}
            </div>
            <div className="content">
              <div className="btns-container">
                <div className="btns-wrapper">
                  <Button
                    gameStore={gameStore}
                    className="play-btn"
                    navLayerID={layerID}
                    navElemID={`${viewID}-playBtn`}
                    namePath={["mainMenu", "playBtnTitle"]}
                    canInteract={canInteract}
                    onClick={() => {
                      gameStore.gameStartClassic();
                    }}
                  />
                  <Button
                    gameStore={gameStore}
                    className="help-btn"
                    navLayerID={layerID}
                    navElemID={`${viewID}-helpBtn`}
                    namePath={["mainMenu", "helpBtnTitle"]}
                    canInteract={canInteract}
                    onClick={() => {
                      gameStore.eventBus.fireEvent(constants.controls.controlEvent.helpMenuToggle);
                    }}
                  />
                  <Button
                    gameStore={gameStore}
                    className="options-btn"
                    navLayerID={layerID}
                    navElemID={`${viewID}-optionsBtn`}
                    namePath={["mainMenu", "optionsBtnTitle"]}
                    canInteract={canInteract}
                    onClick={() => {
                      viewStore.viewLayerEnable({
                        layerID: constants.viewData.layer.optionsMenu,
                        isAdditive: true,
                      });
                    }}
                  />
                  <Button
                    gameStore={gameStore}
                    className="exit-btn"
                    navLayerID={layerID}
                    navElemID={`${viewID}-exitBtn`}
                    namePath={["mainMenu", "exitBtnTitle"]}
                    canInteract={canInteract}
                    onClick={() => {
                      window.appBridge?.quit();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
);
