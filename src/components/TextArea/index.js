import React from "react";
import SuggestionsDropdown from "~components/SuggestionsDropdown";
import { classNames, getCaretCoordinates, insertText, mod } from "~utils";

const initialState = {
  status: "inactive",
  suggestions: [],
  focusIndex: null,
  startPosition: null,
  caret: {}
};

export class TextArea extends React.Component {
  state = initialState;

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    clearTimeout(this.timer);
  }

  handleTextAreaRef = element => {
    this.textAreaElement = element;
    this.props.editorRef(element);
  };

  handleOnChange = ({ target: { value } }) => this.props.onChange(value);

  handleBlur = () => this.setState(initialState);

  loadSuggestions = async (text = "") => {
    const suggestions = await this.props.loadSuggestions(text);
    const { status } = this.state;

    if (status !== "inactive") {
      this.setState(prevState => ({
        ...prevState,
        status: "active",
        suggestions,
        focusIndex: 0
      }));
    }
  };

  handleSuggestionSelected = index => {
    const { startPosition, suggestions } = this.state;

    this.textAreaElement.selectionStart = startPosition;

    insertText(this.textAreaElement, `${suggestions[index].value} `);

    this.handleBlur();
  };

  handleKeyDown = event => {
    const { key } = event;
    const { status, startPosition } = this.state;
    const { selectionStart } = this.textAreaElement;
    const suggestionsActive = status === "active";

    // if suggestions are active and the following keys were pressed...
    if (
      suggestionsActive &&
      (key === "ArrowUp" ||
        key === "ArrowDown" ||
        key === "Tab" ||
        key === "Enter")
    ) {
      // prevent default key presses within textarea
      event.preventDefault();
    } else if (!suggestionsActive && key === "@") {
      //  else if key pressed is @ and suggestions are inactive, update state and load suggestions
      this.setState(
        {
          status: "loading",
          startPosition: selectionStart + 1,
          caret: getCaretCoordinates(this.textAreaElement, "@")
        },
        () => this.loadSuggestions()
      );
    } else if (
      key === "Escape" ||
      (key === "Backspace" && selectionStart <= startPosition)
    ) {
      // else if key pressed is esc or backspace and cursor position is less than initial,
      // then reset back to initial state
      this.setState(initialState);
    }

    // check if suggestions are active
    // since updating top level state is async, we need to set a timeout to allow
    // this component to update before executing the following statements
    if (suggestionsActive) {
      // store the timer to clear it if the component is unmounted while still loading
      this.timer = setTimeout(() => {
        const { focusIndex, suggestions } = this.state;

        // if arrow up/down keys or tab were pressed
        if (key === "ArrowUp" || key === "ArrowDown" || key === "Tab") {
          // move the focus of the suggestion up/down accordingly
          const focusDelta = key === "ArrowUp" ? -1 : 1;
          this.setState(prevState => ({
            ...prevState,
            focusIndex: mod(
              prevState.focusIndex + focusDelta,
              prevState.suggestions.length
            )
          }));
        } else if (key === "Enter" && suggestions.length) {
          // else if enter was pressed, pass back the index that was focused upon
          this.handleSuggestionSelected(focusIndex);
        } else {
          // otherwise, load suggestions based upon current search string
          this.loadSuggestions(this.props.value.substr(startPosition));
        }
      }, 100);
    }
  };

  render() {
    const {
      classes,
      children,
      readOnly,
      textAreaProps,
      height,
      value,
      suggestionTriggerCharacters,
      loadSuggestions,
      selectedTab,
      suggestionsDropdownClasses
    } = this.props;

    const { caret, focusIndex, suggestions, status } = this.state;

    const suggestionsEnabled =
      suggestionTriggerCharacters &&
      suggestionTriggerCharacters.length &&
      loadSuggestions;

    return (
      <div className="mde-textarea-wrapper">
        <textarea
          className={classNames("mde-text", {
            ...classes.textArea,
            hidden: selectedTab
          })}
          style={{ height }}
          ref={this.handleTextAreaRef}
          onChange={this.handleOnChange}
          readOnly={readOnly}
          value={value}
          data-testid="text-area"
          onBlur={suggestionsEnabled ? this.handleBlur : undefined}
          {...textAreaProps}
        />
        {selectedTab && (
          <div
            className={classNames("mde-preview", classes)}
            style={{ height }}
          >
            {children}
          </div>
        )}
        {status === "active" && suggestions.length > 0 ? (
          <SuggestionsDropdown
            classes={suggestionsDropdownClasses}
            caret={caret}
            suggestions={suggestions}
            onSuggestionSelected={this.handleSuggestionSelected}
            focusIndex={focusIndex}
          />
        ) : null}
      </div>
    );
  }
}

export default TextArea;
