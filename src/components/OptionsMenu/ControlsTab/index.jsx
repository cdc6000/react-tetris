import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import Button from "@components/common/Button";
import Select from "@components/common/Select";
import Checkbox from "@components/common/Checkbox";
import NumberInput from "@components/common/NumberInput";
import ControlsMapTable from "@components/ControlsMapTable";

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
    }

    get canInteract() {
      const { gameStore, isTabActive } = this.props;
      const { viewStore } = gameStore;
      return viewStore.inputFocusViewLayerID == this.layerID && isTabActive;
    }

    //

    render() {
      const { viewID, layerID, canInteract } = this;
      const { selectedControlSchemeID } = this.state;
      const { gameStore, tabID, isTabActive, tabData } = this.props;
      const { inputStore } = gameStore;
      const { inputOptions, controlSchemes } = inputStore.observables;
      const { inputOptions: defaultInputOptions } = inputStore.defaults.observables;
      const { lang } = gameStore.observables;
      const { getLangStringConverted } = constants.lang;

      const selectedControlScheme =
        (selectedControlSchemeID && controlSchemes.find((_) => _.id == selectedControlSchemeID)) || false;

      return (
        <div className={`options-list controls-tab${!isTabActive ? " h" : ""}`}>
          <div className="section">
            <div className="header">
              <div className="text">
                {getLangStringConverted({
                  lang,
                  pathArray: ["optionsMenu", "controlsTab", "main", "sectionTitle"],
                })}
              </div>
            </div>
            <div className="content">
              <table className="settings-table">
                <tbody>
                  <tr>
                    <td>
                      <div className="setting-name">
                        {getLangStringConverted({
                          lang,
                          pathArray: ["optionsMenu", "controlsTab", "main", "allowFigureMoveByMouse"],
                        })}
                      </div>
                    </td>
                    <td>
                      <div className="setting-controls">
                        <Checkbox
                          gameStore={gameStore}
                          className="allow-figure-move-by-mouse-checkbox"
                          navLayerID={layerID}
                          navElemID={`${viewID}-${tabID}-allowFigureMoveByMouseCheckbox`}
                          canInteract={canInteract}
                          value={inputOptions.allowFigureMoveByMouse}
                          onChange={(value) => {
                            inputOptions.allowFigureMoveByMouse = value;
                          }}
                        >
                          &#x2714;
                        </Checkbox>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="setting-name">
                        {getLangStringConverted({
                          lang,
                          pathArray: ["optionsMenu", "controlsTab", "main", "inputRepeatDelayInputTitle"],
                        })}
                      </div>
                    </td>
                    <td>
                      <div className="setting-controls">
                        <NumberInput
                          gameStore={gameStore}
                          className="input-repeat-delay"
                          navLayerID={layerID}
                          navElemID={`${viewID}-${tabID}-inputRepeatDelayInput`}
                          navGroupID={`inputRepeatDelayInput`}
                          canInteract={canInteract}
                          value={inputOptions.inputRepeatDelay}
                          valueDefault={defaultInputOptions.inputRepeatDelay}
                          valueMin={0}
                          valueMax={1000}
                          step={10}
                          onChange={(value) => {
                            inputOptions.inputRepeatDelay = value;
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="setting-name">
                        {getLangStringConverted({
                          lang,
                          pathArray: ["optionsMenu", "controlsTab", "main", "inputRepeatRateInputTitle"],
                        })}
                      </div>
                    </td>
                    <td>
                      <div className="setting-controls">
                        <NumberInput
                          gameStore={gameStore}
                          className="input-repeat-rate"
                          navLayerID={layerID}
                          navElemID={`${viewID}-${tabID}-inputRepeatRateInput`}
                          navGroupID={`inputRepeatRateInput`}
                          canInteract={canInteract}
                          value={inputOptions.inputRepeatRate}
                          valueDefault={defaultInputOptions.inputRepeatRate}
                          valueMin={10}
                          valueMax={1000}
                          step={10}
                          onChange={(value) => {
                            inputOptions.inputRepeatRate = value;
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

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
