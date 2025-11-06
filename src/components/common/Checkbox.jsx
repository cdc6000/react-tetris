import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

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

      let content = children;
      if (namePath) {
        content = getLangStringConverted({ lang, pathArray: namePath });
      }

      return (
        <a
          href={"#"}
          className={`checkbox${value ? " checked" : ""}${className ? " " + className : ""}${isNavSelected ? " nav-selected" : ""}`}
          disabled={disabled}
          onClick={(ev) => {
            ev.preventDefault();
            if (!canInteract || disabled) return;
            onChange?.(!value, ev);
          }}
          data-nav-able={canInteract && !disabled ? 1 : 0}
          data-nav-layer-id={navLayerID}
          data-nav-elem-id={navElemID}
          data-nav-hor={navIsHorizontal ? 1 : 0}
          data-nav-group-id={[navGroupID && navLayerID, navGroupID].filter(Boolean).join("-") || undefined}
        >
          <input
            type="checkbox"
            checked={value}
            readOnly={true}
          />
          {content}
        </a>
      );
    }
  }
);
