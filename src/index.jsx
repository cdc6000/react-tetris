import React from "react";
import * as ReactDOMClient from "react-dom/client";

import mobxInit from "./mobxInit";
import GameStore from "@stores/game";

import Main from "./components/Main";

if (module.hot) {
  module.hot.accept();
}

mobxInit();

const rootSelector = "#game";
const rootContainer = document.querySelector(rootSelector);

const gameStore = new GameStore();
if (!process.env.production) {
  window.__GameStore = gameStore;
}

const reactRoot = ReactDOMClient.createRoot(rootContainer);
reactRoot.render(
  <Main
    rootContainer={rootContainer}
    gameStore={gameStore}
  />
);
