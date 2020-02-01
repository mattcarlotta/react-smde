import React from "react";
import Loader from "~components/Loader";
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
    this.clearSearchTimer();
  }

  handleTextAreaRef = element => {
    this.textAreaElement = element;
    this.props.editorRef(element);
  };

  handleOnChange = ({ target: { value } }) => this.props.onChange(value);

  handleBlur = () => this.setState(initialState);

  handleSuggestions = async (text = "") => {
    const suggestions = await this.props.loadSuggestions(text);
    const { status } = this.state;

    if (status !== "inactive") {
      this.setState({
        status: "active",
        suggestions: suggestions || [],
        focusIndex: 0
      });
    }
  };

  handleSuggestionSelected = index => {
    const { startPosition, suggestions } = this.state;
    this.textAreaElement.selectionStart = startPosition;
    insertText(this.textAreaElement, `${suggestions[index].value} `);
    this.handleBlur();
  };

  clearSearchTimer = () => {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = null;
  };

  handleSuggestionSearch = () => {
    // store the timer to clear it if the component is unmounted while still loading
    this.clearSearchTimer();
    this.searchTimer = setTimeout(() => {
      // otherwise, load suggestions based upon current search string
      this.handleSuggestions(this.props.value.substr(this.state.startPosition));
    }, this.props.debounceSuggestions);
  };

  handleKeyDown = event => {
    const { key } = event;
    const { focusIndex, suggestions, status, startPosition } = this.state;
    const { suggestionsEnabled, suggestionTriggerCharacter } = this.props;
    const { selectionStart } = this.textAreaElement;
    const suggestionsActive = status === "active";
    const suggestionsLoading = status === "loading";

    // if suggestions are enabled
    if (suggestionsEnabled) {
      // and active/loading and the following keys were pressed...
      if (
        (suggestionsActive || suggestionsLoading) &&
        (key === "ArrowUp" ||
          key === "ArrowDown" ||
          key === "Tab" ||
          key === "Enter")
      ) {
        // prevent default key presses within textarea when suggestions are active
        event.preventDefault();
      }

      if (!suggestionsActive && key === suggestionTriggerCharacter) {
        //  else if key pressed is suggestionTriggerCharacter and suggestions are inactive, update state and load suggestions
        this.setState(
          {
            isSearching: true,
            status: "loading",
            startPosition: selectionStart + 1,
            caret: getCaretCoordinates(
              this.textAreaElement,
              suggestionTriggerCharacter
            )
          },
          () => this.handleSuggestions()
        );
      } else if (
        (suggestionsActive || suggestionsLoading) &&
        (key === "Escape" ||
          (key === "Backspace" && selectionStart <= startPosition))
      ) {
        // else if key pressed is esc or backspace and cursor position is less than initial,
        // then reset back to initial state and return to prevent the bottom statement from executing
        this.setState(initialState);
        return;
      } else if (key === "ArrowUp" || key === "ArrowDown" || key === "Tab") {
        // if arrow up/down keys or tab were pressed
        // move the focus of the suggestion up/down accordingly
        const focusDelta = key === "ArrowUp" ? -1 : 1;
        this.setState(prevState => ({
          ...prevState,
          focusIndex: mod(
            prevState.focusIndex + focusDelta,
            prevState.suggestions.length
          )
        }));
      } else if (key === "Enter" && suggestions.length > 0) {
        // else if enter was pressed, pass back the index that was focused upon
        this.handleSuggestionSelected(focusIndex);
      } else if (
        status !== "inactive" &&
        key !== "ArrowDown" &&
        key !== "Tab" &&
        key !== "Enter"
      ) {
        // check if suggestions aren't inactive
        // set status to loading, reset suggestions and call handleSuggesitons
        // debounced handleSuggestionSearch sets status to active when resolved
        this.setState({ status: "loading", suggestions: [] }, () =>
          this.handleSuggestionSearch()
        );
      }
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
      suggestionsEnabled,
      selectedTab,
      suggestionsDropdownClasses
    } = this.props;

    const { caret, focusIndex, suggestions, status } = this.state;

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
          onBlur={
            suggestionsEnabled && suggestions.length > 0
              ? this.handleBlur
              : undefined
          }
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
        {status === "active" ? (
          <SuggestionsDropdown
            classes={suggestionsDropdownClasses}
            caret={caret}
            suggestions={suggestions}
            onSuggestionSelected={this.handleSuggestionSelected}
            focusIndex={focusIndex}
          />
        ) : null}
        {status === "loading" && <Loader caret={caret} />}
      </div>
    );
  }
}

export default TextArea;
