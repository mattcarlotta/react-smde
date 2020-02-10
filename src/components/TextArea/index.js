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
	caret: {},
	currentPromise: 0,
};

export class TextArea extends React.Component {
	constructor(props) {
		super(props);
		this.state = initialState;
		this.promiseCount = 0;
		this.showLoading = props.debounceSuggestions >= 300;
	}

	componentDidMount() {
		document.addEventListener("keydown", this.handleKeyDown);
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.handleKeyDown);
		this.clearSearchTimer();
		this.clearVoidSuggestionTimer();
	}

	handleTextAreaRef = element => {
		this.textAreaElement = element;
		this.props.editorRef(element);
	};

	handleOnChange = ({ target: { value } }) => this.props.onChange(value);

	handleBlur = () => {
		this.clearSearchTimer();
		this.clearVoidSuggestionTimer();
		this.setState(initialState, () => (this.promiseCount = 0));
	};

	handleSuggestions = async (text, promise) => {
		const suggestions = await this.props.loadSuggestions(text);
		const { status, currentPromise } = this.state;

		// check that the current promise matches the incoming promise to avoid UI flashing
		if (currentPromise === promise && status !== "inactive") {
			this.setState(
				{
					status: "active",
					suggestions: suggestions || [],
					focusIndex: 0,
					currentPromise: 0,
				},
				() => (this.promiseCount = 0),
			);
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
		clearTimeout(this.searchTimer);
		this.searchTimer = null;
	};

	clearVoidSuggestionTimer = () => {
		clearInterval(this.voidSuggestionTimer);
		this.voidSuggestionTimer = null;
	};

	getSuggestionState = () =>
		["active", "loading", "inactive"].map(s => this.state.status === s);

	handleSuggestionSearch = () => {
		// console.log("triggered handleSuggestionSearch");
		// clear timeout
		this.clearSearchTimer();

		// update the promise count
		this.promiseCount = this.showLoading ? this.promiseCount + 1 : 0;

		// store the timeout
		this.searchTimer = setTimeout(() => {
			// load suggestions based upon current search string
			this.handleSuggestions(
				this.props.value.substr(this.state.startPosition),
				this.promiseCount,
			);
			// clear timeout
			this.clearSearchTimer();
		}, this.props.debounceSuggestions);
	};

	handleKeyDown = event => {
		const { key, ctrlKey } = event;
		const { focusIndex, suggestions, startPosition } = this.state;
		const {
			disableHotKeys,
			disablePreview,
			onCommand,
			onTabChange,
			suggestionsEnabled,
			suggestionTriggerCharacter,
			tab,
		} = this.props;
		const { selectionStart } = this.textAreaElement;
		const [
			suggestionsActive,
			suggestionsLoading,
			suggestionsInactive,
		] = this.getSuggestionState();
		const isNavKey = ["ArrowUp", "ArrowDown", "Tab", "Enter"].some(
			k => k === key,
		);
		const isSpecialKey = ["Shift", "Alt", "CapsLock", "Control"].some(
			k => k === key,
		);
		const undoKey = ctrlKey && key === "z";

		// if suggestions are enabled
		if (suggestionsEnabled) {
			// and active/loading and the following keys were pressed...
			if ((suggestionsActive || suggestionsLoading) && isNavKey) {
				// prevent default key presses within textarea when suggestions are active
				event.preventDefault();
			}

			if (suggestionsInactive && key === suggestionTriggerCharacter) {
				// else if key pressed is suggestionTriggerCharacter and suggestions are inactive,
				// update state and load suggestions
				this.textAreaElement.focus();
				this.setState(
					{
						status: this.showLoading ? "loading" : "active",
						startPosition: selectionStart + 1,
						caret: getCaretCoordinates(
							this.textAreaElement,
							suggestionTriggerCharacter,
						),
						currentPromise: this.showLoading ? 1 : 0,
					},
					() => this.handleSuggestionSearch(),
				);
			} else if (
				((suggestionsActive || suggestionsLoading) && key === "Escape") ||
				((key === "Backspace" || undoKey) &&
					selectionStart <= startPosition &&
					this.props.value.substr(startPosition - 1) !== "@")
			) {
				// else if key pressed is esc or backspace and cursor position is less than initial,
				// then reset back to initial state and return to prevent the bottom statement from executing
				return this.handleBlur();
			} else if (key === "Enter" && suggestions.length > 0) {
				// else if enter was pressed, pass back the index that was focused upon
				this.handleSuggestionSelected(focusIndex);
			} else if (isNavKey) {
				// if arrow up/down or tab keys were pressed
				// move the focus of the suggestion up/down accordingly
				const focusDelta = key === "ArrowUp" ? -1 : 1;
				this.setState(prevState => ({
					focusIndex: mod(
						prevState.focusIndex + focusDelta,
						prevState.suggestions.length,
					),
				}));
			} else if (!suggestionsInactive && !isSpecialKey) {
				// check if suggestions aren't inactive
				// set status to loading, reset suggestions and call handleSuggesitons
				// debounced handleSuggestionSearch sets status to active when resolved
				this.setState(
					prevState => ({
						status: this.showLoading ? "loading" : prevState.status,
						suggestions: this.showLoading ? [] : prevState.suggestions,
						currentPromise: this.showLoading ? prevState.currentPromise + 1 : 0,
					}),
					() => this.handleSuggestionSearch(),
				);
			}
		}

		// if the input is too fast/limited to two characters and immediately followed
		// by ctrl+z/backspace, then this will handle empty values
		if (this.voidSuggestionTimer) this.clearVoidSuggestionTimer();
		this.voidSuggestionTimer = setTimeout(() => {
			const { value } = this.props;
			if (
				suggestionsEnabled &&
				value.substr(startPosition - 1) !== "@" &&
				!value.substr(startPosition)
			) {
				this.handleBlur();
				return;
			}
		}, 50);

		// if in preview and ctrl+z was pressed, revert back to write tab.
		// not doing this, appears to lose history
		if (undoKey && tab === "preview") onTabChange();

		// hot key commands (ctrl + key)
		if (
			!disableHotKeys &&
			ctrlKey &&
			(!suggestionsEnabled || suggestionsInactive)
		) {
			switch (key) {
				case "b": {
					event.preventDefault();
					this.textAreaElement.focus();
					onCommand("bold");
					break;
				}
				case "k": {
					event.preventDefault();
					this.textAreaElement.focus();
					onCommand("link");
					break;
				}
				case "i": {
					event.preventDefault();
					this.textAreaElement.focus();
					onCommand("italic");
					break;
				}
				case "0": {
					if (!disablePreview) {
						event.preventDefault();
						this.textAreaElement.focus();
						onTabChange();
					}
					break;
				}
				default:
					break;
			}
		}
	};

	render() {
		const { classes, editorHeight } = this.props;
		const [suggestionsActive, suggestionsLoading] = this.getSuggestionState();
		const selectedTab = this.props.tab === "preview";

		return (
			<div
				className={classNames(
					"mde-textarea-wrapper",
					classes.mdetextareawrapper,
				)}
			>
				<textarea
					className={classNames("mde-textarea", classes.mdetextarea, {
						hidden: selectedTab,
					})}
					style={{ height: editorHeight }}
					ref={this.handleTextAreaRef}
					onBlur={
						this.props.suggestionsEnabled && this.state.suggestions.length > 0
							? this.handleBlur
							: null
					}
					onChange={this.handleOnChange}
					readOnly={this.props.readOnly}
					value={this.props.value}
					{...this.props.textAreaProps}
				/>
				{selectedTab && (
					<div
						className={classNames("mde-preview", classes.mdepreview)}
						style={{ height: editorHeight }}
					>
						<div
							className={classNames(
								"mde-preview-content",
								classes.mdepreviewcontent,
							)}
						>
							{this.props.children}
						</div>
					</div>
				)}
				{suggestionsActive ? (
					<SuggestionsDropdown
						{...this.props}
						{...this.state}
						onSuggestionSelected={this.handleSuggestionSelected}
						onSuggestionFocus={this.handleSuggestionFocus}
					/>
				) : null}
				{suggestionsLoading && <Spinner {...this.state} classes={classes} />}
			</div>
		);
	}
}

TextArea.propTypes = {
	children: PropTypes.node.isRequired,
	classes: PropTypes.objectOf(PropTypes.string),
	debounceSuggestions: PropTypes.number.isRequired,
	disableHotKeys: PropTypes.bool.isRequired,
	editorRef: PropTypes.func.isRequired,
	height: PropTypes.number,
	loadSuggestions: PropTypes.func,
	onChange: PropTypes.func.isRequired,
	onCommand: PropTypes.func.isRequired,
	onTabChange: PropTypes.func.isRequired,
	readOnly: PropTypes.bool,
	suggestionsEnabled: PropTypes.bool.isRequired,
	suggestionTriggerCharacter: PropTypes.string.isRequired,
	tab: PropTypes.string.isRequired,
	textAreaProps: PropTypes.objectOf(
		PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.func,
			PropTypes.number,
			PropTypes.string,
		]),
	),
	value: PropTypes.string,
};

export default TextArea;
