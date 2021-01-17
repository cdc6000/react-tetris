import React from "react";
import ReactDOM from "react-dom";

import MainContainer from "./components/MainContainer";

require("./style.scss");

if (module.hot)
{
  module.hot.accept();
}

var rootElement = document.getElementById('globalContainer');

ReactDOM.render(
  <MainContainer
    someAttr={rootElement.getAttribute("someAttr")}
  />,
  rootElement
);