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
      inputState: {},
      lastDeviceTypeUsed: constants.controls.deviceType.mouse,

      controlSchemes: [],
      controlSchemesMaxCount: 20,

      inputOptions: {
        allowFigureMoveByMouse: true,
        inputRepeatDelay: 150,
        inputRepeatRate: 50,
      },
    };
    this.nonObservables = {
      evenBusID: "InputStore",

      lastMouseMoveTime: 0,
      mouseMoveTimeoutMs: 30,

      getInputPromise: undefined,
      getInputPromiseResolve: undefined,

      gamepadsState: undefined,
      gamepadInterval: undefined,
    };

    makeObservable(this, {
      // observable
      observables: observable,

      // action
      addControlScheme: action,
      removeControlScheme: action,
      resetControlScheme: action,
      setActiveControlScheme: action,
      addControlSchemeBind: action,
      removeControlSchemeBind: action,
      replaceControlSchemeBind: action,

      inputUpdateState: action,

      // computed
    });

    this.inputsBind();

    this.defaults = {
      observables: objectHelpers.deepCopy(this.observables),
      nonObservables: objectHelpers.deepCopy(this.nonObservables),
    };
  }

  //

  addControlScheme = ({ id, name, namePath, isActive = true, binds = [], props } = {}) => {
    const { controlSchemes, controlSchemesMaxCount } = this.observables;
    const { mainStore } = this.props;
    const { lang } = mainStore.observables;
    if (controlSchemes.length >= controlSchemesMaxCount) return false;

    if (!id || controlSchemes.some((_) => _.id == id)) {
      for (let i = 1; i <= controlSchemesMaxCount; i++) {
        id = i;
        if (!controlSchemes.some((_) => _.id == id)) break;
      }
    }
    if (!namePath) {
      if (!name || controlSchemes.some((_) => _.name == name)) {
        for (let i = 1; i <= controlSchemesMaxCount; i++) {
          name = `${constants.lang.strings[lang].optionsMenu.controlsTab.controlScheme.custom} ${i}`;
          if (!controlSchemes.some((_) => _.name == name)) break;
        }
      }
    }

    controlSchemes.push({
      id,
      name,
      namePath,
      isActive,
      binds,
      ...props,
    });
    if (isActive) {
      this.inputEventsBind({ ids: [id] });
    }

    return id;
  };

  removeControlScheme = ({ id }) => {
    const { controlSchemes } = this.observables;
    if (!id) return false;

    const index = controlSchemes.findIndex((_) => _.id == id);
    if (index < 0) return false;

    const controlScheme = controlSchemes[index];
    if (controlScheme.isDefault) return false;

    this.inputEventsUnbind({ ids: [controlScheme.id], ignoreActive: true });
    controlSchemes.splice(index, 1);

    return { index };
  };

  resetControlScheme = ({ id }) => {
    const { controlSchemes } = this.observables;
    if (!id) return false;

    const controlScheme = controlSchemes.find((_) => _.id == id);
    if (!controlScheme) return false;
    if (!controlScheme.isDefault) return false;

    const defaultControlScheme = this.defaults.observables.controlSchemes.find((_) => _.id == id);
    if (!defaultControlScheme) return false;
    if (!defaultControlScheme.isDefault) return false;

    if (controlScheme.isActive) {
      this.inputEventsUnbind({ ids: [controlScheme.id], ignoreActive: true });
    }

    controlScheme.binds = objectHelpers.deepCopy(defaultControlScheme.binds);

    if (controlScheme.isActive) {
      this.inputEventsBind({ ids: [controlScheme.id] });
    }
    return true;
  };

  setActiveControlScheme = ({ id, state }) => {
    const { controlSchemes } = this.observables;
    if (!id) return false;

    const controlScheme = controlSchemes.find((_) => _.id == id);
    if (!controlScheme) return false;
    if (controlScheme.isActive == state) return false;

    controlScheme.isActive = state;
    if (controlScheme.isActive) {
      this.inputEventsBind({ ids: [controlScheme.id] });
    } else {
      this.inputEventsUnbind({ ids: [controlScheme.id] });
    }
    return true;
  };

  addControlSchemeBind = ({ id, action, triggers }) => {
    const { controlSchemes } = this.observables;
    if (!id || !action) return false;

    const controlScheme = controlSchemes.find((_) => _.id == id);
    if (!controlScheme) return false;

    const bind = controlScheme.binds.find((_) => _.action == action);
    if (!bind) {
      controlScheme.binds.push({
        action,
        triggers: objectHelpers.deepCopy(triggers),
      });
    } else {
      triggers.forEach((trigger) => {
        if (!bind.triggers.some((_) => _ == trigger)) {
          bind.triggers.push(trigger);
        }
      });
    }

    if (controlScheme.isActive) {
      this.inputEventsBind({ ids: [id], action, triggers });
    }

    return true;
  };

  removeControlSchemeBind = ({ id, action, triggers }) => {
    const { controlSchemes } = this.observables;
    if (!id || !action) return false;

    const controlScheme = controlSchemes.find((_) => _.id == id);
    if (!controlScheme) return false;

    const bind = controlScheme.binds.find((_) => _.action == action);
    if (!bind) return false;

    if (controlScheme.isActive) {
      let _triggers = objectHelpers.deepCopy(triggers);

      const actionData = constants.controls.controlEventData[bind.action];
      controlScheme.binds.forEach((_bind) => {
        if (action == _bind.action) return false;

        const _actionData = constants.controls.controlEventData[_bind.action];
        if (_actionData.groupID != actionData.groupID) return false;

        for (let tIndex = _triggers.length - 1; tIndex >= 0; tIndex--) {
          const _trigger = _triggers[tIndex];
          if (_bind.triggers.some((_) => _ == _trigger)) {
            _triggers.splice(tIndex, 1);
          }
        }
      });

      if (_triggers.length) {
        this.inputEventsUnbind({ ids: [id], action, triggers: _triggers, ignoreActive: true });
      }
    }
    if (triggers?.length) {
      triggers.forEach((trigger) => {
        const index = bind.triggers.findIndex((_) => _ == trigger);
        if (index < 0) return;

        bind.triggers.splice(index, 1);
      });
    } else {
      for (let i = bind.triggers.length - 1; i >= 0; i--) {
        bind.triggers.pop();
      }
    }

    return true;
  };

  replaceControlSchemeBind = ({ id, action, triggerOld, triggerNew }) => {
    const { controlSchemes } = this.observables;
    if (!id || !action || !triggerOld || !triggerNew) return false;

    const controlScheme = controlSchemes.find((_) => _.id == id);
    if (!controlScheme) return false;

    const bind = controlScheme.binds.find((_) => _.action == action);
    if (!bind) return false;

    if (controlScheme.isActive) {
      const actionData = constants.controls.controlEventData[bind.action];
      if (
        !controlScheme.binds.some((_bind) => {
          if (action == _bind.action) return false;

          const _actionData = constants.controls.controlEventData[_bind.action];
          if (_actionData.groupID != actionData.groupID) return false;

          return _bind.triggers.some((_) => _ == triggerOld);
        })
      ) {
        this.inputEventsUnbind({ ids: [id], action, triggers: [triggerOld], ignoreActive: true });
      }
    }

    const index = bind.triggers.findIndex((_) => _ == triggerOld);
    if (index < 0) return;

    bind.triggers[index] = triggerNew;

    if (controlScheme.isActive) {
      this.inputEventsBind({ ids: [id], action, triggers: [triggerNew] });
    }

    return true;
  };

  getInput = () => {
    const { mainStore } = this.props;
    const { eventBus } = mainStore;
    const { evenBusID, getInputPromise } = this.nonObservables;
    if (getInputPromise) return getInputPromise;

    this.nonObservables.getInputPromise = new Promise((resolve) => {
      this.nonObservables.getInputPromiseResolve = resolve;
      const triggers = this.getAllActiveTriggersForActions({
        actions: [constants.controls.controlEvent.menuNavBack],
      });
      const cancelInputEvents = [...triggers, constants.controls.getInputEvent(constants.controls.input.f1)];

      eventBus.addEventListener(evenBusID, constants.eventsData.eventType.bindInput, ({ input, state, deviceType }) => {
        const inputEvent = constants.controls.getInputEvent(input);
        if (cancelInputEvents.some((_) => _ == inputEvent)) {
          resolve(false);
        } else {
          if (state.justPressed) {
            resolve(input);
          }
        }
      });
    });

    return this.nonObservables.getInputPromise;
  };

  getInputDisable = () => {
    const { mainStore } = this.props;
    const { eventBus } = mainStore;
    const { evenBusID, getInputPromiseResolve } = this.nonObservables;

    if (!getInputPromiseResolve) return;

    getInputPromiseResolve(false);
    eventBus.removeEventListener(evenBusID, constants.eventsData.eventType.bindInput);

    this.nonObservables.getInputPromise = undefined;
    this.nonObservables.getInputPromiseResolve = undefined;
  };

  getAllActiveTriggersForActions = ({ actions = [] } = {}) => {
    const { controlSchemes } = this.observables;

    const triggers = [];
    controlSchemes.forEach((controlScheme) => {
      if (!controlScheme.isActive) return;

      controlScheme.binds.forEach((bind) => {
        if (!actions.some((_) => _ == bind.action)) return;

        bind.triggers.forEach((trigger) => {
          if (!triggers.some((_) => _ == trigger)) {
            triggers.push(trigger);
          }
        });
      });
    });

    return triggers;
  };

  getActiveTriggerOverlaps = () => {
    const { controlSchemes } = this.observables;

    const groupTriggerActionData = {};
    const overlapData = [];
    const addOverlapData = (controlSchemeID, action, trigger) => {
      const overlapControlScheme = overlapData.find((_) => _.id == controlSchemeID);
      if (!overlapControlScheme) {
        overlapData.push({
          id: controlSchemeID,
          binds: [
            {
              action,
              triggers: [trigger],
            },
          ],
        });
      } else {
        const overlapAction = overlapControlScheme.binds.find((_) => _.action == action);
        if (!overlapAction) {
          overlapControlScheme.binds.push({
            action,
            triggers: [trigger],
          });
        } else {
          if (!overlapAction.triggers.some((_) => _ == trigger)) {
            overlapAction.triggers.push(trigger);
          }
        }
      }
    };

    controlSchemes.forEach((controlScheme) => {
      if (!controlScheme.isActive) return;

      controlScheme.binds.forEach((bind) => {
        const actionData = constants.controls.controlEventData[bind.action];

        const groupID = actionData.groupID || constants.controls.controlGroup.anywhere;
        if (!groupTriggerActionData[groupID]) {
          groupTriggerActionData[groupID] = {};
        }

        bind.triggers.forEach((trigger) => {
          if (groupTriggerActionData[groupID][trigger]) {
            addOverlapData(controlScheme.id, bind.action, trigger);
            const { controlSchemeID, action, isProcessed } = groupTriggerActionData[groupID][trigger];
            if (!isProcessed) {
              addOverlapData(controlSchemeID, action, trigger);
              groupTriggerActionData[groupID][trigger].isProcessed = true;
            }
          } else {
            groupTriggerActionData[groupID][trigger] = { action: bind.action, controlSchemeID: controlScheme.id };
          }
        });
      });
    });

    return overlapData;
  };

  //

  inputEventsBind = ({ ids, action, triggers, ignoreActive = false } = {}) => {
    const { mainStore } = this.props;
    const { eventBus } = mainStore;
    const { inputOptions } = this.observables;
    const { evenBusID } = this.nonObservables;

    let { controlSchemes } = this.observables;
    if (ids?.length) {
      controlSchemes = controlSchemes.filter((_) => ids.some((__) => __ == _.id));
    }

    controlSchemes.forEach((controlScheme) => {
      if (!ignoreActive && !controlScheme.isActive) return;
      controlScheme.binds.forEach((bind) => {
        if (action && bind.action != action) return;

        const actionData = constants.controls.controlEventData[bind.action];
        const eventID = `${evenBusID}-${controlScheme.id}-${actionData.groupID}`;
        const fn = async ({ state, deviceType, deviceTypeChanged, __eventType }) => {
          const triggerData = actionData?.getTriggerData({ options: inputOptions }) || {};
          const { onJustPressed, onJustReleased, onIsPressed } = triggerData;

          let fireEvent = false;
          if (onJustPressed && state.justPressed) {
            fireEvent = true;
          } else if (onJustReleased && state.justReleased) {
            fireEvent = true;
          } else if (onIsPressed && state.isPressed) {
            fireEvent = true;
          }

          if (fireEvent) {
            const results = await eventBus.fireEvent(bind.action, { deviceType, deviceTypeChanged });
            if (results.some((_) => _?.stopInputListenersProcessing)) {
              return { stopListenerProcessing: true };
            }
          }
        };

        let _triggers = bind.triggers;
        if (triggers?.length) {
          _triggers = _triggers.filter((_) => triggers.some((__) => __ == _));
        }
        _triggers.forEach((trigger) => {
          eventBus.addEventListener(eventID, trigger, fn);
        });
      });
    });

    const moveCursorPointerControlEvent = constants.controls.controlEvent.moveCursorPointer;
    const moveCursorPointerActionData = constants.controls.controlEventData[moveCursorPointerControlEvent];
    const moveCursorPointerEventID = `${evenBusID}-${moveCursorPointerActionData.groupID}`;
    eventBus.addEventListener(moveCursorPointerEventID, constants.controls.input.mouse, ({ x, deviceType }) => {
      const { lastDeviceTypeUsed } = this.observables;
      let deviceTypeChanged = false;
      if (deviceType != lastDeviceTypeUsed) {
        this.observables.lastDeviceTypeUsed = deviceType;
        deviceTypeChanged = true;
      }

      eventBus.fireEvent(moveCursorPointerControlEvent, { x, deviceType, deviceTypeChanged });
    });
  };

  inputEventsUnbind = ({ ids, action, triggers, ignoreActive = false } = {}) => {
    const { mainStore } = this.props;
    const { eventBus } = mainStore;
    const { evenBusID } = this.nonObservables;

    let { controlSchemes } = this.observables;
    if (ids?.length) {
      controlSchemes = controlSchemes.filter((_) => ids.some((__) => __ == _.id));
    }

    controlSchemes.forEach((controlScheme) => {
      if (!ignoreActive && controlScheme.isActive) return;
      controlScheme.binds.forEach((bind) => {
        if (action && bind.action != action) return;

        const actionData = constants.controls.controlEventData[bind.action];
        const eventID = `${evenBusID}-${controlScheme.id}-${actionData.groupID}`;

        let _triggers = bind.triggers;
        if (triggers?.length) {
          _triggers = _triggers.filter((_) => triggers.some((__) => __ == _));
        }
        _triggers.forEach((trigger) => {
          eventBus.removeEventListener(eventID, trigger);
        });
      });
    });
  };

  inputUpdateState = ({ ev, input, isPressed, isReleased, isClicked, deviceType }) => {
    const { inputState, inputOptions } = this.observables;
    const { inputRepeatDelay, inputRepeatRate } = inputOptions;
    // console.log({ input, isPressed, isReleased, isClicked, deviceType });

    if (!inputState[input]) {
      this.clearInputState(input);
    }
    const state = inputState[input];

    if (isPressed && !state._isPressed) {
      state.justPressed = true;
      state.justReleased = false;
      state._isPressed = true;
      state.isPressed = false;
    } else if (isReleased) {
      state.justPressed = false;
      state.justReleased = true;
      state._isPressed = false;
      state.isPressed = false;
    } else if (isClicked) {
      state.justPressed = true;
      state.justReleased = true;
      state._isPressed = false;
      state.isPressed = false;
    }

    if (state.timeout) {
      clearTimeout(state.timeout);
    }
    state.timeout = setTimeout(() => {
      state.timeout = undefined;
      let isChanged = false;

      if (state.justReleased && state._isPressed) {
        state._isPressed = false;
      }

      if (state.justPressed) {
        state.justPressed = false;
        isChanged = true;
      }
      if (state.justReleased) {
        state.justReleased = false;
        isChanged = true;
      }
      if (isChanged) {
        this.fireInputEvent({ input, deviceType });
      }
    }, 1);

    if (state.justPressed) {
      if (state.intervalTimeout) {
        clearTimeout(state.intervalTimeout);
      }
      if (state.interval) {
        clearInterval(state.interval);
        state.interval = 0;
      }
      state.intervalTimeout = setTimeout(() => {
        state.intervalTimeout = 0;
        if (state._isPressed) {
          state.isPressed = true;
        }

        state.interval = setInterval(() => {
          if (state.isPressed) {
            this.fireInputEvent({ input, deviceType });
          } else {
            clearInterval(state.interval);
            state.interval = undefined;
          }
        }, inputRepeatRate);
      }, inputRepeatDelay);
    }

    return this.fireInputEvent({ ev, input, deviceType });
  };

  clearInputState = (input) => {
    const { inputState } = this.observables;

    if (!inputState[input]) {
      inputState[input] = {
        justPressed: false,
        _isPressed: false,
        isPressed: false,
        justReleased: false,
        timeout: 0,
        intervalTimeout: 0,
        interval: 0,
      };
    } else {
      const state = inputState[input];
      state.justPressed = false;
      state._isPressed = false;
      state.isPressed = false;
      state.justReleased = false;

      if (state.timeout) {
        clearTimeout(state.timeout);
        state.timeout = 0;
      }
      if (state.intervalTimeout) {
        clearTimeout(state.intervalTimeout);
        state.intervalTimeout = 0;
      }
      if (state.interval) {
        clearInterval(state.interval);
        state.interval = 0;
      }
    }
  };

  fireInputEvent = ({ ev, input, deviceType }) => {
    const { mainStore } = this.props;
    const { eventBus } = mainStore;
    const { inputState, lastDeviceTypeUsed } = this.observables;
    const { getInputPromise } = this.nonObservables;

    const state = objectHelpers.deepCopy(inputState[input]);
    // if (eventBus.getListeners(constants.eventsData.eventType.bindInput)?.length) {
    if (getInputPromise) {
      if (ev?.cancelable) ev?.preventDefault?.();
      return eventBus.fireEvent(constants.eventsData.eventType.bindInput, { input, state, deviceType });
    } else {
      let deviceTypeChanged = false;
      if (deviceType != lastDeviceTypeUsed) {
        this.observables.lastDeviceTypeUsed = deviceType;
        deviceTypeChanged = true;
      }

      const inputData = constants.controls.inputData[input] || {};
      if (inputData.preventDefault) ev?.preventDefault?.();
      return eventBus.fireEvent(constants.controls.getInputEvent(input), { state, deviceType, deviceTypeChanged });
    }
  };

  //

  inputsBind = () => {
    document.addEventListener("keydown", this.onKeyPress);
    document.addEventListener("keyup", this.onKeyRelease);
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mousedown", this.onMouseDown);
    document.addEventListener("mouseup", this.onMouseUp);
    document.addEventListener("contextmenu", this.onContextMenu);
    document.addEventListener("wheel", this.onWheel);
    document.addEventListener("focusin", this.onDocumentFocusIn);
    document.addEventListener("focusout", this.onDocumentFocusOut);

    window.addEventListener("focus", this.onWindowFocus);
    window.addEventListener("blur", this.onWindowBlur);

    if (navigator.getGamepads) {
      if (this.nonObservables.gamepadInterval) {
        clearInterval(this.nonObservables.gamepadInterval);
      }
      this.nonObservables.gamepadInterval = setInterval(this.gamepadUpdate, 33);
    }
  };

  inputsUnbind = () => {
    document.removeEventListener("keydown", this.onKeyPress);
    document.removeEventListener("keyup", this.onKeyRelease);
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mousedown", this.onMouseDown);
    document.removeEventListener("mouseup", this.onMouseUp);
    document.removeEventListener("contextmenu", this.onContextMenu);
    document.removeEventListener("wheel", this.onWheel);
    document.removeEventListener("focusin", this.onDocumentFocusIn);
    document.removeEventListener("focusout", this.onDocumentFocusOut);

    window.removeEventListener("focus", this.onWindowFocus);
    window.removeEventListener("blur", this.onWindowBlur);

    if (this.nonObservables.gamepadInterval) {
      clearInterval(this.nonObservables.gamepadInterval);
      this.nonObservables.gamepadInterval = undefined;
    }
  };

  onKeyPress = (ev) => {
    const keyCode = ev.code || ev.key || ev.keyCode;
    // console.log(`keyPressed: '${keyCode}'`);

    this.inputUpdateState({ ev, input: keyCode, isPressed: true, deviceType: constants.controls.deviceType.keyboard });
  };

  onKeyRelease = (ev) => {
    const keyCode = ev.code || ev.key || ev.keyCode;
    //console.log(`keyReleased: '${keyCode}'`);

    this.inputUpdateState({ ev, input: keyCode, isReleased: true, deviceType: constants.controls.deviceType.keyboard });
  };

  onMouseMove = (ev) => {
    const callTime = Date.now();
    if (callTime - this.nonObservables.lastMouseMoveTime < this.nonObservables.mouseMoveTimeoutMs) return;

    const { mainStore } = this.props;
    const { eventBus } = mainStore;

    this.nonObservables.lastMouseMoveTime = callTime;
    // eventBus.fireEvent(constants.controls.controlEvent.moveCursorPointer, {
    eventBus.fireEvent(constants.controls.input.mouse, {
      x: ev.pageX,
      deviceType: constants.controls.deviceType.mouse,
    });
  };

  onMouseDown = (ev) => {
    if (ev.button == 0) {
      this.inputUpdateState({
        ev,
        input: constants.controls.input.mouseLeftButton,
        isPressed: true,
        deviceType: constants.controls.deviceType.mouse,
      });
    } else if (ev.button == 1) {
      this.inputUpdateState({
        ev,
        input: constants.controls.input.mouseMiddleButton,
        isPressed: true,
        deviceType: constants.controls.deviceType.mouse,
      });
    } else if (ev.button == 2) {
      this.inputUpdateState({
        ev,
        input: constants.controls.input.mouseRightButton,
        isPressed: true,
        deviceType: constants.controls.deviceType.mouse,
      });
    } else if (ev.button == 3) {
      this.inputUpdateState({
        ev,
        input: constants.controls.input.mouseBackButton,
        isPressed: true,
        deviceType: constants.controls.deviceType.mouse,
      });
    } else if (ev.button == 4) {
      this.inputUpdateState({
        ev,
        input: constants.controls.input.mouseForwardButton,
        isPressed: true,
        deviceType: constants.controls.deviceType.mouse,
      });
    }
  };

  onMouseUp = (ev) => {
    if (ev.button == 0) {
      this.inputUpdateState({
        ev,
        input: constants.controls.input.mouseLeftButton,
        isReleased: true,
        deviceType: constants.controls.deviceType.mouse,
      });
    } else if (ev.button == 1) {
      this.inputUpdateState({
        ev,
        input: constants.controls.input.mouseMiddleButton,
        isReleased: true,
        deviceType: constants.controls.deviceType.mouse,
      });
    } else if (ev.button == 2) {
      this.inputUpdateState({
        ev,
        input: constants.controls.input.mouseRightButton,
        isReleased: true,
        deviceType: constants.controls.deviceType.mouse,
      });
    } else if (ev.button == 3) {
      this.inputUpdateState({
        ev,
        input: constants.controls.input.mouseBackButton,
        isReleased: true,
        deviceType: constants.controls.deviceType.mouse,
      });
    } else if (ev.button == 4) {
      this.inputUpdateState({
        ev,
        input: constants.controls.input.mouseForwardButton,
        isReleased: true,
        deviceType: constants.controls.deviceType.mouse,
      });
    }
  };

  onContextMenu = (ev) => {
    ev.preventDefault();
  };

  onWheel = (ev) => {
    if (ev.deltaY > 0) {
      this.inputUpdateState({
        ev,
        input: constants.controls.input.mouseWheelDown,
        isClicked: true,
        deviceType: constants.controls.deviceType.mouse,
      });
    } else if (ev.deltaY < 0) {
      this.inputUpdateState({
        ev,
        input: constants.controls.input.mouseWheelUp,
        isClicked: true,
        deviceType: constants.controls.deviceType.mouse,
      });
    }

    if (ev.deltaX > 0) {
      this.inputUpdateState({
        ev,
        input: constants.controls.input.mouseWheelLeft,
        isClicked: true,
        deviceType: constants.controls.deviceType.mouse,
      });
    } else if (ev.deltaX < 0) {
      this.inputUpdateState({
        ev,
        input: constants.controls.input.mouseWheelRight,
        isClicked: true,
        deviceType: constants.controls.deviceType.mouse,
      });
    }
  };

  gamepadUpdate = () => {
    const gamepadsState = navigator.getGamepads();
    if (!this.nonObservables.gamepadsState) {
      this.nonObservables.gamepadsState = gamepadsState;
      return;
    }

    const { gamepadsState: prevGamepadsState } = this.nonObservables;
    // console.log({ gamepadsState, prevGamepadsState });

    const prevGamepadCount = prevGamepadsState.filter(Boolean).length;
    const gamepadCount = gamepadsState.filter(Boolean).length;
    if (prevGamepadCount > 0 && !gamepadCount) {
      gamepadsState.forEach((gamepadState, gpIndex) => {
        constants.controls.gamepadStandartButtonMapping.forEach((inputName) => {
          if (!gpIndex) {
            this.clearInputState(inputName);
          } else {
            this.clearInputState(`P${gpIndex}|${inputName}`);
          }
        });
      });
    } else {
      let isFirstGamepad = true;
      gamepadsState.forEach((gamepadState, gpIndex) => {
        const prevGamepadState = Boolean(prevGamepadsState[gpIndex]);
        if (prevGamepadState && !gamepadState) {
          constants.controls.gamepadStandartButtonMapping.forEach((inputName) => {
            if (isFirstGamepad) {
              this.clearInputState(inputName);
            } else {
              this.clearInputState(`P${gpIndex}|${inputName}`);
            }
          });
        } else if (gamepadState) {
          gamepadState.buttons.forEach((buttonState, bIndex) => {
            const inputName =
              gamepadState.mapping == "standard" ?
                constants.controls.gamepadStandartButtonMapping[bIndex]
              : `B${bIndex}`;
            const input = isFirstGamepad ? inputName : `P${gpIndex}|${inputName}`;
            const prevButtonState = prevGamepadsState[gpIndex]?.buttons[bIndex];
            const isPressed = buttonState.value > 0 || buttonState.pressed;
            const wasPressed = prevButtonState ? prevButtonState.value > 0 || prevButtonState.pressed : false;
            if (isPressed && !wasPressed) {
              this.inputUpdateState({ input, isPressed: true, deviceType: constants.controls.deviceType.gamepad });
            } else if (!isPressed && wasPressed) {
              this.inputUpdateState({ input, isReleased: true, deviceType: constants.controls.deviceType.gamepad });
            }
          });

          isFirstGamepad = false;
        }
      });
    }

    this.nonObservables.gamepadsState = gamepadsState;
  };

  //

  onDocumentFocusIn = (ev) => {
    // console.log("document focus in", { target: ev.target });
  };

  onDocumentFocusOut = (ev) => {
    // console.log("document focus out", { target, currentFocus: document.querySelectorAll(":focus") });
  };

  onWindowFocus = (ev) => {
    // console.log("window focus", { target: ev.target });
  };

  onWindowBlur = (ev) => {
    // console.log("window blur", { target: ev.target });
  };
}

export default Object.assign(Storage, {});
