import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import Button from "@components/common/Button";
import ControlsMapTable from "@components/ControlsMapTable";

import * as customHelpers from "@utils/custom-helpers";

import * as constants from "@constants/index";

export default observer(
  class HelpMenu extends Component {
    constructor(props) {
      super(props);

      this.viewID = constants.viewData.view.helpMenu;
      this.layerID = constants.viewData.layer.helpMenu;
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
      const { inputStore, viewStore } = gameStore;
      const { viewData } = viewStore.observables;
      const { lang } = gameStore.observables;
      const { getLangStringConverted } = constants.lang;

      const { show } = viewData.viewState[viewID];

      return (
        <div className={`help-menu${!show ? " h" : ""}`}>
          <div className="content-wrapper">
            <div className="title">{getLangStringConverted({ lang, pathArray: ["helpMenu", "menuTitle"] })}</div>
            <div className="content">
              <ControlsMapTable
                gameStore={gameStore}
                showAllActiveTriggers={true}
                hasFocus={canInteract}
                layerID={layerID}
                viewID={viewID}
              />
            </div>
            <div className="control-btns-container">
              <Button
                gameStore={gameStore}
                className="back-btn"
                navLayerID={layerID}
                navElemID={`${viewID}-backBtn`}
                canInteract={canInteract}
                onClick={() => {
                  viewStore.shiftInputFocusToViewLayerID({ layerID, isPrevious: true });
                }}
              >
                {getLangStringConverted({
                  lang,
                  pathArray: ["helpMenu", "backBtnTitle"],
                  conversionList: [
                    customHelpers.insertBtnConversion({
                      gameStore,
                      actions: [
                        constants.controls.controlEvent.helpMenuToggle,
                        constants.controls.controlEvent.menuNavBack,
                      ],
                    }),
                  ],
                })}
              </Button>
            </div>
          </div>
        </div>
      );
    }
  }
);
