import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import Button from "@components/common/Button";

import GraphicsTab from "./GraphicsTab";
import GameplayTab from "./GameplayTab";
import ControlsTab from "./ControlsTab";

import * as reactHelpers from "@utils/react-helpers";
import * as timeHelpers from "@utils/time-helpers";
import * as customHelpers from "@utils/custom-helpers";

import * as constants from "@constants/index";

export default observer(
  class OptionsMenu extends Component {
    constructor(props) {
      super(props);

      this.viewID = constants.viewData.view.optionsMenu;
      this.layerID = constants.viewData.layer.optionsMenu;

      this.mainTabID = {
        graphics: "tab-graphics",
        gameplay: "tab-gameplay",
        controls: "tab-controls",
      };
      this.mainTabIDList = [this.mainTabID.graphics, this.mainTabID.gameplay, this.mainTabID.controls];
      this.mainTabData = {
        [this.mainTabID.graphics]: {
          tabNavElemID: `${this.viewID}-tabBtn_${this.mainTabID.graphics}`,
          namePath: ["optionsMenu", "graphicsTab", "tabBtnTitle"],
          Component: GraphicsTab,
        },
        [this.mainTabID.gameplay]: {
          tabNavElemID: `${this.viewID}-tabBtn_${this.mainTabID.gameplay}`,
          namePath: ["optionsMenu", "gameplayTab", "tabBtnTitle"],
          Component: GameplayTab,
        },
        [this.mainTabID.controls]: {
          tabNavElemID: `${this.viewID}-tabBtn_${this.mainTabID.controls}`,
          namePath: ["optionsMenu", "controlsTab", "tabBtnTitle"],
          Component: ControlsTab,
        },
      };

      this.state = {
        selectedMainTabID: this.mainTabIDList[0],
      };

      this.forceUpdateAsync = reactHelpers.forceUpdateAsync.bind(this);
      this.setStateAsync = reactHelpers.setStateAsync.bind(this);
    }

    get canInteract() {
      const { gameStore } = this.props;
      const { viewStore } = gameStore;
      return viewStore.inputFocusViewLayerID == this.layerID;
    }

    //

    render() {
      const { mainTabID, mainTabIDList, mainTabData, viewID, layerID, canInteract } = this;
      const { selectedMainTabID } = this.state;
      const { gameStore } = this.props;
      const { viewStore } = gameStore;
      const { viewData } = viewStore.observables;
      const { lang } = gameStore.observables;
      const { getLangStringConverted } = constants.lang;

      const { show } = viewData.viewState[viewID];

      return (
        <div className={`options-menu${!show ? " h" : ""}`}>
          <div className="content-wrapper">
            <div className="title">{getLangStringConverted({ lang, pathArray: ["optionsMenu", "menuTitle"] })}</div>
            <div className="content">
              <div className="tab-btns-container">
                {mainTabIDList.map((tabID, tIndex) => {
                  const tabData = mainTabData[tabID];
                  const isSelected = tabID == selectedMainTabID;
                  return (
                    <Button
                      key={tabID}
                      gameStore={gameStore}
                      className={`tab-btn ${tabID}${isSelected ? " pressed" : ""}`}
                      navLayerID={layerID}
                      navElemID={tabData.tabNavElemID}
                      namePath={tabData.namePath}
                      canInteract={canInteract}
                      onClick={() => {
                        this.setState({ selectedMainTabID: tabID });
                      }}
                      navIsHorizontal={true}
                      navGroupID={`options-tabs`}
                    />
                  );
                })}
              </div>

              <div className="options-list-container">
                {mainTabIDList.map((tabID, tIndex) => {
                  const tabData = mainTabData[tabID];
                  const isSelected = tabID == selectedMainTabID;
                  const { Component } = tabData;
                  return (
                    <Component
                      key={tabID}
                      tabID={tabID}
                      gameStore={gameStore}
                      isTabActive={isSelected}
                      tabData={tabData}
                    />
                  );
                })}
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
                    pathArray: ["optionsMenu", "backBtnTitle"],
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
        </div>
      );
    }
  }
);
