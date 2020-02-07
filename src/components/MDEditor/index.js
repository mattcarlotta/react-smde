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
			tab: props.selectedTab,
			isDragging: false,
			originalHeight: 0,
			originalDragY: 0,
			textAreaOffsetHeight: 0,
			textAreaScrollHeight: 0,
		};
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
		this.setState(
			{
				textAreaScrollHeight: this.textAreaRef.scrollHeight,
				textAreaOffsetHeight: this.textAreaRef.offsetHeight,
			},
			() => this.adjustEditorSize(),
		);
	};

	handleGripMouseDown = ({ clientY }) => {
		this.setState(prevState => ({
			originalHeight: prevState.editorHeight,
			originalDragY: clientY,
			isDragging: true,
		}));
	};

	handleGripMouseUp = () =>
		this.setState({ isDragging: false, originalDragY: 0 });

	handleGripMouseMove = ({ clientY }) => {
		const { maxEditorHeight, minEditorHeight } = this.props;
		const newHeight =
			this.state.originalHeight + (clientY - this.state.originalDragY);

		if (
			this.state.isDragging &&
			newHeight >= parseInt(minEditorHeight, 10) &&
			newHeight <= parseInt(maxEditorHeight, 10)
		) {
			this.setState({ editorHeight: newHeight });
		}
	};

	handleTabChange = () =>
		this.setState(
			prevState => ({
				tab: prevState.tab === "write" ? "preview" : "write",
			}),
			() => this.textAreaRef.focus(),
		);

	adjustEditorSize = () => {
		const { autoGrow, maxEditorHeight, minEditorHeight } = this.props;
		const { textAreaOffsetHeight, textAreaScrollHeight } = this.state;

		if (autoGrow && textAreaScrollHeight > textAreaOffsetHeight) {
			this.setState(({ editorHeight, textAreaLineHeight }) => ({
				editorHeight:
					editorHeight >= parseInt(minEditorHeight, 10) &&
					editorHeight <= parseInt(maxEditorHeight, 10)
						? textAreaScrollHeight + textAreaLineHeight
						: editorHeight,
			}));
		}
	};

	setTextAreaRef = element => {
		this.textAreaRef = element;

		if (this.props.autoGrow && element && typeof window !== "undefined") {
			const computed = window.getComputedStyle(element);
			const lineHeight = parseInt(computed.getPropertyValue("line-height"), 10);

			this.setState({
				textAreaLineHeight: !isNaN(lineHeight)
					? lineHeight
					: parseInt(computed.getPropertyValue("font-size"), 10) * 1.5,
			});
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
			suggestionTriggerCharacter,
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
					suggestionsEnabled={suggestionTriggerCharacter && !!loadSuggestions}
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
	maxEditorHeight: 600,
	maxEditorWidth: "100%",
	minEditorHeight: 300,
	readOnly: false,
	selectedTab: "write",
	suggestionTriggerCharacter: "@",
	textAreaProps: { placeholder: "What's on your mind?" },
	tooltipPlacement: "top",
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
						PropTypes.func,
					]),
				),
				icon: PropTypes.node,
			}),
		),
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
			PropTypes.bool,
			PropTypes.func,
			PropTypes.number,
			PropTypes.string,
		]),
	),
	tooltipPlacement: PropTypes.string,
	value: PropTypes.string,
};

export default MDEditor;
