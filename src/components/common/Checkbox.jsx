import React, { Component, Fragment } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react";

import Button from "./Button";

import * as constants from "@constants/index";

export default observer(
  class Checkbox extends Component {
    constructor(props) {
      super(props);
    }

    //

    render() {
      const { className, value, onChange } = this.props;

      return (
        <Button
          {...this.props}
          className={`checkbox${value ? " pressed" : ""}${className ? " " + className : ""}`}
          onClick={() => {
            onChange?.(!value);
          }}
        />
      );
    }
  }
);
