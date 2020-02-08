import ShowSource from "../index";

const text = "<p>Hello</p>";
const initProps = {
	children: <p>Hello</p>,
	text,
};

describe("ShowSource", () => {
	let wrapper;
	beforeEach(() => {
		wrapper = mount(<ShowSource {...initProps} />);
	});

	it("renders without errors", () => {
		expect(wrapper.find("ShowSource").exists()).toBeTruthy();
	});

	it("toggles the modal", () => {
		const toggleModal = () =>
			wrapper
				.find("button")
				.first()
				.simulate("click");

		toggleModal();
		expect(wrapper.find("Modal").exists()).toBeTruthy();
		expect(wrapper.find("Code").text()).toEqual(text);

		toggleModal();
		expect(wrapper.find("Modal").exists()).toBeFalsy();
	});
});
