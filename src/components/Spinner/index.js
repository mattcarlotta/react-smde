import React from "react";
import PropTypes from "prop-types";

const Spinner = ({ caret }) => (
  <ul className="mde-suggestions" style={{ left: caret.left, top: caret.top }}>
    <div className="loading">
      {[0, 1, 2].map(key => (
        <span key={key} />
      ))}
    </div>
  </ul>
);

Spinner.propTypes = {
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
