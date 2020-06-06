import ClickHandler from "../index";

const eventListener = {};
document.addEventListener = (evt, cb) => (eventListener[evt] = cb);
document.removeEventListener = jest.fn();

describe("Click Handler", () => {
	let openMenu;
	let wrapper;
	let clickListener;
	beforeEach(() => {
		wrapper = mount(
			<div>
				<ClickHandler>
					{({ isVisible, closeDropdown, handleClick }) => (
						<div className="wrapper">
							{isVisible ? (
								<div className="close" onClick={closeDropdown} />
							) : (
								<div className="open" onClick={handleClick} />
							)}
							<div className="toggle" onClick={handleClick} />
						</div>
					)}
				</ClickHandler>
				<div tabIndex={0} className="outside" />
			</div>,
		);
		clickListener = event => eventListener.mousedown(event);
		openMenu = () => wrapper.find("div.open").simulate("click");
	});

	it("renders without errors", () => {
		expect(wrapper.find("ClickHandler")).toExist();
	});

	it("initially displays an open div", () => {
		expect(wrapper.find("div.open")).toExist();
	});

	it("handles open/close clicks", () => {
		openMenu();

		expect(wrapper.find("ClickHandler")).toHaveState("isVisible", true);

		wrapper.find("div.close").simulate("click");

		expect(wrapper.find("ClickHandler")).toHaveState("isVisible", false);

		openMenu();

		clickListener({
			target: wrapper.find("div.outside").getDOMNode(),
		});

		expect(wrapper.find("ClickHandler")).toHaveState("isVisible", false);
	});

	it("toggles when 'handleClick' is clicked", () => {
		const toggleMenu = () => wrapper.find("div.toggle").simulate("click");

		toggleMenu();
		expect(wrapper.find("ClickHandler")).toHaveState("isVisible", true);

		toggleMenu();

		expect(wrapper.find("ClickHandler")).toHaveState("isVisible", false);
	});

	it("doesn't change the 'isVisible' state if a left click is on the wrapper", () => {
		openMenu();

		expect(wrapper.find("ClickHandler")).toHaveState("isVisible", true);

		clickListener({
			target: wrapper.find("div.wrapper").getDOMNode(),
		});

		expect(wrapper.find("ClickHandler")).toHaveState("isVisible", true);
	});

	it("removes the event listeners on unmount", () => {
		wrapper.unmount();
		expect(document.removeEventListener).toHaveBeenCalledTimes(1);
	});
});
