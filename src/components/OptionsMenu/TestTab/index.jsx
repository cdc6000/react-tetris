import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import Checkbox from "@components/common/Checkbox";

import * as constants from "@constants/index";

export default observer(
  class OptionsTestTab extends Component {
    constructor(props) {
      super(props);

      this.viewID = constants.viewData.view.optionsMenu;
      this.layerID = constants.viewData.layer.optionsMenu;
    }

    get canInteract() {
      const { gameStore, isTabActive } = this.props;
      const { viewStore } = gameStore;
      return viewStore.inputFocusViewLayerID == this.layerID && isTabActive;
    }

    //

    render() {
      const { viewID, layerID, canInteract } = this;
      const { gameStore, tabID, isTabActive, tabData } = this.props;
      const { lang } = gameStore.observables;
      const { getLangStringConverted } = constants.lang;

      return (
        <div className={`options-list test-tab${!isTabActive ? " h" : ""}`}>
          <Checkbox
            gameStore={gameStore}
            className="test-checkbox"
            navLayerID={layerID}
            navElemID={`${viewID}-${tabID}-testCheckbox`}
            namePath={["optionsMenu", "testTab", "testSettingTitle"]}
            canInteract={canInteract}
          />
        </div>
      );
    }
  }
);
