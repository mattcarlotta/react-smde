import React from "react";
import PropTypes from "prop-types";
import Toolbar from "~components/Toolbar";
import TextArea from "~components/TextArea";
import SvgIcon from "~icons";
import { getDefaultCommands } from "~commands";
import { checkPropTypes, classNames } from "~utils";
import Commander from "../Commander";

export class MDEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorHeight: parseInt(props.minEditorHeight, 10),
      tab: props.selectedTab
    };
    this.gripDrag = null;
    checkPropTypes(props);
  }

  componentDidMount() {
    document.addEventListener("mousemove", this.handleGripMouseMove);
    document.addEventListener("mouseup", this.handleGripMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener("mousemove", this.handleGripMouseMove);
    document.removeEventListener("mouseup", this.handleGripMouseUp);
  }

  handleTextChange = value => {
    this.props.onChange(value);
    this.adjustEditorSize();
  };

  handleGripMouseDown = event => {
    this.gripDrag = {
      originalHeight: this.state.editorHeight,
      originalDragY: event.clientY
    };
  };

  handleGripMouseUp = () => (this.gripDrag = null);

  handleGripMouseMove = ({ clientY }) => {
    if (this.gripDrag !== null) {
      const newHeight =
        this.gripDrag.originalHeight + clientY - this.gripDrag.originalDragY;
      if (
        newHeight >= parseInt(this.props.minEditorHeight, 10) &&
        newHeight <= parseInt(this.props.maxEditorHeight, 10)
      ) {
        this.setState({
          editorHeight:
            this.gripDrag.originalHeight +
            (clientY - this.gripDrag.originalDragY)
        });
      }
    }
  };

  handleTabChange = () =>
    this.setState(
      prevState => ({
        tab: prevState.tab === "write" ? "preview" : "write"
      }),
      () => this.textAreaRef.focus()
    );

  adjustEditorSize = () => {
    if (
      this.props.autoGrow &&
      this.textAreaRef &&
      this.textAreaRef.scrollHeight > this.textAreaRef.offsetHeight
    ) {
      this.setState(prevState => ({
        editorHeight:
          prevState.editorHeight >= parseInt(this.props.minEditorHeight, 10) &&
          prevState.editorHeight <= parseInt(this.props.maxEditorHeight, 10)
            ? this.textAreaRef.scrollHeight + this.textAreaLineHeight
            : prevState.editorHeight
      }));
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
    const { start, end } = Commander(this.textAreaRef, command);
    this.textAreaRef.focus();
    this.textAreaRef.selectionStart = start;
    this.textAreaRef.selectionEnd = end;
  };

  render() {
    const {
      classes,
      disableGrip,
      disableHotKeys,
      disableToolbar,
      loadSuggestions,
      maxEditorWidth,
      textAreaProps,
      suggestionTriggerCharacter
    } = this.props;

    return (
      <div
        className={classNames("mde", classes.mde)}
        style={{ maxWidth: maxEditorWidth }}
      >
        {!disableToolbar && (
          <Toolbar
            {...this.props}
            {...this.state}
            onCommand={this.handleCommand}
            onTabChange={this.handleTabChange}
          />
        )}
        <TextArea
          {...this.props}
          {...this.state}
          editorRef={this.setTextAreaRef}
          disableHotKeys={disableHotKeys}
          onCommand={this.handleCommand}
          onChange={this.handleTextChange}
          onTabChange={this.handleTabChange}
          suggestionsEnabled={suggestionTriggerCharacter && loadSuggestions}
          textAreaProps={textAreaProps}
        />
        {!disableGrip && (
          <div
            className={classNames("mde-grip", classes.grip)}
            onMouseDown={this.handleGripMouseDown}
          >
            <SvgIcon icon="grip" />
          </div>
        )}
      </div>
    );
  }
}

MDEditor.defaultProps = {
  autoGrow: false,
  classes: {},
  commands: getDefaultCommands(),
  debounceSuggestions: 300,
  disableGrip: false,
  disableHotKeys: false,
  disablePreview: false,
  disableToolbar: false,
  maxEditorHeight: 500,
  maxEditorWidth: "100%",
  minEditorHeight: 250,
  readOnly: false,
  selectedTab: "write",
  suggestionTriggerCharacter: "@",
  textAreaProps: { placeholder: "What's on your mind?" },
  tooltipPlacement: "top"
};

MDEditor.propTypes = {
  autoGrow: PropTypes.bool,
  classes: PropTypes.objectOf(PropTypes.string),
  commands: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        tooltip: PropTypes.string,
        buttonProps: PropTypes.objectOf(
          PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.func
          ])
        ),
        icon: PropTypes.node
      })
    )
  ),
  debounceSuggestions: PropTypes.number,
  disableGrip: PropTypes.bool.isRequired,
  disableHotKeys: PropTypes.bool.isRequired,
  disablePreview: PropTypes.bool.isRequired,
  disableToolbar: PropTypes.bool.isRequired,
  maxEditorHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  maxEditorWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  minEditorHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  selectedTab: PropTypes.string,
  suggestionTriggerCharacter: PropTypes.string,
  textAreaProps: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
      PropTypes.func,
      PropTypes.bool
    ])
  ),
  tooltipPlacement: PropTypes.string,
  value: PropTypes.string
};

export default MDEditor;
