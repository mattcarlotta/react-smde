import React from "react";
import PropTypes from "prop-types";
import { classNames } from "~utils";

const Spinner = ({ caret, classes }) => (
  <ul
    className={classNames("mde-suggestions", classes.mdesuggestions)}
    style={{ left: caret.left, top: caret.top }}
  >
    <div className={classNames("mde-loading", classes.mdeloading)}>
      {[0, 1, 2].map(key => (
        <span key={key} />
      ))}
    </div>
  </ul>
);

Spinner.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  caret: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number
  })
};

Spinner.defaultProps = {
  caret: {
    top: 0,
    left: 0
  }
};

export default Spinner;
