import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import * as constants from "@constants/index";

export default observer(
  class InputTip extends Component {
    constructor(props) {
      super(props);
    }

    //

    render() {
      const { children, gameStore, input, inputEvent } = this.props;
      const { lang } = gameStore.observables;
      const { getLangString, stringConverter, getLangStringConverted } = constants.lang;

      let _input = input;
      if (inputEvent) {
        _input = constants.controls.getInput(inputEvent);
      }

      let content = children;
      let iconPath;
      let description;
      if (_input) {
        // const inputData = constants.controls.inputData[_input];
        // if (inputData) {
        //   iconPath = inputData.icon?.();
        // }

        if (!iconPath) {
          let nameGetStringResult = getLangString({ lang, pathArray: ["inputName", _input] });
          if (nameGetStringResult.notFound) {
            content = _input;
            if (content.indexOf("Key") == 0) {
              content = content.substring(3);
            } else if (content.indexOf("Digit") == 0) {
              content = content.substring(5);
            }
          } else {
            content = stringConverter(nameGetStringResult.string);
          }
        }

        description = getLangStringConverted({ lang, pathArray: ["inputDescription", _input] });
      }

      return (
        <div
          className={`input-tip${iconPath ? " icon" : ""}`}
          style={{ backgroundImage: iconPath ? `url("${iconPath}")` : undefined }}
          title={description || undefined}
        >
          {!Boolean(iconPath) && <div className="symbol">{content}</div>}
        </div>
      );
    }
  }
);
