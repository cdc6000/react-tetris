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
      const { getLangString } = constants.lang;

      let { children } = this.props;
      if (input) {
        let getStringResult = getLangString({ lang, pathArray: ["inputName", input] });
        if (getStringResult.notFound) {
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
          children = getStringResult.string;
        }
      }

      return (
        <div className="kb-key">
          <div className="symbol">{children}</div>
        </div>
      );
    }
  }
);
