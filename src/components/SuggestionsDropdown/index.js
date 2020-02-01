import React from "react";
import { classNames } from "~utils";

export class SuggestionsDropdown extends React.PureComponent {
  handleSuggestionClick = ({ currentTarget }) => {
    this.props.onSuggestionSelected(
      parseInt(currentTarget.attributes["data-index"].value)
    );
  };

  render = () => {
    const { focusIndex, suggestions } = this.props;
    return (
      <ul
        className={classNames("mde-suggestions", this.props.classes)}
        style={{ left: this.props.caret.left, top: this.props.caret.top }}
      >
        {suggestions.length > 0 ? (
          suggestions.map(({ value }, i) => (
            <li
              onMouseDown={this.handleSuggestionClick}
              key={i}
              aria-selected={Boolean(focusIndex === i).toString()}
              data-index={i}
            >
              {value}
            </li>
          ))
        ) : (
          <li>No results</li>
        )}
      </ul>
    );
  };
}

export default SuggestionsDropdown;
