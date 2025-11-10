import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import MainMenu from "@components/MainMenu";
import OptionsMenu from "@components/OptionsMenu";
import GamePlayView from "@components/GamePlayView";
import PauseMenu from "@components/PauseMenu";
import GameOverMenu from "@components/GameOverMenu";
import HelpMenu from "@components/HelpMenu";
import GetInputMenu from "@components/GetInputMenu";
import ControlsOverlapMenu from "@components/ControlsOverlapMenu";
import SelectMenu from "@components/SelectMenu";

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

      //console.log("Main state", this.state)

      return (
        <div className="main-view-controller">
          <GamePlayView gameStore={gameStore} />
          <MainMenu gameStore={gameStore} />
          <PauseMenu gameStore={gameStore} />
          <GameOverMenu gameStore={gameStore} />
          <OptionsMenu gameStore={gameStore} />
          <HelpMenu gameStore={gameStore} />
          <GetInputMenu gameStore={gameStore} />
          <ControlsOverlapMenu gameStore={gameStore} />
          <SelectMenu gameStore={gameStore} />

          <div className="version">{process.env.npm_package_version}</div>
        </div>
      );
    }
  }
);
