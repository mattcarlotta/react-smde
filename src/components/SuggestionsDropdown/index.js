import React from "react";
import PropTypes from "prop-types";
import { classNames } from "~utils";

export class SuggestionsDropdown extends React.PureComponent {
  handleSuggestionFocus = ({ currentTarget }) => {
    this.props.onSuggestionFocus(
      parseInt(currentTarget.attributes["data-index"].value, 10)
    );
  };

  handleSuggestionClick = ({ currentTarget }) => {
    this.props.onSuggestionSelected(
      parseInt(currentTarget.attributes["data-index"].value, 10)
    );
  };

  render = () => (
    <ul
      className={classNames(
        "mde-suggestions",
        this.props.classes.mdesuggestions
      )}
      style={{ left: this.props.caret.left, top: this.props.caret.top }}
    >
      {this.props.suggestions.length > 0 ? (
        this.props.suggestions.map(({ value }, i) => (
          <li
            key={i}
            onMouseDown={this.handleSuggestionClick}
            onMouseOver={this.handleSuggestionFocus}
            aria-selected={this.props.focusIndex === i}
            data-index={i}
          >
            {value}
          </li>
        ))
      ) : (
        <li
          className={classNames(
            "mde-no-suggestions",
            this.props.classes.mdenosuggestions
          )}
        >
          No results
        </li>
      )}
    </ul>
  );
}

SuggestionsDropdown.propTypes = {
  caret: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number
  }),
  classes: PropTypes.objectOf(PropTypes.string),
  focusIndex: PropTypes.number,
  onSuggestionSelected: PropTypes.func.isRequired,
  onSuggestionFocus: PropTypes.func.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string }))
};

export default SuggestionsDropdown;
