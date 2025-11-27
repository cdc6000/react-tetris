import React, { Children, Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import Button from "@components/common/Button";
import Checkbox from "@components/common/Checkbox";
import NumberInput from "@components/common/NumberInput";
import Select from "@components/common/Select";

import * as reactHelpers from "@utils/react-helpers";
import * as timeHelpers from "@utils/time-helpers";
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
              namePath: ["gameOptionsMenu", "gameMode", "maxLevels"],
              component: Select,
              getProps: () => {
                const { viewID } = this;
                const { gameStore } = this.props;
                const { lang, gameOptions } = gameStore.observables;
                const { getLangStringConverted } = constants.lang;

                return {
                  className: "max-level-select",
                  navElemID: `${viewID}-maxLevelSelect`,
                  value: gameOptions.maxLevels,
                  title: getLangStringConverted({ lang, pathArray: ["gameOptionsMenu", "gameMode", "maxLevels"] }),
                  options: constants.gameplay.maxLevelList.map((maxLevels) => {
                    let name = maxLevels;
                    if (!maxLevels) {
                      name = getLangStringConverted({
                        lang,
                        pathArray: ["gameOptionsMenu", "gameMode", "maxLevelsZero"],
                      });
                    } else if (maxLevels > 1) {
                      name = `1-${maxLevels}`;
                    }

                    return {
                      id: maxLevels,
                      name,
                    };
                  }),
                  onChange: (value) => {
                    gameOptions.maxLevels = value;
                  },
                };
              },
            },
            {
              namePath: ["gameOptionsMenu", "gameMode", "continueAfterMaxLevel"],
              component: Checkbox,
              getProps: () => {
                const { viewID } = this;
                const { gameStore } = this.props;
                const { gameOptions } = gameStore.observables;

                return {
                  className: "continue-after-max-level-checkbox",
                  navElemID: `${viewID}-continueAfterMaxLevelCheckbox`,
                  value: gameOptions.continueAfterMaxLevel,
                  onChange: (value) => {
                    gameOptions.continueAfterMaxLevel = value;
                  },
                  children: <Fragment>&#x2714;</Fragment>,
                };
              },
            },
            {
              namePath: ["gameOptionsMenu", "gameMode", "timeLimit"],
              component: NumberInput,
              getProps: () => {
                const { viewID } = this;
                const { gameStore } = this.props;
                const { gameOptions } = gameStore.observables;
                const { gameOptions: defaultGameOptions } = gameStore.defaults.observables;

                return {
                  className: "time-limit-input",
                  navElemID: `${viewID}-timeLimitInput`,
                  navGroupID: `timeLimitInput`,
                  value: gameOptions.timeLimit,
                  valueDefault: defaultGameOptions.timeLimit,
                  valueMin: 0,
                  valueMax: 10 * 60 * 1000,
                  step: 60 * 1000,
                  onChange: (value) => {
                    gameOptions.timeLimit = value;
                  },
                  formatter: (value) => {
                    const timeData = timeHelpers.parseTime(value);
                    return `${timeHelpers.pad(timeData.fullMinutes)}:${timeHelpers.pad(timeData.leftoverSeconds)}`;
                  },
                };
              },
            },
            {
              namePath: ["gameOptionsMenu", "gameMode", "linesLimit"],
              component: NumberInput,
              getProps: () => {
                const { viewID } = this;
                const { gameStore } = this.props;
                const { gameOptions } = gameStore.observables;
                const { gameOptions: defaultGameOptions } = gameStore.defaults.observables;

                return {
                  className: "lines-limit-input",
                  navElemID: `${viewID}-linesLimitInput`,
                  navGroupID: `linesLimitInput`,
                  value: gameOptions.linesLimit,
                  valueDefault: defaultGameOptions.linesLimit,
                  valueMin: 0,
                  valueMax: 100,
                  step: 10,
                  onChange: (value) => {
                    gameOptions.linesLimit = value;
                  },
                };
              },
            },
          ],
        },
        {
          namePath: ["gameOptionsMenu", "gameMechanics", "sectionTitle"],
          settings: [
            {
              namePath: ["gameOptionsMenu", "gameMechanics", "enableHold"],
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
              namePath: ["gameOptionsMenu", "gameMechanics", "cellGroupType"],
              component: Select,
              getProps: () => {
                const { viewID } = this;
                const { gameStore } = this.props;
                const { lang, gameOptions } = gameStore.observables;
                const { getLangStringConverted } = constants.lang;

                return {
                  className: "cell-group-type-select",
                  navElemID: `${viewID}-cellGroupTypeSelect`,
                  value: gameOptions.cellGroupType,
                  title: getLangStringConverted({ lang, pathArray: ["gameOptionsMenu", "gameMode", "cellGroupType"] }),
                  options: constants.gameplay.cellGroupTypeList.map((cellGroupTypeID) => {
                    return {
                      id: cellGroupTypeID,
                      name: getLangStringConverted({ lang, pathArray: ["cellGroupType", cellGroupTypeID] }),
                    };
                  }),
                  onChange: (value) => {
                    gameOptions.cellGroupType = value;
                  },
                };
              },
            },
            {
              namePath: ["gameOptionsMenu", "gameMechanics", "groupsFallOnClear"],
              component: Checkbox,
              getProps: () => {
                const { viewID } = this;
                const { gameStore } = this.props;
                const { gameOptions } = gameStore.observables;

                return {
                  className: "groups-fall-on-clear-checkbox",
                  navElemID: `${viewID}-groupsFallOnClearCheckbox`,
                  value: gameOptions.groupsFallOnClear,
                  onChange: (value) => {
                    gameOptions.groupsFallOnClear = value;
                  },
                  children: <Fragment>&#x2714;</Fragment>,
                };
              },
            },
            {
              namePath: ["gameOptionsMenu", "gameMechanics", "groupsConnectWhileFall"],
              component: Checkbox,
              getProps: () => {
                const { viewID } = this;
                const { gameStore } = this.props;
                const { gameOptions } = gameStore.observables;

                return {
                  className: "groups-connect-while-fall-checkbox",
                  navElemID: `${viewID}-groupsConnectWhileFallCheckbox`,
                  value: gameOptions.groupsConnectWhileFall,
                  onChange: (value) => {
                    gameOptions.groupsConnectWhileFall = value;
                  },
                  children: <Fragment>&#x2714;</Fragment>,
                };
              },
            },
            {
              namePath: ["gameOptionsMenu", "gameMechanics", "cellularAutomatonMode"],
              component: Checkbox,
              getProps: () => {
                const { viewID } = this;
                const { gameStore } = this.props;
                const { gameOptions } = gameStore.observables;

                return {
                  className: "game-of-life-mode-checkbox",
                  navElemID: `${viewID}-gameOfLifeModeCheckbox`,
                  value: gameOptions.cellularAutomatonMode,
                  onChange: (value) => {
                    gameOptions.cellularAutomatonMode = value;
                  },
                  children: <Fragment>&#x2714;</Fragment>,
                };
              },
            },
          ],
        },
        {
          namePath: ["gameOptionsMenu", "gameView", "sectionTitle"],
          settings: [
            {
              namePath: ["gameOptionsMenu", "gameView", "cupWidth"],
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
                    gameStore.gameViewDataUpdate();
                  },
                };
              },
            },
            {
              namePath: ["gameOptionsMenu", "gameView", "cupHeight"],
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
                    gameStore.gameViewDataUpdate();
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
      const { getLangStringConverted } = constants.lang;

      const { show } = viewData.viewState[viewID];

      return (
        <div className={`game-options-menu${!show ? " h" : ""}`}>
          <div className="content-wrapper">
            <div className="title">{getLangStringConverted({ lang, pathArray: ["gameOptionsMenu", "menuTitle"] })}</div>
            <div className="content">
              <div className="settings-container-wrapper">
                {customHelpers.settingsSectionsDrawer({
                  sections,
                  gameStore,
                  componentProps: {
                    navLayerID: layerID,
                    canInteract,
                  },
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
