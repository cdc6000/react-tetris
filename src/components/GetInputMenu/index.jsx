import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import InputTip from "@components/common/InputTip";

import * as customHelpers from "@utils/custom-helpers";

import * as constants from "@constants/index";

export default observer(
  class GetInputMenu extends Component {
    constructor(props) {
      super(props);

      this.viewID = constants.viewData.view.getInputMenu;
      this.layerID = constants.viewData.layer.getInputMenu;
    }

    get canInteract() {
      const { gameStore } = this.props;
      const { viewStore } = gameStore;
      return viewStore.inputFocusViewLayerID == this.layerID;
    }

    //

    render() {
      const { viewID, layerID, canInteract } = this;
      const { gameStore } = this.props;
      const { viewStore, inputStore } = gameStore;
      const { registeredInput } = viewStore.getViewLayerData(layerID).data || {};
      const { viewData } = viewStore.observables;
      const { lang } = gameStore.observables;
      const { getLangStringConverted } = constants.lang;

      const { show } = viewData.viewState[viewID];

      return (
        <div className={`get-input-menu${!show ? " h" : ""}`}>
          {!registeredInput && (
            <div className="content-wrapper">
              <div className="title">
                {getLangStringConverted({ lang, pathArray: ["getInputMenu", "awaitingInput"] })}
              </div>
              <div className="tip">
                {getLangStringConverted({
                  lang,
                  pathArray: ["getInputMenu", "awaitingInputExitTip"],
                  conversionList: [
                    customHelpers.insertBtnConversion({
                      gameStore,
                      actions: [constants.controls.controlEvent.menuNavBack],
                      triggers: [constants.controls.getInputEvent(constants.controls.input.f1)],
                    }),
                  ],
                })}
              </div>
            </div>
          )}
          {Boolean(registeredInput) && (
            <div className="content-wrapper">
              <div className="title">
                {getLangStringConverted({ lang, pathArray: ["getInputMenu", "inputRegistered"] })}
              </div>
              <div className="tip">
                <InputTip
                  gameStore={gameStore}
                  input={registeredInput}
                />
              </div>
            </div>
          )}
        </div>
      );
    }
  }
);
