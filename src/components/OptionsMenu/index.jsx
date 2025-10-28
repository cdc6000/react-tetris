import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import * as reactHelpers from "@utils/react-helpers";

import * as constants from "@constants/index";

export default observer(
  class OptionsMenu extends Component {
    constructor(props) {
      super(props);

      this.forceUpdateAsync = reactHelpers.forceUpdateAsync.bind(this);
      this.setStateAsync = reactHelpers.setStateAsync.bind(this);
    }

    //

    render() {
      const { show, gameStore } = this.props;
      const { lang, viewData } = gameStore.observables;
      const langStrings = constants.lang.strings[lang];

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
                  ev.preventDefault();
                  viewData.options.show = false;
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
