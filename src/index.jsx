import React from "react";
import * as ReactDOMClient from "react-dom/client";

import mobxInit from "./mobxInit";
import GameStore from "@stores/game";

import MainViewController from "./components/MainViewController";

if (module.hot) {
  module.hot.accept();
}

mobxInit();
// test

const rootSelector = "#game";
const rootContainer = document.querySelector(rootSelector);

const gameStore = new GameStore();
if (!process.env.production) {
  window.__GameStore = gameStore;
}

const reactRoot = ReactDOMClient.createRoot(rootContainer);
reactRoot.render(
  <MainViewController
    rootContainer={rootContainer}
    gameStore={gameStore}
  />
);
