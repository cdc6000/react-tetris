import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import ControlsMapTable from "@components/ControlsMapTable";

import * as customHelpers from "@utils/custom-helpers";

import * as constants from "@constants/index";

export default observer(
  class HelpMenu extends Component {
    constructor(props) {
      super(props);

      this.viewID = constants.viewData.view.helpMenu;
    }

    //

    render() {
      const { viewID } = this;
      const { gameStore } = this.props;
      const { inputStore, viewStore } = gameStore;
      const { viewData } = viewStore.observables;
      const { lang } = gameStore.observables;
      const { getLangString, stringConverter } = constants.lang;

      const { show } = viewData.viewState[viewID];

      return (
        <div className={`help-menu${!show ? " h" : ""}`}>
          <div className="content-wrapper">
            <div className="title">{getLangString({ lang, pathArray: ["helpMenu", "menuTitle"] }).string}</div>
            <div className="tip">
              {stringConverter(getLangString({ lang, pathArray: ["helpMenu", "tipHelpClose"] }).string, [
                {
                  type: "function",
                  whatIsRegExp: true,
                  what: `\\$\\{btns\\|([^\\}]+)\\}`,
                  to: (key, matchData) => {
                    const triggers = inputStore.getAllActiveTriggersForActions({
                      actions: [constants.controls.controlEvent.helpMenuToggle],
                    });
                    return customHelpers.actionTriggersDrawer({ gameStore, triggers, concatWord: matchData[1], key });
                  },
                },
              ])}
            </div>
            <div className="content">
              <ControlsMapTable
                gameStore={gameStore}
                showAllActiveTriggers={true}
              />
            </div>
            <div className="control-btns-container">
              <button
                className="back-btn"
                onClick={(ev) => {
                  if (viewStore.inputFocusLayerID != constants.viewData.layer.helpMenu) return;
                  viewStore.shiftInputFocusToLayerID({
                    layerID: constants.viewData.layer.helpMenu,
                    isPrevious: true,
                  });
                }}
              >
                {getLangString({ lang, pathArray: ["helpMenu", "backBtnTitle"] }).string}
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
);
