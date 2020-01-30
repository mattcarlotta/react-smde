import React from "react";
import { classNames } from "~utils";

export class SuggestionsDropdown extends React.PureComponent {
  handleSuggestionClick = ({ currentTarget }) => {
    this.props.onSuggestionSelected(
      parseInt(currentTarget.attributes["data-index"].value)
    );
  };

  render = () => (
    <ul
      className={classNames("mde-suggestions", this.props.classes)}
      style={{ left: this.props.caret.left, top: this.props.caret.top }}
    >
      {this.props.suggestions.map(({ value }, i) => (
        <li
          onMouseDown={this.handleSuggestionClick}
          key={i}
          aria-selected={Boolean(this.props.focusIndex === i).toString()}
          data-index={i}
        >
          {value}
        </li>
      ))}
    </ul>
  );
}

export default SuggestionsDropdown;
