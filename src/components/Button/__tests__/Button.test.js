import Button from "../index";

const onClick = jest.fn();

const wrapper = mount(<Button onClick={onClick}>Click Me</Button>);

describe("Button", () => {
	it("renders without errors", () => {
		expect(wrapper.find("button").text()).toEqual("Click Me");
	});

	it("calls the 'onClick' prop", () => {
		wrapper.find("button").simulate("click");
		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
