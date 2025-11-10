import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import Button from "./Button";

import * as constants from "@constants/index";

export default observer(
  class Checkbox extends Component {
    constructor(props) {
      super(props);
    }

    //

    render() {
      const {
        children,
        gameStore,
        className,
        namePath,
        canInteract = true,
        disabled = false,
        value,
        onChange,
      } = this.props;
      const { navigationStore } = gameStore;
      const { lang } = gameStore.observables;
      const { getLangStringConverted } = constants.lang;

      const navigationData = navigationStore.getNavComponentData(this.props);
      const { isNavSelected } = navigationData.props;

      let content = children;
      if (namePath) {
        content = getLangStringConverted({ lang, pathArray: namePath });
      }

      return (
        <a
          href={"#"}
          className={`checkbox${value ? " checked" : ""}${className ? " " + className : ""}${isNavSelected ? " nav-selected" : ""}`}
          disabled={disabled}
          draggable={false}
          onClick={(ev) => {
            ev.preventDefault();
            if (!canInteract || disabled) return;
            onChange?.(!value, ev);
          }}
          {...navigationData.renderProps}
        >
          {/* <input
            type="checkbox"
            checked={value}
            readOnly={true}
          /> */}
          <div
            className={`button${value ? " pressed" : ""}${isNavSelected ? " nav-selected" : ""}`}
          >&#x2714;</div>
          <div className="content">{content}</div>
        </a>
      );
    }
  }
);
