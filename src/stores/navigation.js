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
      navCurrentElemData: {
        elemID: "",
        layerID: "",

        prevElem: {
          elemID: "",
          layerID: "",
        },
      },
      navGroupLastSelectedElemID: {},
      navLayerLastSelectedElemID: {},
    };
    this.nonObservables = {
      evenBusID: "NavigationStore",

      scrollIntoViewLastTimestamp: 0,
    };

    makeObservable(this, {
      // observable
      observables: observable,

      // action
      setCurrentNavElemData: action,
      updateMenuNavElem: action,

      // computed
    });

    this.defaults = {
      observables: objectHelpers.deepCopy(this.observables),
      nonObservables: objectHelpers.deepCopy(this.nonObservables),
    };
  }

  //

  getFirstNavAbleElem = () => {
    return document.querySelector(`[data-nav-able='1']`);
  };

  getAutofocusNavAbleElem = () => {
    return document.querySelector(`[data-nav-able='1'][data-nav-autofocus='1']`);
  };

  getAllNavAbleElems = () => {
    return [...document.querySelectorAll(`[data-nav-able='1']`)];
  };

  getGroupNavAbleElems = (groupID) => {
    return [...document.querySelectorAll(`[data-nav-able='1'][data-nav-group-id='${groupID}']`)];
  };

  getGroupNavAbleElemByID = (groupID, elemID) => {
    return document.querySelector(`[data-nav-able='1'][data-nav-group-id='${groupID}'][data-nav-elem-id='${elemID}']`);
  };

  getLayerNavAbleElems = (layerID) => {
    return [...document.querySelectorAll(`[data-nav-able='1'][data-nav-layer-id='${layerID}']`)];
  };

  getLayerNavAbleElemByID = (layerID, elemID) => {
    return document.querySelector(`[data-nav-able='1'][data-nav-layer-id='${layerID}'][data-nav-elem-id='${elemID}']`);
  };

  //

  getNavElemData = (elem) => {
    if (!elem || !elem.dataset) return {};
    const { navAble, navHor, navElemId, navGroupId, navGroupSave, navLayerId } = elem.dataset;
    return {
      isNavAble: Boolean(+navAble),
      isHorizontal: Boolean(+navHor),
      elemID: navElemId,
      groupID: navGroupId,
      needGroupSave: Boolean(+navGroupSave),
      layerID: navLayerId,
    };
  };

  setCurrentNavElemData = (elem, prevElem) => {
    const { navCurrentElemData, navGroupLastSelectedElemID, navLayerLastSelectedElemID } = this.observables;
    const { elemID, layerID, groupID, needGroupSave } = this.getNavElemData(elem);
    if (!elemID || !layerID) return;

    navCurrentElemData.elemID = elemID;
    navCurrentElemData.layerID = layerID;
    if (prevElem) {
      const { elemID, layerID } = this.getNavElemData(prevElem);
      if (elemID && layerID) {
        navCurrentElemData.prevElem.elemID = elemID;
        navCurrentElemData.prevElem.layerID = layerID;
      }
    }

    navLayerLastSelectedElemID[layerID] = elemID;
    if (groupID && needGroupSave) {
      navGroupLastSelectedElemID[groupID] = elemID;
    }

    this.scrollIntoViewElem(elem);
  };

  menuNavToElemVertical = (elem, prevElem) => {
    const { navGroupLastSelectedElemID } = this.observables;
    const { isHorizontal, groupID } = this.getNavElemData(elem);

    if (isHorizontal && groupID) {
      const navGroupLastSelectedElem = navGroupLastSelectedElemID[groupID];
      if (navGroupLastSelectedElem) {
        const lastSelectedElem = this.getGroupNavAbleElemByID(groupID, navGroupLastSelectedElem);
        if (lastSelectedElem) {
          this.setCurrentNavElemData(lastSelectedElem, prevElem);
          return;
        }
      } else {
        const groupNavAbleElems = this.getGroupNavAbleElems(groupID);
        if (groupNavAbleElems.length) {
          this.setCurrentNavElemData(groupNavAbleElems[0], prevElem);
          return;
        }
      }
    }

    this.setCurrentNavElemData(elem, prevElem);
  };

  getCurrentNavElem = () => {
    const { navCurrentElemData } = this.observables;
    if (!navCurrentElemData.elemID) return false;

    const elem = this.getLayerNavAbleElemByID(navCurrentElemData.layerID, navCurrentElemData.elemID);
    if (!elem) return false;

    return elem;
  };

  getCurrentNavElemIndexData = () => {
    const elem = this.getCurrentNavElem();
    if (!elem) {
      this.updateMenuNavElem();
      return false;
    }

    const navAbleElems = this.getAllNavAbleElems();
    if (!navAbleElems.length) {
      this.updateMenuNavElem();
      return false;
    }

    const index = navAbleElems.findIndex((_) => _ == elem);
    if (index < 0) {
      this.updateMenuNavElem();
      return false;
    }

    return { navAbleElems, elem, index };
  };

  getNavElemIndexData = ({ elem, useLayerLastSelected = true } = {}) => {
    const { navLayerLastSelectedElemID } = this.observables;

    const allNavAbleElems = this.getAllNavAbleElems();
    if (!elem) {
      const autofocusNavAbleElem = this.getAutofocusNavAbleElem();
      if (autofocusNavAbleElem) {
        elem = autofocusNavAbleElem;
      } else {
        elem = allNavAbleElems[0];
      }
    }
    let elemData = this.getNavElemData(elem);
    let index = -1;
    let prevElem;
    let prevElemData;
    let prevElemIndex = -1;

    if (allNavAbleElems.length > 1) {
      if (useLayerLastSelected && elemData.layerID) {
        const navLayerLastSelectedElem = navLayerLastSelectedElemID[elemData.layerID];
        if (navLayerLastSelectedElem) {
          const lastSelectedElem = this.getLayerNavAbleElemByID(elemData.layerID, navLayerLastSelectedElem);
          if (lastSelectedElem) {
            index = allNavAbleElems.findIndex((_) => _ == lastSelectedElem);
            elem = allNavAbleElems[index];
            elemData = this.getNavElemData(elem);
          }
        }
      }

      if (index < 0) {
        index = allNavAbleElems.findIndex((_) => _ == elem);
      }

      if (index >= 0) {
        prevElemIndex = index - 1;
        if (prevElemIndex < 0) {
          prevElemIndex = index + 1;
        }
        if (prevElemIndex < allNavAbleElems.length) {
          prevElem = allNavAbleElems[prevElemIndex];
          prevElemData = this.getNavElemData(prevElem);
        }
      }
    }

    return { allNavAbleElems, elem, elemData, index, prevElem, prevElemData, prevElemIndex };
  };

  scrollIntoViewElem = (elem) => {
    if (!elem) {
      elem = this.getCurrentNavElem();
      if (!elem) return;
    }

    let behavior = "smooth";
    const now = Date.now();
    const { scrollIntoViewLastTimestamp } = this.nonObservables;
    if (now - scrollIntoViewLastTimestamp < 300) {
      behavior = "instant";
    }
    this.nonObservables.scrollIntoViewLastTimestamp = now;

    elem.scrollIntoView({ block: "center", inline: "center", behavior });
  };

  unfocusAnyElem = (elem) => {
    const focusElem = document.querySelector(":focus");
    if (focusElem) focusElem.blur();
  };

  clearLastSelectedElemData = () => {
    const { navGroupLastSelectedElemID, navLayerLastSelectedElemID } = this.observables;
    objectHelpers.clearOwnProperties(navGroupLastSelectedElemID);
    objectHelpers.clearOwnProperties(navLayerLastSelectedElemID);
  };

  //

  updateMenuNavElem = () => {
    const { navCurrentElemData, navLayerLastSelectedElemID } = this.observables;

    if (navCurrentElemData.elemID) {
      let navElem = this.getLayerNavAbleElemByID(navCurrentElemData.layerID, navCurrentElemData.elemID);
      if (!navElem) {
        if (navCurrentElemData.prevElem.elemID) {
          navElem = this.getLayerNavAbleElemByID(
            navCurrentElemData.prevElem.layerID,
            navCurrentElemData.prevElem.elemID
          );
          if (!navElem) {
            navCurrentElemData.elemID = "";
            navCurrentElemData.layerID = "";
            navCurrentElemData.prevElem.elemID = "";
            navCurrentElemData.prevElem.layerID = "";
          } else {
            navCurrentElemData.elemID = navCurrentElemData.prevElem.elemID;
            navCurrentElemData.layerID = navCurrentElemData.prevElem.layerID;
            navCurrentElemData.prevElem.elemID = "";
            navCurrentElemData.prevElem.layerID = "";

            const { prevElem, prevElemData } = this.getNavElemIndexData({ elem: navElem, useLayerLastSelected: false });
            if (prevElem) {
              navCurrentElemData.prevElem.elemID = prevElemData.elemID;
              navCurrentElemData.prevElem.layerID = prevElemData.layerID;
            }
          }
        } else {
          navCurrentElemData.elemID = "";
          navCurrentElemData.layerID = "";
        }
      }
    }

    if (!navCurrentElemData.elemID) {
      const { elem, prevElem } = this.getNavElemIndexData();

      if (elem) {
        this.setCurrentNavElemData(elem, prevElem);
      }
    }
  };

  menuNavVertical = (step) => {
    if (!step) return;

    const currentData = this.getCurrentNavElemIndexData();
    if (!currentData) return;

    const { navAbleElems, elem, index } = currentData;
    const currentElemData = this.getNavElemData(elem);

    if (currentElemData.isHorizontal) {
      const _step = Math.sign(step);
      for (let eIndex = index + _step; _step > 0 ? eIndex < navAbleElems.length : eIndex >= 0; eIndex += _step) {
        const nextElem = navAbleElems[eIndex];
        const nextElemData = this.getNavElemData(nextElem);

        if (!nextElemData.isHorizontal || currentElemData.groupID != nextElemData.groupID) {
          this.menuNavToElemVertical(nextElem, elem);
          break;
        }
      }
    } else {
      const nextElem = navAbleElems[index + step];
      if (nextElem) {
        this.menuNavToElemVertical(nextElem, elem);
      }
    }
  };

  menuNavHorizontal = (step) => {
    const currentData = this.getCurrentNavElemIndexData();
    if (!currentData) return;
    const { navAbleElems, elem, index } = currentData;

    const currentElemData = this.getNavElemData(elem);
    if (!currentElemData.isHorizontal) return;

    const nextElem = navAbleElems[index + step];
    if (nextElem) {
      const nextElemData = this.getNavElemData(nextElem);
      if (nextElemData.isHorizontal && currentElemData.groupID == nextElemData.groupID) {
        this.setCurrentNavElemData(nextElem, elem);
      }
    }
  };

  //

  getNavComponentData = (props) => {
    const { mainStore } = this.props;
    const { inputStore } = mainStore;
    const { lastDeviceTypeUsed } = inputStore.observables;
    const { navCurrentElemData } = this.observables;
    const {
      canInteract = true,
      disabled = false,

      navLayerID,
      navElemID,
      navIsHorizontal,
      navGroupID,
      navAutoFocus = false,
      navGroupSave = true,
    } = props;

    const isNavSelected =
      lastDeviceTypeUsed != constants.controls.deviceType.mouse &&
      canInteract &&
      navLayerID == navCurrentElemData.layerID &&
      navElemID == navCurrentElemData.elemID;

    return {
      props: {
        isNavSelected,
      },
      renderProps: {
        "data-nav-able": canInteract && !disabled ? 1 : 0,
        "data-nav-layer-id": navLayerID,
        "data-nav-elem-id": navElemID,
        "data-nav-hor": navIsHorizontal ? 1 : undefined,
        "data-nav-group-id": [navGroupID && navLayerID, navGroupID].filter(Boolean).join("-") || undefined,
        "data-nav-group-save": navGroupSave ? 1 : undefined,
        "data-nav-autofocus": navAutoFocus ? 1 : undefined,
      },
    };
  };
}

export default Object.assign(Storage, {});
