import React from "react";
import PropTypes from "prop-types";
import { classNames } from "~utils";

export const ToolbarButtonGroup = ({ children, classes }) => (
  <ul className={classNames("mde-header-group", classes.mdeheadergroup)}>
    {children}
  </ul>
);

ToolbarButtonGroup.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  classes: PropTypes.object
};

export default ToolbarButtonGroup;
