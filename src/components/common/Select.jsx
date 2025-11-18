import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import * as constants from "@constants/index";

export default observer(
  class Select extends Component {
    constructor(props) {
      super(props);
    }

    //

    render() {
      const {
        gameStore,
        className,
        canInteract = true,
        disabled = false,
        value,
        defOptionName,
        title,
        options,
        onChange,
      } = this.props;
      const { navigationStore } = gameStore;
      const { lang } = gameStore.observables;
      const { getLangStringConverted } = constants.lang;

      const navigationData = navigationStore.getNavComponentData(this.props);
      const { isNavSelected } = navigationData.props;

      const selectedOption = options.find((_) => _.id == value) || { name: defOptionName || "nothing-selected" };

      return (
        <a
          href={"#"}
          className={`button select${className ? " " + className : ""}${isNavSelected ? " nav-selected" : ""}`}
          disabled={disabled}
          draggable={false}
          onClick={(ev) => {
            ev.preventDefault();
            if (!canInteract || disabled) return;
            gameStore.selectMenuOpen({ title, options, value, onChange });
          }}
          {...navigationData.renderProps}
        >
          <div className="text">
            {selectedOption.name || getLangStringConverted({ lang, pathArray: selectedOption.namePath })}
          </div>
        </a>
      );
    }
  }
);
