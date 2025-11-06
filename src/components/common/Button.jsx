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
      const {
        children,
        gameStore,
        className,
        namePath,
        canInteract = true,
        disabled = false,
        onClick,

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
          className={`button${className ? " " + className : ""}${isNavSelected ? " nav-selected" : ""}`}
          disabled={disabled}
          onClick={(ev) => {
            ev.preventDefault();
            if (!canInteract || disabled) return;
            onClick?.(ev);
          }}
          data-nav-able={canInteract && !disabled ? 1 : 0}
          data-nav-layer-id={navLayerID}
          data-nav-elem-id={navElemID}
          data-nav-hor={navIsHorizontal ? 1 : 0}
          data-nav-group-id={[navGroupID && navLayerID, navGroupID].filter(Boolean).join("-") || undefined}
        >
          {content}
        </a>
      );
    }
  }
);
