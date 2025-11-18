import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import Button from "@components/common/Button";

import * as customHelpers from "@utils/custom-helpers";

import * as constants from "@constants/index";

export default observer(
  class GameWinMenu extends Component {
    constructor(props) {
      super(props);

      this.viewID = constants.viewData.view.gameWinMenu;
      this.layerID = constants.viewData.layer.gameWinMenu;
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
      const { viewStore } = gameStore;
      const { viewData } = viewStore.observables;
      const { lang } = gameStore.observables;
      const { getLangStringConverted } = constants.lang;

      const { show } = viewData.viewState[viewID];

      return (
        <div className={`game-win-menu${!show ? " h" : ""}`}>
          <div className="content-wrapper">
            <div className="title">{getLangStringConverted({ lang, pathArray: ["gameWinMenu", "menuTitle"] })}</div>
            <div className="content">
              <div className="btns-container">
                <div className="btns-wrapper">
                  <Button
                    gameStore={gameStore}
                    className="restart-btn"
                    navLayerID={layerID}
                    navElemID={`${viewID}-restartBtn`}
                    namePath={["gameWinMenu", "restartBtnTitle"]}
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
                    namePath={["gameWinMenu", "exitBtnTitle"]}
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
