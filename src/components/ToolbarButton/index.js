import React from "react";
import PropTypes from "prop-types";
import Tooltip from "@material-ui/core/Tooltip";
import ToolbarItem from "~components/ToolbarItem";
import { classNames } from "~utils";

export const ToolbarButton = ({
	buttonContent,
	buttonProps,
	classes,
	disabled,
	onClick,
	name,
	tooltip,
	tooltipPlacement,
	value,
}) => {
	const button = (
		<button
			type="button"
			tabIndex="0"
			className={classNames({ disabled })}
			data-name={name}
			data-value={value}
			disabled={disabled}
			onClick={onClick}
			{...buttonProps}
		>
			{buttonContent}
		</button>
	);

	return (
		<ToolbarItem className={classNames(classes.mdetoolbaritem)}>
			{tooltip && !disabled ? (
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
					placement={tooltipPlacement}
					title={tooltip}
				>
					{button}
				</Tooltip>
			) : (
				button
			)}
		</ToolbarItem>
	);
};

ToolbarButton.defaultProps = {
	buttonProps: {},
};

ToolbarButton.propTypes = {
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
	disabled: PropTypes.bool,
	onClick: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	tooltip: PropTypes.string,
	tooltipPlacement: PropTypes.string.isRequired,
	value: PropTypes.string,
};

export default ToolbarButton;
