import ReactMarkdown from "react-markdown";
import { replaceSelection } from "~utils";
import MDEditor from "../index";

const onChange = jest.fn();
const value = "";

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

// Object.defineProperty(window, "getComputedStyle", {
// 	value: () => ({
// 		getPropertyValue: prop => {
// 			return prop === "line-height" ? NaN : "13";
// 		},
// 	}),
// });

const nextValue =
	"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";

const eventListener = {};
document.addEventListener = (evt, cb) => (eventListener[evt] = cb);
document.removeEventListener = jest.fn();

describe("MDEditor", () => {
	let wrapper;
	let textareaNode;
	let command;
	beforeEach(() => {
		wrapper = mount(
			<MDEditor {...initProps}>
				<ReactMarkdown skipHtml>{value}</ReactMarkdown>
			</MDEditor>,
		);
		textareaNode = () => wrapper.find("textarea").getDOMNode();
		command = name =>
			wrapper.find(`button[data-name='${name}']`).simulate("click");
	});

	afterEach(() => {
		onChange.mockClear();
		replaceSelection.mockClear();
	});

	it("initially renders without errors", () => {
		expect(wrapper.find("div.mde").exists()).toBeTruthy();
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

		expect(wrapper.find("Toolbar").exists()).toBeFalsy();
	});

	it("disables the grip", () => {
		wrapper = mount(
			<MDEditor {...initProps} disableGrip>
				<ReactMarkdown skipHtml>{value}</ReactMarkdown>
			</MDEditor>,
		);

		expect(wrapper.find("div.mde-grip").exists()).toBeFalsy();
	});

	it("handles editor resizing", () => {
		expect(wrapper.state("editorHeight")).toEqual(300);

		wrapper.instance().handleGripMouseDown({ clientY: 410 });
		wrapper.instance().handleGripMouseMove({ clientY: 710 });

		expect(wrapper.state("editorHeight")).toEqual(600);

		// prevents resizing beyond maxEditorHeight
		wrapper.instance().handleGripMouseDown({ clientY: 710 });
		wrapper.instance().handleGripMouseMove({ clientY: 810 });

		expect(wrapper.state("editorHeight")).toEqual(600);

		// prevents resizing beyond minEditorHeight
		wrapper.instance().handleGripMouseDown({ clientY: 410 });
		wrapper.instance().handleGripMouseMove({ clientY: 110 });

		expect(wrapper.state("editorHeight")).toEqual(300);

		// after releasing mouse click
		wrapper.instance().handleGripMouseUp();
		wrapper.instance().handleGripMouseMove({ clientY: 710 });

		expect(wrapper.state("editorHeight")).toEqual(300);
	});

	it("handlers editor autoGrow resizing", () => {
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

		expect(wrapper.find("textarea").props().style).toEqual({
			height: 160,
		});

		// maxing out text to textarea
		wrapper.setState({
			textAreaScrollHeight: 340.5,
			textAreaOffsetHeight: 300,
		});
		wrapper.instance().adjustEditorSize();
		wrapper.update();

		expect(wrapper.find("textarea").props().style).toEqual({
			height: 360,
		});

		// going over maxEditorHeight
		wrapper.setState({
			textAreaScrollHeight: 495.5,
			textAreaOffsetHeight: 455,
		});
		wrapper.instance().adjustEditorSize();
		wrapper.update();

		expect(wrapper.find("textarea").props().style).toEqual({
			height: 360,
		});
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

		expect(wrapper.state("textAreaLineHeight")).toEqual(13);
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

		expect(wrapper.state("textAreaLineHeight")).toEqual(19.5);
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

	describe("Toolbar Actions", () => {
		beforeEach(() => {
			wrapper.setProps({ value: "Hello" });
		});

		it("removes previous selection", () => {
			wrapper.setProps({ value: "**Hello**" });
			textareaNode().setSelectionRange(2, 7);
			command("bold");
			expect(replaceSelection).toHaveBeenCalledWith(textareaNode(), "Hello");
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
			expect(wrapper.state("tab")).toEqual("preview");
			expect(wrapper.find("ReactMarkdown").exists()).toBeTruthy();

			command("preview-write");
			expect(wrapper.state("tab")).toEqual("write");
			expect(wrapper.find("ReactMarkdown").exists()).toBeFalsy();
		});
	});
});
