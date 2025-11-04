import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import * as constants from "@constants/index";

export default observer(
  class KeyboardKey extends Component {
    constructor(props) {
      super(props);
    }

    //

    render() {
      const { gameStore, input } = this.props;
      const { lang } = gameStore.observables;
      const { getLangString, stringConverter } = constants.lang;

      let { children } = this.props;
      let iconPath;
      let description;
      if (input) {
        // if (typeof input == "string") {
        //   let _input = input.split("input-")[1];
        //   const inputEventData = constants.controls.inputEventData[_input];
        //   if (inputEventData) {
        //     iconPath = inputEventData.icon?.();
        //   }
        // }

        if (!iconPath) {
          let nameGetStringResult = getLangString({ lang, pathArray: ["inputName", input] });
          if (nameGetStringResult.notFound) {
            children = input;
            if (typeof children == "string") {
              children = children.split("input-")[1];
              if (children.indexOf("Key") == 0) {
                children = children.substring(3);
              } else if (children.indexOf("Digit") == 0) {
                children = children.substring(5);
              }
            }
          } else {
            children = stringConverter(nameGetStringResult.string, []);
          }
        }

        let descriptionGetStringResult = getLangString({ lang, pathArray: ["inputDescription", input] });
        if (!descriptionGetStringResult.notFound) {
          description = stringConverter(descriptionGetStringResult.string, []);
        }
      }

      return (
        <div
          className={`kb-key${iconPath ? " icon" : ""}`}
          style={{ backgroundImage: iconPath ? `url("${iconPath}")` : undefined }}
          title={description || undefined}
        >
          {!Boolean(iconPath) && <div className="symbol">{children}</div>}
        </div>
      );
    }
  }
);
