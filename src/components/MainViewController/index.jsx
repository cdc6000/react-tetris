import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import MainMenu from "@components/MainMenu";
import OptionsMenu from "@components/OptionsMenu";
import GamePlayView from "@components/GamePlayView";

import * as reactHelpers from "@utils/react-helpers";

import * as constants from "@constants/index";

import "./styles.scss";

export default observer(
  class MainViewController extends Component {
    constructor(props) {
      super(props);

      this.state = {};

      this.forceUpdateAsync = reactHelpers.forceUpdateAsync.bind(this);
      this.setStateAsync = reactHelpers.setStateAsync.bind(this);
    }

    //

    render() {
      const { gameStore } = this.props;
      const { lang, viewData } = gameStore.observables;
      const langStrings = constants.lang.strings[lang];

      //console.log("Main state", this.state)

      return (
        <div className="main-view-controller">
          <GamePlayView
            show={viewData.current == constants.view.game}
            gameStore={gameStore}
          />
          
          <MainMenu
            show={viewData.current == constants.view.mainMenu}
            gameStore={gameStore}
          />

          <OptionsMenu
            show={viewData.options.show}
            gameStore={gameStore}
          />
        </div>
      );
    }
  }
);
