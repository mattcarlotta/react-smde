import React from "react";
import PropTypes from "prop-types";
import { classNames } from "../util/ClassNames";

export const ToolbarButtonGroup = ({ children }) => (
  <ul className={classNames("mde-header-group")}>{children}</ul>
);

ToolbarButtonGroup.propTypes = {
  children: PropTypes.number.isRequired
};
