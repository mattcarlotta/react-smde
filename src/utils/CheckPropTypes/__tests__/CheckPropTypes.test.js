import { getDefaultCommands } from "~commands";
import CheckPropTypes from "../index";

const onChange = jest.fn();
const value = "";
const children = <p>Previewer</p>;

const initProps = {
	autoGrow: false,
	classes: {},
	children,
	commands: getDefaultCommands(),
	debounceSuggestions: 300,
	disableGrip: false,
	disableHotKeys: false,
	disablePreview: false,
	disableToolbar: false,
	maxEditorHeight: 600,
	maxEditorWidth: "100%",
	minEditorHeight: 300,
	onChange,
	readOnly: false,
	selectedTab: "write",
	suggestionTriggerCharacter: "@",
	textAreaProps: { placeholder: "What's on your mind?" },
	tooltipPlacement: "top",
	value,
};

describe("Check MDEditor PropTypes", () => {
	it("initially doesn't throw any errors", () => {
		expect(() => CheckPropTypes(initProps)).not.toThrow();
	});

	it("handles children type checks", () => {
		expect(() => CheckPropTypes({ ...initProps, children: undefined })).toThrow(
			"The MDEditor must include a Markdown previewer as a child!",
		);
	});

	it("handles value type checks", () => {
		expect(() => CheckPropTypes({ ...initProps, value: undefined })).toThrow(
			"The MDEditor must include a string value property!",
		);
	});

	it("handles onChange type checks", () => {
		expect(() => CheckPropTypes({ ...initProps, onChange: undefined })).toThrow(
			"The MDEditor must include an onChange function property!",
		);
	});

	it("handles selectedTab type checks", () => {
		expect(() =>
			CheckPropTypes({ ...initProps, selectedTab: undefined }),
		).toThrow(
			"The MDEditor was initialized with an invalid 'selectedTab' property. It must be a string that is either 'write' or 'preview'!",
		);

		expect(() =>
			CheckPropTypes({ ...initProps, selectedTab: "badtab" }),
		).toThrow(
			"The MDEditor was initialized with an invalid 'selectedTab' property. It must be a string that is either 'write' or 'preview'!",
		);

		expect(() =>
			CheckPropTypes({ ...initProps, selectedTab: "preview" }),
		).not.toThrow();
	});

	it("handles autoGrow type checks", () => {
		expect(() => CheckPropTypes({ ...initProps, autoGrow: undefined })).toThrow(
			"The MDEditor was initialized with an invalid 'autoGrow' property. It must be a boolean!",
		);
	});

	it("handles classes type checks", () => {
		expect(() => CheckPropTypes({ ...initProps, classes: undefined })).toThrow(
			"The MDEditor was initialized with an invalid 'classes' property. It must be an object of strings!",
		);
	});

	it("handles commands type checks", () => {
		expect(() => CheckPropTypes({ ...initProps, commands: undefined })).toThrow(
			"The MDEditor was initialized with an invalid 'commands' property. It must be a single array of one or many arrays of grouped object commands!",
		);
	});

	it("handles debounceSuggestions type checks", () => {
		expect(() =>
			CheckPropTypes({ ...initProps, debounceSuggestions: undefined }),
		).toThrow(
			"The MDEditor was initialized with an invalid 'debounceSuggestions' property. It must be a number!",
		);
	});

	it("handles disableGrip type checks", () => {
		expect(() =>
			CheckPropTypes({ ...initProps, disableGrip: undefined }),
		).toThrow(
			"The MDEditor was initialized with an invalid 'disableGrip' property. It must be a boolean!",
		);
	});

	it("handles disableHotKeys type checks", () => {
		expect(() =>
			CheckPropTypes({ ...initProps, disableHotKeys: undefined }),
		).toThrow(
			"The MDEditor was initialized with an invalid 'disableHotKeys' property. It must be a boolean!",
		);
	});

	it("handles disablePreview type checks", () => {
		expect(() =>
			CheckPropTypes({ ...initProps, disablePreview: undefined }),
		).toThrow(
			"The MDEditor was initialized with an invalid 'disablePreview' property. It must be a boolean!",
		);
	});

	it("handles disableToolbar type checks", () => {
		expect(() =>
			CheckPropTypes({ ...initProps, disableToolbar: undefined }),
		).toThrow(
			"The MDEditor was initialized with an invalid 'disableToolbar' property. It must be a boolean!",
		);
	});

	it("handles maxEditorHeight type checks", () => {
		expect(() =>
			CheckPropTypes({ ...initProps, maxEditorHeight: undefined }),
		).toThrow(
			"The MDEditor was initialized with an invalid 'maxEditorHeight' property. It must be a number or string!",
		);
	});

	it("handles maxEditorWidth type checks", () => {
		expect(() =>
			CheckPropTypes({ ...initProps, maxEditorWidth: undefined }),
		).toThrow(
			"The MDEditor was initialized with an invalid 'maxEditorWidth' property. It must be a number or string!",
		);
	});

	it("handles minEditorHeight type checks", () => {
		expect(() =>
			CheckPropTypes({ ...initProps, minEditorHeight: undefined }),
		).toThrow(
			"The MDEditor was initialized with an invalid 'minEditorHeight' property. It must be a number or string!",
		);
	});

	it("handles readOnly type checks", () => {
		expect(() => CheckPropTypes({ ...initProps, readOnly: undefined })).toThrow(
			"The MDEditor was initialized with an invalid 'readOnly' property. It must be a boolean!",
		);
	});

	it("handles suggestionTriggerCharacter type checks", () => {
		expect(() =>
			CheckPropTypes({ ...initProps, suggestionTriggerCharacter: undefined }),
		).toThrow(
			"The MDEditor was initialized with an invalid 'suggestionTriggerCharacter' property. It must be a key string!",
		);
	});

	it("handles textAreaProps type checks", () => {
		expect(() =>
			CheckPropTypes({ ...initProps, textAreaProps: undefined }),
		).toThrow(
			"The MDEditor was initialized with an invalid 'textAreaProps' property. It must be an object containing booleans, strings, numbers and/or functions!",
		);
	});

	it("handles tooltipPlacement type checks", () => {
		expect(() =>
			CheckPropTypes({ ...initProps, tooltipPlacement: undefined }),
		).toThrow(
			"The MDEditor was initialized with an invalid 'tooltipPlacement' property. It must be a string containing one of the following: 'top','topLeft','topRight','bottom','bottomLeft','bottomRight','left','leftTop','leftBottom','right','rightTop' or'rightBottom'!",
		);
	});
});
