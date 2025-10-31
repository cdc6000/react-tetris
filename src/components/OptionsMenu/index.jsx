import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import * as reactHelpers from "@utils/react-helpers";

import * as constants from "@constants/index";

export default observer(
  class OptionsMenu extends Component {
    constructor(props) {
      super(props);

      this.viewID = constants.viewData.view.optionsMenu;

      this.forceUpdateAsync = reactHelpers.forceUpdateAsync.bind(this);
      this.setStateAsync = reactHelpers.setStateAsync.bind(this);
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
        <div className={`options-menu${!show ? " h" : ""}`}>
          <div className="center-content-wrapper">
            <label>
              <input type="checkbox" />
              {langStrings.optionsMenu.testSettingTitle}
            </label>

            <div className="control-btns-container">
              <button
                className="back-btn"
                onClick={(ev) => {
                  if (viewStore.inputFocusLayerID != constants.viewData.layer.optionsMenu) return;
                  viewStore.shiftInputFocusToLayerID({
                    layerID: constants.viewData.layer.optionsMenu,
                    isPrevious: true,
                  });
                }}
              >
                {langStrings.optionsMenu.backBtnTitle}
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
);
