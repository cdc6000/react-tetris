import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import KeyboardKey from "@components/common/KeyboardKey";

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

      this.controlEventGroupsList = [
        {
          nameStringPath: ["optionsMenu", "controlsTab", "controlScheme", "groupFigureControlTitle"],
          actions: [
            constants.controls.controlEvent.moveCurrentFigureRight,
            constants.controls.controlEvent.moveCurrentFigureLeft,
            constants.controls.controlEvent.rotateCurrentFigureClockwise,
            constants.controls.controlEvent.rotateCurrentFigureCounterclockwise,
            constants.controls.controlEvent.speedUpFallingCurrentFigure,
            constants.controls.controlEvent.dropCurrentFigure,
          ],
        },
        {
          nameStringPath: ["optionsMenu", "controlsTab", "controlScheme", "groupGameplayTitle"],
          actions: [
            constants.controls.controlEvent.gamePause,
            constants.controls.controlEvent.gameUnpause,
            constants.controls.controlEvent.gamePauseToggle,
          ],
        },
      ];

      this.state = {
        selectedMainTabID: this.mainTabList[1].id,

        selectedControlSchemeID: controlSchemes[0]?.id || 0,

        getInputBlindShow: false,
        getInputBlindContent: null,
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

    onBindKey = async ({ action }) => {
      const { selectedControlSchemeID } = this.state;
      const { gameStore } = this.props;
      const { inputStore } = gameStore;
      const { lang } = gameStore.observables;
      const langStrings = constants.lang.strings[lang];

      await this.setStateAsync({
        getInputBlindShow: true,
        getInputBlindContent: (
          <Fragment>
            <div className="row">{langStrings.optionsMenu.controlsTab.getInputBlind.awaitingInput}</div>
            <div className="row">
              {constants.lang.stringConverter(langStrings.optionsMenu.controlsTab.getInputBlind.awaitingInputExitTip, [
                {
                  type: "function",
                  whatIsRegExp: true,
                  what: `\\$\\{keyboardKey\\|([^\\}]+)\\}`,
                  to: (key, matchData) => {
                    return (
                      <KeyboardKey
                        key={key}
                        gameStore={gameStore}
                        input={`input-${constants.controls.inputEvent[matchData[1]]}`}
                      />
                    );
                  },
                },
              ])}
            </div>
          </Fragment>
        ),
      });

      const { promise, onFinished } = inputStore.getInput();
      const input = await promise;
      if (input) {
        inputStore.addControlSchemeBind({
          id: selectedControlSchemeID,
          action,
          triggers: [input],
        });

        // await this.setStateAsync({
        //   getInputBlindContent: (
        //     <Fragment>
        //       <div className="row">{langStrings.optionsMenu.controlsTab.getInputBlind.inputRegistered}</div>
        //       <div className="row">
        //         <KeyboardKey
        //           gameStore={gameStore}
        //           input={input}
        //         />
        //       </div>
        //     </Fragment>
        //   ),
        // });
        // await eventHelpers.sleep(1000);
      }

      await this.setStateAsync({ getInputBlindShow: false, getInputBlindContent: null });
      onFinished();
    };

    //

    render() {
      const { mainTabID, mainTabList, controlEventGroupsList, viewID } = this;
      const { selectedMainTabID, selectedControlSchemeID, getInputBlindShow, getInputBlindContent } = this.state;
      const { gameStore } = this.props;
      const { inputStore, viewStore } = gameStore;
      const { inputOptions, controlSchemes, controlSchemesMaxCount } = inputStore.observables;
      const { viewData } = viewStore.observables;
      const { lang } = gameStore.observables;
      const langStrings = constants.lang.strings[lang];

      const { show } = viewData.viewState[viewID];

      const selectedControlScheme =
        (selectedControlSchemeID && controlSchemes.find((_) => _.id == selectedControlSchemeID)) || false;

      return (
        <div className={`options-menu${!show ? " h" : ""}`}>
          <div className="center-content-wrapper">
            <div className="header">{langStrings.optionsMenu.menuTitle}</div>

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
                    {constants.lang.getString({ lang, pathArray: tab.nameStringPath })}
                  </button>
                );
              })}
            </div>

            <div className="options-list-container">
              <div className={`options-list test${selectedMainTabID != mainTabID.test ? " h" : ""}`}>
                <label>
                  <input type="checkbox" />
                  {langStrings.optionsMenu.testTab.testSettingTitle}
                </label>
              </div>
              <div className={`options-list controls${selectedMainTabID != mainTabID.controls ? " h" : ""}`}>
                <div className="section">
                  <div className="header">
                    <div className="text">{langStrings.optionsMenu.controlsTab.main.sectionTitle}</div>
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
                        {langStrings.optionsMenu.controlsTab.main.allowFigureMoveByMouse}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="section">
                  <div className="header">
                    <div className="text">{langStrings.optionsMenu.controlsTab.controlScheme.sectionTitle}</div>
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
                            {langStrings.optionsMenu.controlsTab.controlScheme.none}
                          </option>
                          {controlSchemes.map((item) => {
                            return (
                              <option
                                key={item.id}
                                value={item.id}
                              >
                                {item.name || constants.lang.getString({ lang, pathArray: item.nameStringPath })}
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
                          {langStrings.optionsMenu.controlsTab.controlScheme.addBtnTitle}
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
                          {langStrings.optionsMenu.controlsTab.controlScheme.removeBtnTitle}
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
                          {langStrings.optionsMenu.controlsTab.controlScheme.resetBtnTitle}
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
                          {langStrings.optionsMenu.controlsTab.controlScheme.activeToggleTitle}
                        </label>
                      </div>
                    </div>

                    <div className="control-scheme-mapping">
                      <table
                        className="mapping-table"
                        disabled={!selectedControlScheme}
                      >
                        <tbody>
                          {controlEventGroupsList.map((group, gIndex) => {
                            return (
                              <Fragment key={gIndex}>
                                <tr className="group-header">
                                  <td colSpan={2}>
                                    <div className="cell-content">
                                      {constants.lang.getString({ lang, pathArray: group.nameStringPath })}
                                    </div>
                                  </td>
                                </tr>

                                {group.actions.map((action, aIndex) => {
                                  return (
                                    <tr key={aIndex}>
                                      <td>{langStrings.controlEventName[action]}</td>
                                      <td>
                                        <div className="cell-content">
                                          {Boolean(selectedControlScheme) && (
                                            <Fragment>
                                              {selectedControlScheme.binds
                                                .filter((_) => _.action == action)
                                                .map((bind) => {
                                                  return bind.triggers.map((trigger) => {
                                                    return (
                                                      <div
                                                        key={trigger}
                                                        className="key-bind"
                                                      >
                                                        <KeyboardKey
                                                          gameStore={gameStore}
                                                          input={trigger}
                                                        />
                                                        <button
                                                          className="remove-btn"
                                                          onClick={(ev) => {
                                                            if (
                                                              viewStore.inputFocusLayerID !=
                                                              constants.viewData.layer.optionsMenu
                                                            )
                                                              return;
                                                            if (this.state.getInputBlindShow) return;
                                                            inputStore.removeControlSchemeBind({
                                                              id: selectedControlSchemeID,
                                                              action,
                                                              triggers: [trigger],
                                                            });
                                                          }}
                                                        >
                                                          x
                                                        </button>
                                                      </div>
                                                    );
                                                  });
                                                })}
                                              <div className="btn-wrapper">
                                                <button
                                                  className="add-btn"
                                                  onClick={(ev) => {
                                                    if (
                                                      viewStore.inputFocusLayerID !=
                                                      constants.viewData.layer.optionsMenu
                                                    )
                                                      return;
                                                    if (this.state.getInputBlindShow) return;

                                                    this.onBindKey({ action });

                                                    ev.target.blur();
                                                  }}
                                                >
                                                  {langStrings.optionsMenu.controlsTab.controlScheme.mapInputBtnTitle}
                                                </button>
                                              </div>
                                            </Fragment>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
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
                {langStrings.optionsMenu.backBtnTitle}
              </button>
            </div>
          </div>

          <div className={`get-input-blind${!getInputBlindShow ? " h" : ""}`}>
            <div className="center-content-wrapper">{getInputBlindContent}</div>
          </div>
        </div>
      );
    }
  }
);
