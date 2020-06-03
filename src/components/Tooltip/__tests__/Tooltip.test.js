import Tooltip from "../index";

const tooltipArrowSelector = { modifier: `& .TooltipArrow` };
const tooltipArrowPseudoSelector = { modifier: `& .TooltipArrow::before` };
const container = {
	bottom: 80,
	height: 20,
	left: 500,
	right: 530,
	top: 60,
	width: 40,
	x: 500,
	y: 60,
};
const tooltip = {
	bottom: 40,
	height: 40,
	left: 0,
	right: 100,
	top: -4,
	width: 100,
	x: 0,
	y: -4,
};

const initProps = {
	children: (
		<button style={{ height: 40, width: 40 }} data-testid="button">
			Test
		</button>
	),
	overlay: "Hi",
	placement: "top",
};

describe("Tooltip", () => {
	let wrapper;
	let getTooltipWrapper;
	let getTooltipContainer;
	let getTooltipOverlay;
	beforeEach(() => {
		wrapper = mount(<Tooltip {...initProps} />);
		getTooltipWrapper = () =>
			wrapper.find("[data-testid='mde-tooltip-wrapper']").first();
		getTooltipContainer = () =>
			wrapper.find("[data-testid='mde-tooltip-container']").first();
		getTooltipOverlay = () =>
			wrapper.find("[data-testid='mde-tooltip-overlay']");
	});

	it("renders without errors", () => {
		expect(getTooltipWrapper().exists()).toBeTruthy();
	});

	it("renders a tooltip", () => {
		getTooltipWrapper().simulate("mouseenter");

		expect(wrapper.state("isVisible")).toBeTruthy();
		expect(wrapper.state("wasMounted")).toBeTruthy();
		expect(getTooltipContainer().exists()).toBeTruthy();
		expect(getTooltipOverlay().text()).toEqual("Hi");
	});

	it("keeps the tooltip in the DOM, but hides it", () => {
		getTooltipWrapper().simulate("mouseenter");
		getTooltipWrapper().simulate("mouseleave");

		expect(getTooltipContainer().exists()).toBeTruthy();
		expect(getTooltipContainer().first()).toHaveStyleRule("display", "none");
	});

	it("reuses tooltip previous state if it tries to set the dimensions on an unmounted tooltip", () => {
		wrapper.instance().setTooltipDimensions();

		expect(wrapper.state("tooltip")).toEqual({
			bottom: 0,
			height: 0,
			left: 0,
			right: 0,
			top: 0,
			width: 0,
			x: 0,
			y: 0,
		});
	});

	it("hides the tooltip in the DOM if the button is disabled", () => {
		getTooltipWrapper().simulate("mouseenter");
		wrapper.setProps({ disabled: true });
		wrapper.update();

		expect(getTooltipContainer().exists()).toBeTruthy();
		expect(getTooltipContainer().first()).toHaveStyleRule("display", "none");
	});

	it("rerenders the tooltip overlay if it changes", () => {
		getTooltipWrapper().simulate("mouseenter");
		wrapper.setProps({ overlay: "Goodbye" });

		expect(getTooltipOverlay().text()).toEqual("Goodbye");
	});

	describe("Tooltip placements", () => {
		beforeEach(() => {
			getTooltipWrapper().simulate("mouseenter");
			wrapper.setState({ container, tooltip });
		});

		it("renders the tooltip at the top", () => {
			const tooltipContainer = getTooltipContainer();

			expect(tooltipContainer).toHaveStyleRule("top", "16px");
			expect(tooltipContainer).toHaveStyleRule("left", "470px");
			expect(tooltipContainer).toHaveStyleRule("padding-bottom", "8px");

			expect(tooltipContainer).toHaveStyleRule(
				"left",
				"50%",
				tooltipArrowSelector,
			);
			expect(tooltipContainer).toHaveStyleRule(
				"bottom",
				"-5px",
				tooltipArrowSelector,
			);
			expect(tooltipContainer).toHaveStyleRule(
				"transform",
				"translateX(-50%)",
				tooltipArrowSelector,
			);

			expect(tooltipContainer).toHaveStyleRule(
				"transform",
				"translateY(-6.5355px) rotate(45deg)",
				tooltipArrowPseudoSelector,
			);
		});

		it("renders the tooltip at the bottom", () => {
			wrapper.setProps({ placement: "bottom" });
			const tooltipContainer = getTooltipContainer();

			expect(tooltipContainer).toHaveStyleRule("top", "90px");
			expect(tooltipContainer).toHaveStyleRule("left", "470px");
			expect(tooltipContainer).toHaveStyleRule("padding-top", "8px");

			expect(tooltipContainer).toHaveStyleRule(
				"left",
				"50%",
				tooltipArrowSelector,
			);
			expect(tooltipContainer).toHaveStyleRule(
				"top",
				"-5px",
				tooltipArrowSelector,
			);
			expect(tooltipContainer).toHaveStyleRule(
				"transform",
				"translateX(-50%)",
				tooltipArrowSelector,
			);

			expect(tooltipContainer).toHaveStyleRule(
				"transform",
				"translateY(6.5355px) rotate(45deg)",
				tooltipArrowPseudoSelector,
			);
		});

		it("renders the tooltip at the left", () => {
			wrapper.setProps({ placement: "left" });
			const tooltipContainer = getTooltipContainer();

			expect(tooltipContainer).toHaveStyleRule("top", "50px");
			expect(tooltipContainer).toHaveStyleRule("left", "400px");
			expect(tooltipContainer).toHaveStyleRule("padding-right", "8px");

			expect(tooltipContainer).toHaveStyleRule(
				"top",
				"20px",
				tooltipArrowSelector,
			);
			expect(tooltipContainer).toHaveStyleRule(
				"right",
				"-5px",
				tooltipArrowSelector,
			);
			expect(tooltipContainer).toHaveStyleRule(
				"transform",
				"translateY(-50%)",
				tooltipArrowSelector,
			);

			expect(tooltipContainer).toHaveStyleRule(
				"transform",
				"translateX(-6.5355px) rotate(45deg)",
				tooltipArrowPseudoSelector,
			);
		});

		it("renders the tooltip at the right", () => {
			wrapper.setProps({ placement: "right" });
			const tooltipContainer = getTooltipContainer();

			expect(tooltipContainer).toHaveStyleRule("top", "50px");
			expect(tooltipContainer).toHaveStyleRule("left", "530px");
			expect(tooltipContainer).toHaveStyleRule("padding-left", "8px");

			expect(tooltipContainer).toHaveStyleRule(
				"top",
				"20px",
				tooltipArrowSelector,
			);
			expect(tooltipContainer).toHaveStyleRule(
				"left",
				"-5px",
				tooltipArrowSelector,
			);
			expect(tooltipContainer).toHaveStyleRule(
				"transform",
				"translateY(-50%)",
				tooltipArrowSelector,
			);

			expect(tooltipContainer).toHaveStyleRule(
				"transform",
				"translateX(6.5355px) rotate(45deg)",
				tooltipArrowPseudoSelector,
			);
		});
	});
});
