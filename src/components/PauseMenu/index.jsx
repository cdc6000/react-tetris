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
      const { inputStore, viewStore } = gameStore;
      const { viewData } = viewStore.observables;
      const { lang } = gameStore.observables;
      const langStrings = constants.lang.strings[lang];

      const { show } = viewData.viewState[viewID];

      const pauseTriggers = inputStore.getAllActiveTriggersForActions({
        actions: [constants.controls.controlEvent.gameUnpause, constants.controls.controlEvent.gamePauseToggle],
      });
      let pauseTipButtons = [];
      if (pauseTriggers.length > 2) {
        pauseTriggers.slice(0, pauseTriggers.length - 1).forEach((trigger, tIndex) => {
          if (tIndex > 0) pauseTipButtons.push(<Fragment key={`${tIndex}-1`}>{","}</Fragment>);
          pauseTipButtons.push(
            <KeyboardKey
              key={`${tIndex}-2`}
              gameStore={gameStore}
              input={trigger}
            />
          );
        });
        pauseTipButtons.push(<Fragment key={"last-1"}>{"или"}</Fragment>);
        pauseTipButtons.push(
          <KeyboardKey
            key={"last-2"}
            gameStore={gameStore}
            input={pauseTriggers[pauseTriggers.length - 1]}
          />
        );
      } else if (pauseTriggers.length == 2) {
        pauseTipButtons.push(
          <KeyboardKey
            key={"0"}
            gameStore={gameStore}
            input={pauseTriggers[0]}
          />
        );
        pauseTipButtons.push(<Fragment key={"1"}>{"или"}</Fragment>);
        pauseTipButtons.push(
          <KeyboardKey
            key={"2"}
            gameStore={gameStore}
            input={pauseTriggers[1]}
          />
        );
      } else if (pauseTriggers.length == 1) {
        pauseTipButtons.push(
          <KeyboardKey
            key={"0"}
            gameStore={gameStore}
            input={pauseTriggers[0]}
          />
        );
      }

      return (
        <div className={`pause-menu${!show ? " h" : ""}`}>
          <div className="content-wrapper">
            <div className="title">{langStrings.pauseMenu.menuTitle}</div>
            <div className="tip">
              {"Нажмите"}
              {pauseTipButtons}
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
