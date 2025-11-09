import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import * as constants from "@constants/index";

export default observer(
  class Button extends Component {
    constructor(props) {
      super(props);
    }

    //

    render() {
      const { children, gameStore, className, namePath, canInteract = true, disabled = false, onClick } = this.props;
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
          className={`button${className ? " " + className : ""}${isNavSelected ? " nav-selected" : ""}`}
          disabled={disabled}
          draggable={false}
          onClick={(ev) => {
            ev.preventDefault();
            if (!canInteract || disabled) return;
            onClick?.(ev);
          }}
          {...navigationData.renderProps}
        >
          {content}
        </a>
      );
    }
  }
);
