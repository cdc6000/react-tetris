import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import * as constants from "@constants/index";

export default observer(
  class GameOverMenu extends Component {
    constructor(props) {
      super(props);

      this.viewID = constants.viewData.view.gameOverMenu;
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
        <div className={`game-over-menu${!show ? " h" : ""}`}>
          <div className="content-wrapper">
            <div className="title">{langStrings.gameOverMenu.menuTitle}</div>
            <div className="tip">Бывает =(</div>

            <div className="btns-container">
              <div className="btns-wrapper">
                <button
                  className="restart-btn"
                  onClick={(ev) => {
                    if (viewStore.inputFocusLayerID != constants.viewData.layer.gameOverMenu) return;
                    gameStore.gameRestart();
                    viewStore.viewLayerDisable();
                  }}
                >
                  {langStrings.pauseMenu.restartBtnTitle}
                </button>

                <button
                  className="exit-btn"
                  onClick={(ev) => {
                    if (viewStore.inputFocusLayerID != constants.viewData.layer.gameOverMenu) return;
                    gameStore.gameEnd();
                    viewStore.viewLayerEnable({ layerID: constants.viewData.layer.mainMenu });
                  }}
                >
                  {langStrings.pauseMenu.exitBtnTitle}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
);
