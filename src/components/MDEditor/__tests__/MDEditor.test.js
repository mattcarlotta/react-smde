import ReactMarkdown from "react-markdown";
import { replaceSelection } from "~utils";
import MDEditor from "../index";

const onChange = jest.fn();
const value = "";

const initProps = {
	value,
	onChange,
};

jest.mock("~utils", (_, value) => ({
	...require.requireActual("~utils"),
	replaceSelection: jest.fn().mockReturnValue({
		selection: { end: 0, start: 0 },
		value,
	}),
}));

const nextValue =
	"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";

const eventListener = {};
document.addEventListener = (evt, cb) => (eventListener[evt] = cb);
document.removeEventListener = jest.fn();

describe("MDEditor", () => {
	let wrapper;
	let textareaNode;
	beforeEach(() => {
		wrapper = mount(
			<MDEditor {...initProps}>
				<ReactMarkdown skipHtml>{value}</ReactMarkdown>
			</MDEditor>,
		);
		textareaNode = () => wrapper.find("textarea").getDOMNode();
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

	it("removes mouse listeners on unmount", () => {
		wrapper.unmount();
		expect(document.removeEventListener).toHaveBeenCalled();
	});

	describe("Toolbar Actions", () => {
		beforeEach(() => {
			wrapper.setProps({ value: "Hello" });
		});

		it("toggles the markdown preview and textarea", () => {
			wrapper.find("button[data-name='preview-write']").simulate("click");

			expect(wrapper.state("tab")).toEqual("preview");

			wrapper.find("button[data-name='preview-write']").simulate("click");

			expect(wrapper.state("tab")).toEqual("write");
		});

		it("adds headers to the textarea", () => {
			const addHeader = type => {
				wrapper.find("button[data-name='header']").simulate("click");
				wrapper.find(`button[data-name='header-${type}']`).simulate("click");
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

		it("clears all text", () => {
			wrapper.find("button[data-name='trash']").simulate("click");
			expect(replaceSelection).toHaveBeenCalledWith(textareaNode(), "");
		});
	});
});
