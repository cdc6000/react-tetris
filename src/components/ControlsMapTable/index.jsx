import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import InputTip from "@components/common/InputTip";
import Button from "@components/common/Button";
import NavigationPoint from "@components/common/NavigationPoint";

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
          namePath: ["optionsMenu", "controlsTab", "controlScheme", "groupAnyMenuTitle"],
          actions: [
            controlEvent.menuNavUp,
            controlEvent.menuNavDown,
            controlEvent.menuNavLeft,
            controlEvent.menuNavRight,
            controlEvent.menuNavSelect,
            controlEvent.menuNavBack,
          ],
        },
        {
          namePath: ["optionsMenu", "controlsTab", "controlScheme", "groupFigureControlTitle"],
          actions: [
            controlEvent.moveCurrentFigureRight,
            controlEvent.moveCurrentFigureLeft,
            controlEvent.rotateCurrentFigureClockwise,
            controlEvent.rotateCurrentFigureCounterclockwise,
            controlEvent.speedUpFallingCurrentFigure,
            controlEvent.dropCurrentFigure,
            controlEvent.holdCurrentFigure,
          ],
        },
        {
          namePath: ["optionsMenu", "controlsTab", "controlScheme", "groupGameplayTitle"],
          actions: [controlEvent.gamePause, controlEvent.gameUnpause, controlEvent.gamePauseToggle],
        },
        {
          namePath: ["optionsMenu", "controlsTab", "controlScheme", "groupMiscTitle"],
          actions: [controlEvent.helpMenuToggle],
        },
      ];

      this.forceUpdateAsync = reactHelpers.forceUpdateAsync.bind(this);
      this.setStateAsync = reactHelpers.setStateAsync.bind(this);
    }

    //

    render() {
      const { controlEventGroupsList } = this;
      const {
        gameStore,
        viewID,
        layerID,
        inputMapAllowed,
        disabled,
        hasFocus,
        controlScheme,
        showAllActiveTriggers,
        hideEmpty,
      } = this.props;
      const { inputStore } = gameStore;
      const { controlSchemes: allControlSchemes } = inputStore.observables;
      const { lang } = gameStore.observables;
      const { getLangStringConverted } = constants.lang;

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

                  const actionBinds = controlScheme?.binds.filter((_) => _.action == action);
                  const _bind = actionBinds?.[0];
                  const _trigger1 = _bind?.triggers[0];
                  const _trigger2 = _bind?.triggers[1];
                  const actionRender = (
                    <tr key={aIndex}>
                      <td>
                        {getLangStringConverted({ lang, pathArray: ["controlEventName", action] })}
                        {!inputMapAllowed && (
                          <NavigationPoint
                            gameStore={gameStore}
                            canInteract={hasFocus}
                            navLayerID={layerID}
                            navElemID={`${viewID}-navPoint-${gIndex}-${aIndex}`}
                          />
                        )}
                      </td>
                      <td>
                        <div className="cell-content">
                          {Boolean(controlScheme) && (
                            <Fragment>
                              {!inputMapAllowed &&
                                actionBinds.map((bind) => {
                                  return bind.triggers.map((trigger) => {
                                    hasGroupTriggers = true;
                                    hasActionTriggers = true;
                                    return (
                                      <div
                                        key={trigger}
                                        className="key-bind"
                                      >
                                        <InputTip
                                          gameStore={gameStore}
                                          inputEvent={trigger}
                                        />
                                      </div>
                                    );
                                  });
                                })}
                              {Boolean(inputMapAllowed) && (
                                <div className="key-bind">
                                  <Button
                                    gameStore={gameStore}
                                    className="bind-btn"
                                    navLayerID={layerID}
                                    navElemID={`${viewID}-bindTrigger1Btn-${gIndex}-${aIndex}`}
                                    navIsHorizontal={true}
                                    navGroupID={`${gIndex}-${aIndex}-triggers`}
                                    navGroupSave={false}
                                    canInteract={hasFocus}
                                    onClick={() => {
                                      gameStore.bindInput({ controlScheme, action, triggerReplace: _trigger1 });
                                    }}
                                  >
                                    {Boolean(_trigger1) && (
                                      <InputTip
                                        gameStore={gameStore}
                                        inputEvent={_trigger1}
                                      />
                                    )}
                                  </Button>
                                  <Button
                                    gameStore={gameStore}
                                    className="bind-btn"
                                    navLayerID={layerID}
                                    navElemID={`${viewID}-bindTrigger2Btn-${gIndex}-${aIndex}`}
                                    navIsHorizontal={true}
                                    navGroupID={`${gIndex}-${aIndex}-triggers`}
                                    navGroupSave={false}
                                    canInteract={hasFocus}
                                    onClick={() => {
                                      gameStore.bindInput({ controlScheme, action, triggerReplace: _trigger2 });
                                    }}
                                  >
                                    {Boolean(_trigger2) && (
                                      <InputTip
                                        gameStore={gameStore}
                                        inputEvent={_trigger2}
                                      />
                                    )}
                                  </Button>
                                  <Button
                                    gameStore={gameStore}
                                    className="remove-btn"
                                    navLayerID={layerID}
                                    navElemID={`${viewID}-removeBtn-${gIndex}-${aIndex}`}
                                    navIsHorizontal={true}
                                    navGroupID={`${gIndex}-${aIndex}-triggers`}
                                    navGroupSave={false}
                                    canInteract={hasFocus}
                                    disabled={!(_trigger1 || _trigger2)}
                                    onClick={() => {
                                      inputStore.removeControlSchemeBind({
                                        id: controlScheme.id,
                                        action,
                                        triggers: [_trigger1, _trigger2].filter(Boolean),
                                      });
                                    }}
                                  >
                                    <span>&#x1F7AA;</span>
                                  </Button>
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
                                            <InputTip
                                              gameStore={gameStore}
                                              inputEvent={trigger}
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
                          {getLangStringConverted({ lang, pathArray: group.namePath })}
                        </div>
                      </td>
                    </tr>
                    {actionsRender}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }
  }
);
