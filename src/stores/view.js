import {
  makeObservable,
  observable,
  computed,
  action,
  flow,
  autorun,
  runInAction,
  toJS,
  set,
  reaction,
  isAction,
} from "mobx";

import * as constants from "@constants/index";

import EventBus from "@utils/event-bus";
import * as objectHelpers from "@utils/object-helpers";
import * as eventHelpers from "@utils/event-helpers";

class Storage {
  constructor(props) {
    this.props = props;

    this.observables = {
      viewData: {
        viewState: {},
        viewLayers: {},
        viewLayerList: [],
        inputFocusLayerIDs: [],
      },
    };
    this.nonObservables = {
      evenBusID: "ViewStore",
    };

    makeObservable(this, {
      // observable
      observables: observable,

      // action
      viewStateInit: action,
      viewLayerEnable: action,
      viewLayerDisable: action,
      shiftInputFocusToLayerID: action,

      // computed
      inputFocusLayerID: computed,
    });

    this.viewStateInit();

    this.defaults = {
      observables: objectHelpers.deepCopy(this.observables),
      nonObservables: objectHelpers.deepCopy(this.nonObservables),
    };
  }

  viewStateInit = () => {
    const { viewData } = this.observables;

    // views
    viewData.viewState[constants.viewData.view.mainMenu] = {
      canBeShown: true,
      show: false,
    };
    viewData.viewState[constants.viewData.view.optionsMenu] = {
      canBeShown: true,
      show: false,
    };
    viewData.viewState[`${constants.viewData.view.gamePlayView}-${constants.gameMode.classic}`] = {
      canBeShown: true,
      show: false,
    };
    viewData.viewState[constants.viewData.view.pauseMenu] = {
      canBeShown: true,
      show: false,
    };
    viewData.viewState[constants.viewData.view.gameOverMenu] = {
      canBeShown: true,
      show: false,
    };

    // layers
    let layerID = constants.viewData.layer.mainMenu;
    viewData.viewLayers[layerID] = {
      views: [
        {
          id: constants.viewData.view.mainMenu,
          enableProps: {
            show: true,
          },
          disableProps: {
            show: false,
          },
        },
      ],
    };
    viewData.viewLayerList.push(layerID);

    layerID = constants.viewData.layer.optionsMenu;
    viewData.viewLayers[layerID] = {
      views: [
        {
          id: constants.viewData.view.optionsMenu,
          enableProps: {
            show: true,
          },
          disableProps: {
            show: false,
          },
        },
      ],
    };
    viewData.viewLayerList.push(layerID);

    layerID = `${constants.viewData.layer.gamePlayView}-${constants.gameMode.classic}`;
    viewData.viewLayers[layerID] = {
      views: [
        {
          id: `${constants.viewData.view.gamePlayView}-${constants.gameMode.classic}`,
          enableProps: {
            show: true,
          },
          disableProps: {
            show: false,
          },
        },
      ],
    };
    viewData.viewLayerList.push(layerID);

    layerID = constants.viewData.layer.pauseMenu;
    viewData.viewLayers[layerID] = {
      views: [
        {
          id: constants.viewData.view.pauseMenu,
          enableProps: {
            show: true,
          },
          disableProps: {
            show: false,
          },
        },
      ],
    };
    viewData.viewLayerList.push(layerID);

    layerID = constants.viewData.layer.gameOverMenu;
    viewData.viewLayers[layerID] = {
      views: [
        {
          id: constants.viewData.view.gameOverMenu,
          enableProps: {
            show: true,
          },
          disableProps: {
            show: false,
          },
        },
      ],
    };
    viewData.viewLayerList.push(layerID);
  };

  viewLayerEnable = ({ layerID, isAdditive = false, transferFocus = true } = {}) => {
    if (!layerID || layerID == constants.viewData.layer.none) return;
    const { viewData } = this.observables;

    if (!isAdditive) {
      viewData.viewLayerList.forEach((_layerID) => {
        if (_layerID == layerID) return;
        this.viewLayerDisable({ layerID: _layerID });
      });
    }

    const layerData = viewData.viewLayers[layerID];
    layerData.views.forEach((view) => {
      const viewState = viewData.viewState[view.id];
      Object.entries(view.enableProps).forEach(([key, data]) => {
        let isAllowed = true;
        if (key == "show" && data == true && !viewState.canBeShown) {
          isAllowed = false;
        }

        if (isAllowed) {
          viewState[key] = data;
        }
      });
    });

    if (transferFocus) {
      if (!isAdditive) {
        for (let i = viewData.inputFocusLayerIDs.length - 1; i >= 0; i--) {
          viewData.inputFocusLayerIDs.pop();
        }
      }
      viewData.inputFocusLayerIDs.push(layerID);
    }
  };

  viewLayerDisable = ({ layerID } = {}) => {
    const { viewData } = this.observables;
    if (layerID == undefined) {
      layerID = viewData.inputFocusLayerIDs.pop();
    }

    const layerData = viewData.viewLayers[layerID];
    layerData.views.forEach((view) => {
      const viewState = viewData.viewState[view.id];
      Object.entries(view.disableProps).forEach(([key, data]) => {
        let isAllowed = true;

        if (isAllowed) {
          viewState[key] = data;
        }
      });
    });
  };

  get inputFocusLayerID() {
    const { inputFocusLayerIDs } = this.observables.viewData;
    return inputFocusLayerIDs.length ?
        inputFocusLayerIDs[inputFocusLayerIDs.length - 1]
      : constants.viewData.layer.none;
  }

  shiftInputFocusToLayerID = ({ layerID, isPrevious = false } = {}) => {
    if (!layerID || layerID == constants.viewData.layer.none) return;
    const { viewData } = this.observables;

    let layerIndex = viewData.inputFocusLayerIDs.findLastIndex((_) => _ == layerID);
    if (layerIndex < 0) return;
    if (!isPrevious) {
      layerIndex++;
    }

    for (let i = viewData.inputFocusLayerIDs.length - 1; i >= layerIndex; i--) {
      this.viewLayerDisable();
    }
  };
}

export default Object.assign(Storage, {});
