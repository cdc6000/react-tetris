import React, { Children, Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import Button from "@components/common/Button";
import Checkbox from "@components/common/Checkbox";
import NumberInput from "@components/common/NumberInput";

import * as reactHelpers from "@utils/react-helpers";
import * as eventHelpers from "@utils/event-helpers";
import * as customHelpers from "@utils/custom-helpers";

import * as constants from "@constants/index";

export default observer(
  class GameOptionsMenu extends Component {
    constructor(props) {
      super(props);

      this.viewID = constants.viewData.view.gameOptionsMenu;
      this.layerID = constants.viewData.layer.gameOptionsMenu;

      this.sections = [
        {
          namePath: ["gameOptionsMenu", "gameMode", "sectionTitle"],
          settings: [
            {
              namePath: ["gameOptionsMenu", "gameMode", "enableHold"],
              component: Checkbox,
              getProps: () => {
                const { viewID } = this;
                const { gameStore } = this.props;
                const { gameOptions } = gameStore.observables;

                return {
                  className: "enable-hold-checkbox",
                  navElemID: `${viewID}-enableHoldCheckbox`,
                  value: gameOptions.enableHold,
                  onChange: (value) => {
                    gameOptions.enableHold = value;
                  },
                  children: <Fragment>&#x2714;</Fragment>,
                };
              },
            },
            {
              namePath: ["gameOptionsMenu", "gameMode", "cupWidth"],
              component: NumberInput,
              getProps: () => {
                const { viewID } = this;
                const { gameStore } = this.props;
                const { cellsMaxSize } = gameStore;
                const { gameData } = gameStore.observables;
                const { gameData: defaultGameData } = gameStore.defaults.observables;

                return {
                  className: "cup-width-input",
                  navElemID: `${viewID}-cupWidthInput`,
                  navGroupID: `cupWidthInput`,
                  value: gameData.cup.width,
                  valueDefault: defaultGameData.cup.width,
                  valueMin: cellsMaxSize.width + 1,
                  valueMax: 20,
                  step: 1,
                  onChange: (value) => {
                    gameData.cup.width = value;
                    const freeCells = value - cellsMaxSize.width;
                    let startX = 0;
                    if (freeCells > 0) {
                      startX = Math.ceil(freeCells / 2) + (freeCells % 2 > 0 ? 0 : 1);
                    }
                    gameData.cup.figureStart.x = startX;
                    gameStore.cupRectUpdate();
                  },
                };
              },
            },
            {
              namePath: ["gameOptionsMenu", "gameMode", "cupHeight"],
              component: NumberInput,
              getProps: () => {
                const { viewID } = this;
                const { gameStore } = this.props;
                const { gameData } = gameStore.observables;
                const { gameData: defaultGameData } = gameStore.defaults.observables;

                return {
                  className: "cup-height-input",
                  navElemID: `${viewID}-cupHeightInput`,
                  navGroupID: `cupHeightInput`,
                  value: gameData.cup.height,
                  valueDefault: defaultGameData.cup.height,
                  valueMin: 10,
                  valueMax: 30,
                  step: 1,
                  onChange: (value) => {
                    gameData.cup.height = value;
                    gameStore.cupRectUpdate();
                  },
                };
              },
            },
          ],
        },
        {
          namePath: ["gameOptionsMenu", "gamePlay", "sectionTitle"],
          settings: [
            {
              namePath: ["gameOptionsMenu", "gamePlay", "enableNonBlockingMoveDown"],
              component: Checkbox,
              getProps: () => {
                const { viewID } = this;
                const { gameStore } = this.props;
                const { gameOptions } = gameStore.observables;

                return {
                  className: "enable-nonblocking-move-checkbox",
                  navElemID: `${viewID}-enableNonBlockingMoveDown`,
                  value: gameOptions.enableNonBlockingMoveDown,
                  onChange: (value) => {
                    gameOptions.enableNonBlockingMoveDown = value;
                  },
                  children: <Fragment>&#x2714;</Fragment>,
                };
              },
            },
            {
              namePath: ["gameOptionsMenu", "gamePlay", "enableNonBlockingSoftDrop"],
              component: Checkbox,
              getProps: () => {
                const { viewID } = this;
                const { gameStore } = this.props;
                const { gameOptions } = gameStore.observables;

                return {
                  className: "enable-nonblocking-softdrop-checkbox",
                  navElemID: `${viewID}-enableNonBlockingSoftDrop`,
                  value: gameOptions.enableNonBlockingSoftDrop,
                  onChange: (value) => {
                    gameOptions.enableNonBlockingSoftDrop = value;
                  },
                  children: <Fragment>&#x2714;</Fragment>,
                };
              },
            },
            {
              namePath: ["gameOptionsMenu", "gamePlay", "enableNonBlockingHardDrop"],
              component: Checkbox,
              getProps: () => {
                const { viewID } = this;
                const { gameStore } = this.props;
                const { gameOptions } = gameStore.observables;

                return {
                  className: "enable-nonblocking-harddrop-checkbox",
                  navElemID: `${viewID}-enableNonBlockingHardDrop`,
                  value: gameOptions.enableNonBlockingHardDrop,
                  onChange: (value) => {
                    gameOptions.enableNonBlockingHardDrop = value;
                  },
                  children: <Fragment>&#x2714;</Fragment>,
                };
              },
            },
            {
              namePath: ["gameOptionsMenu", "gamePlay", "figureLockDelay"],
              component: NumberInput,
              getProps: () => {
                const { viewID } = this;
                const { gameStore } = this.props;
                const { gameOptions } = gameStore.observables;
                const { gameOptions: defaultGameOptions } = gameStore.defaults.observables;

                return {
                  className: "figure-lock-delay-input",
                  navElemID: `${viewID}-figureLockDelayInput`,
                  navGroupID: `figureLockDelayInput`,
                  value: gameOptions.figureLockDelay,
                  valueDefault: defaultGameOptions.figureLockDelay,
                  valueMin: 10,
                  valueMax: 1000,
                  step: 10,
                  onChange: (value) => {
                    gameOptions.figureLockDelay = value;
                  },
                };
              },
            },
            {
              namePath: ["gameOptionsMenu", "gamePlay", "enableInfiniteRotation"],
              component: Checkbox,
              getProps: () => {
                const { viewID } = this;
                const { gameStore } = this.props;
                const { gameOptions } = gameStore.observables;

                return {
                  className: "enable-infinite-rotation-checkbox",
                  navElemID: `${viewID}-enableInfiniteRotation`,
                  value: gameOptions.enableInfiniteRotation,
                  onChange: (value) => {
                    gameOptions.enableInfiniteRotation = value;
                  },
                  children: <Fragment>&#x2714;</Fragment>,
                };
              },
            },
            {
              namePath: ["gameOptionsMenu", "gamePlay", "enableInfiniteMove"],
              component: Checkbox,
              getProps: () => {
                const { viewID } = this;
                const { gameStore } = this.props;
                const { gameOptions } = gameStore.observables;

                return {
                  className: "enable-infinite-move-checkbox",
                  navElemID: `${viewID}-enableInfiniteMove`,
                  value: gameOptions.enableInfiniteMove,
                  onChange: (value) => {
                    gameOptions.enableInfiniteMove = value;
                  },
                  children: <Fragment>&#x2714;</Fragment>,
                };
              },
            },
          ],
        },
      ];

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
      const { sections, viewID, layerID, canInteract } = this;
      const { gameStore } = this.props;
      const { viewStore } = gameStore;
      const { viewData } = viewStore.observables;
      const { lang, gameOptions } = gameStore.observables;
      const { gameOptions: defaultGameOptions } = gameStore.defaults.observables;
      const { getLangStringConverted } = constants.lang;

      const { show } = viewData.viewState[viewID];

      return (
        <div className={`game-options-menu${!show ? " h" : ""}`}>
          <div className="content-wrapper">
            <div className="title">{getLangStringConverted({ lang, pathArray: ["gameOptionsMenu", "menuTitle"] })}</div>
            <div className="content">
              <div className="settings-container-wrapper">
                {sections.map((section, scIndex) => {
                  return (
                    <div
                      key={scIndex}
                      className="section"
                    >
                      <div className="header">
                        <div className="text">{getLangStringConverted({ lang, pathArray: section.namePath })}</div>
                      </div>
                      <div className="content">
                        <table className="settings-table">
                          <tbody>
                            {section.settings.map((setting, stIndex) => {
                              const Component = setting.component;
                              return (
                                <tr key={stIndex}>
                                  <td>
                                    <div className="setting-name">
                                      {getLangStringConverted({
                                        lang,
                                        pathArray: setting.namePath,
                                      })}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="setting-controls">
                                      <Component
                                        gameStore={gameStore}
                                        navLayerID={layerID}
                                        canInteract={canInteract}
                                        {...setting.getProps()}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
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
                  navIsHorizontal={true}
                  navGroupID={`${viewID}-controlBtns`}
                  onClick={() => {
                    viewStore.shiftInputFocusToViewLayerID({ layerID, isPrevious: true });
                  }}
                >
                  {getLangStringConverted({
                    lang,
                    pathArray: ["gameOptionsMenu", "backBtnTitle"],
                    conversionList: [
                      customHelpers.insertBtnConversion({
                        gameStore,
                        actions: [constants.controls.controlEvent.menuNavBack],
                        isCompact: true,
                      }),
                    ],
                  })}
                </Button>

                <Button
                  gameStore={gameStore}
                  className="start-game-btn"
                  namePath={["gameOptionsMenu", "startGameBtnTitle"]}
                  navLayerID={layerID}
                  navElemID={`${viewID}-startGameBtn`}
                  canInteract={canInteract}
                  navIsHorizontal={true}
                  navGroupID={`${viewID}-controlBtns`}
                  onClick={() => {
                    gameStore.gameStart();
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
