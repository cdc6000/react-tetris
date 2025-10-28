import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import * as constants from "@constants/index";

export default observer(
  class GameOverMenu extends Component {
    constructor(props) {
      super(props);
    }

    //

    render() {
      const { show, gameStore } = this.props;
      const { lang, viewData } = gameStore.observables;
      const langStrings = constants.lang.strings[lang];

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
