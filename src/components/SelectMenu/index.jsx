import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import Button from "@components/common/Button";

import * as customHelpers from "@utils/custom-helpers";

import * as constants from "@constants/index";

export default observer(
  class SelectMenu extends Component {
    constructor(props) {
      super(props);

      this.viewID = constants.viewData.view.selectMenu;
      this.layerID = constants.viewData.layer.selectMenu;
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
      const { eventBus, viewStore } = gameStore;
      const { viewData } = viewStore.observables;
      const { title = "", options = [], value } = viewStore.getViewLayerData(layerID).data;
      const { lang } = gameStore.observables;
      const { getLangStringConverted } = constants.lang;

      const { show } = viewData.viewState[viewID];

      return (
        <div className={`select-menu${!show ? " h" : ""}`}>
          <div className="content-wrapper">
            <div className="title">{title}</div>
            <div className="content">
              <div className="btns-container">
                <div className="btns-wrapper">
                  {options.map((option, oIndex) => {
                    const isSelected = option.id == value;
                    return (
                      <Button
                        key={oIndex}
                        className={`select-option${isSelected ? " pressed" : ""}`}
                        gameStore={gameStore}
                        navLayerID={layerID}
                        navElemID={`${viewID}-option-${oIndex}`}
                        canInteract={canInteract && !isSelected}
                        onClick={() => {
                          eventBus.fireEvent(constants.eventsData.eventType.optionSelected, { id: option.id });
                        }}
                      >
                        {option.name ||
                          (option.namePath &&
                            getLangStringConverted({
                              lang,
                              pathArray: option.namePath,
                            })) ||
                          `no-name-${oIndex}`}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="control-btns-container">
              <Button
                gameStore={gameStore}
                className="back-btn"
                navLayerID={layerID}
                navElemID={`${viewID}-backBtn`}
                canInteract={canInteract}
                onClick={() => {
                  viewStore.optionSelectUnsubscribe();
                }}
              >
                {getLangStringConverted({
                  lang,
                  pathArray: ["selectMenu", "backBtnTitle"],
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
