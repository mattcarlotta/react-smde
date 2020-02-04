import ReactMarkdown from "react-markdown";
import MDEditor from "../index";

const onChange = jest.fn();
const value = "";

const initProps = {
	value,
	onChange,
};

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
});
