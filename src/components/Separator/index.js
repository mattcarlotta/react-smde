import React from "react";
import PropTypes from "prop-types";
import { classNames } from "~utils";

export const Separator = ({ classes }) => (
  <i className={classNames("mde-separator", classes.mdeseparator)}>|</i>
);

Separator.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string)
};

export default Separator;
