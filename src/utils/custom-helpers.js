import React, { Component, Fragment } from "react";
import InputTip from "@components/common/InputTip";

import * as constants from "@constants/index";

export function actionTriggersDrawer({ gameStore, triggers, concatWord, key }) {
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

export function insertBtnConversion({ gameStore, actions = [], triggers = [] }) {
  const { inputStore } = gameStore;
  return {
    type: "function",
    whatIsRegExp: true,
    what: `\\$\\{btns\\|([^\\}]+)\\}`,
    to: (key, matchData) => {
      const _triggers = [...inputStore.getAllActiveTriggersForActions({ actions }), ...triggers];
      return actionTriggersDrawer({
        gameStore,
        triggers: _triggers,
        concatWord: matchData[1],
        key,
      });
    },
  };
}
