import React from "react";
import PropTypes from "prop-types";

const Loader = ({ caret }) => (
  <ul className="mde-suggestions" style={{ left: caret.left, top: caret.top }}>
    <div className="circle-loader">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </ul>
);

Loader.propTypes = {
  caret: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number
  })
};

Loader.defaultProps = {
  caret: {
    top: 0,
    left: 0
  }
};

export default Loader;
