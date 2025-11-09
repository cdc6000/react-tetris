import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import Button from "@components/common/Button";
import Select from "@components/common/Select";
import Checkbox from "@components/common/Checkbox";
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
              <div className="row">
                <Checkbox
                  gameStore={gameStore}
                  className="allow-figure-move-by-mouse-checkbox"
                  navLayerID={layerID}
                  navElemID={`${viewID}-${tabID}-allowFigureMoveByMouseCheckbox`}
                  namePath={["optionsMenu", "controlsTab", "main", "allowFigureMoveByMouse"]}
                  canInteract={canInteract}
                  value={inputOptions.allowFigureMoveByMouse}
                  onChange={(value) => {
                    inputOptions.allowFigureMoveByMouse = value;
                  }}
                />
              </div>
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
              <div className="control-scheme-controls">
                {/* <div className="row">
                  <Button
                    gameStore={gameStore}
                    className="controls-check-overlap-btn"
                    navLayerID={layerID}
                    navElemID={`${viewID}-${tabID}-controlCheckOverlapBtn`}
                    namePath={["optionsMenu", "controlsTab", "controlScheme", "checkOverlapsBtnTitle"]}
                    canInteract={canInteract}
                    onClick={() => {
                      gameStore.checkControlsOverlap();
                    }}
                  />
                </div> */}
                <div className="row">
                  <Select
                    gameStore={gameStore}
                    className="control-scheme-select"
                    navLayerID={layerID}
                    navElemID={`${viewID}-${tabID}-controlSchemeSelect`}
                    canInteract={canInteract}
                    defOptionName={getLangStringConverted({
                      lang,
                      pathArray: ["optionsMenu", "controlsTab", "controlScheme", "none"],
                    })}
                    options={controlSchemes}
                    value={selectedControlSchemeID}
                    onChange={(value) => {
                      this.setState({ selectedControlSchemeID: value });
                    }}
                    navIsHorizontal={true}
                    navGroupID={`controls-controlSchemeControls`}
                  />
                  <Button
                    gameStore={gameStore}
                    className="control-scheme-add-btn"
                    navLayerID={layerID}
                    navElemID={`${viewID}-${tabID}-controlSchemeAddBtn`}
                    namePath={["optionsMenu", "controlsTab", "controlScheme", "addBtnTitle"]}
                    canInteract={canInteract}
                    onClick={() => {
                      const id = inputStore.addControlScheme();
                      this.setState({ selectedControlSchemeID: id });
                    }}
                    navIsHorizontal={true}
                    navGroupID={`controls-controlSchemeControls`}
                  />
                  <Button
                    gameStore={gameStore}
                    className="control-scheme-remove-btn"
                    navLayerID={layerID}
                    navElemID={`${viewID}-${tabID}-controlSchemeRemoveBtn`}
                    namePath={["optionsMenu", "controlsTab", "controlScheme", "removeBtnTitle"]}
                    canInteract={canInteract}
                    disabled={!selectedControlScheme || selectedControlScheme.isDefault}
                    onClick={() => {
                      if (!selectedControlSchemeID) return;

                      const removedIndex = inputStore.removeControlScheme({ id: selectedControlSchemeID });
                      const { controlSchemes } = inputStore.observables;
                      if (controlSchemes.length) {
                        if (controlSchemes[removedIndex]) {
                          this.setState({ selectedControlSchemeID: controlSchemes[removedIndex].id });
                        } else {
                          this.setState({
                            selectedControlSchemeID: controlSchemes[controlSchemes.length - 1].id,
                          });
                        }
                      } else {
                        this.setState({ selectedControlSchemeID: 0 });
                      }
                    }}
                    navIsHorizontal={true}
                    navGroupID={`controls-controlSchemeControls`}
                  />
                  <Button
                    gameStore={gameStore}
                    className="control-scheme-reset-btn"
                    navLayerID={layerID}
                    navElemID={`${viewID}-${tabID}-controlSchemeResetBtn`}
                    namePath={["optionsMenu", "controlsTab", "controlScheme", "resetBtnTitle"]}
                    canInteract={canInteract}
                    disabled={!selectedControlScheme || !selectedControlScheme.isDefault}
                    onClick={() => {
                      if (!selectedControlSchemeID) return;
                      inputStore.resetControlScheme({ id: selectedControlSchemeID });
                    }}
                    navIsHorizontal={true}
                    navGroupID={`controls-controlSchemeControls`}
                  />
                </div>
                <div className="row">
                  <Checkbox
                    gameStore={gameStore}
                    className="control-scheme-active-checkbox"
                    navLayerID={layerID}
                    navElemID={`${viewID}-${tabID}-controlSchemeActiveCheckbox`}
                    namePath={["optionsMenu", "controlsTab", "controlScheme", "activeToggleTitle"]}
                    canInteract={canInteract}
                    disabled={!selectedControlScheme}
                    value={selectedControlScheme ? selectedControlScheme.isActive : false}
                    onChange={(value) => {
                      inputStore.setActiveControlScheme({
                        id: selectedControlSchemeID,
                        state: value,
                      });
                    }}
                  />
                </div>
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
            </div>
          </div>
        </div>
      );
    }
  }
);
