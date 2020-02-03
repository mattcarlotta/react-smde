import React from "react";
import PropTypes from "prop-types";
import Spinner from "~components/Spinner";
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

    if (!this.searchTimer && status !== "inactive") {
      this.setState({
        status: "active",
        suggestions: suggestions || [],
        focusIndex: 0
      });
    }
  };

  handleSuggestionFocus = index => this.setState({ focusIndex: index });

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
      // clear timeout
      this.clearSearchTimer();
      // load suggestions based upon current search string
      this.handleSuggestions(this.props.value.substr(this.state.startPosition));
    }, this.props.debounceSuggestions);
  };

  handleKeyDown = event => {
    const { key, ctrlKey } = event;
    const { focusIndex, suggestions, status, startPosition } = this.state;
    const {
      debounceSuggestions,
      disableHotKeys,
      onCommand,
      onTabChange,
      suggestionsEnabled,
      suggestionTriggerCharacter,
      tab
    } = this.props;
    const { selectionStart } = this.textAreaElement;
    const [suggestionsActive, suggestionsLoading, suggestionsInactive] = [
      "active",
      "loading",
      "inactive"
    ].map(s => status === s);
    const isNavKey = ["ArrowUp", "ArrowDown", "Tab", "Enter"].some(
      k => k === key
    );
    const isSpecialKey = ["Shift", "Alt", "CapsLock"].some(k => k === key);

    // if suggestions are enabled
    if (suggestionsEnabled) {
      // and active/loading and the following keys were pressed...
      if (
        (suggestionsActive || suggestionsLoading) &&
        (isNavKey || (ctrlKey && key === "k"))
      ) {
        // prevent default key presses within textarea when suggestions are active
        event.preventDefault();
      }

      if (suggestionsInactive && key === suggestionTriggerCharacter) {
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
          ((key === "Backspace" || (ctrlKey && key === "z")) &&
            selectionStart <= startPosition))
      ) {
        // else if key pressed is esc or backspace and cursor position is less than initial,
        // then reset back to initial state and return to prevent the bottom statement from executing
        this.clearSearchTimer();
        this.setState(initialState);
        return;
      } else if (key === "Enter" && suggestions.length > 0) {
        // else if enter was pressed, pass back the index that was focused upon
        this.handleSuggestionSelected(focusIndex);
      } else if (isNavKey) {
        // if arrow up/down or tab keys were pressed
        // move the focus of the suggestion up/down accordingly
        const focusDelta = key === "ArrowUp" ? -1 : 1;
        this.setState(prevState => ({
          ...prevState,
          focusIndex: mod(
            prevState.focusIndex + focusDelta,
            prevState.suggestions.length
          )
        }));
      } else if (!suggestionsInactive && !isSpecialKey && !ctrlKey) {
        // check if suggestions aren't inactive
        // set status to loading, reset suggestions and call handleSuggesitons
        // debounced handleSuggestionSearch sets status to active when resolved
        const showLoading = debounceSuggestions >= 300;
        this.setState(
          prevState => ({
            status: showLoading ? "loading" : prevState.status,
            suggestions: showLoading ? [] : prevState.suggestions
          }),
          () => this.handleSuggestionSearch()
        );
      }
    }

    // hot key commands (ctrl + key)
    if (
      !disableHotKeys &&
      ctrlKey &&
      (!suggestionsEnabled || suggestionsInactive)
    ) {
      switch (key) {
        case "b": {
          onCommand("bold");
          break;
        }
        case "k": {
          event.preventDefault();
          onCommand("link");
          break;
        }
        case "i": {
          onCommand("italic");
          break;
        }
        case "0": {
          onTabChange(tab === "write" ? "preview" : "write");
        }
        default:
          break;
      }
    }
  };

  render() {
    const {
      children,
      classes,
      height,
      readOnly,
      suggestionsEnabled,
      tab,
      textAreaProps,
      value
    } = this.props;
    const { caret, focusIndex, suggestions, status } = this.state;

    const selectedTab = tab === "preview";

    return (
      <div
        className={classNames(
          "mde-textarea-wrapper",
          classes.mdetextareawrapper
        )}
      >
        <textarea
          className={classNames("mde-textarea", classes.mdetextarea, {
            hidden: selectedTab
          })}
          style={{ height }}
          ref={this.handleTextAreaRef}
          onBlur={
            suggestionsEnabled && suggestions.length > 0
              ? this.handleBlur
              : undefined
          }
          onChange={this.handleOnChange}
          readOnly={readOnly}
          value={value}
          {...textAreaProps}
        />
        {selectedTab && (
          <div
            className={classNames("mde-preview", classes.mdepreview)}
            style={{ height }}
          >
            <div
              className={classNames(
                "mde-preview-content",
                classes.mdepreviewcontent
              )}
            >
              {children}
            </div>
          </div>
        )}
        {status === "active" ? (
          <SuggestionsDropdown
            classes={classes}
            caret={caret}
            suggestions={suggestions}
            onSuggestionSelected={this.handleSuggestionSelected}
            onSuggestionFocus={this.handleSuggestionFocus}
            focusIndex={focusIndex}
          />
        ) : null}
        {status === "loading" && <Spinner caret={caret} classes={classes} />}
      </div>
    );
  }
}

TextArea.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.objectOf(PropTypes.string),
  disableHotKeys: PropTypes.bool.isRequired,
  editorRef: PropTypes.func.isRequired,
  height: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onCommand: PropTypes.func.isRequired,
  onTabChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  suggestionsEnabled: PropTypes.func,
  tab: PropTypes.string.isRequired,
  textAreaProps: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.func])
  ),
  value: PropTypes.string
};

export default TextArea;
