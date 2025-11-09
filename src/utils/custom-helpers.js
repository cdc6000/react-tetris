import React, { Component, Fragment } from "react";
import InputTip from "@components/common/InputTip";

import * as constants from "@constants/index";

export function actionTriggersInlineDrawer({ gameStore, triggers, concatWord, key }) {
  const elements = [];
  if (triggers.length) {
    if (triggers.length >= 2) {
      triggers.slice(0, triggers.length - 1).forEach((trigger, tIndex) => {
        if (tIndex > 0) elements.push(<Fragment key={`${key}-${tIndex}-1`}>,&nbsp;</Fragment>);
        elements.push(
          <InputTip
            key={`${key}-${tIndex}-2`}
            gameStore={gameStore}
            inputEvent={trigger}
          />
        );
      });
    }
    if (triggers.length > 1) {
      elements.push(<Fragment key={`${key}-last-1`}>&nbsp;{concatWord}&nbsp;</Fragment>);
    }
    elements.push(
      <InputTip
        key={`${key}-last-2`}
        gameStore={gameStore}
        inputEvent={triggers[triggers.length - 1]}
      />
    );

    return elements;
  } else {
    return "";
  }
}

export function actionTriggersAnimatedDrawer({ gameStore, triggers, isSmooth = false, key }) {
  if (triggers.length == 1) {
    return (
      <InputTip
        key={key}
        gameStore={gameStore}
        inputEvent={triggers[0]}
      />
    );
  } else if (triggers.length > 1) {
    return (
      <div
        key={key}
        className={`input-tips${isSmooth ? " smooth" : ""}`}
        style={{ "--input-tip-elements": triggers.length }}
      >
        {triggers.map((trigger, tIndex) => {
          return (
            <InputTip
              key={tIndex}
              gameStore={gameStore}
              inputEvent={trigger}
            />
          );
        })}
        {isSmooth && (
          <InputTip
            key={"last"}
            gameStore={gameStore}
            inputEvent={triggers[0]}
          />
        )}
      </div>
    );
  } else {
    return "";
  }
}

export function insertBtnConversion({ gameStore, actions = [], triggers = [], isCompact = false }) {
  const { inputStore } = gameStore;
  const drawFunction = isCompact ? actionTriggersAnimatedDrawer : actionTriggersInlineDrawer;
  return {
    type: "function",
    whatIsRegExp: true,
    what: `\\$\\{btns\\|([^\\}]+)\\}`,
    to: (key, matchData) => {
      const _triggers = [...inputStore.getAllActiveTriggersForActions({ actions }), ...triggers];
      return drawFunction({
        gameStore,
        triggers: _triggers,
        concatWord: matchData[1],
        // isSmooth: true,
        key,
      });
    },
  };
}
