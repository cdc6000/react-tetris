import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import Button from "@components/common/Button";
import Checkbox from "@components/common/Checkbox";
import NumberInput from "@components/common/NumberInput";

import * as customHelpers from "@utils/custom-helpers";

import * as constants from "@constants/index";

export default observer(
  class OptionsGraphicsTab extends Component {
    constructor(props) {
      super(props);

      this.viewID = constants.viewData.view.optionsMenu;
      this.layerID = constants.viewData.layer.optionsMenu;

      this.sections = [
        {
          namePath: ["optionsMenu", "graphicsTab", "intraface", "sectionTitle"],
          settings: [
            {
              namePath: ["optionsMenu", "graphicsTab", "intraface", "interfaceScale"],
              component: NumberInput,
              getProps: () => {
                const { viewID } = this;
                const { gameStore, tabID } = this.props;
                const { graphicsOptions } = gameStore.observables;
                const { graphicsOptions: defaultGraphicsOptions } = gameStore.defaults.observables;

                return {
                  className: "input-hard-drop-delay",
                  navElemID: `${viewID}-${tabID}-hardDropDelayInput`,
                  navGroupID: `hardDropDelayInput`,
                  value: graphicsOptions.interfaceScale,
                  valueDefault: defaultGraphicsOptions.interfaceScale,
                  valueMin: 0.8,
                  valueMax: 1.5,
                  step: 0.05,
                  onChange: (value) => {
                    graphicsOptions.interfaceScale = parseFloat(value.toFixed(2));
                    gameStore.gameViewDataUpdate();
                  },
                };
              },
            },
            {
              namePath: ["optionsMenu", "graphicsTab", "intraface", "maxCellSize"],
              component: NumberInput,
              getProps: () => {
                const { viewID } = this;
                const { gameStore, tabID } = this.props;
                const { graphicsOptions } = gameStore.observables;
                const { graphicsOptions: defaultGraphicsOptions } = gameStore.defaults.observables;

                return {
                  className: "input-max-cell-size",
                  navElemID: `${viewID}-${tabID}-maxCellSizeInput`,
                  navGroupID: `maxCellSizeInput`,
                  value: graphicsOptions.maxCellSize,
                  valueDefault: defaultGraphicsOptions.maxCellSize,
                  valueMin: 10,
                  valueMax: 100,
                  step: 5,
                  onChange: (value) => {
                    graphicsOptions.maxCellSize = value;
                    gameStore.gameViewDataUpdate();
                  },
                };
              },
            },
          ],
        },
      ];
    }

    get canInteract() {
      const { gameStore, isTabActive } = this.props;
      const { viewStore } = gameStore;
      return viewStore.inputFocusViewLayerID == this.layerID && isTabActive;
    }

    //

    render() {
      const { viewID, layerID, sections, canInteract } = this;
      const { gameStore, tabID, isTabActive, tabData } = this.props;
      const { lang } = gameStore.observables;
      const { getLangStringConverted } = constants.lang;

      return (
        <div className={`options-list graphics-tab${!isTabActive ? " h" : ""}`}>
          {customHelpers.settingsSectionsDrawer({
            sections,
            gameStore,
            componentProps: {
              navLayerID: layerID,
              canInteract,
            },
          })}
        </div>
      );
    }
  }
);
