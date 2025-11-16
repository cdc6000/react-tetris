import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import Button from "@components/common/Button";
import Checkbox from "@components/common/Checkbox";
import NumberInput from "@components/common/NumberInput";
import ControlsMapTable from "@components/ControlsMapTable";

import * as customHelpers from "@utils/custom-helpers";

import * as constants from "@constants/index";

export default observer(
  class OptionsControlsTab extends Component {
    constructor(props) {
      super(props);

      const { gameStore } = this.props;
      const { inputStore } = gameStore;
      const { controlSchemes } = inputStore.observables;

      this.state = {
        selectedControlSchemeID: controlSchemes[0]?.id || 0,
      };

      this.viewID = constants.viewData.view.optionsMenu;
      this.layerID = constants.viewData.layer.optionsMenu;

      this.sections = [
        {
          namePath: ["optionsMenu", "controlsTab", "main", "sectionTitle"],
          settings: [
            {
              namePath: ["optionsMenu", "controlsTab", "main", "allowFigureMoveByMouse"],
              component: Checkbox,
              getProps: () => {
                const { viewID } = this;
                const { gameStore, tabID } = this.props;
                const { inputStore } = gameStore;
                const { inputOptions } = inputStore.observables;

                return {
                  className: "allow-figure-move-by-mouse-checkbox",
                  navElemID: `${viewID}-${tabID}-allowFigureMoveByMouseCheckbox`,
                  value: inputOptions.allowFigureMoveByMouse,
                  onChange: (value) => {
                    inputOptions.allowFigureMoveByMouse = value;
                  },
                  children: <Fragment>&#x2714;</Fragment>,
                };
              },
            },
            {
              namePath: ["optionsMenu", "controlsTab", "main", "inputRepeatDelay"],
              component: NumberInput,
              getProps: () => {
                const { viewID } = this;
                const { gameStore, tabID } = this.props;
                const { inputStore } = gameStore;
                const { inputOptions } = inputStore.observables;
                const { inputOptions: defaultInputOptions } = inputStore.defaults.observables;

                return {
                  className: "input-repeat-delay",
                  navElemID: `${viewID}-${tabID}-inputRepeatDelayInput`,
                  navGroupID: `inputRepeatDelayInput`,
                  value: inputOptions.inputRepeatDelay,
                  valueDefault: defaultInputOptions.inputRepeatDelay,
                  valueMin: 0,
                  valueMax: 1000,
                  step: 10,
                  onChange: (value) => {
                    inputOptions.inputRepeatDelay = value;
                  },
                };
              },
            },
            {
              namePath: ["optionsMenu", "controlsTab", "main", "inputRepeatRate"],
              component: NumberInput,
              getProps: () => {
                const { viewID } = this;
                const { gameStore, tabID } = this.props;
                const { inputStore } = gameStore;
                const { inputOptions } = inputStore.observables;
                const { inputOptions: defaultInputOptions } = inputStore.defaults.observables;

                return {
                  className: "input-repeat-rate",
                  navElemID: `${viewID}-${tabID}-inputRepeatRateInput`,
                  navGroupID: `inputRepeatRateInput`,
                  value: inputOptions.inputRepeatRate,
                  valueDefault: defaultInputOptions.inputRepeatRate,
                  valueMin: 10,
                  valueMax: 1000,
                  step: 10,
                  onChange: (value) => {
                    inputOptions.inputRepeatRate = value;
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
      const { viewID, layerID, canInteract, sections } = this;
      const { selectedControlSchemeID } = this.state;
      const { gameStore, tabID, isTabActive, tabData } = this.props;
      const { inputStore } = gameStore;
      const { inputOptions, controlSchemes } = inputStore.observables;
      const { inputOptions: defaultInputOptions } = inputStore.defaults.observables;
      const { lang, gameOptions } = gameStore.observables;
      const { gameOptions: defaultGameOptions } = gameStore.defaults.observables;
      const { getLangStringConverted } = constants.lang;

      const selectedControlScheme =
        (selectedControlSchemeID && controlSchemes.find((_) => _.id == selectedControlSchemeID)) || false;

      return (
        <div className={`options-list controls-tab${!isTabActive ? " h" : ""}`}>
          {customHelpers.settingsSectionsDrawer({
            sections,
            gameStore,
            componentProps: {
              navLayerID: layerID,
              canInteract,
            },
          })}

          <div className="section">
            <div className="header">
              <div className="text">
                {getLangStringConverted({
                  lang,
                  pathArray: ["optionsMenu", "controlsTab", "controlScheme", "sectionTitle"],
                })}
              </div>
            </div>
            <div className="content">
              <div className="control-scheme-select">
                {controlSchemes.map((controlScheme) => {
                  const isSelected = controlScheme.id == selectedControlSchemeID;
                  return (
                    <Button
                      key={controlScheme.id}
                      gameStore={gameStore}
                      className={`control-scheme-btn${isSelected ? " pressed" : ""}`}
                      navLayerID={layerID}
                      navElemID={`${viewID}-${tabID}-controlScheme-${controlScheme.id}`}
                      canInteract={canInteract}
                      onClick={() => {
                        this.setState({ selectedControlSchemeID: controlScheme.id });
                      }}
                      navIsHorizontal={true}
                      navGroupID={`controls-controlScheme`}
                    >
                      {controlScheme.name || getLangStringConverted({ lang, pathArray: controlScheme.namePath })}
                    </Button>
                  );
                })}
              </div>

              <ControlsMapTable
                gameStore={gameStore}
                inputMapAllowed={true}
                controlScheme={selectedControlScheme}
                disabled={!selectedControlScheme}
                hasFocus={canInteract}
                layerID={layerID}
                viewID={`${viewID}-${tabID}`}
              />

              <div className="btn-wrapper">
                <Button
                  gameStore={gameStore}
                  className={`control-scheme-reset`}
                  namePath={["optionsMenu", "controlsTab", "controlScheme", "resetBtnTitle"]}
                  navLayerID={layerID}
                  navElemID={`${viewID}-${tabID}-controlSchemeReset`}
                  canInteract={canInteract}
                  onClick={() => {
                    inputStore.resetControlScheme({ id: selectedControlSchemeID });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
);
