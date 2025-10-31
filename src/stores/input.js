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
      setupDefaultControlSchemes: action,
      inputUpdateState: action,

      // computed
    });
  }

  setupDefaultControlSchemes = () => {
    const { controlSchemes } = this.observables;
    const { inputEvent, controlEvent } = constants.controls;

    // keyboard
    controlSchemes.push({
      id: "DefaultKeyboard",
      isActive: true,
      binds: [
        {
          trigger: inputEvent.arrowLeft,
          action: controlEvent.moveCurrentFigureLeft,
        },
        {
          trigger: inputEvent.arrowRight,
          action: controlEvent.moveCurrentFigureRight,
        },

        {
          trigger: inputEvent.arrowUp,
          action: controlEvent.rotateCurrentFigureClockwise,
        },

        {
          trigger: inputEvent.arrowDown,
          action: controlEvent.speedUpFallingCurrentFigure,
        },
        {
          trigger: inputEvent.space,
          action: controlEvent.dropCurrentFigure,
        },

        {
          trigger: inputEvent.kP,
          action: controlEvent.gamePauseToggle,
        },
      ],
    });

    // mouse
    controlSchemes.push({
      id: "DefaultMouse",
      isActive: true,
      binds: [
        {
          trigger: inputEvent.mouseRightButton,
          action: controlEvent.rotateCurrentFigureClockwise,
        },

        {
          trigger: inputEvent.mouseWheelDown,
          action: controlEvent.speedUpFallingCurrentFigure,
        },
        {
          trigger: inputEvent.mouseLeftButton,
          action: controlEvent.dropCurrentFigure,
        },

        {
          trigger: inputEvent.mouseWheelDown,
          action: controlEvent.gameUnpause,
        },
        {
          trigger: inputEvent.mouseWheelUp,
          action: controlEvent.gamePause,
        },
      ],
    });
  };

  inputEventsBind = () => {
    const { eventBus } = this.props;
    const { controlSchemes, inputOptions } = this.observables;
    const { evenBusID } = this.nonObservables;

    controlSchemes.forEach((controlScheme) => {
      if (!controlScheme.isActive) return;
      controlScheme.binds.forEach((bind) => {
        eventBus.addEventListener(`${evenBusID}-${controlScheme.id}`, `input-${bind.trigger}`, ({ state }) => {
          const triggerData =
            constants.controls.controlEventTrigger[bind.action]?.({
              options: inputOptions,
            }) || {};
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
            eventBus.fireEvent(`control-${bind.action}`);
          }
        });
      });
    });
  };

  inputEventsUnbind = () => {
    const { eventBus } = this.props;
    const { controlSchemes } = this.observables;
    const { evenBusID } = this.nonObservables;

    controlSchemes.forEach((controlScheme) => {
      controlScheme.binds.forEach((bind) => {
        eventBus.removeEventListener(`${evenBusID}-${controlScheme.id}`, `input-${bind.trigger}`);
      });
    });
  };

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

  inputUpdateState = ({ input, isPressed, isReleased, isClicked }) => {
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
        this.fireInputEvent(input);
      }
    }, 1);

    if (state.isPressed) {
      if (state.interval) {
        clearInterval(state.interval);
      }
      state.interval = setInterval(() => {
        if (state.isPressed) {
          this.fireInputEvent(input);
        } else {
          clearInterval(state.interval);
          state.interval = undefined;
        }
      }, 50);
    }

    this.fireInputEvent(input);
  };

  fireInputEvent = (input) => {
    const { eventBus } = this.props;
    const { inputState } = this.observables;

    const state = objectHelpers.deepCopy(inputState[input]);
    return eventBus.fireEvent(`input-${input}`, { state });
  };

  onKeyPress = (ev) => {
    const keyCode = ev.code || ev.key || ev.keyCode;
    // console.log(`keyPressed: '${keyCode}'`);

    this.inputUpdateState({ input: keyCode, isPressed: true });
  };

  onKeyRelease = (ev) => {
    const keyCode = ev.code || ev.key || ev.keyCode;
    //console.log(`keyReleased: '${keyCode}'`);

    this.inputUpdateState({ input: keyCode, isReleased: true });
  };

  onMouseMove = (ev) => {
    const { inputOptions } = this.observables;
    if (!inputOptions.allowFigureMoveByMouse) return;

    const { cupElemRect } = this.props.nonObservables;
    if (!cupElemRect) return;

    const callTime = Date.now();
    if (callTime - this.nonObservables.lastMouseMoveTime < this.nonObservables.mouseMoveTimeoutMs) return;

    this.nonObservables.lastMouseMoveTime = callTime;
    this.props.eventBus.fireEvent(`control-${constants.controls.controlEvent.moveCurrentFigureCupPointX}`, {
      x: ev.pageX - cupElemRect.left,
    });
  };

  onMouseDown = (ev) => {
    if (ev.button == 0) {
      this.inputUpdateState({ input: constants.controls.inputEvent.mouseLeftButton, isPressed: true });
    } else if (ev.button == 2) {
      this.inputUpdateState({ input: constants.controls.inputEvent.mouseRightButton, isPressed: true });
    }
  };

  onMouseUp = (ev) => {
    if (ev.button == 0) {
      this.inputUpdateState({ input: constants.controls.inputEvent.mouseLeftButton, isReleased: true });
    } else if (ev.button == 2) {
      this.inputUpdateState({ input: constants.controls.inputEvent.mouseRightButton, isReleased: true });
    }
  };

  onContextMenu = (ev) => {
    ev.preventDefault();
  };

  onWheel = async (ev) => {
    if (ev.deltaY > 0) {
      this.inputUpdateState({ input: constants.controls.inputEvent.mouseWheelDown, isClicked: true });
    } else if (ev.deltaY) {
      this.inputUpdateState({ input: constants.controls.inputEvent.mouseWheelUp, isClicked: true });
    }
  };
}

export default Object.assign(Storage, {});
