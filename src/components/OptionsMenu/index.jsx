import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import KeyboardKey from "@components/common/KeyboardKey";
import ControlsMapTable from "@components/ControlsMapTable";

import * as reactHelpers from "@utils/react-helpers";
import * as eventHelpers from "@utils/event-helpers";

import * as constants from "@constants/index";

export default observer(
  class OptionsMenu extends Component {
    constructor(props) {
      super(props);

      const { gameStore } = this.props;
      const { inputStore } = gameStore;
      const { controlSchemes } = inputStore.observables;

      this.mainTabID = {
        controls: "controls",
        test: "test",
      };
      this.mainTabList = [
        {
          id: this.mainTabID.test,
          nameStringPath: ["optionsMenu", "testTab", "tabBtnTitle"],
        },
        {
          id: this.mainTabID.controls,
          nameStringPath: ["optionsMenu", "controlsTab", "tabBtnTitle"],
        },
      ];

      this.state = {
        selectedMainTabID: this.mainTabList[1].id,

        selectedControlSchemeID: controlSchemes[0]?.id || 0,
      };

      this.viewID = constants.viewData.view.optionsMenu;

      this.forceUpdateAsync = reactHelpers.forceUpdateAsync.bind(this);
      this.setStateAsync = reactHelpers.setStateAsync.bind(this);
    }

    //

    onTabSelect = ({ tab }) => {
      const { mainTabID } = this;
      const { gameStore } = this.props;
      const { inputStore } = gameStore;
      const { controlSchemes } = inputStore.observables;

      const selectedMainTabID = tab.id;
      this.setState({ selectedMainTabID });

      if (selectedMainTabID == mainTabID.controls) {
        if (!this.state.selectedControlSchemeID && controlSchemes.length) {
          this.setState({ selectedControlSchemeID: controlSchemes[0].id });
        }
      }
    };

    //

    render() {
      const { mainTabID, mainTabList, viewID } = this;
      const { selectedMainTabID, selectedControlSchemeID } = this.state;
      const { gameStore } = this.props;
      const { inputStore, viewStore } = gameStore;
      const { inputOptions, controlSchemes, controlSchemesMaxCount } = inputStore.observables;
      const { viewData } = viewStore.observables;
      const { lang } = gameStore.observables;
      const { getLangString } = constants.lang;

      const { show } = viewData.viewState[viewID];

      const selectedControlScheme =
        (selectedControlSchemeID && controlSchemes.find((_) => _.id == selectedControlSchemeID)) || false;

      return (
        <div className={`options-menu${!show ? " h" : ""}`}>
          <div className="content-wrapper">
            <div className="title">{getLangString({ lang, pathArray: ["optionsMenu", "menuTitle"] }).string}</div>
            <div className="content">
              <div className="tab-btns-container">
                {mainTabList.map((tab) => {
                  const isSelected = tab.id == selectedMainTabID;
                  return (
                    <button
                      key={tab.id}
                      className={`tab-btn ${tab.id}${isSelected ? " sel" : ""}`}
                      onClick={(ev) => {
                        if (viewStore.inputFocusLayerID != constants.viewData.layer.optionsMenu) return;
                        this.onTabSelect({ tab });
                      }}
                    >
                      {getLangString({ lang, pathArray: tab.nameStringPath }).string}
                    </button>
                  );
                })}
              </div>

              <div className="options-list-container">
                <div className={`options-list test${selectedMainTabID != mainTabID.test ? " h" : ""}`}>
                  <label>
                    <input type="checkbox" />
                    {getLangString({ lang, pathArray: ["optionsMenu", "testTab", "testSettingTitle"] }).string}
                  </label>
                </div>
                <div className={`options-list controls${selectedMainTabID != mainTabID.controls ? " h" : ""}`}>
                  <div className="section">
                    <div className="header">
                      <div className="text">
                        {
                          getLangString({ lang, pathArray: ["optionsMenu", "controlsTab", "main", "sectionTitle"] })
                            .string
                        }
                      </div>
                    </div>
                    <div className="content">
                      <div className="row">
                        <label>
                          <input
                            type="checkbox"
                            checked={inputOptions.allowFigureMoveByMouse}
                            onChange={(ev) => {
                              inputOptions.allowFigureMoveByMouse = Boolean(ev.target.checked);
                            }}
                          />
                          {
                            getLangString({
                              lang,
                              pathArray: ["optionsMenu", "controlsTab", "main", "allowFigureMoveByMouse"],
                            }).string
                          }
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="section">
                    <div className="header">
                      <div className="text">
                        {
                          getLangString({
                            lang,
                            pathArray: ["optionsMenu", "controlsTab", "controlScheme", "sectionTitle"],
                          }).string
                        }
                      </div>
                    </div>
                    <div className="content">
                      <div className="control-scheme-controls">
                        <div className="row">
                          <select
                            className="control-scheme-select"
                            value={selectedControlSchemeID}
                            onChange={(ev) => {
                              if (viewStore.inputFocusLayerID != constants.viewData.layer.optionsMenu) return;
                              this.setState({ selectedControlSchemeID: ev.target.value });
                            }}
                          >
                            <option
                              value={0}
                              disabled={true}
                              hidden={true}
                            >
                              {
                                getLangString({
                                  lang,
                                  pathArray: ["optionsMenu", "controlsTab", "controlScheme", "none"],
                                }).string
                              }
                            </option>
                            {controlSchemes.map((item) => {
                              return (
                                <option
                                  key={item.id}
                                  value={item.id}
                                >
                                  {item.name || getLangString({ lang, pathArray: item.nameStringPath }).string}
                                </option>
                              );
                            })}
                          </select>
                          <button
                            className="control-scheme-add-btn"
                            disabled={controlSchemes.length >= controlSchemesMaxCount}
                            onClick={(ev) => {
                              if (viewStore.inputFocusLayerID != constants.viewData.layer.optionsMenu) return;
                              const id = inputStore.addControlScheme();
                              this.setState({ selectedControlSchemeID: id });
                            }}
                          >
                            {
                              getLangString({
                                lang,
                                pathArray: ["optionsMenu", "controlsTab", "controlScheme", "addBtnTitle"],
                              }).string
                            }
                          </button>
                          <button
                            className="control-scheme-remove-btn"
                            disabled={!selectedControlScheme || selectedControlScheme.isDefault}
                            onClick={(ev) => {
                              if (viewStore.inputFocusLayerID != constants.viewData.layer.optionsMenu) return;
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
                          >
                            {
                              getLangString({
                                lang,
                                pathArray: ["optionsMenu", "controlsTab", "controlScheme", "removeBtnTitle"],
                              }).string
                            }
                          </button>
                          <button
                            className="control-scheme-reset-btn"
                            disabled={!selectedControlScheme || !selectedControlScheme.isDefault}
                            onClick={(ev) => {
                              if (viewStore.inputFocusLayerID != constants.viewData.layer.optionsMenu) return;
                              if (!selectedControlSchemeID) return;

                              inputStore.resetControlScheme({ id: selectedControlSchemeID });
                            }}
                          >
                            {
                              getLangString({
                                lang,
                                pathArray: ["optionsMenu", "controlsTab", "controlScheme", "resetBtnTitle"],
                              }).string
                            }
                          </button>
                        </div>
                        <div className="row">
                          <label disabled={!selectedControlScheme}>
                            <input
                              type="checkbox"
                              checked={selectedControlScheme ? selectedControlScheme.isActive : false}
                              onChange={(ev) => {
                                inputStore.setActiveControlScheme({
                                  id: selectedControlSchemeID,
                                  state: Boolean(ev.target.checked),
                                });
                              }}
                            />
                            {
                              getLangString({
                                lang,
                                pathArray: ["optionsMenu", "controlsTab", "controlScheme", "activeToggleTitle"],
                              }).string
                            }
                          </label>
                        </div>
                      </div>

                      <ControlsMapTable
                        gameStore={gameStore}
                        controlScheme={selectedControlScheme}
                        disabled={!selectedControlScheme}
                        hasFocus={viewStore.inputFocusLayerID == constants.viewData.layer.optionsMenu}
                        inputMapAllowed={true}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="control-btns-container">
                <button
                  className="back-btn"
                  onClick={(ev) => {
                    if (viewStore.inputFocusLayerID != constants.viewData.layer.optionsMenu) return;
                    viewStore.shiftInputFocusToLayerID({
                      layerID: constants.viewData.layer.optionsMenu,
                      isPrevious: true,
                    });
                  }}
                >
                  {getLangString({ lang, pathArray: ["optionsMenu", "backBtnTitle"] }).string}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
);
