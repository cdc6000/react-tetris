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
        valuePrecision = 2,
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

      const isValueDefault = value == valueDefault;
      const prevVal = parseFloat((value - step).toFixed(valuePrecision));
      const nextVal = parseFloat((value + step).toFixed(valuePrecision));
      const isValueMin = prevVal < valueMin;
      const isValueMax = nextVal > valueMax;

      return (
        <div
          className={`number-input${className ? " " + className : ""}`}
          disabled={disabled}
        >
          {Boolean(content) && <div className="text">{content}</div>}
          <div className="controls">
            <Button
              gameStore={gameStore}
              className="number-subtract-btn"
              navLayerID={navLayerID}
              navElemID={`${navElemID}-numberSubtractBtn`}
              canInteract={canInteract}
              disabled={disabled || isValueMin}
              onClick={() => {
                if (isValueMin) return;
                onChange?.(prevVal);
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
              disabled={disabled || isValueMax}
              onClick={() => {
                if (isValueMax) return;
                onChange?.(nextVal);
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
              disabled={disabled || isValueDefault}
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
