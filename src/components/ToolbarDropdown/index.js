import React from "react";
import PropTypes from "prop-types";
import Tooltip from "@material-ui/core/Tooltip";
import ClickHandler from "~components/ClickHandler";
import Dropdown from "~components/Dropdown";
import ToolbarButton from "~components/ToolbarButton";
import ToolbarItem from "~components/ToolbarItem";
import { classNames } from "~utils";

export const ToolbarDropdown = ({
	buttonContent,
	buttonProps,
	classes,
	commands,
	disabled,
	name,
	onClick,
	onCommand,
	tooltip,
	tooltipPlacement,
}) => {
	const button = onClick => (
		<button
			type="button"
			data-name={name}
			tabIndex="0"
			className={disabled ? "disabled" : undefined}
			onClick={onClick}
			disabled={disabled}
			{...buttonProps}
		>
			{buttonContent}
		</button>
	);

	return (
		<ToolbarItem className={classNames(classes.mdetoolbaritem)}>
			<ClickHandler>
				{({ isVisible, closeDropdown, handleClick }) => (
					<React.Fragment>
						{!disabled ? (
							<Tooltip
								arrow
								classes={{
									arrow: classes.mdetooltiparrow,
									popper: classes.mdetooltippopper,
									popperArrow: classes.mdetooltippopperarrow,
									tooltip: classes.mdetooltip,
									tooltipPlacementBottom: classes.mdetooltipplacementbottom,
									tooltipPlacementLeft: classes.mdetooltipplacementleft,
									tooltipPlacementRight: classes.mdetooltipplacementright,
									tooltipPlacementTop: classes.mdetooltipplacementtop,
									touch: classes.mdetooltiptouch,
								}}
								disabled={disabled}
								placement={tooltipPlacement}
								title={tooltip}
							>
								{button(handleClick)}
							</Tooltip>
						) : (
							<React.Fragment>{button(null)}</React.Fragment>
						)}
						{isVisible ? (
							<Dropdown className={classNames(classes.mdedrop)}>
								{commands.map(({ name, buttonProps, icon, value }) => (
									<ToolbarButton
										key={name}
										name={name}
										buttonProps={buttonProps}
										buttonContent={icon}
										classes={classes}
										onClick={() => {
											if (onClick) {
												onClick(value);
											} else {
												onCommand(name);
											}
											closeDropdown();
										}}
										readOnly={disabled}
										tooltipPlacement={tooltipPlacement}
									/>
								))}
							</Dropdown>
						) : null}
					</React.Fragment>
				)}
			</ClickHandler>
		</ToolbarItem>
	);
};

ToolbarDropdown.defaultProps = {
	buttonProps: {},
};

ToolbarDropdown.propTypes = {
	buttonContent: PropTypes.node.isRequired,
	buttonProps: PropTypes.objectOf(
		PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.func,
			PropTypes.number,
			PropTypes.string,
		]),
	),
	classes: PropTypes.objectOf(PropTypes.string),
	commands: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			tooltip: PropTypes.string,
			buttonProps: PropTypes.objectOf(
				PropTypes.oneOfType([
					PropTypes.string,
					PropTypes.number,
					PropTypes.func,
				]),
			),
			icon: PropTypes.node,
		}),
	),
	disabled: PropTypes.bool,
	name: PropTypes.string,
	onClick: PropTypes.func,
	onCommand: PropTypes.func.isRequired,
	tooltip: PropTypes.string,
	tooltipPlacement: PropTypes.string.isRequired,
};

export default ToolbarDropdown;
