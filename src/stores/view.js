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
        inputFocusViewLayerIDs: [],
      },
    };
    this.nonObservables = {
      evenBusID: "ViewStore",

      optionSelectPromise: undefined,
      optionSelectPromiseResolve: undefined,
    };

    makeObservable(this, {
      // observable
      observables: observable,

      // action
      setViewLayerData: action,
      viewLayerEnable: action,
      viewLayerDisable: action,
      shiftInputFocusToViewLayerID: action,

      // computed
      inputFocusViewLayerID: computed,
    });
  }

  setDefaults = () => {
    this.defaults = {
      observables: objectHelpers.deepCopy(this.observables),
      nonObservables: objectHelpers.deepCopy(this.nonObservables),
    };
  };

  //

  getViewLayerData = (layerID) => {
    return this.observables.viewData.viewLayers[layerID];
  };

  setViewLayerData = ({ layerID, data = {}, override = true }) => {
    if (!layerID || layerID == constants.viewData.layer.none) return false;

    const { mainStore } = this.props;
    const { eventBus } = mainStore;

    const { viewData } = this.observables;
    viewData.viewLayers[layerID] = override ? data : { ...viewData.viewLayers[layerID], ...data };
    if (!viewData.viewLayerList.some((_) => _ == layerID)) {
      viewData.viewLayerList.push(layerID);
    }

    const layerDataCopy = objectHelpers.deepCopy(viewData.viewLayers[layerID]);
    eventBus.fireEvent(constants.eventsData.eventType.viewLayerUpdate, {
      layerID,
      layerData: layerDataCopy,
    });

    return true;
  };

  viewLayerEnable = ({ layerID, isAdditive = false, transferFocus = true }) => {
    if (!layerID || layerID == constants.viewData.layer.none) return;
    const { mainStore } = this.props;
    const { eventBus } = mainStore;
    const { viewData } = this.observables;

    if (!isAdditive) {
      viewData.viewLayerList.forEach((_layerID) => {
        if (_layerID == layerID) return;
        this.viewLayerDisable({ layerID: _layerID, fireEvent: false });
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
    layerData.isEnabled = true;

    if (transferFocus) {
      if (!isAdditive) {
        for (let i = viewData.inputFocusViewLayerIDs.length - 1; i >= 0; i--) {
          viewData.inputFocusViewLayerIDs.pop();
        }
      }
      viewData.inputFocusViewLayerIDs.push(layerID);
    }

    const layerDataCopy = objectHelpers.deepCopy(layerData);
    eventBus.fireEvent(constants.eventsData.eventType.viewLayerUpdate, {
      layerID,
      layerData: layerDataCopy,
    });
  };

  viewLayerDisable = ({ layerID, fireEvent = true, isSafe = true } = {}) => {
    const { mainStore } = this.props;
    const { eventBus } = mainStore;
    const { viewData } = this.observables;

    if (layerID == undefined) {
      if (isSafe && viewData.inputFocusViewLayerIDs.length <= 1) return;
      layerID = viewData.inputFocusViewLayerIDs.pop();
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
    layerData.isEnabled = false;

    if (fireEvent) {
      const layerDataCopy = objectHelpers.deepCopy(layerData);
      eventBus.fireEvent(constants.eventsData.eventType.viewLayerUpdate, {
        layerID,
        layerData: layerDataCopy,
      });
    }
  };

  get inputFocusViewLayerID() {
    const { inputFocusViewLayerIDs } = this.observables.viewData;
    return inputFocusViewLayerIDs.length ?
        inputFocusViewLayerIDs[inputFocusViewLayerIDs.length - 1]
      : constants.viewData.layer.none;
  }

  shiftInputFocusToViewLayerID = ({ layerID, isPrevious = false, isSafe = true }) => {
    if (!layerID || layerID == constants.viewData.layer.none) return;
    const { viewData } = this.observables;

    if (isSafe && viewData.inputFocusViewLayerIDs.length <= 1) return;

    let layerIndex = viewData.inputFocusViewLayerIDs.findLastIndex((_) => _ == layerID);
    if (layerIndex < 0) return;
    if (!isPrevious) {
      layerIndex++;
    }

    for (let i = viewData.inputFocusViewLayerIDs.length - 1; i >= layerIndex; i--) {
      this.viewLayerDisable();
    }
  };

  //

  optionSelectSubscribe = () => {
    const { mainStore } = this.props;
    const { eventBus } = mainStore;
    const { evenBusID, optionSelectPromise } = this.nonObservables;
    if (optionSelectPromise) return optionSelectPromise;

    this.nonObservables.optionSelectPromise = new Promise((resolve) => {
      this.nonObservables.optionSelectPromiseResolve = resolve;

      eventBus.addEventListener(evenBusID, constants.eventsData.eventType.optionSelected, ({ id }) => {
        resolve(id);
      });
    });

    return this.nonObservables.optionSelectPromise;
  };

  optionSelectUnsubscribe = () => {
    const { mainStore } = this.props;
    const { eventBus } = mainStore;
    const { evenBusID, optionSelectPromiseResolve } = this.nonObservables;

    if (!optionSelectPromiseResolve) return;

    optionSelectPromiseResolve(false);
    eventBus.removeEventListener(evenBusID, constants.eventsData.eventType.optionSelected);

    this.nonObservables.optionSelectPromise = undefined;
    this.nonObservables.optionSelectPromiseResolve = undefined;
  };
}

export default Object.assign(Storage, {});
