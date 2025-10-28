import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import * as constants from "@constants/index";

export default observer(
  class PauseMenu extends Component {
    constructor(props) {
      super(props);
    }

    //

    render() {
      const { show, gameStore } = this.props;
      const { lang, viewData } = gameStore.observables;
      const langStrings = constants.lang.strings[lang];

      return (
        <div className={`pause-menu${!show ? " h" : ""}`}>
          <div className="content-wrapper">
            <div className="title">{langStrings.pauseMenu.menuTitle}</div>
            <div className="tip">
              Нажмите <div className="kb-key">P</div> или <div className="kb-key">&nbsp;Колесо&nbsp;&#8595;&nbsp;</div>{" "}
              для продолжения
            </div>

            <div className="btns-container">
              <div className="btns-wrapper">
                <button
                  className="options-btn"
                  onClick={(ev) => {
                    ev.preventDefault();
                    viewData.options.show = true;
                  }}
                >
                  {langStrings.pauseMenu.optionsBtnTitle}
                </button>

                <button
                  className="restart-btn"
                  onClick={(ev) => {
                    ev.preventDefault();
                    gameStore.gameRestart();
                  }}
                >
                  {langStrings.pauseMenu.restartBtnTitle}
                </button>

                <button
                  className="exit-btn"
                  onClick={(ev) => {
                    ev.preventDefault();
                    gameStore.gameEnd();
                    viewData.current = constants.view.mainMenu;
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
