import { insertText } from "~utils";
import TextArea from "../index";

const editorRef = jest.fn();
const onChange = jest.fn();
const onCommand = jest.fn();
const onTabChange = jest.fn();
const loadSuggestions = jest.fn();

const initProps = {
	children: <p>Markdown preview</p>,
	classes: {},
	debounceSuggestions: 300,
	disablePreview: false,
	disableHotKeys: false,
	editorRef,
	height: 300,
	loadSuggestions,
	onChange,
	onCommand,
	onTabChange,
	readOnly: false,
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
			wrapper
				.instance()
				.handleKeyDown({ preventDefault, ctrlKey: false, ...event });
	});

	afterEach(() => {
		editorRef.mockClear();
		insertText.mockClear();
		loadSuggestions.mockClear();
		onChange.mockClear();
		onCommand.mockClear();
		onTabChange.mockClear();
		preventDefault.mockClear();
	});

	it("renders without errors", () => {
		expect(wrapper.find("div.mde-textarea-wrapper").exists()).toBeTruthy();
	});

	it("utilizes the outside controlled value", () => {
		expect(textarea().props().value).toEqual("Hello");
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

		expect(wrapper.find("SuggestionsDropdown").exists()).toBeFalsy();
		expect(wrapper.find("Spinner").exists()).toBeFalsy();
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

		expect(wrapper.state()).toEqual(
			expect.objectContaining({
				status: "active",
				currentPromise: 0,
			}),
		);
		expect(wrapper.find("Spinner").exists()).toBeFalsy();
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

		expect(wrapper.state()).toEqual(
			expect.objectContaining({
				status: "active",
				suggestions,
				currentPromise: 0,
			}),
		);
		expect(wrapper.find("Spinner").exists()).toBeFalsy();
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

			expect(wrapper.state("suggestions")).toEqual([]);
		});

		it("displays a loading indicator when suggestions have been triggered", () => {
			keydownHandler({ key: "@" });
			wrapper.update();

			expect(wrapper.state()).toEqual(
				expect.objectContaining({
					status: "loading",
					startPosition: 1,
					caret: expect.objectContaining({
						top: 1,
						left: 1,
					}),
					currentPromise: 1,
				}),
			);

			expect(wrapper.find("Spinner").exists()).toBeTruthy();
		});

		it("initially displays all suggestions", async () => {
			loadSuggestions.mockReturnValue(suggestions);
			keydownHandler({ key: "@" });
			jest.runAllTimers();
			wrapper.update();
			expect(loadSuggestions).toHaveBeenCalledWith("");

			await flushPromises();
			wrapper.update();

			expect(wrapper.state()).toEqual(
				expect.objectContaining({
					status: "active",
					suggestions,
				}),
			);

			expect(wrapper.find("SuggestionsDropdown").exists()).toBeTruthy();
			expect(wrapper.find("ul.mde-suggestions").text()).toContain(
				"Bob",
				"Nancy",
			);

			wrapper
				.find("ul.mde-suggestions")
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
				.find("ul.mde-suggestions")
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
				.find("ul.mde-suggestions")
				.find("li")
				.at(1)
				.simulate("mouseover", { currentTarget: 1 });

			wrapper.update();

			expect(wrapper.state("focusIndex")).toEqual(1);
		});

		it("displays 'No results' if suggestions are 'active' but empty", async () => {
			loadSuggestions.mockReturnValue(undefined);
			keydownHandler({ key: "@" });
			jest.runAllTimers();
			wrapper.update();

			expect(loadSuggestions).toHaveBeenCalledWith("");

			await flushPromises();
			wrapper.update();

			expect(wrapper.state()).toEqual(
				expect.objectContaining({
					status: "active",
					suggestions: [],
				}),
			);

			expect(wrapper.find("SuggestionsDropdown").exists()).toBeTruthy();
			expect(wrapper.find("li.mde-no-suggestions")).toBeTruthy();
		});

		it("resets suggestions to be refiltered", async () => {
			keydownHandler({ key: "@" });
			keydownHandler({ key: "b" });

			expect(wrapper.state()).toEqual(
				expect.objectContaining({
					status: "loading",
					suggestions: [],
					currentPromise: 2,
				}),
			);
		});

		it("calls 'preventDefault' when specific keys are pressed", async () => {
			// preventDefault.mockClear();
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

		it("deactivates the suggestions when the '@' symbol is deleted", async () => {
			loadSuggestions.mockReturnValue(suggestions);
			keydownHandler({ key: "@" });
			jest.runAllTimers();
			wrapper.update();

			await flushPromises();
			wrapper.update();

			wrapper.setProps({ value: "" });
			keydownHandler({ key: "Backspace" });

			expect(wrapper.state()).toEqual(
				expect.objectContaining({
					status: "inactive",
					suggestions: [],
				}),
			);
		});
	});
});
