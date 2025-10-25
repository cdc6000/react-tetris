import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import GamePlayWindow from "@components/GamePlayWindow";


import * as reactHelpers from "@utils/react-helpers";

import * as constants from "@constants/index";

import "./styles.scss";

export default observer(
  class Main extends Component {
    constructor(props) {
      super(props);

      this.state = {};

      this.forceUpdateAsync = reactHelpers.forceUpdateAsync.bind(this);
      this.setStateAsync = reactHelpers.setStateAsync.bind(this);
    }

    //

    render() {
      const { gameStore } = this.props;
      const { currentMenu } = gameStore.observables;

      //console.log("Main state", this.state)

      return (
        <div className="game-container">
          <GamePlayWindow
            show={currentMenu == constants.menu.game}
            gameStore={gameStore}
          />
        </div>
      );
    }
  }
);
