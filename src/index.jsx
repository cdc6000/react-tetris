import React from 'react';
import * as ReactDOMClient from 'react-dom/client';

import Main from "./components/Main";

if (module.hot) {
  module.hot.accept();
}

const rootSelector = "#game";
const rootContainer = document.querySelector(rootSelector);
const reactRoot = ReactDOMClient.createRoot(rootContainer);
reactRoot.render(
  <Main rootContainer={rootContainer} />
);