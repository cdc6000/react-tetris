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
        options,
        onChange,

        navLayerID,
        navElemID,
        navIsHorizontal,
        navGroupID,
      } = this.props;
      const { navigationStore } = gameStore;
      const { navCurrentElemData } = navigationStore.observables;
      const { lang } = gameStore.observables;
      const { getLangStringConverted } = constants.lang;

      const isNavSelected =
        canInteract && navLayerID == navCurrentElemData.layerID && navElemID == navCurrentElemData.elemID;

      return (
        <select
          className={`select${className ? " " + className : ""}${isNavSelected ? " nav-selected" : ""}`}
          disabled={disabled}
          value={value}
          onChange={(ev) => {
            if (!canInteract || disabled) return;
            onChange?.(ev.target.value, ev);
          }}
          data-nav-able={canInteract && !disabled ? 1 : 0}
          data-nav-layer-id={navLayerID}
          data-nav-elem-id={navElemID}
          data-nav-hor={navIsHorizontal ? 1 : 0}
          data-nav-group-id={[navGroupID && navLayerID, navGroupID].filter(Boolean).join("-") || undefined}
        >
          {Boolean(defOptionName) && (
            <option
              value={0}
              disabled={true}
              hidden={true}
            >
              {defOptionName}
            </option>
          )}
          {options.map((item) => {
            return (
              <option
                key={item.id}
                value={item.id}
              >
                {item.name || getLangStringConverted({ lang, pathArray: item.namePath })}
              </option>
            );
          })}
        </select>
      );
    }
  }
);
