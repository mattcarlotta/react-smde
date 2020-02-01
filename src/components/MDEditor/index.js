import React from "react";
import Toolbar from "~components/Toolbar";
import TextArea from "~components/TextArea";
import SvgIcon from "~icons";
import { getDefaultCommands } from "~commands";
import { classNames } from "~utils";
import Commander from "../Commander";

export class MDEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorHeight: props.minEditorHeight,
      tab: props.selectedTab
    };
    this.gripDrag = null;
  }

  componentDidMount() {
    document.addEventListener("mousemove", this.handleGripMouseMove);
    document.addEventListener("mouseup", this.handleGripMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener("mousemove", this.handleGripMouseMove);
    document.removeEventListener("mouseup", this.handleGripMouseUp);
  }

  handleTextChange = value => this.props.onChange(value);

  handleGripMouseDown = event => {
    this.gripDrag = {
      originalHeight: this.state.editorHeight,
      originalDragY: event.clientY
    };
  };

  handleGripMouseUp = () => (this.gripDrag = null);

  handleGripMouseMove = event => {
    if (this.gripDrag !== null) {
      const newHeight =
        this.gripDrag.originalHeight +
        event.clientY -
        this.gripDrag.originalDragY;
      if (
        newHeight >= this.props.minEditorHeight &&
        newHeight <= this.props.maxEditorHeight
      ) {
        this.setState(prevState => ({
          ...prevState,
          editorHeight:
            this.gripDrag.originalHeight +
            (event.clientY - this.gripDrag.originalDragY)
        }));
      }
    }
  };

  handleTabChange = newTab => {
    const { onTabChange } = this.props;
    if (onTabChange) onTabChange(newTab);
    else this.setState({ tab: newTab });
  };

  adjustEditorSize = () => {
    if (
      this.props.autoGrow &&
      this.textAreaRef &&
      this.textAreaRef.scrollHeight > this.textAreaRef.offsetHeight
    ) {
      this.setState({
        editorHeight: this.textAreaRef.scrollHeight + this.textAreaLineHeight
      });
    }
  };

  setTextAreaRef = element => {
    this.textAreaRef = element;

    if (this.props.autoGrow && element && window) {
      const computed = window.getComputedStyle(element);
      let lineHeight = parseInt(computed.getPropertyValue("line-height"), 10);

      if (isNaN(lineHeight)) {
        lineHeight = parseInt(computed.getPropertyValue("font-size"), 10) * 1.5;
      }

      this.textAreaLineHeight = lineHeight;
    }

    this.adjustEditorSize();
  };

  handleCommand = command => {
    const { start, end } = Commander(this.textAreaRef, command.name);
    this.textAreaRef.focus();
    this.textAreaRef.selectionStart = start;
    this.textAreaRef.selectionEnd = end;
  };

  render() {
    const { tab } = this.state;

    const {
      classes,
      className,
      loadSuggestions,
      maxEditorWidth,
      textAreaProps,
      suggestionTriggerCharacter
    } = this.props;

    return (
      <div
        className={classNames("mde", classes.mde, className)}
        style={{ width: maxEditorWidth }}
      >
        <Toolbar
          {...this.props}
          classes={classes.toolbar}
          onCommand={this.handleCommand}
          onTabChange={this.handleTabChange}
          tab={tab}
        />
        <TextArea
          {...this.props}
          suggestionsDropdownClasses={classes.suggestionsDropdown}
          editorRef={this.setTextAreaRef}
          onChange={this.handleTextChange}
          textAreaProps={textAreaProps}
          height={this.state.editorHeight}
          selectedTab={tab === "preview"}
          suggestionsEnabled={suggestionTriggerCharacter && loadSuggestions}
        />
        <div
          className={classNames("grip", classes.grip)}
          onMouseDown={this.handleGripMouseDown}
        >
          <SvgIcon icon="grip" />
        </div>
      </div>
    );
  }
}

MDEditor.defaultProps = {
  autoGrow: false,
  classes: {},
  commands: getDefaultCommands(),
  debounceSuggestions: 500,
  disablePreview: false,
  readOnly: false,
  markdownProps: {},
  maxEditorHeight: 500,
  maxEditorWidth: "100%",
  minEditorHeight: 250,
  minPreviewHeight: 200,
  suggestionTriggerCharacter: "@",
  tooltipPlacement: "top",
  value: ""
};

export default MDEditor;
