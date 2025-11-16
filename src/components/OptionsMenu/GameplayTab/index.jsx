import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import Button from "@components/common/Button";
import Checkbox from "@components/common/Checkbox";
import NumberInput from "@components/common/NumberInput";

import * as customHelpers from "@utils/custom-helpers";

import * as constants from "@constants/index";

export default observer(
  class OptionsGameplayTab extends Component {
    constructor(props) {
      super(props);

      this.viewID = constants.viewData.view.optionsMenu;
      this.layerID = constants.viewData.layer.optionsMenu;

      this.sections = [
        {
          namePath: ["optionsMenu", "gameplayTab", "main", "sectionTitle"],
          settings: [
            {
              namePath: ["optionsMenu", "gameplayTab", "main", "hardDropDelay"],
              component: NumberInput,
              getProps: () => {
                const { viewID } = this;
                const { gameStore, tabID } = this.props;
                const { gameplayOptions } = gameStore.observables;
                const { gameplayOptions: defaultGameplayOptions } = gameStore.defaults.observables;

                return {
                  className: "input-hard-drop-delay",
                  navElemID: `${viewID}-${tabID}-hardDropDelayInput`,
                  navGroupID: `hardDropDelayInput`,
                  value: gameplayOptions.hardDropDelay,
                  valueDefault: defaultGameplayOptions.hardDropDelay,
                  valueMin: 0,
                  valueMax: 1000,
                  step: 10,
                  onChange: (value) => {
                    gameplayOptions.hardDropDelay = value;
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
        <div className={`options-list gameplay-tab${!isTabActive ? " h" : ""}`}>
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
