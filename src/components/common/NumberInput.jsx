import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import Button from "./Button";

import * as constants from "@constants/index";

export default observer(
  class NumberInput extends Component {
    constructor(props) {
      super(props);
    }

    //

    render() {
      const {
        children,
        gameStore,
        className,
        canInteract = true,
        disabled = false,
        namePath,
        value,
        valueDefault,
        valueMin,
        valueMax,
        step,
        onChange,

        navLayerID,
        navElemID,
        navGroupID,
      } = this.props;
      const { lang } = gameStore.observables;
      const { getLangStringConverted } = constants.lang;

      let content = children;
      if (namePath) {
        content = getLangStringConverted({ lang, pathArray: namePath });
      }

      return (
        <div
          className={`number-input${className ? " " + className : ""}`}
          disabled={disabled}
        >
          <div className="text">{content}</div>
          <div className="controls">
            <Button
              gameStore={gameStore}
              className="number-subtract-btn"
              navLayerID={navLayerID}
              navElemID={`${navElemID}-numberSubtractBtn`}
              canInteract={canInteract}
              disabled={disabled}
              onClick={() => {
                const newVal = value - step;
                if (newVal < valueMin) return;
                onChange?.(newVal);
              }}
              navIsHorizontal={true}
              navGroupID={navGroupID}
            >
              <span>&#x2212;</span>
            </Button>
            <div className="value">{value}</div>
            <Button
              gameStore={gameStore}
              className="number-add-btn"
              navLayerID={navLayerID}
              navElemID={`${navElemID}-numberAddBtn`}
              canInteract={canInteract}
              disabled={disabled}
              onClick={() => {
                const newVal = value + step;
                if (newVal > valueMax) return;
                onChange?.(newVal);
              }}
              navIsHorizontal={true}
              navGroupID={navGroupID}
            >
              <span>&#x002B;</span>
            </Button>
            <Button
              gameStore={gameStore}
              className="number-add-btn"
              navLayerID={navLayerID}
              navElemID={`${navElemID}-numberResetBtn`}
              canInteract={canInteract}
              disabled={disabled || value == valueDefault}
              onClick={() => {
                onChange?.(valueDefault);
              }}
              navIsHorizontal={true}
              navGroupID={navGroupID}
            >
              <span>&#x2B8C;</span>
            </Button>
          </div>
        </div>
      );
    }
  }
);
