import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import KeyboardKey from "@components/common/KeyboardKey";

import * as reactHelpers from "@utils/react-helpers";
import * as eventHelpers from "@utils/event-helpers";

import * as constants from "@constants/index";

export default observer(
  class ControlsMapTable extends Component {
    constructor(props) {
      super(props);

      const { controlEvent } = constants.controls;

      this.controlEventGroupsList = [
        {
          nameStringPath: ["optionsMenu", "controlsTab", "controlScheme", "groupFigureControlTitle"],
          actions: [
            controlEvent.moveCurrentFigureRight,
            controlEvent.moveCurrentFigureLeft,
            controlEvent.rotateCurrentFigureClockwise,
            controlEvent.rotateCurrentFigureCounterclockwise,
            controlEvent.speedUpFallingCurrentFigure,
            controlEvent.dropCurrentFigure,
          ],
        },
        {
          nameStringPath: ["optionsMenu", "controlsTab", "controlScheme", "groupGameplayTitle"],
          actions: [controlEvent.gamePause, controlEvent.gameUnpause, controlEvent.gamePauseToggle],
        },
        {
          nameStringPath: ["optionsMenu", "controlsTab", "controlScheme", "groupMiscTitle"],
          actions: [controlEvent.helpMenuToggle],
        },
      ];

      this.state = {
        getInputBlindShow: false,
        getInputBlindContent: null,
      };

      this.forceUpdateAsync = reactHelpers.forceUpdateAsync.bind(this);
      this.setStateAsync = reactHelpers.setStateAsync.bind(this);
    }

    //

    onBindKey = async ({ action }) => {
      const { gameStore, controlScheme } = this.props;
      const { inputStore } = gameStore;
      const { lang } = gameStore.observables;
      const { getLangString, stringConverter } = constants.lang;

      await this.setStateAsync({
        getInputBlindShow: true,
        getInputBlindContent: (
          <div className="content-wrapper">
            <div className="title">
              {
                getLangString({ lang, pathArray: ["optionsMenu", "controlsTab", "getInputBlind", "awaitingInput"] })
                  .string
              }
            </div>
            <div className="content">
              <div className="row">
                {stringConverter(
                  getLangString({
                    lang,
                    pathArray: ["optionsMenu", "controlsTab", "getInputBlind", "awaitingInputExitTip"],
                  }).string,
                  [
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
                  ]
                )}
              </div>
            </div>
          </div>
        ),
      });

      const { promise, onFinished } = inputStore.getInput();
      const input = await promise;
      if (input) {
        inputStore.addControlSchemeBind({
          id: controlScheme.id,
          action,
          triggers: [input],
        });

        // await this.setStateAsync({
        //   getInputBlindContent: (
        //     <div className="content-wrapper">
        //       <div className="title">
        //         {
        //           getLangString({ lang, pathArray: ["optionsMenu", "controlsTab", "getInputBlind", "inputRegistered"] })
        //             .string
        //         }
        //       </div>
        //       <div className="content">
        //         <KeyboardKey
        //           gameStore={gameStore}
        //           input={input}
        //         />
        //       </div>
        //     </div>
        //   ),
        // });
        // await eventHelpers.sleep(1000);
      }

      await this.setStateAsync({ getInputBlindShow: false, getInputBlindContent: null });
      onFinished();
      this.props.onInputMap?.();
    };

    //

    render() {
      const { controlEventGroupsList } = this;
      const { gameStore, disabled, hasFocus, inputMapAllowed, controlScheme, showAllActiveTriggers, hideEmpty } =
        this.props;
      const { getInputBlindShow, getInputBlindContent } = this.state;
      const { inputStore } = gameStore;
      const { controlSchemes: allControlSchemes } = inputStore.observables;
      const { lang } = gameStore.observables;
      const { getLangString } = constants.lang;

      return (
        <div className="controls-map-wrapper">
          <table
            className="controls-map-table"
            disabled={disabled}
          >
            <tbody>
              {controlEventGroupsList.map((group, gIndex) => {
                let hasGroupTriggers = false;
                const actionsRender = group.actions.map((action, aIndex) => {
                  let hasActionTriggers = false;
                  const actionRender = (
                    <tr key={aIndex}>
                      <td>{getLangString({ lang, pathArray: ["controlEventName", action] }).string}</td>
                      <td>
                        <div className="cell-content">
                          {Boolean(controlScheme) && (
                            <Fragment>
                              {controlScheme.binds
                                .filter((_) => _.action == action)
                                .map((bind) => {
                                  return bind.triggers.map((trigger) => {
                                    hasGroupTriggers = true;
                                    hasActionTriggers = true;
                                    return (
                                      <div
                                        key={trigger}
                                        className="key-bind"
                                      >
                                        <KeyboardKey
                                          gameStore={gameStore}
                                          input={trigger}
                                        />
                                        {Boolean(inputMapAllowed) && (
                                          <button
                                            className="remove-btn"
                                            onClick={(ev) => {
                                              if (!hasFocus) return;
                                              if (this.state.getInputBlindShow) return;
                                              inputStore.removeControlSchemeBind({
                                                id: controlScheme.id,
                                                action,
                                                triggers: [trigger],
                                              });
                                            }}
                                          >
                                            x
                                          </button>
                                        )}
                                      </div>
                                    );
                                  });
                                })}
                              {Boolean(controlScheme) && Boolean(inputMapAllowed) && (
                                <div className="btn-wrapper">
                                  <button
                                    className="add-btn"
                                    onClick={(ev) => {
                                      if (!hasFocus) return;
                                      if (this.state.getInputBlindShow) return;

                                      this.onBindKey({ action });

                                      ev.target.blur();
                                    }}
                                  >
                                    {
                                      getLangString({
                                        lang,
                                        pathArray: ["optionsMenu", "controlsTab", "controlScheme", "mapInputBtnTitle"],
                                      }).string
                                    }
                                  </button>
                                </div>
                              )}
                            </Fragment>
                          )}
                          {!Boolean(controlScheme) && Boolean(showAllActiveTriggers) && (
                            <Fragment>
                              {allControlSchemes.reduce((acc, controlScheme) => {
                                acc.push(
                                  ...controlScheme.binds
                                    .filter((_) => _.action == action)
                                    .map((bind) => {
                                      return bind.triggers.map((trigger) => {
                                        hasGroupTriggers = true;
                                        hasActionTriggers = true;
                                        return (
                                          <div
                                            key={trigger}
                                            className="key-bind"
                                          >
                                            <KeyboardKey
                                              gameStore={gameStore}
                                              input={trigger}
                                            />
                                          </div>
                                        );
                                      });
                                    })
                                );
                                return acc;
                              }, [])}
                            </Fragment>
                          )}
                        </div>
                      </td>
                    </tr>
                  );

                  if (hideEmpty && !hasActionTriggers) return null;
                  return actionRender;
                });

                if (hideEmpty && !hasGroupTriggers) return null;

                return (
                  <Fragment key={gIndex}>
                    <tr className="group-header">
                      <td colSpan={2}>
                        <div className="cell-content">
                          {getLangString({ lang, pathArray: group.nameStringPath }).string}
                        </div>
                      </td>
                    </tr>
                    {actionsRender}
                  </Fragment>
                );
              })}
            </tbody>
          </table>

          <div className={`get-input-blind${!getInputBlindShow ? " h" : ""}`}>{getInputBlindContent}</div>
        </div>
      );
    }
  }
);
