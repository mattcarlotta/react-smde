import TextArea from "../index";

const editorRef = jest.fn();
const onChange = jest.fn();
const onCommand = jest.fn();
const onTabChange = jest.fn();
const loadSuggestions = jest.fn();

const initProps = {
	children: <p>Markdown preview</p>,
	classes: {},
	disableHotKeys: false,
	editorRef,
	height: 300,
	loadSuggestions,
	onChange,
	onCommand,
	onTabChange,
	readOnly: false,
	suggestionsEnabled: false,
	tab: "write",
	textAreaProps: { placeholder: "What's on your mind?" },
	value: "Hello",
};

describe("TextArea", () => {
	let wrapper;
	beforeEach(() => {
		wrapper = mount(<TextArea {...initProps} />);
	});

	it("renders without errors", () => {
		expect(wrapper.find("div.mde-textarea-wrapper").exists()).toBeTruthy();
	});
});
