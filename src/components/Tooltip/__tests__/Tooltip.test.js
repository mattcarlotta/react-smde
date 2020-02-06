import Tooltip from "../index";

describe("Tooltip", () => {
	// https://github.com/ant-design/ant-design/pull/18441
	it(`component could be updated and unmounted without errors`, () => {
		const wrapper = mount(<Tooltip />);
		expect(() => {
			wrapper.setProps({});
			wrapper.unmount();
		}).not.toThrow();
	});

	it("check `onVisibleChange` arguments", () => {
		const onVisibleChange = jest.fn();

		const wrapper = mount(
			<Tooltip
				title=""
				mouseEnterDelay={0}
				mouseLeaveDelay={0}
				onVisibleChange={onVisibleChange}
			>
				<div id="hello">Hello world!</div>
			</Tooltip>,
		);

		// `title` is empty.
		const div = wrapper.find("#hello").at(0);
		div.simulate("mouseenter");
		expect(onVisibleChange).not.toHaveBeenCalled();
		expect(wrapper.instance().tooltip.props.visible).toBe(false);

		div.simulate("mouseleave");
		expect(onVisibleChange).not.toHaveBeenCalled();
		expect(wrapper.instance().tooltip.props.visible).toBe(false);

		// update `title` value.
		wrapper.setProps({ title: "Have a nice day!" });
		wrapper.find("#hello").simulate("mouseenter");
		expect(onVisibleChange).toHaveBeenLastCalledWith(true);
		expect(wrapper.instance().tooltip.props.visible).toBe(true);

		wrapper.find("#hello").simulate("mouseleave");
		expect(onVisibleChange).toHaveBeenLastCalledWith(false);
		expect(wrapper.instance().tooltip.props.visible).toBe(false);

		// add `visible` props.
		wrapper.setProps({ visible: false });
		wrapper.find("#hello").simulate("mouseenter");
		expect(onVisibleChange).toHaveBeenLastCalledWith(true);
		const lastCount = onVisibleChange.mock.calls.length;
		expect(wrapper.instance().tooltip.props.visible).toBe(false);

		// always trigger onVisibleChange
		wrapper.simulate("mouseleave");
		expect(onVisibleChange.mock.calls.length).toBe(lastCount); // no change with lastCount
		expect(wrapper.instance().tooltip.props.visible).toBe(false);
	});

	it("should hide when mouse leave native disabled button", () => {
		const onVisibleChange = jest.fn();
		const wrapper = mount(
			<Tooltip
				title="xxxxx"
				mouseEnterDelay={0}
				mouseLeaveDelay={0}
				onVisibleChange={onVisibleChange}
			>
				<button type="button" disabled>
					Hello world!
				</button>
			</Tooltip>,
		);

		expect(wrapper.find("span")).toHaveLength(1);
		const button = wrapper.find("span").at(0);
		button.simulate("mouseenter");
		expect(onVisibleChange).toHaveBeenCalledWith(true);
		expect(wrapper.instance().tooltip.props.visible).toBe(true);

		button.simulate("mouseleave");
		expect(onVisibleChange).toHaveBeenCalledWith(false);
		expect(wrapper.instance().tooltip.props.visible).toBe(false);
	});

	describe("should hide when mouse leave antd disabled component", () => {
		function testComponent(name, Component) {
			it(name, () => {
				const onVisibleChange = jest.fn();
				const wrapper = mount(
					<Tooltip
						title="xxxxx"
						mouseEnterDelay={0}
						mouseLeaveDelay={0}
						onVisibleChange={onVisibleChange}
					>
						<Component disabled />
					</Tooltip>,
				);

				expect(wrapper.render()).toMatchSnapshot();
				const button = wrapper.find("span").at(0);
				button.simulate("mouseenter");
				expect(onVisibleChange).toHaveBeenCalledWith(true);
				expect(wrapper.instance().tooltip.props.visible).toBe(true);

				button.simulate("mouseleave");
				expect(onVisibleChange).toHaveBeenCalledWith(false);
				expect(wrapper.instance().tooltip.props.visible).toBe(false);
			});
		}
	});

	it("should render disabled Button style properly", () => {
		const wrapper1 = mount(
			<Tooltip title="xxxxx">
				<button disabled>Hello world!</button>
			</Tooltip>,
		);
		const wrapper2 = mount(
			<Tooltip title="xxxxx">
				<button disabled style={{ display: "block" }}>
					Hello world!
				</button>
			</Tooltip>,
		);
		expect(
			wrapper1
				.find("span")
				.first()
				.getDOMNode().style.display,
		).toBe("inline-block");
		expect(
			wrapper2
				.find("span")
				.first()
				.getDOMNode().style.display,
		).toBe("block");
	});

	it("should works for arrowPointAtCenter", () => {
		const arrowWidth = 5;
		const horizontalArrowShift = 16;
		const triggerWidth = 200;

		const suit = () => {
			const wrapper = mount(
				<Tooltip
					title="xxxxx"
					trigger="click"
					mouseEnterDelay={0}
					mouseLeaveDelay={0}
					placement="bottomLeft"
				>
					<button type="button" style={{ width: triggerWidth }}>
						Hello world!
					</button>
				</Tooltip>,
			);
			wrapper
				.find("button")
				.at(0)
				.simulate("click");
			const popupLeftDefault = parseInt(
				wrapper.instance().getPopupDomNode().style.left,
				10,
			);

			const wrapper2 = mount(
				<Tooltip
					title="xxxxx"
					trigger="click"
					mouseEnterDelay={0}
					mouseLeaveDelay={0}
					placement="bottomLeft"
					arrowPointAtCenter
				>
					<button type="button" style={{ width: triggerWidth }}>
						Hello world!
					</button>
				</Tooltip>,
			);
			wrapper2
				.find("button")
				.at(0)
				.simulate("click");
			const popupLeftArrowPointAtCenter = parseInt(
				wrapper2.instance().getPopupDomNode().style.left,
				10,
			);
			expect(popupLeftArrowPointAtCenter - popupLeftDefault).toBe(
				triggerWidth / 2 - horizontalArrowShift - arrowWidth,
			);
		};

		jest.dontMock("rc-trigger", suit);
	});

	// https://github.com/ant-design/ant-design/issues/20891
	it("should display zero", async () => {
		const wrapper = mount(
			<Tooltip title={0} visible>
				<div />
			</Tooltip>,
		);
		expect(wrapper.find(".ant-tooltip-inner").getDOMNode().innerHTML).toBe("0");
	});
});
