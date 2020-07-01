import ReactMarkdown from "react-markdown";
import { replaceSelection } from "~utils";
import { MDEditor } from "../index";

const editorRef = jest.fn();
const onChange = jest.fn();
const value = "";
const onClick = jest.fn();

const initProps = {
	value,
	onChange,
};

const invalidCommand = {
	name: "invalid-command",
	tooltip: "Add an invalid command",
	buttonProps: { "aria-label": "Add invalid command" },
	icon: <p>Invalid</p>,
};

jest.mock("~utils", (_, value) => ({
	...require.requireActual("~utils"),
	replaceSelection: jest.fn().mockReturnValue({
		selection: { end: 0, start: 0 },
		value,
	}),
}));

const eventListener = {};
document.addEventListener = (evt, cb) => (eventListener[evt] = cb);
document.removeEventListener = jest.fn();

describe("MDEditor", () => {
	let wrapper;
	let textareaNode;
	let command;
	let mousemoveHandler;
	let mouseupHandler;
	beforeEach(() => {
		wrapper = mount(
			<MDEditor {...initProps}>
				<ReactMarkdown skipHtml>{value}</ReactMarkdown>
			</MDEditor>,
		);
		textareaNode = () => wrapper.find("textarea").getDOMNode();
		command = name =>
			wrapper.find(`button[data-name='${name}']`).simulate("click");
		mousemoveHandler = event => eventListener.mousemove(event);
		mouseupHandler = () => eventListener.mouseup();
	});

	afterEach(() => {
		editorRef.mockClear();
		onChange.mockClear();
		replaceSelection.mockClear();
	});

	it("initially renders without errors", () => {
		expect(wrapper.find("[data-testid='mde']")).toExist();
	});

	it("handles value changes", () => {
		const newValue = "## Hello world!";
		wrapper
			.find("textarea")
			.simulate("change", { target: { value: newValue } });

		expect(onChange).toHaveBeenCalledWith(newValue);
	});

	it("disables the toolbar", () => {
		wrapper = mount(
			<MDEditor {...initProps} disableToolbar>
				<ReactMarkdown skipHtml>{value}</ReactMarkdown>
			</MDEditor>,
		);

		expect(wrapper.find("Toolbar")).not.toExist();
	});

	it("disables the grip", () => {
		wrapper = mount(
			<MDEditor {...initProps} disableGrip>
				<ReactMarkdown skipHtml>{value}</ReactMarkdown>
			</MDEditor>,
		);

		expect(wrapper.find("[data-testid='mde-grip']")).not.toExist();
	});

	it("hides the grip", () => {
		wrapper = mount(
			<MDEditor {...initProps} hideGrip>
				<ReactMarkdown skipHtml>{value}</ReactMarkdown>
			</MDEditor>,
		);

		expect(wrapper.find("[data-testid='mde-grip-container']")).not.toExist();
	});

	it("displays the characterLength", () => {
		wrapper.setProps({ showCharacterLength: true });

		expect(
			wrapper.find("[data-testid='mde-textarea-character-length']"),
		).toExist();

		expect(
			wrapper
				.find("[data-testid='mde-textarea-character-length']")
				.first()
				.text(),
		).toEqual("0");

		wrapper.setProps({ maxCharacterLength: 100 });

		expect(
			wrapper
				.find("[data-testid='mde-textarea-character-length']")
				.first()
				.text(),
		).toEqual("0/100");
	});

	it("handles editor resizing", () => {
		expect(wrapper).toHaveState("editorHeight", 250);
		const initiateGrip = num =>
			wrapper
				.find("[data-testid='mde-grip']")
				.simulate("mousedown", { clientY: num });

		// clicking the grip and moving the mouse down, updates the height
		initiateGrip(100);
		mousemoveHandler({ clientY: 200 });
		expect(wrapper).toHaveState("isDragging", true);
		expect(wrapper).toHaveState("originalDragY", 100);
		mouseupHandler();
		expect(wrapper).toHaveState("editorHeight", 350);
		expect(wrapper).toHaveState("isDragging", false);
		expect(wrapper).toHaveState("originalDragY", 0);

		// prevents resizing beyond maxEditorHeight
		initiateGrip(200);
		mousemoveHandler({ clientY: 400 });
		expect(wrapper).toHaveState("isDragging", true);
		expect(wrapper).toHaveState("originalDragY", 200);
		// editor reaches max height
		expect(wrapper).toHaveState("editorHeight", 550);
		// user attempts to move past height
		mousemoveHandler({ clientY: 500 });
		mouseupHandler();
		// editor height doesn't update
		expect(wrapper).toHaveState("editorHeight", 550);
		expect(wrapper).toHaveState("isDragging", false);
		expect(wrapper).toHaveState("originalDragY", 0);

		// prevents resizing beyond minEditorHeight
		initiateGrip(400);
		mousemoveHandler({ clientY: 100 });
		expect(wrapper).toHaveState("isDragging", true);
		expect(wrapper).toHaveState("originalDragY", 400);
		// editor reaches min height
		expect(wrapper).toHaveState("editorHeight", 250);
		// user attempts to move past min height
		mousemoveHandler({ clientY: 90 });
		mouseupHandler();
		// editor height doesn't update
		expect(wrapper).toHaveState("editorHeight", 250);
		expect(wrapper).toHaveState("isDragging", false);
		expect(wrapper).toHaveState("originalDragY", 0);
	});

	it("handles editor autoGrow resizing", () => {
		Object.defineProperty(window, "getComputedStyle", {
			value: () => ({
				getPropertyValue: prop => (prop === "line-height" ? NaN : "13"),
			}),
		});

		wrapper = mount(
			<MDEditor
				{...initProps}
				autoGrow
				minEditorHeight={100}
				maxEditorHeight={300}
			>
				<ReactMarkdown skipHtml>{value}</ReactMarkdown>
			</MDEditor>,
		);

		// adding text to textarea
		wrapper.setState({
			textAreaScrollHeight: 140.5,
			textAreaOffsetHeight: 100,
		});
		wrapper.instance().adjustEditorSize();
		wrapper.update();

		expect(wrapper.find("textarea")).toHaveStyle("height", 160);

		// going over text to textarea
		wrapper.setState({
			textAreaScrollHeight: 340.5,
			textAreaOffsetHeight: 300,
		});
		wrapper.instance().adjustEditorSize();
		wrapper.update();

		expect(wrapper.find("textarea")).toHaveStyle("height", 300);

		// going over maxEditorHeight
		wrapper.setState({
			textAreaScrollHeight: 495.5,
			textAreaOffsetHeight: 455,
		});
		wrapper.instance().adjustEditorSize();
		wrapper.update();

		expect(wrapper.find("textarea")).toHaveStyle("height", 300);
	});

	it("handles editor lineheight via 'font-size' property", () => {
		Object.defineProperty(window, "getComputedStyle", {
			value: () => ({
				getPropertyValue: () => "13",
			}),
		});

		wrapper = mount(
			<MDEditor {...initProps} minEditorHeight={100} autoGrow>
				<ReactMarkdown skipHtml>{value}</ReactMarkdown>
			</MDEditor>,
		);

		expect(wrapper).toHaveState("textAreaLineHeight", 13);
	});

	it("handles editor lineheight via 'line-height' property", () => {
		Object.defineProperty(window, "getComputedStyle", {
			value: () => ({
				getPropertyValue: prop => (prop === "line-height" ? NaN : "13"),
			}),
		});

		wrapper = mount(
			<MDEditor {...initProps} minEditorHeight={100} autoGrow>
				<ReactMarkdown skipHtml>{value}</ReactMarkdown>
			</MDEditor>,
		);

		expect(wrapper).toHaveState("textAreaLineHeight", 19.5);
	});

	it("handles elevating the editor ref", () => {
		Object.defineProperty(window, "getComputedStyle", {
			value: () => ({
				getPropertyValue: prop => (prop === "line-height" ? NaN : "13"),
			}),
		});

		wrapper = mount(
			<MDEditor {...initProps} editorRef={editorRef}>
				<ReactMarkdown skipHtml>{value}</ReactMarkdown>
			</MDEditor>,
		);

		expect(editorRef).toHaveBeenCalledWith(textareaNode());
	});

	it("handles invalid commands", () => {
		wrapper = mount(
			<MDEditor {...initProps} commands={[[invalidCommand]]}>
				<ReactMarkdown skipHtml>{value}</ReactMarkdown>
			</MDEditor>,
		);

		wrapper.find("button[data-name='invalid-command']").simulate("click");
		expect(replaceSelection).not.toHaveBeenCalled();
	});

	it("removes mouse listeners on unmount", () => {
		wrapper.unmount();
		expect(document.removeEventListener).toHaveBeenCalled();
	});

	it("handles custom button interactions", () => {
		wrapper = mount(
			<MDEditor
				{...initProps}
				commands={[
					[
						{
							name: "emoji-menu",
							tooltip: "Add an emoji",
							buttonProps: {
								"aria-label": "Add an emoji",
							},
							onClick,
							icon: "🙂",
							children: [
								{
									name: "smile",
									icon: <p>🙂</p>,
									value: "🙂",
								},
							],
						},
					],
				]}
			>
				<ReactMarkdown>{value}</ReactMarkdown>
			</MDEditor>,
		);

		wrapper.find("button[data-name='emoji-menu']").simulate("click");

		wrapper.find("p").first().simulate("click");

		expect(onClick).toHaveBeenCalledWith("🙂");
	});

	describe("Toolbar Actions", () => {
		beforeEach(() => {
			wrapper.setProps({ value: "Hello" });
		});

		it("removes previous symbols", () => {
			wrapper.setProps({ value: "**Hello**" });
			command("bold");
			expect(replaceSelection).toHaveBeenCalledWith(textareaNode(), "Hello");

			wrapper.setProps({ value: "Hello **Goodbye**" });
			textareaNode().setSelectionRange(6, 6);
			command("bold");
			expect(replaceSelection).toHaveBeenCalledWith(textareaNode(), "Goodbye");
		});

		it("handles one liner offsets", () => {
			wrapper.setProps({ value: "Hello\nGoodbye" });
			textareaNode().setSelectionRange(0, 13);
			command("ordered-list");
			expect(replaceSelection).toHaveBeenCalledWith(
				textareaNode(),
				"1. Hello\n2. Goodbye",
			);
		});

		it("adds headers to the textarea", () => {
			const addHeader = type => {
				command("header");
				command(`header-${type}`);
			};

			addHeader(1);
			expect(replaceSelection).toHaveBeenCalledWith(textareaNode(), "# Hello");

			addHeader(2);
			expect(replaceSelection).toHaveBeenCalledWith(textareaNode(), "## Hello");

			addHeader(3);
			expect(replaceSelection).toHaveBeenCalledWith(
				textareaNode(),
				"### Hello",
			);

			addHeader(4);
			expect(replaceSelection).toHaveBeenCalledWith(
				textareaNode(),
				"#### Hello",
			);

			addHeader(5);
			expect(replaceSelection).toHaveBeenCalledWith(
				textareaNode(),
				"##### Hello",
			);

			addHeader(6);
			expect(replaceSelection).toHaveBeenCalledWith(
				textareaNode(),
				"###### Hello",
			);
		});

		it("bolds or unbolds the current text", () => {
			const boldText = () =>
				wrapper.find("button[data-name='bold']").simulate("click");

			boldText();
			expect(replaceSelection).toHaveBeenCalledWith(
				textareaNode(),
				"**Hello**",
			);

			wrapper.setProps({ value: "**Hello**" });
			boldText();
			expect(replaceSelection).toHaveBeenCalledWith(textareaNode(), "Hello");
		});

		it("bolditalicizes or unbolditalicizes the current text", () => {
			const boldItalicText = () =>
				wrapper.find("button[data-name='bolditalic']").simulate("click");

			boldItalicText();
			expect(replaceSelection).toHaveBeenCalledWith(
				textareaNode(),
				"***Hello***",
			);

			wrapper.setProps({ value: "***Hello***" });
			boldItalicText();
			expect(replaceSelection).toHaveBeenCalledWith(textareaNode(), "Hello");
		});

		it("italicizes or unitalicizes the current text", () => {
			const italicText = () =>
				wrapper.find("button[data-name='italic']").simulate("click");

			italicText();
			expect(replaceSelection).toHaveBeenCalledWith(textareaNode(), "*Hello*");

			wrapper.setProps({ value: "*Hello*" });
			italicText();
			expect(replaceSelection).toHaveBeenCalledWith(textareaNode(), "Hello");
		});

		it("adds strike-through or removes strike-through from the current text", () => {
			const strikeThruText = () =>
				wrapper.find("button[data-name='strike-through']").simulate("click");

			strikeThruText();
			expect(replaceSelection).toHaveBeenCalledWith(
				textareaNode(),
				"~~Hello~~",
			);

			wrapper.setProps({ value: "~~Hello~~" });
			strikeThruText();
			expect(replaceSelection).toHaveBeenCalledWith(textareaNode(), "Hello");
		});

		it("adds a horizontal rule", () => {
			wrapper.find("button[data-name='horizontal-rule']").simulate("click");
			expect(replaceSelection).toHaveBeenCalledWith(
				textareaNode(),
				"\n\n---\n",
			);
		});

		it("adds a link", () => {
			command("link");

			expect(replaceSelection).toHaveBeenCalledWith(
				textareaNode(),
				"[Hello](https://www.example.com)",
			);

			// show default template
			wrapper.setProps({ value: "" });
			command("link");
			expect(replaceSelection).toHaveBeenCalledWith(
				textareaNode(),
				"[link](https://www.example.com)",
			);
		});

		it("adds a quote", () => {
			command("quote");
			expect(replaceSelection).toHaveBeenCalledWith(textareaNode(), "> Hello");
		});

		it("adds a inline code", () => {
			command("code");
			expect(replaceSelection).toHaveBeenCalledWith(textareaNode(), "`Hello`");
		});

		it("adds a code block", () => {
			wrapper.setProps({ value: "\nHello\n" });
			textareaNode().setSelectionRange(0, 7);

			command("code");
			expect(replaceSelection).toHaveBeenCalledWith(
				textareaNode(),
				"```\n\nHello\n\n```",
			);
		});

		it("adds an image", () => {
			command("image");
			expect(replaceSelection).toHaveBeenCalledWith(
				textareaNode(),
				"![example.png](Hello)",
			);

			// show default template
			wrapper.setProps({ value: "" });
			command("image");
			expect(replaceSelection).toHaveBeenCalledWith(
				textareaNode(),
				"![example.png](https://example.com/your-image.png)",
			);
		});

		it("adds an unordered list", () => {
			command("unordered-list");
			expect(replaceSelection).toHaveBeenCalledWith(textareaNode(), "- Hello");
		});

		it("adds an ordered list", () => {
			command("ordered-list");
			expect(replaceSelection).toHaveBeenCalledWith(textareaNode(), "1. Hello");
		});

		it("adds a checked list", () => {
			command("checked-list");
			expect(replaceSelection).toHaveBeenCalledWith(
				textareaNode(),
				"- [ ] Hello",
			);
		});

		it("clears all text", () => {
			command("trash");
			expect(replaceSelection).toHaveBeenCalledWith(textareaNode(), "");
		});

		it("previews/unpreviews the markdown text", () => {
			command("preview-write");
			expect(wrapper).toHaveState("tab", "preview");
			expect(wrapper.find("ReactMarkdown")).toExist();

			command("preview-write");
			expect(wrapper).toHaveState("tab", "write");
			expect(wrapper.find("ReactMarkdown")).not.toExist();
		});
	});
});
