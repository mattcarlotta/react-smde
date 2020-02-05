import ReactMarkdown from "react-markdown";
import MDEditor from "../index";

const onChange = jest.fn();
const value = "";

const initProps = {
	value,
	onChange,
};

const nextValue =
	"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";

const eventListener = {};
document.addEventListener = (evt, cb) => (eventListener[evt] = cb);
document.removeEventListener = jest.fn();

describe("MDEditor", () => {
	let wrapper;
	beforeEach(() => {
		wrapper = mount(
			<MDEditor {...initProps}>
				<ReactMarkdown skipHtml>{value}</ReactMarkdown>
			</MDEditor>,
		);
	});

	afterEach(() => {
		onChange.mockClear();
		document.removeEventListener.mockClear();
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
			wrapper
				.find("textarea")
				.simulate("change", { target: { value: "Hello" } });
		});

		it("toggles the markdown preview and textarea", () => {
			wrapper.find("button[data-name='preview-write']").simulate("click");

			expect(wrapper.state("tab")).toEqual("preview");

			wrapper.find("button[data-name='preview-write']").simulate("click");

			expect(wrapper.state("tab")).toEqual("write");
		});
	});
});
