import { insertText } from "~utils";
import { TextArea } from "../index";

const editorRef = jest.fn();
const onChange = jest.fn();
const onCommand = jest.fn();
const onTabChange = jest.fn();
const loadSuggestions = jest.fn();

const initProps = {
	className: "testing",
	children: <p>Markdown preview</p>,
	classes: {},
	debounceSuggestions: 300,
	disablePreview: false,
	disableHotKeys: false,
	editorRef,
	height: 300,
	loadSuggestions,
	maxCharacterLength: null,
	onChange,
	onCommand,
	onTabChange,
	readOnly: false,
	showCharacterLength: false,
	suggestionsEnabled: false,
	suggestionTriggerCharacter: "@",
	tab: "write",
	textAreaProps: { placeholder: "What's on your mind?" },
	value: "Hello",
};

jest.mock("~utils", () => ({
	...require.requireActual("~utils"),
	insertText: jest.fn(),
	replaceText: jest.fn(),
}));

const preventDefault = jest.fn();
const suggestions = [{ value: "Bob" }, { value: "Nancy" }];

const eventListener = {};
document.addEventListener = (evt, cb) => (eventListener[evt] = cb);
document.removeEventListener = jest.fn();

jest.useFakeTimers();

describe("TextArea", () => {
	let wrapper;
	let textarea;
	let textareaNode;
	let keydownHandler;
	beforeEach(() => {
		wrapper = mount(<TextArea {...initProps} />);
		textarea = () => wrapper.find("textarea");
		textareaNode = () => textarea().getDOMNode();
		keydownHandler = event =>
			eventListener.keydown({ preventDefault, ctrlKey: false, ...event });
	});

	afterEach(() => {
		editorRef.mockClear();
		insertText.mockClear();
		loadSuggestions.mockClear();
		onChange.mockClear();
		onCommand.mockClear();
		onTabChange.mockClear();
		preventDefault.mockClear();
		document.removeEventListener.mockClear();
	});

	it("renders without errors", () => {
		expect(wrapper.find("[data-testid='mde-textarea-wrapper']")).toExist();
	});

	it("utilizes the outside controlled value", () => {
		expect(textarea()).toHaveValue("Hello");
	});

	it("calls 'editorRef' function after loading", () => {
		expect(editorRef).toHaveBeenCalledWith(textareaNode());
	});

	it("calls 'onChange' when the textarea text is changed", () => {
		textarea().simulate("change", { target: { value: "Hello\nGoodbye" } });
		expect(onChange).toHaveBeenCalledWith("Hello\nGoodbye");
	});

	it("resets the tab if 'ctrl+z' was pressed", () => {
		wrapper.setProps({ tab: "preview" });

		keydownHandler({ key: "z", ctrlKey: true });
		wrapper.update();

		expect(onTabChange).toHaveBeenCalledTimes(1);
	});

	it("doesn't load suggestions if 'suggestionsEnabled' is false", async () => {
		wrapper.setProps({ suggestionsEnabled: false });
		keydownHandler({ key: "@" });
		jest.runAllTimers();
		wrapper.update();

		expect(wrapper.find("SuggestionsDropdown")).not.toExist();
		expect(wrapper.find("Spinner")).not.toExist();
	});

	it("doesn't update the textarea when in 'readOnly'", () => {
		document.removeEventListener.mockClear();
		wrapper = mount(<TextArea {...initProps} readOnly />);

		const spy = jest.spyOn(wrapper.instance(), "handleKeyDown");
		wrapper.instance().forceUpdate();

		keydownHandler({ key: "t" });
		jest.runAllTimers();
		wrapper.update();

		expect(spy).toHaveBeenCalledTimes(0);

		wrapper.unmount();

		expect(document.removeEventListener).not.toHaveBeenCalled();
	});

	it("handles 'bold' hot key", async () => {
		keydownHandler({ key: "b", ctrlKey: true });
		jest.runAllTimers();
		wrapper.update();

		expect(preventDefault).toHaveBeenCalledTimes(1);
		expect(onCommand).toHaveBeenCalledWith("bold");
	});

	it("handles 'link' hot key", async () => {
		keydownHandler({ key: "k", ctrlKey: true });
		jest.runAllTimers();
		wrapper.update();

		expect(preventDefault).toHaveBeenCalledTimes(1);
		expect(onCommand).toHaveBeenCalledWith("link");
	});

	it("handles 'italic' hot key", async () => {
		keydownHandler({ key: "i", ctrlKey: true });
		jest.runAllTimers();
		wrapper.update();

		expect(preventDefault).toHaveBeenCalledTimes(1);
		expect(onCommand).toHaveBeenCalledWith("italic");
	});

	it("handles 'preview/write' hot key", async () => {
		keydownHandler({ key: "0", ctrlKey: true });
		jest.runAllTimers();
		wrapper.update();

		expect(preventDefault).toHaveBeenCalledTimes(1);
		expect(onTabChange).toHaveBeenCalledTimes(1);

		preventDefault.mockClear();
		onTabChange.mockClear();

		wrapper.setProps({ disablePreview: true });
		wrapper.update();

		keydownHandler({ key: "0", ctrlKey: true });
		expect(preventDefault).toHaveBeenCalledTimes(0);
		expect(onTabChange).toHaveBeenCalledTimes(0);
	});

	it("doesn't handle hot keys if 'disableHotKeys' is true", async () => {
		wrapper.setProps({ disableHotKeys: true });
		keydownHandler({ key: "0", ctrlKey: true });
		jest.runAllTimers();
		wrapper.update();

		expect(onTabChange).toHaveBeenCalledTimes(0);
	});

	it("doesn't display a loading indicator if 'debounceSuggestions' is less than 300 and initiated", () => {
		wrapper = mount(
			<TextArea
				{...initProps}
				debounceSuggestions={0}
				suggestionsEnabled
				value=""
			/>,
		);
		keydownHandler({ key: "@" });
		wrapper.update();

		expect(wrapper).toHaveState({
			status: "active",
			currentPromise: 0,
		});
		expect(wrapper.find("Spinner")).not.toExist();
	});

	it("doesn't display a loading indicator if 'debounceSuggestions' is less than 300 and refiltered", () => {
		wrapper = mount(
			<TextArea
				{...initProps}
				debounceSuggestions={0}
				suggestionsEnabled
				value=""
			/>,
		);
		wrapper.setState({ status: "active", suggestions });
		keydownHandler({ key: "b" });
		wrapper.update();

		expect(wrapper).toHaveState({
			status: "active",
			suggestions,
			currentPromise: 0,
		});
		expect(wrapper.find("Spinner")).not.toExist();
	});

	describe("Suggestions", () => {
		beforeEach(() => {
			wrapper.setProps({
				suggestionsEnabled: true,
				value: " ",
			});
			wrapper.setState({ suggestions });
		});

		it("calls 'handleBlur' when the textarea has suggestions", () => {
			textarea().simulate("blur");

			expect(wrapper).toHaveState("suggestions", []);
		});

		it("displays a loading indicator when suggestions have been triggered", () => {
			keydownHandler({ key: "@" });
			wrapper.update();

			expect(wrapper).toHaveState({
				status: "loading",
				startPosition: 1,
				caret: expect.objectContaining({
					top: 0,
					left: 0,
				}),
				currentPromise: 1,
			});

			expect(wrapper.find("Spinner")).toExist();
		});

		it("initially displays all suggestions", async () => {
			loadSuggestions.mockReturnValue(suggestions);
			keydownHandler({ key: "@" });
			jest.runAllTimers();
			wrapper.update();
			expect(loadSuggestions).toHaveBeenCalledWith("");

			await flushPromises();
			wrapper.update();

			expect(wrapper).toHaveState({
				status: "active",
				suggestions,
			});

			expect(wrapper.find("SuggestionsDropdown")).toExist();
			expect(
				wrapper
					.find("[data-testid='mde-suggestions']")
					.find("li")
					.first()
					.text(),
			).toContain("Bob", "Nancy");

			wrapper
				.find("[data-testid='mde-suggestions']")
				.find("li")
				.first()
				.simulate("mousedown", { currentTarget: 0 });

			expect(insertText).toHaveBeenCalledWith(textareaNode(), "Bob ");
		});

		it("handles a suggestion click", async () => {
			loadSuggestions.mockReturnValue(suggestions);
			keydownHandler({ key: "@" });
			jest.runAllTimers();
			wrapper.update();
			expect(loadSuggestions).toHaveBeenCalledWith("");

			await flushPromises();
			wrapper.update();

			wrapper
				.find("[data-testid='mde-suggestions']")
				.find("li")
				.first()
				.simulate("mousedown", { currentTarget: 0 });

			expect(insertText).toHaveBeenCalledWith(textareaNode(), "Bob ");
		});

		it("handles a suggestion focus", async () => {
			loadSuggestions.mockReturnValue(suggestions);
			keydownHandler({ key: "@" });
			jest.runAllTimers();
			wrapper.update();
			expect(loadSuggestions).toHaveBeenCalledWith("");

			await flushPromises();
			wrapper.update();

			wrapper
				.find("[data-testid='mde-suggestions']")
				.find("li")
				.at(1)
				.simulate("mouseover", { currentTarget: 1 });

			wrapper.update();

			expect(wrapper).toHaveState("focusIndex", 1);
		});

		it("displays 'No results' if suggestions are 'active' but empty", async () => {
			loadSuggestions.mockReturnValue(undefined);
			keydownHandler({ key: "@" });
			jest.runAllTimers();
			wrapper.update();

			expect(loadSuggestions).toHaveBeenCalledWith("");

			await flushPromises();
			wrapper.update();

			expect(wrapper).toHaveState({
				status: "active",
				suggestions: [],
			});

			expect(wrapper.find("SuggestionsDropdown")).toExist();
			expect(wrapper.find("[data-test-id='mde-no-suggestions']")).toBeTruthy();
		});

		it("resets suggestions to be refiltered", async () => {
			keydownHandler({ key: "@" });
			keydownHandler({ key: "b" });

			expect(wrapper).toHaveState({
				status: "loading",
				suggestions: [],
				currentPromise: 2,
			});
		});

		it("calls 'preventDefault' when specific keys are pressed", async () => {
			wrapper.setState({ status: "loading" });
			keydownHandler({ key: "ArrowUp" });
			keydownHandler({ key: "ArrowDown" });
			keydownHandler({ key: "Tab" });
			keydownHandler({ key: "Enter" });
			keydownHandler({ key: "k", ctrlKey: true });
			jest.runAllTimers();
			wrapper.update();

			expect(preventDefault).toHaveBeenCalledTimes(5);
		});

		it("deactivates the suggestions when the '@' symbol is removed", async () => {
			loadSuggestions.mockReturnValue(suggestions);
			keydownHandler({ key: "@" });
			jest.runAllTimers();
			wrapper.update();

			await flushPromises();
			wrapper.update();

			wrapper.setProps({ value: "" });
			keydownHandler({ key: "Backspace" });

			expect(wrapper).toHaveState({
				status: "inactive",
				suggestions: [],
			});
		});
	});
});
