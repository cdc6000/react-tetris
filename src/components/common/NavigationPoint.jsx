import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import * as constants from "@constants/index";

export default observer(
  class NavigationPoint extends Component {
    constructor(props) {
      super(props);
    }

    //

    render() {
      const { gameStore } = this.props;
      const { navigationStore } = gameStore;

      const navigationData = navigationStore.getNavComponentData(this.props);

      return (
        <div
          className={`navigation-point`}
          {...navigationData.renderProps}
        />
      );
    }
  }
);
