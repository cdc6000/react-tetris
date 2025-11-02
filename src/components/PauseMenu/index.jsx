import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import KeyboardKey from "@components/common/KeyboardKey";

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
      const { viewStore } = gameStore;
      const { viewData } = viewStore.observables;
      const { lang } = gameStore.observables;
      const langStrings = constants.lang.strings[lang];

      const { show } = viewData.viewState[viewID];

      return (
        <div className={`pause-menu${!show ? " h" : ""}`}>
          <div className="content-wrapper">
            <div className="title">{langStrings.pauseMenu.menuTitle}</div>
            <div className="tip">
              {"Нажмите"}
              <KeyboardKey gameStore={gameStore}>P</KeyboardKey>
              {"или"}
              <KeyboardKey gameStore={gameStore}>Колесо &#8595;</KeyboardKey>
              {"для продолжения"}
            </div>

            <div className="btns-container">
              <div className="btns-wrapper">
                <button
                  className="continue-btn"
                  onClick={(ev) => {
                    if (viewStore.inputFocusLayerID != constants.viewData.layer.pauseMenu) return;
                    gameStore.eventBus.fireEvent(constants.controls.controlEvent.gameUnpause);
                  }}
                >
                  {langStrings.pauseMenu.continueBtnTitle}
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
                  {langStrings.pauseMenu.optionsBtnTitle}
                </button>

                <button
                  className="restart-btn"
                  onClick={(ev) => {
                    if (viewStore.inputFocusLayerID != constants.viewData.layer.pauseMenu) return;
                    gameStore.gameRestart();
                    viewStore.viewLayerDisable();
                  }}
                >
                  {langStrings.pauseMenu.restartBtnTitle}
                </button>

                <button
                  className="exit-btn"
                  onClick={(ev) => {
                    if (viewStore.inputFocusLayerID != constants.viewData.layer.pauseMenu) return;
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
