import Code from "../index";

const wrapper = mount(<Code text="Hello" />);

describe("Code", () => {
	it("renders the text", () => {
		expect(wrapper.find("code").text()).toEqual("Hello");
	});
});
