import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import Button from "@components/common/Button";

import * as customHelpers from "@utils/custom-helpers";

import * as constants from "@constants/index";

export default observer(
  class PauseMenu extends Component {
    constructor(props) {
      super(props);

      this.viewID = constants.viewData.view.pauseMenu;
      this.layerID = constants.viewData.layer.pauseMenu;
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
        <div className={`pause-menu${!show ? " h" : ""}`}>
          <div className="content-wrapper">
            <div className="title">{getLangStringConverted({ lang, pathArray: ["pauseMenu", "menuTitle"] })}</div>
            <div className="tip">
              {getLangStringConverted({
                lang,
                pathArray: ["pauseMenu", "tipUnpause"],
                conversionList: [
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
                ],
              })}
            </div>
            <div className="content">
              <div className="btns-container">
                <div className="btns-wrapper">
                  <Button
                    gameStore={gameStore}
                    className="continue-btn"
                    navLayerID={layerID}
                    navElemID={`${viewID}-continueBtn`}
                    namePath={["pauseMenu", "continueBtnTitle"]}
                    canInteract={canInteract}
                    onClick={() => {
                      gameStore.eventBus.fireEvent(constants.controls.controlEvent.gameUnpause);
                    }}
                  />
                  <Button
                    gameStore={gameStore}
                    className="help-btn"
                    navLayerID={layerID}
                    navElemID={`${viewID}-helpBtn`}
                    namePath={["pauseMenu", "helpBtnTitle"]}
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
                    namePath={["pauseMenu", "optionsBtnTitle"]}
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
                    className="restart-btn"
                    navLayerID={layerID}
                    navElemID={`${viewID}-restartBtn`}
                    namePath={["pauseMenu", "restartBtnTitle"]}
                    canInteract={canInteract}
                    onClick={() => {
                      gameStore.gameRestart();
                      viewStore.viewLayerDisable();
                    }}
                  />
                  <Button
                    gameStore={gameStore}
                    className="exit-btn"
                    navLayerID={layerID}
                    navElemID={`${viewID}-exitBtn`}
                    namePath={["pauseMenu", "exitBtnTitle"]}
                    canInteract={canInteract}
                    onClick={() => {
                      gameStore.gameEnd();
                      viewStore.viewLayerEnable({ layerID: constants.viewData.layer.mainMenu });
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
