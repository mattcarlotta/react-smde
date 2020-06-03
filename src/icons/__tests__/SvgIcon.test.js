import SvgIcon from "../";

const wrapper = mount(<SvgIcon icon="" />);

describe("SvgIcon", () => {
	it("returns null if 'icon' doesn't match", () => {
		expect(wrapper.find("svg")).not.toExist();
	});
});
