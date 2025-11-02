import React, { Component, Fragment } from "react";
import KeyboardKey from "@components/common/KeyboardKey";

export function actionTriggersDrawer({ gameStore, triggers, concatWord, key }) {
  const elements = [];
  if (triggers.length) {
    if (triggers.length >= 2) {
      triggers.slice(0, triggers.length - 1).forEach((trigger, tIndex) => {
        if (tIndex > 0) elements.push(<Fragment key={`${key}-${tIndex}-1`}>{","}</Fragment>);
        elements.push(
          <KeyboardKey
            key={`${key}-${tIndex}-2`}
            gameStore={gameStore}
            input={trigger}
          />
        );
      });
    }
    if (triggers.length > 1) {
      elements.push(<Fragment key={`${key}-last-1`}>{concatWord}</Fragment>);
    }
    elements.push(
      <KeyboardKey
        key={`${key}-last-2`}
        gameStore={gameStore}
        input={triggers[triggers.length - 1]}
      />
    );

    return elements;
  } else {
    return "";
  }
}
