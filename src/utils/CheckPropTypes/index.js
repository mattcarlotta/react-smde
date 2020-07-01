export function checkPropTypes({
	autoGrow,
	children,
	classes,
	commands,
	debounceSuggestions,
	disableGrip,
	disableHotKeys,
	disablePreview,
	disableToolbar,
	hideGrip,
	editorRef,
	maxCharacterLength,
	maxEditorHeight,
	maxEditorWidth,
	minEditorHeight,
	onChange,
	readOnly,
	selectedTab,
	showCharacterLength,
	suggestionTriggerCharacter,
	textAreaProps,
	tooltipPlacement,
	value,
}) {
	if (!children)
		throw Error("The MDEditor must include a Markdown previewer as a child!");
	if (typeof value !== "string")
		throw Error("The MDEditor must include a string value property!");
	if (typeof onChange !== "function")
		throw Error("The MDEditor must include an onChange function property!");
	if (
		typeof selectedTab !== "string" ||
		(selectedTab !== "write" && selectedTab !== "preview")
	)
		throw Error(
			"The MDEditor was initialized with an invalid 'selectedTab' property. It must be a string that is either 'write' or 'preview'!",
		);
	if (typeof autoGrow !== "boolean")
		throw Error(
			"The MDEditor was initialized with an invalid 'autoGrow' property. It must be a boolean!",
		);
	if (typeof classes !== "object")
		throw Error(
			"The MDEditor was initialized with an invalid 'classes' property. It must be an object of strings!",
		);
	if (!Array.isArray(commands))
		throw Error(
			"The MDEditor was initialized with an invalid 'commands' property. It must be a single array of one or many arrays of grouped object commands!",
		);
	if (typeof debounceSuggestions !== "number")
		throw Error(
			"The MDEditor was initialized with an invalid 'debounceSuggestions' property. It must be a number!",
		);
	if (typeof disableGrip !== "boolean")
		throw Error(
			"The MDEditor was initialized with an invalid 'disableGrip' property. It must be a boolean!",
		);
	if (typeof disableHotKeys !== "boolean")
		throw Error(
			"The MDEditor was initialized with an invalid 'disableHotKeys' property. It must be a boolean!",
		);
	if (typeof disablePreview !== "boolean")
		throw Error(
			"The MDEditor was initialized with an invalid 'disablePreview' property. It must be a boolean!",
		);
	if (typeof disableToolbar !== "boolean")
		throw Error(
			"The MDEditor was initialized with an invalid 'disableToolbar' property. It must be a boolean!",
		);
	if (typeof hideGrip !== "boolean")
		throw Error(
			"The MDEditor was initialized with an invalid 'hideGrip' property. It must be a boolean!",
		);
	if (typeof editorRef !== "function")
		throw Error(
			"The MDEditor was initialized with an invalid 'editorRef' property. It must be a callback function!",
		);
	if (
		maxCharacterLength !== null &&
		typeof maxCharacterLength !== "string" &&
		typeof maxCharacterLength !== "number"
	)
		throw Error(
			"The MDEditor was initialized with an invalid 'maxCharacterLength' property. It must be a number or string!",
		);
	if (
		typeof maxEditorHeight !== "number" &&
		typeof maxEditorHeight !== "string"
	)
		throw Error(
			"The MDEditor was initialized with an invalid 'maxEditorHeight' property. It must be a number or string!",
		);
	if (typeof maxEditorWidth !== "number" && typeof maxEditorWidth !== "string")
		throw Error(
			"The MDEditor was initialized with an invalid 'maxEditorWidth' property. It must be a number or string!",
		);
	if (
		typeof minEditorHeight !== "number" &&
		typeof minEditorHeight !== "string"
	)
		throw Error(
			"The MDEditor was initialized with an invalid 'minEditorHeight' property. It must be a number or string!",
		);
	if (typeof readOnly !== "boolean")
		throw Error(
			"The MDEditor was initialized with an invalid 'readOnly' property. It must be a boolean!",
		);
	if (typeof showCharacterLength !== "boolean")
		throw Error(
			"The MDEditor was initialized with an invalid 'showCharacterLength' property. It must be a boolean!",
		);
	if (typeof suggestionTriggerCharacter !== "string")
		throw Error(
			"The MDEditor was initialized with an invalid 'suggestionTriggerCharacter' property. It must be a key string!",
		);
	if (typeof textAreaProps !== "object")
		throw Error(
			"The MDEditor was initialized with an invalid 'textAreaProps' property. It must be an object containing booleans, strings, numbers and/or functions!",
		);
	if (typeof tooltipPlacement !== "string")
		throw Error(
			"The MDEditor was initialized with an invalid 'tooltipPlacement' property. It must be a string containing one of the following: 'top','topLeft','topRight','bottom','bottomLeft','bottomRight','left','leftTop','leftBottom','right','rightTop' or'rightBottom'!",
		);
}

export default checkPropTypes;
