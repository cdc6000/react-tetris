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
      controlSchemes: [],
      controlSchemesMaxCount: 20,
      inputOptions: {
        allowFigureMoveByMouse: true,
      },
    };
    this.nonObservables = {
      evenBusID: "InputStore",

      lastMouseMoveTime: 0,
      mouseMoveTimeoutMs: 30,
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
      setupDefaultControlSchemes: action,

      inputUpdateState: action,

      // computed
    });

    this.inputsBind();
    this.setupDefaultControlSchemes();

    this.defaults = {
      observables: objectHelpers.deepCopy(this.observables),
      nonObservables: objectHelpers.deepCopy(this.nonObservables),
    };
  }

  addControlScheme = ({ id, name, nameStringPath, isActive = true, binds = [], props } = {}) => {
    const { controlSchemes, controlSchemesMaxCount } = this.observables;
    const { lang } = this.props.observables;
    if (controlSchemes.length >= controlSchemesMaxCount) return false;

    if (!id || controlSchemes.some((_) => _.id == id)) {
      for (let i = 1; i <= controlSchemesMaxCount; i++) {
        id = i;
        if (!controlSchemes.some((_) => _.id == id)) break;
      }
    }
    if (!nameStringPath) {
      if (!name || controlSchemes.some((_) => _.name == name)) {
        for (let i = 1; i <= controlSchemesMaxCount; i++) {
          name = `${constants.lang.strings[lang].optionsMenu.controlsTab.controlScheme.new} ${i}`;
          if (!controlSchemes.some((_) => _.name == name)) break;
        }
      }
    }

    controlSchemes.push({
      id,
      name,
      nameStringPath,
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
    if (!id) return false;

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
    if (!id) return false;

    const controlScheme = controlSchemes.find((_) => _.id == id);
    if (!controlScheme) return false;

    const bind = controlScheme.binds.find((_) => _.action == action);
    if (!bind) return false;

    if (controlScheme.isActive) {
      this.inputEventsUnbind({ ids: [id], action, triggers, ignoreActive: true });
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

  setupDefaultControlSchemes = () => {
    const { inputEvent, controlEvent } = constants.controls;

    // keyboard
    let id = "DefaultKeyboard";
    this.addControlScheme({
      id,
      nameStringPath: ["optionsMenu", "controlsTab", "controlScheme", "defaultKeyboard"],
      isActive: false,
      props: {
        isDefault: true,
      },
    });

    this.addControlSchemeBind({
      id,
      action: controlEvent.moveCurrentFigureLeft,
      triggers: [`input-${inputEvent.arrowLeft}`],
    });
    this.addControlSchemeBind({
      id,
      action: controlEvent.moveCurrentFigureRight,
      triggers: [`input-${inputEvent.arrowRight}`],
    });

    this.addControlSchemeBind({
      id,
      action: controlEvent.rotateCurrentFigureClockwise,
      triggers: [`input-${inputEvent.arrowUp}`],
    });

    this.addControlSchemeBind({
      id,
      action: controlEvent.speedUpFallingCurrentFigure,
      triggers: [`input-${inputEvent.arrowDown}`],
    });
    this.addControlSchemeBind({
      id,
      action: controlEvent.dropCurrentFigure,
      triggers: [`input-${inputEvent.space}`],
    });

    this.addControlSchemeBind({
      id,
      action: controlEvent.gamePauseToggle,
      triggers: [`input-${inputEvent.kP}`],
    });

    this.setActiveControlScheme({ id, state: true });

    // mouse
    id = "DefaultMouse";
    this.addControlScheme({
      id,
      nameStringPath: ["optionsMenu", "controlsTab", "controlScheme", "defaultMouse"],
      isActive: false,
      props: {
        isDefault: true,
      },
    });

    this.addControlSchemeBind({
      id,
      action: controlEvent.rotateCurrentFigureClockwise,
      triggers: [`input-${inputEvent.mouseRightButton}`],
    });

    this.addControlSchemeBind({
      id,
      action: controlEvent.speedUpFallingCurrentFigure,
      triggers: [`input-${inputEvent.mouseWheelDown}`],
    });
    this.addControlSchemeBind({
      id,
      action: controlEvent.dropCurrentFigure,
      triggers: [`input-${inputEvent.mouseLeftButton}`],
    });

    this.addControlSchemeBind({
      id,
      action: controlEvent.gameUnpause,
      triggers: [`input-${inputEvent.mouseWheelDown}`],
    });
    this.addControlSchemeBind({
      id,
      action: controlEvent.gamePause,
      triggers: [`input-${inputEvent.mouseWheelUp}`],
    });

    this.setActiveControlScheme({ id, state: true });
  };

  getInput = () => {
    const { eventBus } = this.props;
    const { evenBusID } = this.nonObservables;
    return {
      promise: new Promise((resolve) => {
        eventBus.addEventListener(evenBusID, "BindInput", ({ input, state }) => {
          if (input == `input-${constants.controls.inputEvent.f1}`) {
            resolve(false);
          } else {
            if (state.justPressed) {
              resolve(input);
            }
          }
        });
      }),
      onFinished: () => {
        eventBus.removeEventListener(evenBusID, "BindInput");
      },
    };
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

  //

  inputEventsBind = ({ ids, action, triggers, ignoreActive = false } = {}) => {
    const { eventBus } = this.props;
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
        const fn = ({ state }) => {
          const triggerData = actionData?.getTriggerData({ options: inputOptions }) || {};
          const { onJustPressed, onJustReleased, onIsPressed } = triggerData;

          // state.justPressed && console.log("input event", { action: bind.action });
          let fireEvent = false;
          if (onJustPressed && state.justPressed) {
            fireEvent = true;
          } else if (onJustReleased && state.justReleased) {
            fireEvent = true;
          } else if (onIsPressed && state.isPressed) {
            fireEvent = true;
          }

          if (fireEvent) {
            eventBus.fireEvent(bind.action);
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
  };

  inputEventsUnbind = ({ ids, action, triggers, ignoreActive = false } = {}) => {
    const { eventBus } = this.props;
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

  inputUpdateState = ({ ev, input, isPressed, isReleased, isClicked }) => {
    // console.log({ input });
    const { inputState } = this.observables;
    if (!inputState[input]) {
      inputState[input] = {
        justPressed: false,
        isPressed: false,
        justReleased: false,
        timeout: undefined,
        interval: undefined,
      };
    }
    const state = inputState[input];

    if (isPressed && !state.isPressed) {
      state.justPressed = true;
      state.justReleased = false;
      state.isPressed = true;
    } else if (isReleased) {
      state.justPressed = false;
      state.justReleased = true;
      state.isPressed = false;
    } else if (isClicked) {
      state.justPressed = true;
      state.justReleased = true;
      state.isPressed = true;
    }

    if (state.timeout) {
      clearTimeout(state.timeout);
    }
    state.timeout = setTimeout(() => {
      state.timeout = undefined;
      let isChanged = false;
      if (state.justReleased && state.isPressed) {
        state.isPressed = false;
        isChanged = true;
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
        this.fireInputEvent({ input });
      }
    }, 1);

    if (state.isPressed) {
      if (state.interval) {
        clearInterval(state.interval);
      }
      state.interval = setInterval(() => {
        if (state.isPressed) {
          this.fireInputEvent({ input });
        } else {
          clearInterval(state.interval);
          state.interval = undefined;
        }
      }, 50);
    }

    return this.fireInputEvent({ ev, input });
  };

  fireInputEvent = ({ ev, input }) => {
    const { eventBus } = this.props;
    const { inputState } = this.observables;

    const state = objectHelpers.deepCopy(inputState[input]);
    if (eventBus.getListeners("BindInput")?.length) {
      if (ev?.cancelable) ev?.preventDefault?.();
      return eventBus.fireEvent("BindInput", { input: `input-${input}`, state });
    } else if (eventBus.getListeners(`input-${input}`)?.length) {
      // if (ev?.cancelable) ev?.preventDefault?.();
      return eventBus.fireEvent(`input-${input}`, { state });
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
  };

  inputsUnbind = () => {
    document.removeEventListener("keydown", this.onKeyPress);
    document.removeEventListener("keyup", this.onKeyRelease);
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mousedown", this.onMouseDown);
    document.removeEventListener("mouseup", this.onMouseUp);
    document.removeEventListener("contextmenu", this.onContextMenu);
    document.removeEventListener("wheel", this.onWheel);
  };

  onKeyPress = (ev) => {
    const keyCode = ev.code || ev.key || ev.keyCode;
    // console.log(`keyPressed: '${keyCode}'`);

    this.inputUpdateState({ ev, input: keyCode, isPressed: true });
  };

  onKeyRelease = (ev) => {
    const keyCode = ev.code || ev.key || ev.keyCode;
    //console.log(`keyReleased: '${keyCode}'`);

    this.inputUpdateState({ ev, input: keyCode, isReleased: true });
  };

  onMouseMove = (ev) => {
    const { inputOptions } = this.observables;
    if (!inputOptions.allowFigureMoveByMouse) return;

    const { cupElemRect } = this.props.nonObservables;
    if (!cupElemRect) return;

    const callTime = Date.now();
    if (callTime - this.nonObservables.lastMouseMoveTime < this.nonObservables.mouseMoveTimeoutMs) return;

    this.nonObservables.lastMouseMoveTime = callTime;
    this.props.eventBus.fireEvent(constants.controls.controlEvent.moveCurrentFigureCupPointX, {
      x: ev.pageX - cupElemRect.left,
    });
  };

  onMouseDown = (ev) => {
    if (ev.button == 0) {
      this.inputUpdateState({ ev, input: constants.controls.inputEvent.mouseLeftButton, isPressed: true });
    } else if (ev.button == 2) {
      this.inputUpdateState({ ev, input: constants.controls.inputEvent.mouseRightButton, isPressed: true });
    }
  };

  onMouseUp = (ev) => {
    if (ev.button == 0) {
      this.inputUpdateState({ ev, input: constants.controls.inputEvent.mouseLeftButton, isReleased: true });
    } else if (ev.button == 2) {
      this.inputUpdateState({ ev, input: constants.controls.inputEvent.mouseRightButton, isReleased: true });
    }
  };

  onContextMenu = (ev) => {
    ev.preventDefault();
  };

  onWheel = (ev) => {
    if (ev.deltaY > 0) {
      this.inputUpdateState({ ev, input: constants.controls.inputEvent.mouseWheelDown, isClicked: true });
    } else if (ev.deltaY) {
      this.inputUpdateState({ ev, input: constants.controls.inputEvent.mouseWheelUp, isClicked: true });
    }
  };
}

export default Object.assign(Storage, {});
