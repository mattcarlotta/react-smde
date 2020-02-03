import React from "react";
import PropTypes from "prop-types";
import { classNames } from "~utils";

export const ToolbarButtonGroup = ({ children, classes }) => (
  <ul className={classNames("mde-toolbar-group", classes.mdetoolbargroup)}>
    {children}
  </ul>
);

ToolbarButtonGroup.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  classes: PropTypes.objectOf(PropTypes.string)
};

export default ToolbarButtonGroup;
