import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import Button from "@components/common/Button";
import ControlsMapTable from "@components/ControlsMapTable";

import * as customHelpers from "@utils/custom-helpers";

import * as constants from "@constants/index";

export default observer(
  class GetInputMenu extends Component {
    constructor(props) {
      super(props);

      this.viewID = constants.viewData.view.controlsOverlapMenu;
      this.layerID = constants.viewData.layer.controlsOverlapMenu;
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
      const { overlapControlSchemes } = viewStore.getViewLayerData(layerID).data || {};
      const { viewData } = viewStore.observables;
      const { controlSchemes } = inputStore.observables;
      const { lang } = gameStore.observables;
      const { getLangStringConverted } = constants.lang;

      const { show } = viewData.viewState[viewID];

      return (
        <div className={`controls-overlap-menu${!show ? " h" : ""}`}>
          <div className="content-wrapper">
            <div className="title">
              {getLangStringConverted({
                lang,
                pathArray: [
                  "overlapControlsMenu",
                  overlapControlSchemes?.length ? "foundOverlapsTitle" : "notFoundOverlapsTitle",
                ],
              })}
            </div>
            {Boolean(overlapControlSchemes?.length) && (
              <div className="content">
                {overlapControlSchemes.map((overlapControlScheme, csIndex) => {
                  const controlScheme = controlSchemes.find((_) => _.id == overlapControlScheme.id);
                  return (
                    <div
                      key={csIndex}
                      className="control-scheme-wrapper"
                    >
                      <div className="title">
                        {controlScheme.name || getLangStringConverted({ lang, pathArray: controlScheme.namePath })}
                      </div>
                      <ControlsMapTable
                        gameStore={gameStore}
                        controlScheme={overlapControlScheme}
                        hideEmpty={true}
                        hasFocus={canInteract}
                        layerID={layerID}
                        viewID={viewID}
                      />
                    </div>
                  );
                })}
              </div>
            )}
            <div className="control-btns-container">
              <Button
                gameStore={gameStore}
                className="back-btn"
                navLayerID={layerID}
                navElemID={`${viewID}-backBtn`}
                navAutoFocus={true}
                canInteract={canInteract}
                onClick={() => {
                  viewStore.shiftInputFocusToViewLayerID({ layerID, isPrevious: true });
                }}
              >
                {getLangStringConverted({
                  lang,
                  pathArray: ["overlapControlsMenu", "backBtnTitle"],
                  conversionList: [
                    customHelpers.insertBtnConversion({
                      gameStore,
                      actions: [constants.controls.controlEvent.menuNavBack],
                      isCompact: true,
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
